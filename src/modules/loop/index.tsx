import { Switch, Route } from 'react-router-dom';
import { stakeConfig } from '../../ui-config';
import ErrorPage from '../../components/ErrorPage';
import LoopOverview from './screens/LoopOverview';

export default function Loop() {
  if (!stakeConfig) {
    return <ErrorPage title="Reward was not configured" />;
  }
  return (
    <Switch>
      <Route exact={true} path="/loop" component={LoopOverview} />
    </Switch>
  );
}
