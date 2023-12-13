import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { stakeConfig } from '../../ui-config';
import ErrorPage from '../../components/ErrorPage';
import ManageOverview from './screens/ManageOverview';

export const faqLink = 'https://docs.aave.com/faq/migration-and-staking';

export default function Manage() {
  if (!stakeConfig) {
    return <ErrorPage title="Reward was not configured" />;
  }
  return (
    <Switch>
      <Route exact={true} path="/manage" component={ManageOverview} />
    </Switch>
  );
}
