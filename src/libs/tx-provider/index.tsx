import React, { PropsWithChildren, useContext } from 'react';
import { providers } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { useWeb3React } from '@web3-react/core';
import { LendingPool, FaucetService } from '@aave/contract-helpers';
import { useProtocolDataContext } from '../protocol-data-provider';
import { getProvider } from '../../helpers/config/markets-and-network-config';
import MultiFeeDistributionABI from '../../abi/MultiFeeDistributionABI.json';
import ChefIncentivesControllerABI from '../../abi/ChefIncentivesControllerABI.json';
import ViniumTokenABI from '../../abi/ViniumTokenABI.json';
import erc20ABI from '../../abi/erc20ABI.json';
import LeveragerABI from '../../abi/LeveragerABI.json';
import { useUserWalletDataContext } from '../web3-data-provider';
import { getContract } from '../utils';

export interface TxBuilderContextInterface {
  lendingPool: LendingPool;
  faucetService: FaucetService;
  multiFeeDistribution?: '' | Contract | undefined;
  chefIncentiveController?: '' | Contract | undefined;
  viniumTokenContract?: '' | Contract | undefined;
  viniumLPContract?: '' | Contract | undefined;
  leveragerContract?: '' | Contract | undefined;
}

const TxBuilderContext = React.createContext({} as TxBuilderContextInterface);

export function TxBuilderProvider({ children }: PropsWithChildren<{}>) {
  const { chainId: currentChainId, currentMarketData } = useProtocolDataContext();
  const { currentAccount } = useUserWalletDataContext();
  const { library: provider } = useWeb3React<providers.Web3Provider>();

  const lendingPool = new LendingPool(getProvider(currentChainId), {
    LENDING_POOL: currentMarketData.addresses.LENDING_POOL,
    REPAY_WITH_COLLATERAL_ADAPTER: currentMarketData.addresses.REPAY_WITH_COLLATERAL_ADAPTER,
    SWAP_COLLATERAL_ADAPTER: currentMarketData.addresses.SWAP_COLLATERAL_ADAPTER,
    WETH_GATEWAY: currentMarketData.addresses.WETH_GATEWAY,
  });

  const faucetService = new FaucetService(getProvider(currentChainId), currentMarketData.addresses.FAUCET);

  const multiFeeDistribution =
    currentMarketData.addresses.MULTIFEE_DISTRIBUTION &&
    getContract(currentMarketData.addresses.MULTIFEE_DISTRIBUTION!, MultiFeeDistributionABI, provider!, currentAccount);

  const chefIncentiveController =
    currentMarketData.addresses.INCENTIVES_CONTROLLER &&
    getContract(currentMarketData.addresses.INCENTIVES_CONTROLLER!, ChefIncentivesControllerABI, provider!, currentAccount);

  const viniumTokenContract =
    currentMarketData.addresses.VINIUM_OFT && getContract(currentMarketData.addresses.VINIUM_OFT!, ViniumTokenABI, provider!, currentAccount);

  const viniumLPContract =
    currentMarketData.addresses.VINIUM_LP && getContract(currentMarketData.addresses.VINIUM_LP!, erc20ABI, provider!, currentAccount);

  const leveragerContract =
    currentMarketData.addresses.LEVERAGER && getContract(currentMarketData.addresses.LEVERAGER!, LeveragerABI, provider!, currentAccount);

  return (
    <TxBuilderContext.Provider
      value={{ lendingPool, faucetService, multiFeeDistribution, chefIncentiveController, viniumTokenContract, viniumLPContract, leveragerContract }}
    >
      {children}
    </TxBuilderContext.Provider>
  );
}

export const useTxBuilderContext = () => useContext(TxBuilderContext);
