import { useState } from 'react';
import { BigNumber, Contract, providers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useUserWalletDataContext } from '../web3-data-provider';
import { useConnectionStatusContext } from '../connection-status-provider';
import { getContract } from '../utils';
import { usePolling } from '../hooks/use-polling';
import { useProtocolDataContext } from '../protocol-data-provider';
import sFraxABI from '../../abi/sFraxABI.json';
import { parseEther } from 'ethers/lib/utils';
import erc20ABI from '../../abi/erc20ABI.json';

// interval in which the rpc data is refreshed
const POLLING_INTERVAL = 30 * 1000;

export interface sFraxHumanized {
  convertToAssets: number;
  convertToShares: number;
  apy: number;
  totalSupply: number;
}

export interface sFraxUserHumanized {
  userAssetBalance: BigNumber;
  userVaultBalance: BigNumber;
}

export interface sFraxDataResponse {
  loading: boolean;
  error: boolean;
  data?: sFraxHumanized;
  userData?: sFraxUserHumanized;
  vaultContract: Contract;
  refresh: () => Promise<any>;
}

export function useSFraxData(assetAddr: string, vaultAddress: string): sFraxDataResponse {
  const { library: provider } = useWeb3React<providers.Web3Provider>();
  const { chainId } = useProtocolDataContext();
  const { currentAccount } = useUserWalletDataContext();
  const { isRPCActive } = useConnectionStatusContext();
  // const { user } = useDynamicPoolDataContext();

  let skip = !isRPCActive;

  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [errorData, setErrorData] = useState<boolean>(false);
  const [data, setData] = useState<sFraxHumanized | undefined>(undefined);
  const [userData, setUserData] = useState<sFraxUserHumanized | undefined>(undefined);

  // const vaultAddress = '0x83f20f44975d03b1b09e64809b757c47f942beea';

  const vaultContract = getContract(vaultAddress, sFraxABI, provider!);
  // const vaultContract = new ethers.Contract(vaultAddress, sFraxABI, provider);

  const fetchData = async () => {
    try {
      if (!provider || !assetAddr || !vaultAddress) return;
      setLoadingData(true);

      const currentConvertToAssets: BigNumber = await vaultContract.convertToAssets(parseEther('1'));
      const convertToShares: BigNumber = await vaultContract.convertToShares(parseEther('1'));

      const currentBlocknumber = await provider.getBlockNumber();
      const lastDayAgoBlockNumber: BigNumber = BigNumber.from(currentBlocknumber).sub(BigNumber.from(2 * 60 * 60));
      const lastConvertToAssets: BigNumber = await vaultContract.convertToAssets(parseEther('1'), { blockTag: lastDayAgoBlockNumber.toNumber() });
      const convertToAssetsApr = currentConvertToAssets.sub(lastConvertToAssets);

      const totalSupply: BigNumber = await vaultContract.totalSupply();

      let response: sFraxHumanized = {
        convertToAssets: +currentConvertToAssets / 10 ** 18,
        convertToShares: +convertToShares / 10 ** 18,
        apy: +convertToAssetsApr.mul(BigNumber.from(365)) / 10 ** 18,
        totalSupply: +totalSupply / 10 ** 18,
      };

      setData(response);
      setErrorData(false);
    } catch (e) {
      console.log('e', e);
      setErrorData(e);
    }
    setLoadingData(false);
  };

  const fetchUserData = async () => {
    try {
      if (!provider || !currentAccount || !assetAddr || !vaultAddress) return;
      setLoadingData(true);

      const assetContract = getContract(assetAddr, erc20ABI, provider!);
      const userAssetBalance: BigNumber = await assetContract.balanceOf(currentAccount);
      const userVaultBalance: BigNumber = await vaultContract.balanceOf(currentAccount);

      let response: sFraxUserHumanized = {
        userAssetBalance,
        userVaultBalance,
      };

      setUserData(response);
      setErrorData(false);
    } catch (e) {
      console.log('e', e);
      setErrorData(e);
    }
    setLoadingData(false);
  };

  usePolling(fetchData, POLLING_INTERVAL, skip, [skip, chainId]);
  usePolling(fetchUserData, POLLING_INTERVAL, skip, [skip, chainId, currentAccount]);

  const loading = loadingData;
  const error = errorData;
  return {
    loading,
    error,
    data,
    userData,
    vaultContract,
    refresh: () => {
      return Promise.all([fetchData(), fetchUserData()]);
    },
  };
}
