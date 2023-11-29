import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { Box, Button, Card, CardContent, Grid, OutlinedInput, Tab, Tabs, Typography } from '@mui/material';
import NoDataPanel from '../../../../components/NoDataPanel';
import { useUserWalletDataContext } from '../../../../libs/web3-data-provider';
import ContentWrapper from '../../../../components/wrappers/ContentWrapper';
import { useHistory } from 'react-router-dom';
import { useSFraxData } from '../../../../libs/erc4626/use-sfrax-token';
import { ComputedReserveData } from '../../../../libs/pool-data-provider';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import { getContract } from '../../../../libs/utils';
import erc20ABI from '../../../../abi/erc20ABI.json';
import sFraxABI from '../../../../abi/sFraxABI.json';
import { useWeb3React } from '@web3-react/core';
import { ethers, providers } from 'ethers';
import { ERC20Service } from '@aave/contract-helpers';
import { getProvider } from '../../../../helpers/config/markets-and-network-config';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import { SpinLoader } from '@aave/aave-ui-kit';
import { useDebouncedCallback } from 'use-debounce';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface sFraxMainProps {
  reserves: ComputedReserveData[];
  sFraxAddr: string;
}

export default function FraxMain({ reserves, sFraxAddr }: sFraxMainProps) {
  const intl = useIntl();
  const history = useHistory();
  const { currentAccount: user } = useUserWalletDataContext();
  const { chainId: currentChainId } = useProtocolDataContext();
  const { library: provider } = useWeb3React<providers.Web3Provider>();
  const fraxReserve = reserves.find((reserve) => reserve.symbol === 'FRAX');

  const fraxAddr = fraxReserve?.underlyingAsset!;
  const { data, userData, refresh } = useSFraxData(fraxAddr!, sFraxAddr);

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fraxApproved, setfraxApproved] = useState(false);
  const [assetDepositAmount, setAssetDepositAmount] = useState(0);
  const [vaultWithdrawAmount, setVaultWithdrawAmount] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const checkfraxApproved = async () => {
    if(!fraxAddr) return;
    const erc20Service = new ERC20Service(getProvider(currentChainId));
    const { isApproved } = erc20Service;

    // console.log('fraxReserve?.underlyingAsset!', fraxReserve?.underlyingAsset!);
    const approved = await isApproved({
      // token: fraxReserve?.underlyingAsset!,
      token: fraxAddr,
      user: user,
      spender: sFraxAddr,
      amount: assetDepositAmount.toString(),
    });

    setfraxApproved(approved);
  };

  const debfraxApproved = useDebouncedCallback(checkfraxApproved, 400);

  useEffect(() => {
    const intervalId = setInterval(() => debfraxApproved(), 1000);
    return () => clearInterval(intervalId);
  }, [debfraxApproved]);

  const handleAssetApprove = async () => {
    if (!user || !provider || !fraxAddr) return;

    setLoading(true);
    try {
      // const fraxContract = getContract(fraxReserve.underlyingAsset, erc20ABI, provider, user);
      const fraxContract = getContract(fraxAddr, erc20ABI, provider, user);
      let tx = await fraxContract.approve(sFraxAddr, ethers.constants.MaxInt256);
      await tx.wait();
    } catch (err) {
      console.log('err', err);
    }
    setLoading(false);
  };

  const handleAssetDeposit = async () => {
    if (!user || !provider) return;
    setLoading(true);
    try {
      const sFraxContract = getContract(sFraxAddr, sFraxABI, provider, user);
      let tx = await sFraxContract.deposit(parseUnits(assetDepositAmount.toString(), 18), user);
      await tx.wait();
      await refresh();
    } catch (err) {
      console.log('err', err);
    }
    setLoading(false);
  };

  const handleVaultWithdraw = async () => {
    if (!user || !provider) return;
    setLoading(true);
    try {
      const sFraxContract = getContract(sFraxAddr, sFraxABI, provider, user);
      let tx = await sFraxContract.redeem(parseUnits(vaultWithdrawAmount.toString(), 18), user, user);
      await tx.wait();
      await refresh();
    } catch (err) {
      console.log('err', err);
    }
    setLoading(false);
  };

  return (
    <>
      {!user ? (
        <NoDataPanel
          title={!user ? intl.formatMessage(messages.connectWallet) : intl.formatMessage(messages.noDataTitle)}
          description={!user ? intl.formatMessage(messages.connectWalletDescription) : intl.formatMessage(messages.noDataDescription)}
          withConnectButton={!user}
        />
      ) : (
        <>
          <Card>
            <CardContent>
              <Typography> sFrax Supply: {(data?.totalSupply! ?? 0).toFixed(2)}</Typography>
              <Typography> Current APY: {(data?.apy! * 100).toFixed(2)}%</Typography>
              <Typography> Converation Rate: {data?.convertToAssets!.toFixed(4)} frax ( per 1 sFrax) </Typography>
              <Typography>
                Frax Balance : {(+formatEther(userData?.userAssetBalance! ?? 0)).toFixed(2)} frax , sFrax worth :{' '}
                {(+formatEther(userData?.userAssetBalance! ?? 0) * data?.convertToShares!).toFixed(2)}
              </Typography>
              <Typography>sFrax Balance : {(+formatEther(userData?.userVaultBalance! ?? 0)).toFixed(2)} sFrax</Typography>
            </CardContent>
          </Card>
          <ContentWrapper className="CurrencyScreenWrapper__content" withBackButton={true} goBack={() => history.goBack()} withFullHeight>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '500px' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Deposit" {...a11yProps(0)} />
                  <Tab label="Withdraw" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={tab} index={0}>
                <Grid container sx={{ flexDirection: 'column', alignItems: 'flex-start' }} spacing={3}>
                  <Grid item>
                    <Typography sx={{ color: 'white' }}>frax Balance : {+formatEther(userData?.userAssetBalance! ?? 0)} </Typography>
                  </Grid>
                  <Grid item>
                    <OutlinedInput
                      id="outlined-adornment-weight"
                      type="number"
                      value={assetDepositAmount}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setAssetDepositAmount(+event.target.value);
                      }}
                      endAdornment={
                        <Button size="small" onClick={() => setAssetDepositAmount(+formatEther(userData?.userAssetBalance! ?? 0))}>
                          Max
                        </Button>
                      }
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        'aria-label': 'weight',
                      }}
                    />
                  </Grid>
                  <Grid item>
                    {loading ? (
                      <SpinLoader color="white" className="TxTopInfo__spinner" />
                    ) : fraxApproved ? (
                      <Button onClick={() => handleAssetDeposit()}>Deposit</Button>
                    ) : (
                      <Button onClick={() => handleAssetApprove()}>Approve</Button>
                    )}
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: 'white' }}>Current sFrax : {+formatEther(userData?.userVaultBalance! ?? 0)} </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: 'white' }}>
                      Estimated sFrax : {+formatEther(userData?.userVaultBalance! ?? 0) + assetDepositAmount * data?.convertToShares!}{' '}
                    </Typography>
                  </Grid>
                </Grid>
              </CustomTabPanel>

              <CustomTabPanel value={tab} index={1}>
                <Grid container sx={{ flexDirection: 'column', alignItems: 'flex-start' }} spacing={3}>
                  <Grid item>
                    <Typography sx={{ color: 'white' }}>sFrax Balance : {+formatEther(userData?.userVaultBalance! ?? 0)} </Typography>
                  </Grid>
                  <Grid item>
                    <OutlinedInput
                      id="outlined-adornment-weight"
                      type="number"
                      value={vaultWithdrawAmount}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setVaultWithdrawAmount(+event.target.value);
                      }}
                      endAdornment={
                        <Button size="small" onClick={() => setVaultWithdrawAmount(+formatEther(userData?.userVaultBalance! ?? 0))}>
                          Max
                        </Button>
                      }
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        'aria-label': 'weight',
                      }}
                    />
                  </Grid>
                  <Grid item>
                    {loading ? (
                      <SpinLoader color="white" className="TxTopInfo__spinner" />
                    ) : (
                      <Button onClick={() => handleVaultWithdraw()}>Withdraw</Button>
                    )}
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: 'white' }}>Current frax : {+formatEther(userData?.userAssetBalance! ?? 0)} </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: 'white' }}>
                      Estimated frax : {+formatEther(userData?.userAssetBalance! ?? 0) + vaultWithdrawAmount * data?.convertToAssets!}{' '}
                    </Typography>
                  </Grid>
                </Grid>
              </CustomTabPanel>
            </Box>
          </ContentWrapper>
        </>
      )}
    </>
  );
}
