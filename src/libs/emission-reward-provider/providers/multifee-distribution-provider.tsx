import React, { ReactElement, ReactNode, useContext } from 'react';
import { useProtocolDataContext } from '../../protocol-data-provider';
import { useUserWalletDataContext } from '../../web3-data-provider';
import { NetworkConfig } from '../../../helpers/config/types';
import { useConnectionStatusContext } from '../../connection-status-provider';
import { ChainId } from '@aave/contract-helpers';
import { useMultiFeeDistributionData } from '../hooks/use-multifee-distribution';
import { DataHumanized, UserDataHumanized } from '../types';

/**
 * removes the marketPrefix from a symbol
 * @param symbol
 * @param prefix
 */
export const unPrefixSymbol = (symbol: string, prefix: string) => {
  return symbol.toUpperCase().replace(RegExp(`^(${prefix[0]}?${prefix.slice(1)})`), '');
};

export interface MultiFeeDistributionDataContextData {
  userId?: string;
  chainId: ChainId;
  networkConfig: NetworkConfig;
  data: DataHumanized;
  userData?: UserDataHumanized;
  refresh: () => Promise<void>;
}

const MultiFeeDistributionDataContext = React.createContext(
  {} as MultiFeeDistributionDataContextData
);

interface MultiFeeDistributionDataProviderProps {
  children: ReactNode;
  loader: ReactElement;
  errorPage: ReactElement;
}

export function MultiFeeDistributionProvider({
  children,
  loader,
  errorPage,
}: MultiFeeDistributionDataProviderProps) {
  const { currentAccount } = useUserWalletDataContext();
  const { currentMarketData, chainId, networkConfig } = useProtocolDataContext();
  const { isRPCActive } = useConnectionStatusContext();
  const RPC_ONLY_MODE = networkConfig.rpcOnly;

  const {
    error: rpcDataError,
    loading: rpcDataLoading,
    data: rpcData,
    refresh,
  } = useMultiFeeDistributionData(
    currentMarketData.addresses.MULTIFEE_DISTRIBUTION!,
    chainId,
    !isRPCActive,
    currentAccount
  );

  const activeData = rpcData;
  if (isRPCActive && rpcDataLoading && !rpcData) {
    return loader;
  }

  if (!activeData || (isRPCActive && rpcDataError)) {
    return errorPage;
  }

  const data: DataHumanized = activeData.data!;
  const userData: UserDataHumanized = activeData.userData!;

  if (!RPC_ONLY_MODE && isRPCActive && rpcData) {
    console.log('switched to RPC');
  }

  return (
    <MultiFeeDistributionDataContext.Provider
      value={{
        userId: currentAccount,
        chainId,
        networkConfig,
        refresh: isRPCActive ? refresh : async () => {},
        data,
        userData,
      }}
    >
      {children}
    </MultiFeeDistributionDataContext.Provider>
  );
}

export const useMultiFeeDistributionDataContext = () => useContext(MultiFeeDistributionDataContext);
