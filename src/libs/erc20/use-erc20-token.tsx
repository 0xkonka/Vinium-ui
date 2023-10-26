import { useState } from 'react';
import { BigNumber, Contract, providers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useUserWalletDataContext } from '../web3-data-provider';
import { useConnectionStatusContext } from '../connection-status-provider';
import { getContract } from '../utils';
import { usePolling } from '../hooks/use-polling';
import { useProtocolDataContext } from '../protocol-data-provider';
import erc20ABI from '../../abi/erc20ABI.json';

// interval in which the rpc data is refreshed
const POLLING_INTERVAL = 30 * 1000;

export interface erc20Humanized {
  balance: BigNumber;
}

export interface erc20DataResponse {
  loading: boolean;
  error: boolean;
  userData?: erc20Humanized;
  erc20Contract: Contract;
  refresh: () => Promise<any>;
}

export function useERC20Data(erc20Address: string): erc20DataResponse {
  const { currentAccount } = useUserWalletDataContext();
  const { library: provider } = useWeb3React<providers.Web3Provider>();
  const { chainId } = useProtocolDataContext();
  const { isRPCActive } = useConnectionStatusContext();

  let skip = !isRPCActive;

  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [errorData, setErrorData] = useState<boolean>(false);
  const [userData, setUserData] = useState<erc20Humanized | undefined>(undefined);

  const erc20Contract = getContract(erc20Address, erc20ABI, provider!, currentAccount);

  const fetchUserData = async () => {
    try {
      if (!provider) return;
      setLoadingData(true);

      let balance: BigNumber = await erc20Contract.balanceOf(currentAccount);
      let response: erc20Humanized = {
        balance,
      };

      setUserData(response);
      setErrorData(false);
    } catch (e) {
      console.log('e', e);
      setErrorData(e);
    }
    setLoadingData(false);
  };

  usePolling(fetchUserData, POLLING_INTERVAL, skip, [skip, erc20Address, chainId]);

  const loading = loadingData;
  const error = errorData;
  return {
    loading,
    error,
    userData,
    erc20Contract,
    refresh: () => {
      return Promise.all([fetchUserData()]);
    },
  };
}
