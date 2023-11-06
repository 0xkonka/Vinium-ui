import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { stakeConfig } from '../../ui-config';
import ErrorPage from '../../components/ErrorPage';
import FraxOverview from './screens/FraxOverview';

export const faqLink = 'https://docs.aave.com/faq/migration-and-staking';

export default function Frax() {
  if (!stakeConfig) {
    return <ErrorPage title="Sdai was not configured" />;
  }
  return (
    <Switch>
      <Route exact={true} path="/frax" component={FraxOverview} />
    </Switch>
  );
}
