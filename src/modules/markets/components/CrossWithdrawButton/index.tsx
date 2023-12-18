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
import { ComputedReserveData, UserSummary } from '../../../../libs/pool-data-provider';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import { availableMarkets, getNetworkConfig, marketsData } from '../../../../helpers/config/markets-and-network-config';
import { TokenIcon, isAssetStable } from '../../../../helpers/config/assets-config';
import { valueToBigNumber, BigNumber, calculateHealthFactorFromBalancesBigUnits } from '@aave/protocol-js';
import { useTxBuilderContext } from '../../../../libs/tx-provider';
import PoolTxConfirmationView from '../../../../components/PoolTxConfirmationView';
import defaultMessages from '../../../../defaultMessages';
import messages from '../../../withdraw/screens/WithdrawConfirmation/messages';
import { useIntl } from 'react-intl';
import { getAtokenInfo } from '../../../../helpers/get-atoken-info';
import Row from '../../../../components/basic/Row';
import Value from '../../../../components/basic/Value';
import HealthFactor from '../../../../components/HealthFactor';
import NoDataPanel from '../../../../components/NoDataPanel';

interface CrossWithdrawButtonProps {
  user: UserSummary;
  reserves: ComputedReserveData[];
}

const CrossWithdrawButton = ({ user, reserves }: CrossWithdrawButtonProps) => {
  const intl = useIntl();
  const { currentMarket, setCurrentMarket } = useProtocolDataContext();
  const { lendingPool } = useTxBuilderContext();

  const [open, setOpen] = useState(false);
  const [assetId, setAssetId] = useState('0');
  const [withdrawBal, setWithdrawBal] = useState('0');
  const [isTxExecuted, setIsTxExecuted] = useState(false);

  const aTokenData = getAtokenInfo({
    address: reserves[+assetId].aTokenAddress,
    symbol: reserves[+assetId].symbol,
    decimals: reserves[+assetId].decimals,
  });

  const underlyingBalance = valueToBigNumber(user?.userReservesData[+assetId].underlyingBalance!);
  const availableLiquidity = valueToBigNumber(reserves[+assetId].availableLiquidity);
  let maxAmountToWithdraw = BigNumber.min(underlyingBalance, availableLiquidity);
  let maxCollateralToWithdrawInETH = valueToBigNumber('0');

  if (
    user?.userReservesData[+assetId].usageAsCollateralEnabledOnUser &&
    reserves[+assetId].usageAsCollateralEnabled &&
    user?.totalBorrowsMarketReferenceCurrency !== '0'
  ) {
    // if we have any borrowings we should check how much we can withdraw without liquidation
    // with 0.5% gap to avoid reverting of tx
    const excessHF = valueToBigNumber(user?.healthFactor).minus('1');
    if (excessHF.gt('0')) {
      maxCollateralToWithdrawInETH = excessHF
        .multipliedBy(user?.totalBorrowsMarketReferenceCurrency)
        // because of the rounding issue on the contracts side this value still can be incorrect
        .div(Number(reserves[+assetId].reserveLiquidationThreshold) + 0.01)
        .multipliedBy('0.99');
    }
    maxAmountToWithdraw = BigNumber.min(
      maxAmountToWithdraw,
      maxCollateralToWithdrawInETH.dividedBy(reserves[+assetId].priceInMarketReferenceCurrency)
    );
  }

  let amountToWithdraw = withdrawBal;
  let displayAmountToWithdraw = withdrawBal;

  // if (amountToWithdraw.eq('-1')) {
  //   if (user?.totalBorrowsMarketReferenceCurrency !== '0') {
  //     if (!maxAmountToWithdraw.eq(underlyingBalance)) {
  //       amountToWithdraw = maxAmountToWithdraw;
  //     }
  //   }
  //   displayAmountToWithdraw = maxAmountToWithdraw;
  // }

  let blockingError = '';
  let totalCollateralInETHAfterWithdraw = valueToBigNumber(user?.totalCollateralMarketReferenceCurrency!);
  let liquidationThresholdAfterWithdraw = user?.currentLiquidationThreshold;
  let healthFactorAfterWithdraw = valueToBigNumber(user?.healthFactor!);

  if (user?.userReservesData[+assetId].usageAsCollateralEnabledOnUser && reserves[+assetId].usageAsCollateralEnabled) {
    const amountToWithdrawInEth = +displayAmountToWithdraw * +reserves[+assetId].priceInMarketReferenceCurrency;
    totalCollateralInETHAfterWithdraw = totalCollateralInETHAfterWithdraw.minus(amountToWithdrawInEth);

    liquidationThresholdAfterWithdraw = valueToBigNumber(user?.totalCollateralMarketReferenceCurrency)
      .multipliedBy(user?.currentLiquidationThreshold)
      .minus(valueToBigNumber(amountToWithdrawInEth).multipliedBy(reserves[+assetId].reserveLiquidationThreshold))
      .div(totalCollateralInETHAfterWithdraw)
      .toFixed(4, BigNumber.ROUND_DOWN);

    healthFactorAfterWithdraw = calculateHealthFactorFromBalancesBigUnits(
      totalCollateralInETHAfterWithdraw,
      user?.totalBorrowsMarketReferenceCurrency,
      liquidationThresholdAfterWithdraw
    );

    if (healthFactorAfterWithdraw.lt('1') && user?.totalBorrowsMarketReferenceCurrency !== '0') {
      blockingError = intl.formatMessage(messages.errorCanNotWithdrawThisAmount);
    }
  }

  if (!blockingError && (underlyingBalance.eq('0') || underlyingBalance.lt(displayAmountToWithdraw))) {
    blockingError = intl.formatMessage(messages.errorYouDoNotHaveEnoughFundsToWithdrawThisAmount);
  }
  if (!blockingError && (availableLiquidity.eq('0') || +displayAmountToWithdraw > +reserves[+assetId].availableLiquidity)) {
    blockingError = intl.formatMessage(messages.errorPoolDoNotHaveEnoughFundsToWithdrawThisAmount);
  }

  const handleGetTransactions = async () => {
    console.log('reserves[+assetId].underlyingAsset', reserves[+assetId]);
    console.log('amountToWithdraw', amountToWithdraw);
    return await lendingPool.withdraw({
      user: user?.id!,
      reserve: reserves[+assetId].underlyingAsset,
      amount: amountToWithdraw.toString(),
      aTokenAddress: reserves[+assetId].aTokenAddress,
    });
  };

  const handleMainTxExecuted = () => setIsTxExecuted(true);

  const isHealthFactorDangerous = user?.totalBorrowsMarketReferenceCurrency !== '0' && healthFactorAfterWithdraw.toNumber() <= 1.05;

  return (
    <Box pt={2}>
      <Button
        variant="outlined"
        onClick={() => {
          setOpen(true);
        }}
      >
        Cross Chain Withdraw
      </Button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle sx={{ minWidth: '500px' }}>Withdraw</DialogTitle>
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
        {!user ? (
          <NoDataPanel
            title={intl.formatMessage(messages.connectWallet)}
            description={intl.formatMessage(messages.connectWalletDescription)}
            withConnectButton={true}
          />
        ) : (
          <>
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
                      value={withdrawBal}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setWithdrawBal(event.target.value);
                      }}
                      endAdornment={
                        <Button size="small" onClick={() => setWithdrawBal(maxAmountToWithdraw.toString())}>
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
              {+withdrawBal > 0 && (
                <PoolTxConfirmationView
                  mainTxName={intl.formatMessage(defaultMessages.withdraw)}
                  caption={intl.formatMessage(messages.caption)}
                  boxTitle={intl.formatMessage(defaultMessages.withdraw)}
                  boxDescription={intl.formatMessage(messages.boxDescription)}
                  approveDescription={intl.formatMessage(messages.approveDescription)}
                  getTransactionsData={handleGetTransactions}
                  onMainTxExecuted={handleMainTxExecuted}
                  blockingError={blockingError}
                  dangerousMessage={
                    isHealthFactorDangerous
                      ? intl.formatMessage(messages.healthFactorDangerousText, {
                          liquidation: <span>{intl.formatMessage(messages.liquidation)}</span>,
                        })
                      : ''
                  }
                  aTokenData={aTokenData}
                >
                  <Row title={intl.formatMessage(messages.rowTitle)} withMargin={+user?.healthFactor > 0}>
                    <Value
                      symbol={reserves[+assetId].symbol}
                      value={displayAmountToWithdraw.toString()}
                      tokenIcon={true}
                      maximumValueDecimals={isAssetStable(reserves[+assetId].symbol) ? 4 : 18}
                      updateCondition={isTxExecuted}
                      tooltipId={reserves[+assetId].symbol}
                    />
                  </Row>

                  {+user?.healthFactor > 0 && (
                    <>
                      <HealthFactor
                        title={intl.formatMessage(messages.currentHealthFactor)}
                        value={user?.healthFactor}
                        updateCondition={isTxExecuted}
                        titleColor="dark"
                      />
                      <HealthFactor
                        title={intl.formatMessage(messages.nextHealthFactor)}
                        value={healthFactorAfterWithdraw.toString()}
                        withTextShadow={isHealthFactorDangerous}
                        updateCondition={isTxExecuted}
                        withoutModal={true}
                        titleColor="dark"
                      />
                    </>
                  )}
                </PoolTxConfirmationView>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default CrossWithdrawButton;
