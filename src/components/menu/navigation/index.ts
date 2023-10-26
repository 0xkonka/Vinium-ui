import { MessageDescriptor } from 'react-intl';
import { moreMenuExtraItems, moreMenuItems, moreMenuMobileOnlyItems, stakeConfig, governanceConfig } from '../../../ui-config';
import { MarketDataType } from '../../../helpers/config/types';
import { isFeatureEnabled } from '../../../helpers/config/markets-and-network-config';

import messages from './messages';

export interface Navigation {
  link: string;
  title: MessageDescriptor;
  hiddenWithoutWallet?: boolean;
  absolute?: boolean;
  newTab?: boolean;
  onClick?: () => void;
  isVisible?: (data: MarketDataType) => boolean | undefined;
}

const navigation: Navigation[] = [
  {
    link: '/markets',
    title: messages.markets,
  },
  {
    link: 'https://isolated.vinium.finance/#/markets',
    title: messages.dmarkets,
    absolute: true,
  },
  {
    link: '/dashboard',
    title: messages.dashboard,
  },
  {
    link: '/deposit',
    title: messages.deposit,
  },
  {
    link: '/borrow',
    title: messages.borrow,
  },
  {
    link: '/loop',
    title: messages.loop,
  },
  {
    link: '/manage',
    title: messages.manage,
  },
  {
    link: 'https://vinium-bridge.vercel.app/',
    title: messages.bridge,
    absolute: true,
    newTab: true,
  },
  // {
  //   link: '/staking',
  //   title: messages.stake,
  //   isVisible: () => !!stakeConfig,
  // },
  {
    link: 'https://docs.vinium.finance/',
    title: messages.docs,
    absolute: true,
    newTab: true,
  },
  {
    link: '/asset-swap',
    title: messages.swap,
    isVisible: isFeatureEnabled.liquiditySwap,
  },
];

export const moreNavigation: Navigation[] = [...moreMenuItems, ...moreMenuExtraItems];

export const mobileNavigation: Navigation[] = [
  ...navigation,
  //...moreMenuItems,
  //...moreMenuMobileOnlyItems,
];

export default navigation;
