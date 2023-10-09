import { useState } from 'react';
import { BigNumber, providers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import {
  // UiPoolDataProvider,
  ChainId,
} from '@aave/contract-helpers';
import { usePolling } from '../../hooks/use-polling';
import { getContract } from '../../utils';

import MultiFeeDistributionABI from '../abi/MultiFeeDistributionABI.json';
import {
  DataHumanized,
  EarnedBalance,
  LockedBalances,
  RewardData,
  UserDataHumanized,
  WithdrawableBalance,
} from '../types';

// interval in which the rpc data is refreshed
const POLLING_INTERVAL = 30 * 1000;

export interface PoolDataResponse {
  loading: boolean;
  error: boolean;
  data: {
    data?: DataHumanized;
    userData?: UserDataHumanized;
  };
  refresh: () => Promise<any>;
}

// Fetch reserve and user incentive data from UiIncentiveDataProvider
export function useMultiFeeDistributionData(
  multifeeDistributionAddress: string,
  chainId: ChainId,
  skip: boolean,
  // rewardTokenAddress: string,
  userAddress?: string
): PoolDataResponse {
  const currentAccount: string | undefined = userAddress ? userAddress.toLowerCase() : undefined;
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [errorData, setErrorData] = useState<boolean>(false);
  const [loadingUserData, setLoadingUserData] = useState<boolean>(false);
  const [errorUserData, setErrorUserData] = useState<boolean>(false);
  const [data, setData] = useState<DataHumanized | undefined>(undefined);
  const [userData, setUserData] = useState<UserDataHumanized | undefined>(undefined);

  const { library: provider } = useWeb3React<providers.Web3Provider>();

  // Fetch and format reserve incentive data from UiIncentiveDataProvider contract
  const fetchData = async () => {
    try {
      console.log('provider', provider);
      if (!provider) return;
      const multiFeeDistribution = getContract(
        multifeeDistributionAddress,
        MultiFeeDistributionABI,
        provider!
      );
      setLoadingData(true);
      console.log('multiFeeDistribution', multiFeeDistribution);
      const rewardTokenAddress = await multiFeeDistribution.stakingToken();
      // console.log('rewardTokenAddresses', rewardTokenAddresses)
      // const rewardTokenAddress = rewardTokenAddresses[0];
      const lastTimeRewardApplicable: BigNumber =
        await multiFeeDistribution.lastTimeRewardApplicable(rewardTokenAddress);
      const rewardPerToken: BigNumber = await multiFeeDistribution.rewardPerToken(
        rewardTokenAddress
      );
      const getRewardForDuration: BigNumber = await multiFeeDistribution.getRewardForDuration(
        rewardTokenAddress
      );

      let dataResponse: DataHumanized = {
        lastTimeRewardApplicable,
        rewardPerToken,
        getRewardForDuration,
      };

      console.log('dataResponse', dataResponse);

      setData(dataResponse);
      setErrorData(false);
    } catch (e) {
      console.log('e', e);
      setErrorData(e);
    }
    setLoadingData(false);
  };

  // Fetch and format user incentive data from UiIncentiveDataProvider
  const fetchUserData = async () => {
    console.log('currentAccount', currentAccount);
    if (!currentAccount) return;

    try {
      if (!provider) return;
      const multiFeeDistribution = getContract(
        multifeeDistributionAddress,
        MultiFeeDistributionABI,
        provider!,
        currentAccount
      );
      setLoadingUserData(true);

      const totalBalance: BigNumber = await multiFeeDistribution.totalBalance(currentAccount);
      const unlockedBalance: BigNumber = await multiFeeDistribution.unlockedBalance(currentAccount);
      const earnedBalances: EarnedBalance = await multiFeeDistribution.earnedBalances(
        currentAccount
      );
      const lockedBalances: LockedBalances = await multiFeeDistribution.lockedBalances(
        currentAccount
      );
      const withdrawableBalance: WithdrawableBalance =
        await multiFeeDistribution.withdrawableBalance(currentAccount);
      const claimableRewards: RewardData[] = await multiFeeDistribution.claimableRewards(
        currentAccount
      );

      let userDataResponse: UserDataHumanized = {
        totalBalance,
        unlockedBalance,
        earnedBalances,
        lockedBalances,
        withdrawableBalance,
        claimableRewards,
      };

      console.log('userDataResponse', userDataResponse);

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
    data: { data, userData },
    refresh: () => {
      return Promise.all([fetchUserData(), fetchData()]);
    },
  };
}
