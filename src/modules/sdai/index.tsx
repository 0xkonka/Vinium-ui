import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SdaiOverview from './screens/SdaiOverview';

export const faqLink = 'https://docs.aave.com/faq/migration-and-staking';

export default function Sdai() {
  return (
    <Switch>
      <Route exact={true} path="/sdai" component={SdaiOverview} />
    </Switch>
  );
}
