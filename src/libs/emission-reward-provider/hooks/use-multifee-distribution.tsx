import { useState } from 'react';
import { BigNumber, providers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { usePolling } from '../../hooks/use-polling';
import { getContract } from '../../utils';

import IncentiveControllerABI from '../abi/ChefIncentivesControllerABI.json';
import MultiFeeDistributionABI from '../abi/MultiFeeDistributionABI.json';
import MulticallABI from '../abi/Multicall.json';
import { DataHumanized, UserDataHumanized } from '../types';
import { useProtocolDataContext } from '../../protocol-data-provider';
import { useConnectionStatusContext } from '../../connection-status-provider';
import multicall from '../../multicall';
import { useUserWalletDataContext } from '../../web3-data-provider';

// interval in which the rpc data is refreshed
const POLLING_INTERVAL = 30 * 1000;

export interface MultiFeeDistributionResponse {
  loading: boolean;
  error: boolean;
  data?: DataHumanized;
  userData?: UserDataHumanized;
  refresh: () => Promise<any>;
}

// Fetch reserve and user incentive data from UiIncentiveDataProvider
export function useMultiFeeDistributionData(): MultiFeeDistributionResponse {
  const { currentAccount } = useUserWalletDataContext();
  const { library: provider } = useWeb3React<providers.Web3Provider>();
  const { currentMarketData, chainId } = useProtocolDataContext();
  const { isRPCActive } = useConnectionStatusContext();

  let skip = !isRPCActive;

  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [errorData, setErrorData] = useState<boolean>(false);
  const [loadingUserData, setLoadingUserData] = useState<boolean>(false);
  const [errorUserData, setErrorUserData] = useState<boolean>(false);
  const [data, setData] = useState<DataHumanized | undefined>(undefined);
  const [userData, setUserData] = useState<UserDataHumanized | undefined>(undefined);

  let multifeeDistributionAddress = currentMarketData.addresses.MULTIFEE_DISTRIBUTION!;
  let multicallAddress = currentMarketData.addresses.MULTICALL!;

  const multicallContract = getContract(multicallAddress, MulticallABI, provider!);

  const fetchData = async () => {
    try {
      if (!provider) return;
      const multiFeeDistribution = getContract(
        multifeeDistributionAddress,
        MultiFeeDistributionABI,
        provider!
      );

      setLoadingData(true);
      const rewardTokenAddress = await multiFeeDistribution.stakingToken();

      const [lastTimeRewardApplicable, rewardPerToken, getRewardForDuration] = await multicall(
        multicallContract,
        MultiFeeDistributionABI,
        [
          {
            address: multifeeDistributionAddress,
            name: 'lastTimeRewardApplicable',
            params: [rewardTokenAddress],
          },
          {
            address: multifeeDistributionAddress,
            name: 'rewardPerToken',
            params: [rewardTokenAddress],
          },
          {
            address: multifeeDistributionAddress,
            name: 'getRewardForDuration',
            params: [rewardTokenAddress],
          },
        ]
      );

      let dataResponse: DataHumanized = {
        lastTimeRewardApplicable: lastTimeRewardApplicable[0],
        rewardPerToken: rewardPerToken[0],
        getRewardForDuration: getRewardForDuration[0],
      };

      setData(dataResponse);
      setErrorData(false);
    } catch (e) {
      console.log('e', e);
      setErrorData(e);
    }
    setLoadingData(false);
  };

  const fetchUserData = async () => {
    if (!currentAccount) return;

    try {
      if (!provider) return;

      setLoadingUserData(true);

      const [
        totalBalance,
        unlockedBalance,
        earnedBalances,
        lockedBalances,
        withdrawableBalance,
        claimableRewards,
      ] = await multicall(multicallContract, MultiFeeDistributionABI, [
        {
          address: multifeeDistributionAddress,
          name: 'totalBalance',
          params: [currentAccount],
        },
        {
          address: multifeeDistributionAddress,
          name: 'unlockedBalance',
          params: [currentAccount],
        },
        {
          address: multifeeDistributionAddress,
          name: 'earnedBalances',
          params: [currentAccount],
        },
        {
          address: multifeeDistributionAddress,
          name: 'lockedBalances',
          params: [currentAccount],
        },
        {
          address: multifeeDistributionAddress,
          name: 'withdrawableBalance',
          params: [currentAccount],
        },
        {
          address: multifeeDistributionAddress,
          name: 'claimableRewards',
          params: [currentAccount],
        },
      ]);

      let userDataResponse: UserDataHumanized = {
        totalBalance: totalBalance.amount,
        unlockedBalance: unlockedBalance.amount,
        earnedBalances: { total: earnedBalances.total, earningsData: earnedBalances.earningsData },
        lockedBalances: {
          total: lockedBalances.total,
          unlockable: lockedBalances.unlockable,
          locked: lockedBalances.locked,
          lockData: lockedBalances.lockData,
        },
        withdrawableBalance: {
          amount: withdrawableBalance.amount,
          penaltyAmount: withdrawableBalance.penaltyAmount,
        },
        claimableRewards: claimableRewards.rewards,
      };

      setUserData(userDataResponse);
      setErrorUserData(false);
    } catch (e) {
      console.log('e', e);
      setErrorUserData(e.message);
    }
    setLoadingUserData(false);
  };

  usePolling(fetchData, POLLING_INTERVAL, skip, [skip, multifeeDistributionAddress, chainId]);
  usePolling(fetchUserData, POLLING_INTERVAL, skip, [
    skip,
    multifeeDistributionAddress,
    chainId,
    currentAccount,
  ]);

  const loading = loadingData || loadingUserData;
  const error = errorData || errorUserData;
  return {
    loading,
    error,
    data,
    userData,
    refresh: () => {
      return Promise.all([fetchUserData(), fetchData()]);
    },
  };
}