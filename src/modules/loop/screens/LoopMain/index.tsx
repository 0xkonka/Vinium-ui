import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { valueToBigNumber } from '@aave/protocol-js';
import { Box, Button, Grid, MenuItem, OutlinedInput, Select, SelectChangeEvent, Slider, Typography } from '@mui/material';
import NoDataPanel from '../../../../components/NoDataPanel';
import { useUserWalletDataContext } from '../../../../libs/web3-data-provider';
import { ComputedReserveData, useDynamicPoolDataContext, useStaticPoolDataContext } from '../../../../libs/pool-data-provider';
import { useWalletBalanceProviderContext } from '../../../../libs/wallet-balance-provider/WalletBalanceProvider';
import LoopAction from '../../components/LoopAction';
import ContentWrapper from '../../../../components/wrappers/ContentWrapper';
import { useHistory } from 'react-router-dom';

export default function LoopMain() {
  const intl = useIntl();
  const history = useHistory();
  const { currentAccount } = useUserWalletDataContext();
  const { walletData } = useWalletBalanceProviderContext();
  const { reserves, user } = useDynamicPoolDataContext();
  const { marketRefPriceInUsd } = useStaticPoolDataContext();

  const [assetId, setAssetId] = React.useState('0');
  const [userAssetBal, setUserAssetBal] = useState('0');
  const [loopCount, setLoopCount] = React.useState(2);

  const [loopStep, setloopStep] = useState(0);

  const listData = (withFilter: boolean) => {
    const data = (reserves: ComputedReserveData[]) =>
      reserves.map((reserve) => {
        const userReserve = user?.userReservesData.find((userRes) => userRes.reserve.symbol === reserve.symbol);
        const walletBalance =
          walletData[reserve.underlyingAsset] === '0'
            ? valueToBigNumber('0')
            : valueToBigNumber(walletData[reserve.underlyingAsset] || '0').dividedBy(valueToBigNumber('10').pow(reserve.decimals));
        const walletBalanceInUSD = walletBalance.multipliedBy(reserve.priceInMarketReferenceCurrency).multipliedBy(marketRefPriceInUsd).toString();
        return {
          ...reserve,
          walletBalance,
          walletBalanceInUSD,
          underlyingBalance: userReserve ? userReserve.underlyingBalance : '0',
          underlyingBalanceInUSD: userReserve ? userReserve.underlyingBalanceUSD : '0',
          liquidityRate: reserve.supplyAPY,
          avg30DaysLiquidityRate: Number(reserve.avg30DaysLiquidityRate),
          borrowingEnabled: reserve.borrowingEnabled,
          interestHistory: [],
        };
      });

    return data(reserves);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setAssetId(event.target.value);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setLoopCount(newValue as number);
  };

  return (
    <>
      {!currentAccount ? (
        <NoDataPanel
          title={!currentAccount ? intl.formatMessage(messages.connectWallet) : intl.formatMessage(messages.noDataTitle)}
          description={!currentAccount ? intl.formatMessage(messages.connectWalletDescription) : intl.formatMessage(messages.noDataDescription)}
          withConnectButton={!currentAccount}
        />
      ) : (
        <ContentWrapper
          className="CurrencyScreenWrapper__content"
          withBackButton={true}
          goBack={() => (loopStep === 0 ? history.goBack() : setloopStep(0))}
          withFullHeight
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '500px' }}>
            {!loopStep ? (
              <Grid container sx={{ justifyContent: 'center', alignItems: 'center' }}>
                <Grid item sm={12} md={6}>
                  <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                    <Grid item sm={12}>
                      <Typography>1-Click Loop</Typography>
                    </Grid>
                    <Grid item sm={12}>
                      <Select value={assetId} onChange={handleChange} inputProps={{ 'aria-label': 'Without label' }} sx={{ width: '100%' }}>
                        {reserves.map((reserve, index) => (
                          <MenuItem value={index} key={index}>
                            {reserve.symbol}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item sm={12}>
                      <OutlinedInput
                        id="outlined-adornment-weight"
                        type="number"
                        value={userAssetBal}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          setUserAssetBal(event.target.value);
                        }}
                        endAdornment={
                          <Button size="small" onClick={() => setUserAssetBal(Number(listData(false)[+assetId].walletBalance!).toString())}>
                            Max
                          </Button>
                        }
                        aria-describedby="outlined-weight-helper-text"
                        inputProps={{
                          'aria-label': 'weight',
                        }}
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item sm={12}>
                      <Slider
                        valueLabelDisplay="auto"
                        size="medium"
                        step={1}
                        min={2}
                        max={10}
                        value={loopCount}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                      />
                    </Grid>
                    <Grid item sm={12}>
                      <Button color="primary" disabled={+userAssetBal === 0} onClick={() => setloopStep(1)}>
                        Start Looping
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <LoopAction assetId={+assetId} userAssetBal={userAssetBal} loopCount={loopCount} />
            )}
          </Box>
        </ContentWrapper>
      )}
    </>
  );
}
