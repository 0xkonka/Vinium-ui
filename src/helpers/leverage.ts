import BigNumber from 'bignumber.js';
import { LTV_PRECISION, normalizeBN, calculateHealthFactorFromBalances, valueToBigNumber } from '@aave/protocol-js';

import { ComputedReserveData, UserSummary } from '../libs/pool-data-provider';

export const BN_ONE: BigNumber = valueToBigNumber('1');
export const BN_ZERO = valueToBigNumber('0');
export const loopingLeverageToLtv = (leverage: BigNumber) => BN_ONE.minus(BN_ONE.div(leverage));

export const significantLoopingCount = (leverage: BigNumber, significantDigits = 1, maxCount = 40) => {
  const ltv = loopingLeverageToLtv(leverage);
  let currentleverage = BN_ONE;
  let prevLtv = ltv;
  const significantNum = BN_ONE.shiftedBy(significantDigits * -1);
  for (let i = 1; i < 40; i++) {
    currentleverage = currentleverage.plus(prevLtv);
    prevLtv = prevLtv.multipliedBy(ltv);
    if (leverage.minus(currentleverage).lt(significantNum)) return Math.max(i, 2);
  }

  return maxCount;
};

export const calcLiquidationThreshold = (
  current: { threshold: BigNumber; collateral: BigNumber },
  delta: { threshold: BigNumber; collateral: BigNumber }
) =>
  current.collateral
    .multipliedBy(current.threshold)
    .plus(delta.collateral.multipliedBy(delta.threshold))
    .div(current.collateral.plus(delta.collateral));

export const calculateHealthFactor = (param: {
  totalCollateralInMarketReferenceCurrency: BigNumber;
  totalBorrowedInMarketReferenceCurrency: BigNumber;
  liquidationThreshold: BigNumber;
  marketReferenceCurrencyDecimals: number;
}) => {
  const result = calculateHealthFactorFromBalances(
    normalizeBN(param.totalCollateralInMarketReferenceCurrency, -param.marketReferenceCurrencyDecimals),
    normalizeBN(param.totalBorrowedInMarketReferenceCurrency, -param.marketReferenceCurrencyDecimals),
    normalizeBN(param.liquidationThreshold, -LTV_PRECISION)
  );

  if (param.totalBorrowedInMarketReferenceCurrency.isZero()) return result;
  return result.isPositive() ? result : BN_ZERO;
};

export const calculateLoopingAPR = (params: { leverage: BigNumber; depositIncentiveAPR: BigNumber; variableBorrowIncentiveAPR: BigNumber }) => {
  const base = BN_ONE;
  const maxDeposit = base.multipliedBy(params.leverage);
  const maxBorrow = maxDeposit.minus(base);
  return maxDeposit.multipliedBy(params.depositIncentiveAPR).plus(maxBorrow.multipliedBy(params.variableBorrowIncentiveAPR)).div(base);
};

type LoopingEstimationResult = {
  depositAPY: BigNumber;
  borrowAPY: BigNumber;
  rewardAPR: BigNumber;
  netAPY: BigNumber;
  healthFactor?: string;
};

export type EstimationParam = {
  amount: BigNumber;
  asset: ComputedReserveData;
  userSummary?: UserSummary;
  leverage: BigNumber;
  depositIncentiveAPR: BigNumber;
  variableBorrowIncentiveAPR: BigNumber;
};

export const estimateLooping = ({
  amount,
  userSummary,
  asset: { priceInMarketReferenceCurrency, supplyAPY, variableBorrowAPY, reserveLiquidationThreshold, decimals },
  leverage,
  depositIncentiveAPR,
  variableBorrowIncentiveAPR,
}: EstimationParam): LoopingEstimationResult => {
  const totalDeposit = amount.multipliedBy(leverage);
  const totalBorrow = totalDeposit.minus(amount);
  const loopedRewardAPR = calculateLoopingAPR({
    leverage,
    depositIncentiveAPR,
    variableBorrowIncentiveAPR,
  });

  const loopedDepositAPY = totalDeposit.multipliedBy(supplyAPY).div(amount);
  const loopedBorrowAPY = totalBorrow.multipliedBy(variableBorrowAPY).div(amount);

  const totalDepositInMarketReferenceCurrency = totalDeposit.multipliedBy(valueToBigNumber(priceInMarketReferenceCurrency));
  const totalBorrowInMarketReferenceCurrency = totalBorrow.multipliedBy(valueToBigNumber(priceInMarketReferenceCurrency));

  const totalCollateralInMarketReferenceCurrency = valueToBigNumber(userSummary?.totalCollateralMarketReferenceCurrency || '').plus(
    totalDepositInMarketReferenceCurrency
  );
  const totalBorrowedInMarketReferenceCurrency = valueToBigNumber(userSummary?.totalBorrowsMarketReferenceCurrency || '').plus(
    totalBorrowInMarketReferenceCurrency
  );

  const liquidationThreshold = calcLiquidationThreshold(
    {
      threshold: valueToBigNumber(userSummary?.currentLiquidationThreshold || ''),
      collateral: valueToBigNumber(userSummary?.totalCollateralMarketReferenceCurrency || ''),
    },
    {
      threshold: valueToBigNumber(reserveLiquidationThreshold),
      collateral: totalDepositInMarketReferenceCurrency,
    }
  );

  const healthFactor = calculateHealthFactor({
    totalCollateralInMarketReferenceCurrency,
    totalBorrowedInMarketReferenceCurrency,
    liquidationThreshold,
    marketReferenceCurrencyDecimals: decimals,
  });

  return {
    depositAPY: loopedDepositAPY,
    borrowAPY: loopedBorrowAPY,
    rewardAPR: loopedRewardAPR,
    netAPY: loopedDepositAPY.plus(loopedRewardAPR).minus(loopedBorrowAPY),
    healthFactor: Number(healthFactor).toString(),
  };
};

export type CalculateLoopAPYParam = {
  amount?: BigNumber;
  asset: ComputedReserveData;
  depositIncentiveAPR: BigNumber;
  variableBorrowIncentiveAPR: BigNumber;
};

export const calculateLoopAPY = ({
  amount = valueToBigNumber('1000'),
  asset: { supplyAPY, variableBorrowAPY, baseLTVasCollateral },
  depositIncentiveAPR,
  variableBorrowIncentiveAPR,
}: CalculateLoopAPYParam): BigNumber => {
  const leverage = BN_ONE.div(BN_ONE.minus(valueToBigNumber(baseLTVasCollateral))).decimalPlaces(2, BigNumber.ROUND_FLOOR);
  const totalDeposit = amount.multipliedBy(leverage);
  const totalBorrow = totalDeposit.minus(amount);
  const loopedRewardAPR = calculateLoopingAPR({
    leverage,
    depositIncentiveAPR,
    variableBorrowIncentiveAPR,
  });
  const loopedDepositAPY = totalDeposit.multipliedBy(supplyAPY).div(amount);
  const loopedBorrowAPY = totalBorrow.multipliedBy(variableBorrowAPY).div(amount);
  const loopedNetAPY = loopedDepositAPY.plus(loopedRewardAPR).minus(loopedBorrowAPY);
  return loopedNetAPY;
};
