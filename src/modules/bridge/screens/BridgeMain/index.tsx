import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { Box, Button, Grid, ListItemIcon, ListItemText, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import NoDataPanel from '../../../../components/NoDataPanel';
import ContentWrapper from '../../../../components/wrappers/ContentWrapper';
import { useHistory } from 'react-router-dom';
import { useUserWalletDataContext } from '../../../../libs/web3-data-provider';
import { useViniumTokenData } from '../../../../libs/vinium-protocol-js/hooks/use-vinium-token';
import { formatEther, formatUnits, parseEther } from 'ethers/lib/utils';
import { getNetworkConfig } from '../../../../helpers/config/markets-and-network-config';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import { useTxBuilderContext } from '../../../../libs/tx-provider';
import { CHAINS, CHAIN_ID_TO_NETWORK } from '../../../../ui-config/chains';
import { ethers } from 'ethers';
import { SpinLoader, useThemeContext } from '@aave/aave-ui-kit';

export default function BridgeMain() {
  const intl = useIntl();
  const history = useHistory();
  const { currentTheme } = useThemeContext();
  const { currentAccount } = useUserWalletDataContext();
  const { chainId } = useProtocolDataContext();
  const { userData } = useViniumTokenData();
  const { viniumTokenContract } = useTxBuilderContext();

  const config = useMemo(() => getNetworkConfig(chainId), [chainId]);

  const [fee, setFee] = useState(0);
  const [OFTBal, setOFTBal] = useState('0');
  const [chainName, setChainName] = useState('');
  const [toChainId, setToChainId] = useState(0);
  const [calcLoading, setCalcLoading] = useState(false);
  const [bridgeLoading, setBridgeLoading] = useState(false);

  const getGasForDestination = (destChainId: number) => {
    let gasSettings: any = {
      102: 160000, // arb->bsc
      110: 3200000, // bsc->arb
    };
    return (gasSettings[destChainId] ?? 200000) * 1.01;
  };

  const calculateBridgeFee = useCallback(
    async (destChainId: number) => {
      if (!viniumTokenContract || !currentAccount || toChainId === 0) return;
      const gasSetting = getGasForDestination(destChainId);
      let toAddressBytes32 = ethers.utils.defaultAbiCoder.encode(['address'], [currentAccount]);
      let adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, gasSetting]); // default adapterParams example
      console.log('toChainId', toChainId);
      const fees = await viniumTokenContract.estimateSendFee(toChainId, toAddressBytes32, parseEther(OFTBal), false, adapterParams);
      const fee = formatUnits(fees[0]);
      console.log('fee', fee);
      return fee;
    },
    [OFTBal, currentAccount, toChainId, viniumTokenContract]
  );

  useEffect(() => {
    (async () => {
      try {
        setCalcLoading(true);
        const fee = await calculateBridgeFee(toChainId);
        setCalcLoading(false);
        setFee(+fee!);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [toChainId, calculateBridgeFee]);

  const handleBridge = async () => {
    if (!viniumTokenContract || !currentAccount || toChainId === 0) return;
    setBridgeLoading(true);
    try {
      let toAddressBytes32 = ethers.utils.defaultAbiCoder.encode(['address'], [currentAccount]);
      let gasSetting = getGasForDestination(toChainId);
      let adapterParams = ethers.utils.solidityPack(['uint16', 'uint256'], [1, gasSetting]); // default adapterParams example
      const fee = await calculateBridgeFee(toChainId);

      if (+fee! > 0)
        await (
          await viniumTokenContract.sendFrom(
            currentAccount,
            toChainId,
            toAddressBytes32,
            parseEther(OFTBal),
            {
              refundAddress: currentAccount, // refund address (if too much message fee is sent, it gets refunded)
              zroPaymentAddress: ethers.constants.AddressZero, // address(0x0) if not paying in ZRO (LayerZero Token)
              adapterParams: adapterParams, // flexible bytes array to indicate messaging adapter services
            },
            { value: parseEther(fee!) }
          )
        ).wait();
    } catch (err) {
      console.log('err', err);
    }
    setBridgeLoading(false);
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
        <ContentWrapper className="CurrencyScreenWrapper__content" withBackButton={true} goBack={() => history.goBack()} withFullHeight>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '500px' }}>
            <Grid container sx={{ flexDirection: 'column', alignItems: 'center' }} spacing={2}>
              <Grid item sm={12} md={6}>
                <Typography>{intl.formatMessage(messages.description)}</Typography>
              </Grid>
              <Grid item sm={12} md={6} width={'100%'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Bridge VINIUM</Typography>
                <Typography>{(+formatEther(userData?.balance! ?? 0)).toFixed(2)}</Typography>
              </Grid>
              <Grid item sm={12} md={6} width={'100%'}>
                <OutlinedInput
                  id="outlined-adornment-weight"
                  type="number"
                  value={OFTBal}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setOFTBal(event.target.value);
                  }}
                  endAdornment={
                    <Button size="small" onClick={() => setOFTBal(formatEther(userData?.balance! ?? 0))}>
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
              <Grid item sm={12} md={6} width={'100%'}>
                <Select value={chainName} inputProps={{ 'aria-label': 'Without label' }} sx={{ width: '100%' }}>
                  {CHAINS.filter(
                    (chain) =>
                      chain.isTestnet === config.isTestnet && chain.bridgeEnabled === true && chain.chainId !== CHAIN_ID_TO_NETWORK[chainId].chainId
                  ).map((item, index) => (
                    <MenuItem value={item.name} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemIcon sx={{ minWidth: '0' }}>
                          {typeof item.image === 'string' ? <img src={item.image} alt="network-icon" /> : <item.image className="network-icon" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.name}
                          onClick={() => {
                            setToChainId(item.chainId);
                            setChainName(item.name);
                          }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item sm={12} md={6}>
                Estimated Fee : {calcLoading ? <SpinLoader className="DotStatus__loader" color={currentTheme.orange.hex} /> : fee}
              </Grid>
              <Grid item sm={12} md={6}>
                {bridgeLoading ? (
                  <SpinLoader className="DotStatus__loader" color={currentTheme.orange.hex} />
                ) : (
                  <Button variant="contained" onClick={() => handleBridge()}>
                    Bridge
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
        </ContentWrapper>
      )}
    </>
  );
}
