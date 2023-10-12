import React from 'react';
import { useIntl } from 'react-intl';
import { useThemeContext } from '@aave/aave-ui-kit';
import { ChainId } from '@aave/contract-helpers';
import messages from './messages';
import staticStyles from './style';

import ContentWrapper from '../../../../components/wrappers/ContentWrapper';
import ScreenWrapper from '../../../../components/wrappers/ScreenWrapper';
import Row from '../../../../components/basic/Row';
import Value from '../../../../components/basic/Value';
import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import {
  getDefaultChainId,
  getSupportedChainIds,
} from '../../../../helpers/config/markets-and-network-config';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import { useStaticPoolDataContext } from '../../../../libs/pool-data-provider';
import NetworkMismatch from '../../../../components/TxConfirmationView/NetworkMismatch';
import { useUserWalletDataContext } from '../../../../libs/web3-data-provider';
import ManageMain from '../ManageMain';

export default function ManageOverview() {
  const intl = useIntl();
  const { currentTheme, xl, sm } = useThemeContext();
  const { disconnectWallet, currentProviderName } = useUserWalletDataContext();
  const { library: provider, chainId } = useWeb3React<providers.Web3Provider>();
  const { chainId: currentMarketChainId, networkConfig } = useProtocolDataContext();
  const { refresh, chainId: txChainId } = useStaticPoolDataContext();

  let _allowedChainIds = [ChainId.mainnet, ChainId.kovan];

  const currentWalletChainId = chainId as number;
  const allowedChainIds = _allowedChainIds?.filter((chainId) =>
    getSupportedChainIds().includes(chainId)
  );

  const currentMarketNetworkIsSupported =
    !allowedChainIds ||
    allowedChainIds?.find((network) =>
      networkConfig.isFork
        ? network === networkConfig.underlyingChainId
        : network === currentMarketChainId
    );

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
    <div className="ManageMain">
      <ScreenWrapper
        pageTitle={intl.formatMessage(messages.manage)}
        isTitleOnDesktop={true}
        withMobileGrayBg={false}
      >
        {networkMismatch && currentProviderName ? (
          <NetworkMismatch
            neededChainId={neededChainId}
            currentChainId={chainId as ChainId}
            currentProviderName={currentProviderName}
          />
        ) : (
          <ManageMain />
        )}
      </ScreenWrapper>
    </div>
  );
}
