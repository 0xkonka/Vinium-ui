import { useState } from 'react';
import { BigNumber, providers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { usePolling } from '../../hooks/use-polling';
import { getContract } from '../../utils';
import IncentiveControllerABI from '../abi/ChefIncentivesControllerABI.json';
import { useProtocolDataContext } from '../../protocol-data-provider';
import { useConnectionStatusContext } from '../../connection-status-provider';
import { ComputedReserveData, useDynamicPoolDataContext } from '../../pool-data-provider';
import { useUserWalletDataContext } from '../../web3-data-provider';

// interval in which the rpc data is refreshed
const POLLING_INTERVAL = 30 * 1000;

export interface ChefIncentiveHumanized {
  id: string;
  claimableReward: BigNumber;
  rewardTokens: string[];
}

export interface ChefIncentiveDataResponse {
  loading: boolean;
  error: boolean;
  data?: ChefIncentiveHumanized[];
  refresh: () => Promise<any>;
}

// Fetch reserve and user incentive data from UiIncentiveDataProvider
export function useChefIncentiveData(): ChefIncentiveDataResponse {
  const { currentAccount } = useUserWalletDataContext();
  const { library: provider } = useWeb3React<providers.Web3Provider>();
  const { currentMarketData, chainId } = useProtocolDataContext();
  const { isRPCActive } = useConnectionStatusContext();
  const { reserves } = useDynamicPoolDataContext();

  let skip = !isRPCActive;

  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [errorData, setErrorData] = useState<boolean>(false);
  const [data, setData] = useState<ChefIncentiveHumanized[] | undefined>(undefined);

  let incentiveControllerAddress = currentMarketData.addresses.INCENTIVES_CONTROLLER!;

  const incentiveController = getContract(incentiveControllerAddress, IncentiveControllerABI, provider!, currentAccount);

  // Fetch and format reserve incentive data from UiIncentiveDataProvider contract
  const fetchData = async () => {
    try {
      if (!provider) return;
      if (reserves.length === 0) return;
      setLoadingData(true);

      let dataResponse: ChefIncentiveHumanized[] = [];
      for (let i = 0; i < reserves.length; i++) {
        let claimableRewards: BigNumber[] = await incentiveController.claimableReward(currentAccount, [
          reserves[i].aTokenAddress,
          reserves[i].stableDebtTokenAddress,
          reserves[i].variableDebtTokenAddress,
        ]);
        let claimableReward: BigNumber = BigNumber.from(0);
        for (let j = 0; j < claimableRewards.length; j++) claimableReward = claimableReward.add(claimableRewards[j]);
        let response: ChefIncentiveHumanized = {
          id: reserves[i].id,
          claimableReward,
          // rewardTokens: [reserves[i].aTokenAddress, reserves[i].stableDebtTokenAddress, reserves[i].variableDebtTokenAddress],
          rewardTokens: [reserves[i].aTokenAddress],
        };
        dataResponse.push(response);
      }
      // const lastTimeRewardApplicable: BigNumber =
      //   await multiFeeDistribution.lastTimeRewardApplicable(rewardTokenAddress);
      // const rewardPerToken: BigNumber = await multiFeeDistribution.rewardPerToken(
      //   rewardTokenAddress
      // );
      // const getRewardForDuration: BigNumber = await multiFeeDistribution.getRewardForDuration(
      //   rewardTokenAddress
      // );

      setData(dataResponse);
      setErrorData(false);
    } catch (e) {
      console.log('e', e);
      setErrorData(e);
    }
    setLoadingData(false);
  };

  usePolling(fetchData, POLLING_INTERVAL, skip, [skip, incentiveControllerAddress, chainId, reserves]);

  const loading = loadingData;
  const error = errorData;
  return {
    loading,
    error,
    data,
    refresh: () => {
      return Promise.all([fetchData()]);
    },
  };
}
