import React from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { useThemeContext } from '@aave/aave-ui-kit';

import DefaultButton from '../../basic/DefaultButton';
import AccessMaticMarketHelpModal from '../../HelpModal/AccessMaticMarketHelpModal';
import { AvailableWeb3Connectors, useUserWalletDataContext } from '../../../libs/web3-data-provider';
import { getNetworkConfig } from '../../../helpers/config/markets-and-network-config';

import messages from './messages';
import staticStyles from './style';

import { useWeb3React } from '@web3-react/core';
import { providers } from 'ethers';
import { ChainId } from '../../../helpers/chainID';
import { Button } from '@mui/material';

interface NetworkMismatchProps {
  neededChainId: ChainId;
  currentChainId: ChainId;
  currentProviderName: AvailableWeb3Connectors;
}

const ADD_CONFIG: {
  [key: number]: {
    name: string;
    explorerUrls: string[];
    nativeCurrency: { name: string; symbol: string; decimals: number };
  };
} = {
  [ChainId.polygon]: {
    name: 'Polygon',
    explorerUrls: ['https://explorer.matic.network'],
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  [ChainId.mumbai]: {
    name: 'Mumbai',
    explorerUrls: ['https://explorer-mumbai.maticvigil.com'],
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  [ChainId.avalanche]: {
    name: 'Avalanche',
    explorerUrls: ['https://cchain.explorer.avax.network'],
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    },
  },
  [ChainId.fuji]: {
    name: 'Avalanche Fuji',
    explorerUrls: ['https://cchain.explorer.avax-test.network'],
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18,
    },
  },
  [ChainId.goerli]: {
    name: 'Ethereum Goerli',
    explorerUrls: ['https://goerli.etherscan.io'],
    nativeCurrency: {
      name: 'Goerli',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

export default function NetworkMismatchButton({ neededChainId, currentChainId, currentProviderName }: NetworkMismatchProps) {
  const intl = useIntl();
  const { currentTheme } = useThemeContext();
  const { library } = useWeb3React<providers.Web3Provider>();
  const { handleNetworkChange } = useUserWalletDataContext();

  const config = ADD_CONFIG[neededChainId];
  const isMetaMask = (global.window as any)?.ethereum?.isMetaMask;
  // @ts-ignore
  const isCoinbaseWallet = library?.provider?.isCoinbaseWallet === true;
  const isAddable = (isMetaMask || isCoinbaseWallet) && ['browser', 'wallet-link'].includes(currentProviderName) && config;
  const { publicJsonRPCWSUrl, publicJsonRPCUrl } = getNetworkConfig(neededChainId);

  // const isExternalNetworkUpdateNeeded =
  //   !isMetaMaskForMatic && ['browser', 'wallet-connect'].includes(currentProviderName);
  const isManualNetworkUpdateNeeded = ['torus', 'portis'].includes(currentProviderName);
  const isNeededNetworkNotSupported =
    neededChainId === ChainId.polygon && ['authereum', 'fortmatic', 'mew-wallet', 'ledger'].includes(currentProviderName);

  const neededNetworkConfig = getNetworkConfig(neededChainId);
  const currentNetworkConfig = getNetworkConfig(currentChainId);

  return (
    <div className="NetworkMismatch">
      {isAddable && config && (
        <Button
          onClick={async (e) => {
            e.stopPropagation();
            if (library) {
              try {
                await library.provider.request!({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: `0x${neededChainId.toString(16)}` }],
                });
              } catch (switchError) {
                console.log(switchError);
                if (switchError.code === 4902) {
                  try {
                    await library.provider.request!({
                      method: 'wallet_addEthereumChain',
                      params: [
                        {
                          chainId: `0x${neededChainId.toString(16)}`,
                          chainName: config.name,
                          nativeCurrency: config.nativeCurrency,
                          rpcUrls: [...publicJsonRPCUrl, publicJsonRPCWSUrl],
                          blockExplorerUrls: config.explorerUrls,
                        },
                      ],
                    });
                  } catch (addError) {
                    console.log(addError);
                    // TODO: handle error somehow
                  }
                }
              }
            }
          }}
        >
          {intl.formatMessage(messages.changeNetwork)}{' '}
        </Button>
      )}

      {isManualNetworkUpdateNeeded && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleNetworkChange(neededChainId);
          }}
        >
          {' '}
          {intl.formatMessage(messages.changeNetwork)}{' '}
        </Button>
      )}

      {!isAddable && (
        <div className="NetworkMismatch__bottom-inner">
          <div className="NetworkMismatch__bottom-text">
            {isAddable && (
              <div>
                {intl.formatMessage(messages.howToChange)} <AccessMaticMarketHelpModal className="NetworkMismatch__bottomText" text="Polygon POS" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
