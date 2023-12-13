import React from 'react';
import { Switch, Route } from 'react-router-dom';
import BridgeOverview from './screens/BridgeOverview';

export default function LiFiBridge() {
  return (
    <Switch>
      <Route exact={true} path="/bridge" component={BridgeOverview} />
    </Switch>
  );
}
