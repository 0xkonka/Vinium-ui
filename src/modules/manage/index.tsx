import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { stakeConfig } from '../../ui-config';
import ErrorPage from '../../components/ErrorPage';
import ManageMain from './screens/ManageMain';
import { StakeDataProvider } from '../../libs/pool-data-provider/hooks/use-stake-data-context';

export const faqLink = 'https://docs.aave.com/faq/migration-and-staking';

export default function Manage() {
  if (!stakeConfig) {
    return <ErrorPage title="Reward was not configured" />;
  }
  return (
    <StakeDataProvider stakeConfig={stakeConfig}>
      {/* // <StakingWrapper> */}
      <Switch>
        {/* <Route exact={true} path="/staking" component={StakingMain} /> */}

        <Route exact={true} path="/manage" component={ManageMain} />
        {/* <Route
            exact={true}
            path="/staking/disclaimer"
            component={StakeDisclaimer}
          />
          <Route
            exact={true}
            path="/staking/confirmation"
            component={StakeWithApprovalConfirmation}
          />

          <Route
            exact={true}
            path="/staking/claim/confirmation"
            component={StakingClaimConfirmation}
          />

          <Route
            exact={true}
            path="/staking/activate-cooldown/confirmation"
            component={ActivateCooldownConfirmation}
          />

          <Route exact={true} path="/staking/unstake" component={UnstakeAmount} />
          <Route
            exact={true}
            path="/staking/unstake/confirmation"
            component={UnstakeConfirmation}
          /> */}
      </Switch>
      {/* // </StakingWrapper> */}
    </StakeDataProvider>
  );
}
