import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { Box, Button, Card, CardContent, Grid, OutlinedInput, Tab, Tabs, Typography } from '@mui/material';
import NoDataPanel from '../../../../components/NoDataPanel';
import { useUserWalletDataContext } from '../../../../libs/web3-data-provider';
import ContentWrapper from '../../../../components/wrappers/ContentWrapper';
import { useHistory } from 'react-router-dom';
import { useSDaiData } from '../../../../libs/erc4626/use-sdai-token';
import { ComputedReserveData } from '../../../../libs/pool-data-provider';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import { getContract } from '../../../../libs/utils';
import erc20ABI from '../../../../abi/erc20ABI.json';
import sDaiABI from '../../../../abi/sDaiABI.json';
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

interface SdaiMainProps {
  reserves: ComputedReserveData[];
  sDaiAddr: string;
}

export default function SdaiMain({ reserves, sDaiAddr }: SdaiMainProps) {
  const intl = useIntl();
  const history = useHistory();
  const { currentAccount: user } = useUserWalletDataContext();
  const { chainId: currentChainId } = useProtocolDataContext();
  const { library: provider } = useWeb3React<providers.Web3Provider>();
  const daiReserve = reserves.find((reserve) => reserve.symbol === 'DAI');

  // const daiAddr = '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844';
  const daiAddr = daiReserve?.underlyingAsset;
  const { data, userData, refresh } = useSDaiData(daiAddr!, sDaiAddr);

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [daiApproved, setDaiApproved] = useState(false);
  const [assetDepositAmount, setAssetDepositAmount] = useState(0);
  const [vaultWithdrawAmount, setVaultWithdrawAmount] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const checkdaiApproved = async () => {
    if(!daiAddr) return;
    const erc20Service = new ERC20Service(getProvider(currentChainId));
    const { isApproved } = erc20Service;

    // console.log('daiReserve?.underlyingAsset!', daiReserve?.underlyingAsset!);
    const approved = await isApproved({
      // token: daiReserve?.underlyingAsset!,
      token: daiAddr,
      user: user,
      spender: sDaiAddr,
      amount: assetDepositAmount.toString(),
    });

    setDaiApproved(approved);
  };

  const debdaiApproved = useDebouncedCallback(checkdaiApproved, 400);

  useEffect(() => {
    const intervalId = setInterval(() => debdaiApproved(), 1000);
    return () => clearInterval(intervalId);
  }, [debdaiApproved]);

  const handleAssetApprove = async () => {
    if (!user || !provider || !daiAddr) return;

    setLoading(true);
    try {
      // const daiContract = getContract(daiReserve.underlyingAsset, erc20ABI, provider, user);
      const daiContract = getContract(daiAddr, erc20ABI, provider, user);
      let tx = await daiContract.approve(sDaiAddr, ethers.constants.MaxInt256);
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
      const sDaiContract = getContract(sDaiAddr, sDaiABI, provider, user);
      let tx = await sDaiContract.deposit(parseUnits(assetDepositAmount.toString(), 18), user);
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
      const sDaiContract = getContract(sDaiAddr, sDaiABI, provider, user);
      let tx = await sDaiContract.redeem(parseUnits(vaultWithdrawAmount.toString(), 18), user, user);
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
              <Typography> DAI in DSR: {(data?.daiInRad! / 10 ** 9).toFixed(2)}B DAI</Typography>
              <Typography> DSR Rate: {(data?.dsr! * 100).toFixed(2)}%</Typography>
              <Typography> Converation Rate: {data?.convertToAssets!.toFixed(2)} Dai ( per 1 sDai) </Typography>
              <Typography>
                Dai Balance : {(+formatEther(userData?.userAssetBalance! ?? 0)).toFixed(2)} dai , sDai worth :{' '}
                {(+formatEther(userData?.userAssetBalance! ?? 0) * data?.convertToShares!).toFixed(2)}
              </Typography>
              <Typography>sDai Balance : {(+formatEther(userData?.userVaultBalance! ?? 0)).toFixed(2)} sDai</Typography>
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
                    <Typography sx={{ color: 'white' }}>Dai Balance : {+formatEther(userData?.userAssetBalance! ?? 0)} </Typography>
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
                    ) : daiApproved ? (
                      <Button onClick={() => handleAssetDeposit()}>Deposit</Button>
                    ) : (
                      <Button onClick={() => handleAssetApprove()}>Approve</Button>
                    )}
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: 'white' }}>Current sDai : {+formatEther(userData?.userVaultBalance! ?? 0)} </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: 'white' }}>
                      Estimated sDai : {+formatEther(userData?.userVaultBalance! ?? 0) + assetDepositAmount * data?.convertToShares!}{' '}
                    </Typography>
                  </Grid>
                </Grid>
              </CustomTabPanel>

              <CustomTabPanel value={tab} index={1}>
                <Grid container sx={{ flexDirection: 'column', alignItems: 'flex-start' }} spacing={3}>
                  <Grid item>
                    <Typography sx={{ color: 'white' }}>sDai Balance : {+formatEther(userData?.userVaultBalance! ?? 0)} </Typography>
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
                    <Typography sx={{ color: 'white' }}>Current Dai : {+formatEther(userData?.userAssetBalance! ?? 0)} </Typography>
                  </Grid>
                  <Grid item>
                    <Typography sx={{ color: 'white' }}>
                      Estimated Dai : {+formatEther(userData?.userAssetBalance! ?? 0) + vaultWithdrawAmount * data?.convertToAssets!}{' '}
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
