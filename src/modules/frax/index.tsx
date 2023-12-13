import React from 'react';
import { Switch, Route } from 'react-router-dom';
import FraxOverview from './screens/FraxOverview';

export const faqLink = 'https://docs.aave.com/faq/migration-and-staking';

export default function Frax() {
  return (
    <Switch>
      <Route exact={true} path="/frax" component={FraxOverview} />
    </Switch>
  );
}
