import { useState } from 'react';
import { BigNumber, Contract, providers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { useUserWalletDataContext } from '../web3-data-provider';
import { useConnectionStatusContext } from '../connection-status-provider';
import { getContract } from '../utils';
import { usePolling } from '../hooks/use-polling';
import { useProtocolDataContext } from '../protocol-data-provider';
import sDaiABI from '../../abi/sDaiABI.json';
import sDaivatABI from '../../abi/sDaiVat.json';
import { parseEther } from 'ethers/lib/utils';
import erc20ABI from '../../abi/erc20ABI.json';

// interval in which the rpc data is refreshed
const POLLING_INTERVAL = 30 * 1000;

export interface sDaiHumanized {
  convertToAssets: number;
  convertToShares: number;
  dsr: number;
  daiInRad: number;
}

export interface sDaiUserHumanized {
  userAssetBalance: BigNumber;
  userVaultBalance: BigNumber;
}

export interface sDaiDataResponse {
  loading: boolean;
  error: boolean;
  data?: sDaiHumanized;
  userData?: sDaiUserHumanized;
  vaultContract: Contract;
  refresh: () => Promise<any>;
}

export function useSDaiData(assetAddr: string, vaultAddress: string): sDaiDataResponse {
  const { library: provider } = useWeb3React<providers.Web3Provider>();
  const { chainId } = useProtocolDataContext();
  const { currentAccount } = useUserWalletDataContext();
  const { isRPCActive } = useConnectionStatusContext();
  // const { user } = useDynamicPoolDataContext();

  let skip = !isRPCActive;

  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [errorData, setErrorData] = useState<boolean>(false);
  const [data, setData] = useState<sDaiHumanized | undefined>(undefined);
  const [userData, setUserData] = useState<sDaiUserHumanized | undefined>(undefined);

  // const vaultAddress = '0x83f20f44975d03b1b09e64809b757c47f942beea';

  const vaultContract = getContract(vaultAddress, sDaiABI, provider!);
  // const vaultContract = new ethers.Contract(vaultAddress, sDaiABI, provider);

  const fetchData = async () => {
    try {
      if (!provider || !assetAddr || !vaultAddress) return;
      setLoadingData(true);

      const [potAddress, vatAddress] = await Promise.all([vaultContract.pot(), vaultContract.vat()]);

      const vatContract = getContract(vatAddress, sDaivatABI, provider!);

      const currentConvertToAssets: BigNumber = await vaultContract.convertToAssets(parseEther('1'));
      const convertToShares: BigNumber = await vaultContract.convertToShares(parseEther('1'));
      const currentBlocknumber = await provider.getBlockNumber();
      const lastDayAgoBlockNumber: BigNumber = BigNumber.from(currentBlocknumber).sub(BigNumber.from(2 * 60 * 60));
      const lastConvertToAssets: BigNumber = await vaultContract.convertToAssets(parseEther('1'), { blockTag: lastDayAgoBlockNumber.toNumber() });
      const convertToAssetsApr = currentConvertToAssets.sub(lastConvertToAssets);

      const daiInRad: BigNumber = await vatContract.dai(potAddress);

      let response: sDaiHumanized = {
        convertToAssets: +currentConvertToAssets / 10 ** 18,
        convertToShares: +convertToShares / 10 ** 18,
        dsr: +convertToAssetsApr.mul(BigNumber.from(365)) / 10 ** 18,
        daiInRad: +daiInRad.div('1' + '0'.repeat(45)),
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

      let response: sDaiUserHumanized = {
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
