import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { valueToBigNumber } from '@aave/protocol-js';
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Slider,
  Typography,
} from '@mui/material';
import NoDataPanel from '../../../../components/NoDataPanel';
import { ComputedReserveData, UserSummary, useStaticPoolDataContext } from '../../../../libs/pool-data-provider';
import { useWalletBalanceProviderContext } from '../../../../libs/wallet-balance-provider/WalletBalanceProvider';
import LoopAction from '../../components/LoopAction';
import ContentWrapper from '../../../../components/wrappers/ContentWrapper';
import { useHistory } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { isEmpty } from 'lodash';

import { estimateLooping } from '../../../../helpers/leverage';
import useViniumLendingPoolRewards from '../../../../libs/vinium-protocol-js/hooks/use-lending-pool-rewards';
import { TokenIcon } from '../../../../helpers/config/assets-config';
import AmountField from '../../../../components/fields/AmountField';
import { vaultAssetSymbols } from '../../helper';

interface ListData {
  walletBalance: BigNumber;
  walletBalanceInUSD: string;
  underlyingBalance: string;
  underlyingBalanceInUSD: string;
  liquidityRate: string;
  LTVasCollateral: number;
  maxLeverage: number;
  isVault: boolean;
}

interface LoopMainProps {
  reserves: ComputedReserveData[];
  user?: UserSummary;
  currentAccount: string;
}

