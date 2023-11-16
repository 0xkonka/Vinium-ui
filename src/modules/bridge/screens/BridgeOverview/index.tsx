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
import BridgeMain from '../BridgeMain';
import { ChainId } from '../../../../helpers/chainID';

export default function BridgeOverview() {
  const intl = useIntl();
  const { currentProviderName } = useUserWalletDataContext();
  const { chainId } = useWeb3React<providers.Web3Provider>();
  const { chainId: currentMarketChainId, networkConfig } = useProtocolDataContext();
  const { chainId: txChainId } = useStaticPoolDataContext();

  let _allowedChainIds = [ChainId.mainnet, ChainId.kovan];

  const currentWalletChainId = chainId as number;
  const allowedChainIds = _allowedChainIds?.filter((chainId) => getSupportedChainIds().includes(chainId));

  const currentMarketNetworkIsSupported =
    !allowedChainIds ||
    allowedChainIds?.find((network) => (networkConfig.isFork ? network === networkConfig.underlyingChainId : network === currentMarketChainId));

  let networkMismatch = false;
  let neededChainId = getDefaultChainId();

  if (currentMarketNetworkIsSupported && currentMarketChainId !== currentWalletChainId) {
    networkMismatch = true;
    neededChainId = currentMarketChainId;
  }

  if (!currentMarketNetworkIsSupported && txChainId !== currentWalletChainId) {
    networkMismatch = true;
    neededChainId = txChainId;
  }

  return (
    <div className="BridgeMain">
      <ScreenWrapper pageTitle={intl.formatMessage(messages.Bridge)} isTitleOnDesktop={true} withMobileGrayBg={false}>
        {networkMismatch && currentProviderName ? (
          <NetworkMismatch neededChainId={neededChainId} currentChainId={chainId as ChainId} currentProviderName={currentProviderName} />
        ) : (
          <BridgeMain />
        )}
      </ScreenWrapper>
    </div>
  );
}
