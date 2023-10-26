import { useState } from 'react';
import { BigNumber, providers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { usePolling } from '../../hooks/use-polling';
import { getContract } from '../../utils';

import ViniumTokenABI from '../../../abi/ViniumTokenABI.json';
import { useProtocolDataContext } from '../../protocol-data-provider';
import { useConnectionStatusContext } from '../../connection-status-provider';
import { useUserWalletDataContext } from '../../web3-data-provider';

// interval in which the rpc data is refreshed
const POLLING_INTERVAL = 30 * 1000;

export interface ViniumTokenHumanized {
  balance: BigNumber;
}

export interface ViniumTokenDataResponse {
  loading: boolean;
  error: boolean;
  userData?: ViniumTokenHumanized;
  refresh: () => Promise<any>;
}

export function useViniumTokenData(): ViniumTokenDataResponse {
  const { currentAccount } = useUserWalletDataContext();
  const { library: provider } = useWeb3React<providers.Web3Provider>();
  const { currentMarketData, chainId } = useProtocolDataContext();
  const { isRPCActive } = useConnectionStatusContext();

  let skip = !isRPCActive;

  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [errorData, setErrorData] = useState<boolean>(false);
  const [userData, setUserData] = useState<ViniumTokenHumanized | undefined>(undefined);

  let viniumTokenAddress = currentMarketData.addresses.VINIUM_OFT!;

  const viniumTokenContract = getContract(viniumTokenAddress, ViniumTokenABI, provider!, currentAccount);

  const fetchUserData = async () => {
    try {
      if (!provider) return;
      setLoadingData(true);

      let balance: BigNumber = await viniumTokenContract.balanceOf(currentAccount);
      let response: ViniumTokenHumanized = {
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

  usePolling(fetchUserData, POLLING_INTERVAL, skip, [skip, viniumTokenAddress, chainId]);

  const loading = loadingData;
  const error = errorData;
  return {
    loading,
    error,
    userData,
    refresh: () => {
      return Promise.all([fetchUserData()]);
    },
  };
}