export default function LoopMain({ currentAccount, reserves, user }: LoopMainProps) {
  const intl = useIntl();
  const history = useHistory();
  const { walletData } = useWalletBalanceProviderContext();
  const { marketRefPriceInUsd } = useStaticPoolDataContext();
  const { getRewardApr } = useViniumLendingPoolRewards();

  const [listData, setListData] = useState<ListData[]>([]);
  const [assetId, setAssetId] = useState('0');
  const [loopBal, setLoopBal] = useState('1');
  const [loopType, setLoopType] = React.useState('single');
  const [leverage, setLeverage] = useState(1.1);
  const [loopCount, setLoopCount] = useState(1);
  const [loopStep, setloopStep] = useState(0);

  const { viniumRewardsDepositApr = 0, viniumRewardsBorrowApr = 0 } = getRewardApr(reserves[+assetId]);

  const { depositAPY, borrowAPY, rewardAPR, netAPY, healthFactor } = estimateLooping({
    amount: valueToBigNumber(loopBal),
    asset: reserves[+assetId]!,
    leverage: valueToBigNumber(leverage),
    depositIncentiveAPR: valueToBigNumber(viniumRewardsDepositApr),
    variableBorrowIncentiveAPR: valueToBigNumber(viniumRewardsBorrowApr),
    userSummary: user,
  });

  useEffect(() => {
    if (reserves) {
      const data = (reserves: ComputedReserveData[]) => {
        return reserves.map((reserve) => {
          const userReserve = user?.userReservesData.find((userRes) => userRes.reserve.symbol === reserve.symbol);
          const walletBalance =
            walletData[reserve.underlyingAsset] === '0'
              ? valueToBigNumber('0')
              : valueToBigNumber(walletData[reserve.underlyingAsset] || '0').dividedBy(valueToBigNumber('10').pow(reserve.decimals));
          const walletBalanceInUSD = walletBalance.multipliedBy(reserve.priceInMarketReferenceCurrency).multipliedBy(marketRefPriceInUsd).toString();

          const LTVasCollateral = +reserve.baseLTVasCollateral === 0 ? 0.9 : +reserve.baseLTVasCollateral;
          const maxLeverage = Math.floor((1 / (1 - LTVasCollateral)) * 10) / 10;

          const isVault = vaultAssetSymbols.includes(reserve.symbol);

          const data: ListData = {
            // ...reserve,
            walletBalance,
            walletBalanceInUSD,
            underlyingBalance: userReserve ? userReserve.underlyingBalance : '0',
            underlyingBalanceInUSD: userReserve ? userReserve.underlyingBalanceUSD : '0',
            liquidityRate: reserve.supplyAPY,
            LTVasCollateral,
            maxLeverage,
            isVault,
          };
          return data;
        });
      };
      setListData(data(reserves));
    }
  }, [reserves, marketRefPriceInUsd, user, walletData]);

  const handleAssetChange = (event: SelectChangeEvent) => {
    setAssetId(event.target.value);
    setLeverage(1.1);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setLeverage(newValue as number);
  };

  useEffect(() => {
    if (isEmpty(listData)) return;
    const ltv = listData[+assetId].LTVasCollateral;

    let loopCount = Math.log(1 - (1 - ltv) * leverage) / Math.log(ltv) - 1;

    setLoopCount(Math.max(Math.floor(loopCount), 1));
  }, [assetId, listData, leverage, loopBal]);

  if (isEmpty(listData)) return <div />;

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
                  <Grid container spacing={2}>
                    <Grid item sm={12}>
                      <Typography sx={{ color: 'white', fontSize: '1.5rem', textAlign: 'center' }}>1-Click Loop</Typography>
                    </Grid>
                    <Grid item sm={12}>
                      <Select value={assetId} onChange={handleAssetChange} inputProps={{ 'aria-label': 'Without label' }} sx={{ width: '100%' }}>
                        {reserves.map((reserve, index) => (
                          <MenuItem value={index} key={index}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <ListItemIcon sx={{ minWidth: '0' }}>
                                <TokenIcon
                                  tokenSymbol={reserve.symbol}
                                  height={26}
                                  width={26}
                                  className="TableItem__token"
                                  tooltipId={reserve.symbol}
                                />
                              </ListItemIcon>
                              <ListItemText primary={reserve.symbol} />
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item sm={12}>
                      <FormControl variant="filled" sx={{ width: '100%' }}>
                        <OutlinedInput
                          id="outlined-adornment-weight"
                          type="number"
                          value={loopBal}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setLoopBal(event.target.value);
                          }}
                          endAdornment={
                            <Button size="small" onClick={() => setLoopBal(Number(listData[+assetId].walletBalance!).toString())}>
                              Max
                            </Button>
                          }
                          aria-describedby="outlined-weight-helper-text"
                          inputProps={{
                            'aria-label': 'weight',
                          }}
                        />
                      </FormControl>
                    </Grid>
                    {listData && listData[+assetId].isVault! && (
                      <Grid item sm={12}>
                        <FormControl>
                          <FormLabel id="demo-controlled-radio-buttons-group">Single loop or Vault loop</FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={loopType}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLoopType(event.target.value)}
                          >
                            <FormControlLabel value="single" control={<Radio />} label="Single" />
                            <FormControlLabel value="vault" control={<Radio />} label="Vault" />
                          </RadioGroup>
                          <FormLabel>
                            {loopType === 'single' ? 'Loop Single Asset' : 'Loop (Deposit Vault Asset , Borrow Underlying Asset , Mint Vault Asset)'}{' '}
                          </FormLabel>
                        </FormControl>
                      </Grid>
                    )}
                    {listData && (
                      <Grid item sm={12}>
                        <Typography sx={{ color: 'white', textAlign: 'center' }}>Leverage : {leverage} </Typography>

                        <Slider
                          valueLabelDisplay="auto"
                          size="medium"
                          step={0.1}
                          min={1.1}
                          max={listData[+assetId]?.maxLeverage! - 0.1 ?? 10}
                          value={leverage}
                          onChange={handleSliderChange}
                          aria-labelledby="input-slider"
                        />
                      </Grid>
                    )}
                    <Grid item sm={12}>
                      <Card variant="outlined" sx={{ backgroundColor: 'transparent', borderRadius: '10px' }}>
                        <List sx={{ width: '100%' }} component="nav" aria-label="mailbox folders">
                          {/* <ListItem>
                            <ListItemText primary="Asset LTV:" />
                            <ListItemText primary={listData[+assetId].LTVasCollateral} sx={{ textAlign: 'right' }} />
                          </ListItem> */}
                          <Divider />
                          <ListItem>
                            <ListItemText primary="EstimatedNet APY:" />
                            <ListItemText primary={`${(+netAPY * 100).toFixed(2)} %`} sx={{ textAlign: 'right' }} />
                          </ListItem>
                          <Divider />
                          <ListItem divider>
                            <ListItemText primary="Vinium" />
                            <ListItemText primary={`${(+rewardAPR * 100).toFixed(2)} %`} sx={{ textAlign: 'right' }} />
                          </ListItem>
                          <Divider />
                          <ListItem divider>
                            <ListItemText primary="Base APY:" />
                            <ListItemText primary={`${((+depositAPY - +borrowAPY) * 100).toFixed(2)} %`} sx={{ textAlign: 'right' }} />
                          </ListItem>
                          <Divider />

                          <ListItem divider>
                            <ListItemText primary="Health Factor:" />
                            <ListItemText primary={`${(+healthFactor! ?? 0).toFixed(2)} %`} sx={{ textAlign: 'right' }} />
                          </ListItem>
                          <ListItem divider>
                            <ListItemText primary="Loop Count:" />
                            <ListItemText primary={loopCount} sx={{ textAlign: 'right' }} />
                          </ListItem>
                        </List>
                      </Card>
                    </Grid>
                    <Grid item sm={12} sx={{ textAlign: 'center' }}>
                      <Button variant="outlined" color="primary" disabled={+loopBal === 0} onClick={() => setloopStep(1)}>
                        Start Looping
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <LoopAction assetId={+assetId} loopBal={loopBal} loopCount={loopCount} loopType={loopType} />
            )}
          </Box>
        </ContentWrapper>
      )}
    </>
  );
}
