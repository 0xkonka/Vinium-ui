import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { stakeConfig } from '../../ui-config';
import ErrorPage from '../../components/ErrorPage';
import SdaiOverview from './screens/SdaiOverview';

export const faqLink = 'https://docs.aave.com/faq/migration-and-staking';

export default function Sdai() {
  if (!stakeConfig) {
    return <ErrorPage title="Sdai was not configured" />;
  }
  return (
    <Switch>
      <Route exact={true} path="/sdai" component={SdaiOverview} />
    </Switch>
  );
}
