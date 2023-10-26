import { defineMessages } from 'react-intl';

export default defineMessages({
  manage: 'Manage',
  lockedAndStakedBalance: 'Your Locked + Staked Vinium',
  dailyRevenue: 'Your Daily revenue',
  weeklyRevenue: 'Your Weekly Revenue',
  dailyPlatformFee: 'Your Daily Platform Fees',
  dailyPenaltyFee: 'Your Daily Penalty Fees',
  lockVinium: 'Lock Vinium',
  stakeVinium: 'Stake Vinium',

  noDataTitle: 'Your balance is zero',
  noDataDescription: `Your balance of {currencySymbol} is 0. Transfer {currencySymbol} to your wallet to be able to deposit`,
  noDataLPTokenDescription: `You don't have any {currencySymbol} in your wallet. Transfer {currencySymbol} to your wallet in order to deposit. To get {currencySymbol}, you need to provide liquidity to the correct pool.`,
  noDataButtonTitle: `Faucet`,


  connectWallet: 'Please connect a wallet',
  connectWalletDescription:
    'We couldn’t detect a wallet. Connect a wallet to deposit and see your balance grow.',

  warningText:
    'Before depositing {symbol} please check that the amount you want to deposit is not currently being used for staking. If it is being used for staking, your transaction might fail.',

  aaveWarning:
    'Depositing your AAVE tokens is not the same as staking them. If you wish to stake your AAVE tokens, please go to the {link}',
  stakingView: 'staking view',
});
