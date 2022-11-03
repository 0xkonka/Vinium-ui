import { ChainId } from '@aave/contract-helpers';
import { Stake } from '@aave/protocol-js';

export interface StakeConfig {
  chainId: ChainId;
  stakeDataProvider: string;
  tokens: {
    [token: string]: {
      TOKEN_STAKING: string;
      STAKING_REWARD_TOKEN: string;
      STAKING_HELPER?: string;
    };
  };
}

export const stakeConfig: StakeConfig | undefined = {
  chainId: ChainId.mainnet,
  stakeDataProvider: '0xa82247B44750ae23076D6746A9B5B8dc0eCBB646',
  tokens: {
    [Stake.aave]: {
      TOKEN_STAKING: '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
      STAKING_REWARD_TOKEN: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      STAKING_HELPER: '0xce0424653fb2fd48ed1b621bdbd60db16b2e388a',
    }
  },
};

// fuji config
// export const stakeConfig: StakeConfig | undefined = {
//   chainId: ChainId.fuji,
//   stakeDataProvider: '0x11cFF6E846df69d6856d4F771b5500F12a5dd32c',
//   tokens: {
//     [Stake.aave]: {
//       TOKEN_STAKING: '0x312eB4ecD24AE363a8FBd043bd021d73571A0FAB',
//       STAKING_REWARD_TOKEN: '0xA1A01e1Ea015742205F9B4Da9ad9ee9e10c3DfC2',
//       STAKING_HELPER: '0x9ac1938798384cd4543b441BbEa8C2a7648Fc90D',
//     }
//   },
// };
