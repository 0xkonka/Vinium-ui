import React from 'react';
import { Switch, Route } from 'react-router-dom';
import BridgeOverview from './screens/BridgeOverview';

export const faqLink = 'https://docs.aave.com/faq/migration-and-staking';

export default function Bridge() {
  return (
    <Switch>
      <Route exact={true} path="/vinium-bridge" component={BridgeOverview} />
    </Switch>
  );
}
