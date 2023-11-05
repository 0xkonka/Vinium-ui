import { useCallback } from 'react';
import { valueToBigNumber } from '@aave/protocol-js';
import { ComputedUserReserve } from '@aave/math-utils';
import BigNumber from 'bignumber.js';

import { ComputedReserveData, useStaticPoolDataContext } from '../../pool-data-provider';
// import { useViniumPrices } from 'libs/aave-protocol-js/hooks/use-vinium-prices';
import { BN_ONE, calculateLoopingAPR } from '../../../helpers/leverage';

const useViniumLendingPoolRewards = () => {
  const { marketRefPriceInUsd } = useStaticPoolDataContext();
  // const { prices } = useViniumPrices();
  const tokenPrice = 1; // TODO

  const getRewardApr = useCallback(
    (
      poolReserve: ComputedReserveData
    ): {
      viniumRewardsDepositApr: number;
      viniumRewardsBorrowApr: number;
      grossDepositApr: number;
      grossBorrowApr: number;
    } => {
      const eligableBorrowsUsd = valueToBigNumber(poolReserve.rewardEligableDeposits || 0)
        .multipliedBy(poolReserve.priceInMarketReferenceCurrency)
        .multipliedBy(marketRefPriceInUsd)
        .toNumber();
      const eligableBorrowUsd = valueToBigNumber(poolReserve.rewardEligableBorrows || 0)
        .multipliedBy(poolReserve.priceInMarketReferenceCurrency)
        .multipliedBy(marketRefPriceInUsd)
        .toNumber();

      const totalDeposits = valueToBigNumber(poolReserve.totalLiquidity || 0)
        .multipliedBy(poolReserve.priceInMarketReferenceCurrency)
        .multipliedBy(marketRefPriceInUsd)
        .toNumber();
      const totalBorrowsInUSD = valueToBigNumber(poolReserve.totalDebt || 0)
        .multipliedBy(poolReserve.priceInMarketReferenceCurrency)
        .multipliedBy(marketRefPriceInUsd)
        .toNumber();

      const viniumPrice = tokenPrice || 0;

      const depositRewardsPerSecUsd = (poolReserve.depositRewardsPerSec || 0) * viniumPrice;
      const borrowRewardsPerSecUsd = (poolReserve.borrowRewardsPerSec || 0) * viniumPrice;
      const depositRewardsPerYear = depositRewardsPerSecUsd * 86400 * 365;
      const borrowRewardsPerYear = borrowRewardsPerSecUsd * 86400 * 365;

      const grossDepositApr = depositRewardsPerYear / totalDeposits;
      const grossBorrowApr = borrowRewardsPerYear / totalBorrowsInUSD;

      const viniumRewardsDepositApr = eligableBorrowsUsd ? depositRewardsPerYear / eligableBorrowsUsd : 0;
      const viniumRewardsBorrowApr = eligableBorrowUsd ? borrowRewardsPerYear / eligableBorrowUsd : 0;

      return { viniumRewardsDepositApr, viniumRewardsBorrowApr, grossDepositApr, grossBorrowApr };
    },
    [marketRefPriceInUsd]
  );

  const getLoopApr = useCallback((poolReserve: ComputedReserveData, viniumRewardsDepositApr: number, viniumRewardsBorrowApr: number): number => {
    const maxLV = BN_ONE.div(BN_ONE.minus(valueToBigNumber(poolReserve.baseLTVasCollateral))).decimalPlaces(2, BigNumber.ROUND_FLOOR);
    const leverage = maxLV.lt(valueToBigNumber('4')) ? maxLV.toString() : '4';

    const loopApr = calculateLoopingAPR({
      leverage: valueToBigNumber(leverage),
      depositIncentiveAPR: valueToBigNumber(viniumRewardsDepositApr),
      variableBorrowIncentiveAPR: valueToBigNumber(viniumRewardsBorrowApr),
    });

    return loopApr.toNumber();
  }, []);

  const getUserRewardsPerSecond = useCallback(
    (userReserve: ComputedUserReserve, poolReserve: ComputedReserveData): number => {
      const totalDeposits = valueToBigNumber(poolReserve.rewardEligableDeposits || 0)
        .multipliedBy(poolReserve.priceInMarketReferenceCurrency)
        .multipliedBy(marketRefPriceInUsd)
        .toNumber();

      const totalBorrows = valueToBigNumber(poolReserve.rewardEligableBorrows || 0)
        .multipliedBy(poolReserve.priceInMarketReferenceCurrency)
        .multipliedBy(marketRefPriceInUsd)
        .toNumber();

      const userDeposits = Number(userReserve.underlyingBalanceUSD);
      const userBorrows = Number(userReserve.variableBorrowsUSD);
      const userDepsRewardsPerSecond = totalDeposits ? ((poolReserve.depositRewardsPerSec || 0) * userDeposits) / totalDeposits : 0;

      const userBorrowsRewardsPerSecond = totalBorrows ? ((poolReserve.borrowRewardsPerSec || 0) * userBorrows) / totalBorrows : 0;
      return userDepsRewardsPerSecond + userBorrowsRewardsPerSecond;
    },
    [marketRefPriceInUsd]
  );

  return {
    getRewardApr,
    getLoopApr,
    getUserRewardsPerSecond,
  };
};

export default useViniumLendingPoolRewards;
