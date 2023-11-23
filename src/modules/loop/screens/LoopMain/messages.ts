import { defineMessages } from 'react-intl';

export default defineMessages({
  noDataTitle: 'Your balance is zero',
  noDataDescription: `Your balance of {currencySymbol} is 0. Transfer {currencySymbol} to your wallet to be able to deposit`,
  noDataLPTokenDescription: `You don't have any {currencySymbol} in your wallet. Transfer {currencySymbol} to your wallet in order to deposit. To get {currencySymbol}, you need to provide liquidity to the correct pool.`,
  noDataButtonTitle: `Faucet`,

  connectWallet: 'Please connect a wallet',
  connectWalletDescription: 'We couldn’t detect a wallet. Connect a wallet to deposit and see your balance grow.',
});
