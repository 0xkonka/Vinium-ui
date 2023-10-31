import { useState } from 'react';

import { UiPoolDataProvider, ReservesDataHumanized, UserReserveDataHumanized, ChainId, ReserveDataHumanized } from '@aave/contract-helpers';
import { usePolling } from '../../hooks/use-polling';
import { getProvider } from '../../../helpers/config/markets-and-network-config';
import { ChefIncentivesControllerFactory } from '../../vinium-protocol-js/contracts/ChefIncentivesControllerFactory';
import { useProtocolDataContext } from '../../protocol-data-provider';
import { formatEther, formatUnits } from 'ethers/lib/utils';

// interval in which the rpc data is refreshed
const POLLING_INTERVAL = 30 * 1000;

export interface ReserveDataHumanized2 extends ReserveDataHumanized {
  depositRewardsPerSec?: number;
  borrowRewardsPerSec?: number;
  rewardEligableDeposits?: string;
  rewardEligableBorrows?: string;
}

export interface PoolDataResponse {
  loading: boolean;
  error: boolean;
  data: {
    reserves?: ReservesDataHumanized;
    userReserves?: UserReserveDataHumanized[];
  };
  refresh: () => Promise<any>;
}

// Fetch reserve and user incentive data from UiIncentiveDataProvider
export function usePoolData(
  lendingPoolAddressProvider: string,
  chainId: ChainId,
  poolDataProviderAddress: string,
  skip: boolean,
  userAddress?: string
): PoolDataResponse {
  const currentAccount: string | undefined = userAddress ? userAddress.toLowerCase() : undefined;
  const { currentMarketData } = useProtocolDataContext();
  const [loadingReserves, setLoadingReserves] = useState<boolean>(false);
  const [errorReserves, setErrorReserves] = useState<boolean>(false);
  const [loadingUserReserves, setLoadingUserReserves] = useState<boolean>(false);
  const [errorUserReserves, setErrorUserReserves] = useState<boolean>(false);
  const [reserves, setReserves] = useState<ReservesDataHumanized | undefined>(undefined);
  const [userReserves, setUserReserves] = useState<UserReserveDataHumanized[] | undefined>(undefined);

  let incentiveControllerAddress = currentMarketData.addresses.INCENTIVES_CONTROLLER!;

  // Fetch and format reserve incentive data from UiIncentiveDataProvider contract
  const fetchReserves = async () => {
    const provider = getProvider(chainId);
    const poolDataProviderContract = new UiPoolDataProvider({
      uiPoolDataProviderAddress: poolDataProviderAddress,
      provider,
    });

    const chefIncentiveController = ChefIncentivesControllerFactory.connect(incentiveControllerAddress, provider);

    try {
      setLoadingReserves(true);
      // const reservesResponse = await poolDataProviderContract.getReservesHumanized(
      //   lendingPoolAddressProvider
      // );

      const [totalApsValue, globalRewardsPerSecValue, reservesResponse]: [any, any, ReservesDataHumanized] = await Promise.all([
        chefIncentiveController.totalAllocPoint(),
        chefIncentiveController.rewardsPerSecond(),
        poolDataProviderContract.getReservesHumanized(lendingPoolAddressProvider),
      ]);
      // console.log('reservesResponse >>>>>', reservesResponse);

      const data = reservesResponse.reservesData;
      for (let index = 0; index < data.length; index++) {
        const reserve: ReserveDataHumanized2 = data[index];

        const [aTokenPoolInfo, debtTokenPoolInfo] = await Promise.all([
          chefIncentiveController.poolInfo(reserve.aTokenAddress),
          chefIncentiveController.poolInfo(reserve.variableDebtTokenAddress),
        ]);

        const totalAps = totalApsValue.toNumber();
        const globalRewardsPerSec = parseFloat(formatEther(globalRewardsPerSecValue));
        // reservesResponse.reservesData.forEach((r) => (r.stableBorrowRateEnabled = false));

        reserve.depositRewardsPerSec = totalAps > 0 ? (aTokenPoolInfo.allocPoint.toNumber() / totalAps) * globalRewardsPerSec : 0;
        reserve.borrowRewardsPerSec = totalAps > 0 ? (debtTokenPoolInfo.allocPoint.toNumber() / totalAps) * globalRewardsPerSec : 0;
        reserve.rewardEligableDeposits = formatUnits(aTokenPoolInfo.totalSupply, reserve.decimals);
        reserve.rewardEligableBorrows = formatUnits(debtTokenPoolInfo.totalSupply, reserve.decimals);
      }

      setReserves(reservesResponse);
      setErrorReserves(false);
    } catch (e) {
      console.log('e', e);
      setErrorReserves(e.message);
    }
    setLoadingReserves(false);
  };

  // Fetch and format user incentive data from UiIncentiveDataProvider
  const fetchUserReserves = async () => {
    if (!currentAccount) return;
    const provider = getProvider(chainId);
    const poolDataProviderContract = new UiPoolDataProvider({
      uiPoolDataProviderAddress: poolDataProviderAddress,
      provider,
    });

    try {
      setLoadingUserReserves(true);
      const userReservesResponse: UserReserveDataHumanized[] = await poolDataProviderContract.getUserReservesHumanized(
        lendingPoolAddressProvider,
        currentAccount
      );

      setUserReserves(userReservesResponse);
      setErrorUserReserves(false);
    } catch (e) {
      console.log('e', e);
      setErrorUserReserves(e.message);
    }
    setLoadingUserReserves(false);
  };

  usePolling(fetchReserves, POLLING_INTERVAL, skip, [skip, poolDataProviderAddress, chainId]);
  usePolling(fetchUserReserves, POLLING_INTERVAL, skip, [skip, poolDataProviderAddress, chainId, currentAccount]);

  const loading = loadingReserves || loadingUserReserves;
  const error = errorReserves || errorUserReserves;
  return {
    loading,
    error,
    data: { reserves, userReserves },
    refresh: () => {
      return Promise.all([fetchUserReserves(), fetchReserves()]);
    },
  };
}
