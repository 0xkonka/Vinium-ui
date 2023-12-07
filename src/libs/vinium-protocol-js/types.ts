import { BigNumber } from 'ethers';

export interface DataHumanized {
  lastTimeRewardApplicable: BigNumber;
  rewardPerToken: BigNumber;
  getRewardForDuration: BigNumber;
}

export interface UserDataHumanized {
  lockedBalances: LockedBalances;
  earnedBalances: EarnedBalance;
  withdrawableBalance: WithdrawableBalance;
  claimableRewards: RewardData[];
}

export interface RewardData {
  token: string;
  amount: BigNumber;
}

export interface LockedBalance {
  amount: BigNumber;
  unlockTime: BigNumber;
}

export interface EarnedBalance {
  total: BigNumber;
  earningsData: LockedBalance[];
}

export interface LockedBalances {
  total: BigNumber;
  unlockable: BigNumber;
  locked: BigNumber;
  lockData: LockedBalance[];
}

export interface WithdrawableBalance {
  earned: BigNumber;
  amountWithoutPenalty: BigNumber;
  penaltyETHAmount: BigNumber;
}
