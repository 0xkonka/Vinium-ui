// import { JSX } from 'react';
import BSC_IMAGE from '../../images/chains/bsc';
import ETH_IMAGE from '../../images/chains/ethereum';
import ARBITRUM_IMAGE from '../../images/chains/arbitrum';
import AVALANCHE_IMAGE from '../../images/chains/avalanche';
import FANTOM_IMAGE from '../../images/chains/fantom.png';
import POLYGON_IMAGE from '../../images/chains/polygon.png';
import OPTIMISM_IMAGE from '../../images/chains/optimism.jpeg';

interface ChainInfo {
  chainId: number;
  name: string;
  image: string | ((props: {}) => any);
  //availableTokens: string[];
  isTestnet: boolean;
  bridgeEnabled: boolean;
}

const CHAIN_INFO = {
  // localhost: {
  //   chainId: 31337,
  //   name: 'Localhost',
  //   image: ETH_IMAGE,
  //   //availableTokens: [],
  //   isTestnet: true,
  //   bridgeEnabled: false,
  // },
  mainnet: {
    chainId: 101,
    name: 'Mainnet',
    image: ETH_IMAGE,
    //availableTokens: ['USDC', 'USDT', 'DAI', 'FRAX', 'USDD', 'ETH', 'sUSD', 'LUSD', 'MAI', 'METIS'],
    isTestnet: false,
    bridgeEnabled: false,
  },
  goerli: {
    chainId: 10121,
    name: 'Ethereum - Test',
    image: ETH_IMAGE,
    //availableTokens: ['USDC', 'USDT', 'DAI', 'FRAX', 'USDD', 'ETH', 'sUSD', 'LUSD', 'MAI', 'METIS'],
    isTestnet: true,
    bridgeEnabled: true,
  },
  bsc: {
    chainId: 102,
    name: 'Binance Smart Chain',
    image: BSC_IMAGE,
    //availableTokens: ['BUSD', 'USDT', 'USDD', 'MAI', 'METIS'],
    isTestnet: false,
    bridgeEnabled: true,
  },
  bscTest: {
    chainId: 10102,
    name: 'Binance Smart Chain - Test',
    image: BSC_IMAGE,
    //availableTokens: ['BUSD', 'USDT', 'USDD', 'MAI', 'METIS'],
    isTestnet: true,
    bridgeEnabled: false,
  },
  avalanche: {
    chainId: 106,
    name: 'Avalanche',
    image: AVALANCHE_IMAGE,
    //availableTokens: ['USDC', 'USDT', 'FRAX', 'MAI'],
    isTestnet: false,
    bridgeEnabled: false,
  },
  fuji: {
    chainId: 10106,
    name: 'Avalanche - Test',
    image: AVALANCHE_IMAGE,
    //availableTokens: ['USDC', 'USDT', 'FRAX', 'MAI'],
    isTestnet: true,
    bridgeEnabled: true,
  },
  polygon: {
    chainId: 109,
    name: 'Polygon',
    image: POLYGON_IMAGE,
    //availableTokens: ['USDC', 'USDT', 'DAI', 'MAI'],
    isTestnet: false,
    bridgeEnabled: false,
  },
  polygonTest: {
    chainId: 10109,
    name: 'Polygon - Test',
    image: POLYGON_IMAGE,
    //availableTokens: ['USDC', 'USDT', 'DAI', 'MAI'],
    isTestnet: true,
    bridgeEnabled: false,
  },
  arbitrum: {
    chainId: 110,
    name: 'Arbitrum',
    image: ARBITRUM_IMAGE,
    //availableTokens: ['USDC', 'USDT', 'FRAX', 'ETH', 'LUSD', 'MAI'],
    isTestnet: false,
    bridgeEnabled: true,
  },
  arbitrumGoerli: {
    chainId: 10143,
    name: 'Arbitrum - Test',
    image: ARBITRUM_IMAGE,
    //availableTokens: ['USDC', 'USDT', 'FRAX', 'ETH', 'LUSD', 'MAI'],
    isTestnet: true,
    bridgeEnabled: false,
  },
  optimism: {
    chainId: 111,
    name: 'Optimism',
    image: OPTIMISM_IMAGE,
    //availableTokens: ['USDC', 'DAI', 'FRAX', 'ETH', 'sUSD', 'LUSD', 'MAI'],
    isTestnet: false,
    bridgeEnabled: false,
  },
  optimismTest: {
    chainId: 10111,
    name: 'Optimism - Test',
    image: OPTIMISM_IMAGE,
    //availableTokens: ['USDC', 'DAI', 'FRAX', 'ETH', 'sUSD', 'LUSD', 'MAI'],
    isTestnet: true,
    bridgeEnabled: false,
  },
  fantom: {
    chainId: 112,
    name: 'Fantom',
    image: FANTOM_IMAGE,
    //availableTokens: ['USDC'],
    isTestnet: false,
    bridgeEnabled: false,
  },
  fantomTest: {
    chainId: 10112,
    name: 'Fantom - Test',
    image: FANTOM_IMAGE,
    //availableTokens: ['USDC'],
    isTestnet: true,
    bridgeEnabled: false,
  },
};

const CHAIN_ID_TO_NETWORK: Record<number, ChainInfo> = {
  101: CHAIN_INFO.mainnet,
  102: CHAIN_INFO.bsc,
  106: CHAIN_INFO.avalanche,
  109: CHAIN_INFO.polygon,
  110: CHAIN_INFO.arbitrum,
  111: CHAIN_INFO.optimism,
  112: CHAIN_INFO.fantom,
  10121: CHAIN_INFO.goerli,
  10102: CHAIN_INFO.bscTest,
  10106: CHAIN_INFO.fuji,
  10109: CHAIN_INFO.polygonTest,
  10143: CHAIN_INFO.arbitrumGoerli,
  10111: CHAIN_INFO.optimismTest,
  10112: CHAIN_INFO.fantomTest,

  // main chain Id to network
  1: CHAIN_INFO.mainnet,
  5: CHAIN_INFO.goerli,
  56: CHAIN_INFO.bsc,
  97: CHAIN_INFO.bscTest,
  137: CHAIN_INFO.polygon,
  80001: CHAIN_INFO.polygonTest,
  43114: CHAIN_INFO.avalanche,
  43113: CHAIN_INFO.fuji,
  42161: CHAIN_INFO.arbitrum,
  421613: CHAIN_INFO.arbitrumGoerli,
  // 31337: CHAIN_INFO.localhost,
};

const CHAINS = [
  CHAIN_INFO.mainnet,
  CHAIN_INFO.arbitrum,
  CHAIN_INFO.polygon,
  CHAIN_INFO.bsc,
  CHAIN_INFO.avalanche,
  CHAIN_INFO.fantom,
  CHAIN_INFO.optimism,
  CHAIN_INFO.goerli,
  CHAIN_INFO.bscTest,
  CHAIN_INFO.fuji,
  CHAIN_INFO.polygonTest,
  CHAIN_INFO.arbitrumGoerli,
  CHAIN_INFO.optimismTest,
  CHAIN_INFO.fantomTest,
];

export { CHAIN_INFO, CHAINS, CHAIN_ID_TO_NETWORK };
