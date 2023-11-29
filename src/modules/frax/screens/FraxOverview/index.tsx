import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';

import ScreenWrapper from '../../../../components/wrappers/ScreenWrapper';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { getDefaultChainId, getSupportedChainIds } from '../../../../helpers/config/markets-and-network-config';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import { useDynamicPoolDataContext, useStaticPoolDataContext } from '../../../../libs/pool-data-provider';
import NetworkMismatch from '../../../../components/TxConfirmationView/NetworkMismatch';
import { useUserWalletDataContext } from '../../../../libs/web3-data-provider';
import SdaiMain from '../FraxMain';
import { ChainId } from '../../../../helpers/chainID';
import { Typography } from '@mui/material';

export default function FraxOverview() {
  const intl = useIntl();
  const { currentProviderName } = useUserWalletDataContext();
  const { chainId } = useWeb3React<providers.Web3Provider>();
  // const { chainId: currentMarketChainId } = useProtocolDataContext();
  // const { chainId: txChainId } = useStaticPoolDataContext();
  const { reserves } = useDynamicPoolDataContext();
  const { currentMarketData } = useProtocolDataContext();

  let allowedChainId = ChainId.mainnet;
  const currentWalletChainId = chainId as number;
  let networkMismatch = false;
  let marketMismatch = false;

  if (currentWalletChainId !== allowedChainId) {
    networkMismatch = true;
  }

  if (currentMarketData.chainId !== allowedChainId) {
    marketMismatch = true;
  }

  return (
    <div className="FraxMain">
      <ScreenWrapper pageTitle={intl.formatMessage(messages.sdai)} isTitleOnDesktop={true} withMobileGrayBg={false}>
        {networkMismatch && currentProviderName ? (
          <NetworkMismatch neededChainId={allowedChainId} currentChainId={chainId as ChainId} currentProviderName={currentProviderName} />
        ) : marketMismatch ? (
          <Typography>Please change market to Ethreum </Typography>
        ) : (
          reserves.length > 0 && currentMarketData.addresses.SFRAX && <SdaiMain reserves={reserves} sFraxAddr={currentMarketData.addresses.SFRAX} />
        )}
      </ScreenWrapper>
    </div>
  );
}
