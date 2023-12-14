import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ComputedReserveData } from '../../../../libs/pool-data-provider';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import { availableMarkets, getNetworkConfig, marketsData } from '../../../../helpers/config/markets-and-network-config';
import { TokenIcon } from '../../../../helpers/config/assets-config';
import { useWalletBalanceProviderContext } from '../../../../libs/wallet-balance-provider/WalletBalanceProvider';
import { valueToBigNumber } from '@aave/protocol-js';
import { useTxBuilderContext } from '../../../../libs/tx-provider';
import { useUserWalletDataContext } from '../../../../libs/web3-data-provider';
import { getReferralCode } from '../../../../libs/referral-handler';
import PoolTxConfirmationView from '../../../../components/PoolTxConfirmationView';
import defaultMessages from '../../../../defaultMessages';
import messages from '../../../deposit/screens/DepositConfirmation/messages';
import { useIntl } from 'react-intl';
import { getAtokenInfo } from '../../../../helpers/get-atoken-info';

const CrossDepositButton = ({ reserves }: { reserves: ComputedReserveData[] }) => {
  const intl = useIntl();
  const { walletData } = useWalletBalanceProviderContext();
  const { currentAccount } = useUserWalletDataContext();
  const { currentMarket, setCurrentMarket } = useProtocolDataContext();
  const { lendingPool } = useTxBuilderContext();

  const [open, setOpen] = useState(false);
  const [assetId, setAssetId] = useState('0');
  const [depositBal, setDepositBal] = useState('0');

  const walletBal = useMemo(() => {
    if (reserves) {
      const walletBal = (reserves: ComputedReserveData[]) => {
        return reserves.map((reserve) => {
          const walletBalance =
            walletData[reserve.underlyingAsset] === '0'
              ? valueToBigNumber('0')
              : valueToBigNumber(walletData[reserve.underlyingAsset] || '0').dividedBy(valueToBigNumber('10').pow(reserve.decimals));
          return +walletBalance;
        });
      };
      return walletBal(reserves);
    }
  }, [reserves, walletData]);

  const aTokenData = getAtokenInfo({
    address: reserves[+assetId].aTokenAddress,
    symbol: reserves[+assetId].symbol,
    decimals: reserves[+assetId].decimals,
  });

  let blockingError = '';
  if (walletBal && +walletBal[+assetId] < +depositBal) {
    blockingError = intl.formatMessage(messages.errorWalletBalanceNotEnough, {
      poolReserveSymbol: reserves[+assetId].symbol,
    });
  }

  const handleGetTransactions = async () => {
    return lendingPool.deposit({
      user: currentAccount,
      reserve: reserves[+assetId].underlyingAsset,
      amount: depositBal.toString(),
      referralCode: getReferralCode(),
    });
  };

  if (!walletBal) return <div />;

  return (
    <Box pt={2}>
      <Button
        variant="outlined"
        onClick={() => {
          setOpen(true);
        }}
      >
        Cross Chain Deposit
      </Button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle sx={{ minWidth: '500px' }}>Deposit</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            setOpen(false);
          }}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Card>
            <CardContent>
              <Typography variant="h6">Select Network</Typography>
              {availableMarkets.map((market) => {
                const marketData = marketsData[market];
                const config = getNetworkConfig(marketData.chainId);
                const testnetMark = config.isFork ? 'F' : config.isTestnet ? config.name.charAt(0).toUpperCase() : undefined;
                return (
                  <Button onClick={() => setCurrentMarket(market)} disabled={currentMarket === market} key={market}>
                    <Box component="img" src={marketData.logo} alt="" sx={{ width: '30px', height: '30px' }} />
                    {testnetMark && <span className="MarketSwitcher__kovan">{testnetMark}</span>}
                  </Button>
                );
              })}
              <Select
                value={assetId}
                onChange={(event) => {
                  setAssetId(event.target.value);
                }}
                inputProps={{ 'aria-label': 'Without label' }}
                sx={{ width: '100%' }}
              >
                {reserves.map((reserve, index) => (
                  <MenuItem value={index} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ListItemIcon sx={{ minWidth: '0' }}>
                        <TokenIcon tokenSymbol={reserve.symbol} height={26} width={26} className="TableItem__token" tooltipId={reserve.symbol} />
                      </ListItemIcon>
                      <ListItemText primary={reserve.symbol} />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <FormControl variant="filled" sx={{ width: '100%' }}>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  type="number"
                  value={depositBal}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setDepositBal(event.target.value);
                  }}
                  endAdornment={
                    <Button size="small" onClick={() => setDepositBal(walletBal[+assetId].toString())}>
                      Max
                    </Button>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    'aria-label': 'weight',
                  }}
                />
              </FormControl>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          {+depositBal > 0 && (
            <PoolTxConfirmationView
              mainTxName={intl.formatMessage(defaultMessages.deposit)}
              caption={intl.formatMessage(messages.caption)}
              boxTitle={intl.formatMessage(defaultMessages.deposit)}
              boxDescription={intl.formatMessage(messages.boxDescription)}
              approveDescription={intl.formatMessage(messages.approveDescription)}
              getTransactionsData={handleGetTransactions}
              blockingError={blockingError}
              aTokenData={aTokenData}
            ></PoolTxConfirmationView>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CrossDepositButton;
