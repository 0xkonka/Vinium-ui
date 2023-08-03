import { ChainId } from '@aave/contract-helpers';
import { MarketDataType } from '../../helpers/config/types';

import * as logos from './images';

export enum CustomMarket {
  // proto_kovan = 'proto_kovan',
  // proto_mainnet = 'proto_mainnet',
  proto_avalanche = 'proto_avalanche',
  // proto_matic = 'proto_matic',
  proto_mumbai = 'proto_mumbai',
  // amm_kovan = 'amm_kovan',
  // amm_mainnet = 'amm_mainnet',
  proto_fuji = 'proto_fuji',
}

export const marketsData: { [key in keyof typeof CustomMarket]: MarketDataType } = {
  // [CustomMarket.proto_kovan]: {
  //   chainId: ChainId.kovan,
  //   logo: logos.aavev2Logo,
  //   activeLogo: logos.aavev2ActiveLogo,
  //   aTokenPrefix: 'A',
  //   enabledFeatures: {
  //     faucet: true,
  //     governance: true,
  //     staking: true,
  //     incentives: true,
  //   },
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: '0x88757f2f99175387ab4c6a4b3067c77a695b0349'.toLowerCase(),
  //     LENDING_POOL: '0xE0fBa4Fc209b4948668006B2bE61711b7f465bAe',
  //     WETH_GATEWAY: '0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70',
  //     FAUCET: '0x600103d518cC5E8f3319D532eB4e5C268D32e604',
  //   },
  // },
  // [CustomMarket.proto_mainnet]: {
  //   chainId: ChainId.mainnet,
  //   logo: logos.aavev2Logo,
  //   activeLogo: logos.aavev2ActiveLogo,
  //   aTokenPrefix: 'A',
  //   enabledFeatures: {
  //     governance: true,
  //     staking: true,
  //     liquiditySwap: true,
  //     collateralRepay: true,
  //     incentives: true,
  //   },
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5'.toLowerCase(),
  //     LENDING_POOL: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
  //     WETH_GATEWAY: '0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04',
  //     REPAY_WITH_COLLATERAL_ADAPTER: '0x498c5431eb517101582988fbb36431ddaac8f4b1',
  //     SWAP_COLLATERAL_ADAPTER: '0x135896DE8421be2ec868E0b811006171D9df802A',
  //   },
  // },
  // [CustomMarket.amm_kovan]: {
  //   chainId: ChainId.kovan,
  //   logo: logos.ammLogo,
  //   activeLogo: logos.ammActiveLogo,
  //   aTokenPrefix: 'AAMM',
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: '0x67FB118A780fD740C8936511947cC4bE7bb7730c'.toLowerCase(),
  //     LENDING_POOL: '0x762E2a3BBe729240ea44D31D5a81EAB44d34ef01',
  //     WETH_GATEWAY: '0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70',
  //     FAUCET: '0x600103d518cC5E8f3319D532eB4e5C268D32e604',
  //   },
  // },
  // [CustomMarket.amm_mainnet]: {
  //   chainId: ChainId.mainnet,
  //   logo: logos.ammLogo,
  //   activeLogo: logos.ammActiveLogo,
  //   aTokenPrefix: 'AAMM',
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: '0xacc030ef66f9dfeae9cbb0cd1b25654b82cfa8d5'.toLowerCase(),
  //     LENDING_POOL: '0x7937d4799803fbbe595ed57278bc4ca21f3bffcb',
  //     WETH_GATEWAY: '0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04',
  //   },
  // },
  [CustomMarket.proto_mumbai]: {
    chainId: ChainId.mumbai,
    logo: logos.aaveLogo,
    activeLogo: logos.aaveActiveLogo,
    subLogo: logos.polygon,
    aTokenPrefix: 'AM',
    enabledFeatures: {
      incentives: true,
      faucet: true,
    },
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0x178113104fEcbcD7fF8669a0150721e231F0FD4B'.toLowerCase(),
      LENDING_POOL: '0x9198F13B08E299d85E096929fA9781A1E3d5d827',
      WETH_GATEWAY: '0xee9eE614Ad26963bEc1Bec0D2c92879ae1F209fA',
      FAUCET: '0x0b3C23243106A69449e79C14c58BB49E358f9B10',
    },
  },
  // [CustomMarket.proto_matic]: {
  //   chainId: ChainId.polygon,
  //   logo: logos.aaveLogo,
  //   activeLogo: logos.aaveActiveLogo,
  //   subLogo: logos.polygon,
  //   aTokenPrefix: 'AM',
  //   enabledFeatures: {
  //     liquiditySwap: true,
  //     incentives: true,
  //   },
  //   addresses: {
  //     LENDING_POOL_ADDRESS_PROVIDER: '0xd05e3E715d945B59290df0ae8eF85c1BdB684744'.toLowerCase(),
  //     LENDING_POOL: '0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf',
  //     WETH_GATEWAY: '0xbEadf48d62aCC944a06EEaE0A9054A90E5A7dc97',
  //     SWAP_COLLATERAL_ADAPTER: '0x35784a624D4FfBC3594f4d16fA3801FeF063241c',
  //   },
  // },
  [CustomMarket.proto_fuji]: {
    chainId: ChainId.fuji,
    logo: logos.aaveLogo,
    activeLogo: logos.aaveActiveLogo,
    subLogo: logos.avalanche,
    aTokenPrefix: 'AAVA',
    enabledFeatures: {
      faucet: true,
      incentives: true,
    },
    addresses: {
      // LENDING_POOL_ADDRESS_PROVIDER: '0x7fdC1FdF79BE3309bf82f4abdAD9f111A6590C0f'.toLowerCase(),
      // LENDING_POOL: '0x76cc67FF2CC77821A70ED14321111Ce381C2594D',
      // WETH_GATEWAY: '0x1648C14DbB6ccdd5846969cE23DeEC4C66a03335',
      LENDING_POOL_ADDRESS_PROVIDER: '0x595F26E054903B1FD969A2B0e9D9e2ea839BAd0B'.toLowerCase(),
      LENDING_POOL: '0xf517604D8EbE9215bc32b98aA1f2cf60AC8f210b',
      WETH_GATEWAY: '0xa70140E5C2385410063Bd996953156236CA7A9a2',
      FAUCET: '0x90E5BAc5A98fff59617080848959f44eACB4Cd7B',
    },
  },
  [CustomMarket.proto_avalanche]: {
    chainId: ChainId.avalanche,
    logo: logos.aaveLogo,
    activeLogo: logos.aaveActiveLogo,
    subLogo: logos.avalanche,
    aTokenPrefix: 'Vi',
    enabledFeatures: {
      liquiditySwap: false,
      incentives: false,
    },
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0xAb534e276FAE6b2f3b30Eb3fcbb495304d808603'.toLowerCase(),
      LENDING_POOL: '0xc246579105cd52a40C0E654CAdEB34c39F2dbe3f',
      WETH_GATEWAY: '0x87EDF69FF8912CfF318FEAd777594B207eA47ada',
      //SWAP_COLLATERAL_ADAPTER: '0x2EcF2a2e74B19Aab2a62312167aFF4B78E93B6C5',
    },
  },
} as const;
