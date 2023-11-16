import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { stakeConfig } from '../../ui-config';
import ErrorPage from '../../components/ErrorPage';
import { StakeDataProvider } from '../../libs/pool-data-provider/hooks/use-stake-data-context';
import BridgeOverview from './screens/BridgeOverview';

export const faqLink = 'https://docs.aave.com/faq/migration-and-staking';

export default function Bridge() {
  if (!stakeConfig) {
    return <ErrorPage title="Reward was not configured" />;
  }
  return (
    <StakeDataProvider stakeConfig={stakeConfig}>
      <Switch>
        <Route exact={true} path="/vinium-bridge" component={BridgeOverview} />
      </Switch>
    </StakeDataProvider>
  );
}
