import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { Grid } from '@mui/material';
import StakeVinium from '../../components/StakeVinium';
import LockVinium from '../../components/LockVinium';
import ViniumClaim from '../../components/ViniumClaim';
import NoDataPanel from '../../../../components/NoDataPanel';
import { useUserWalletDataContext } from '../../../../libs/web3-data-provider';
import ClaimableFees from '../../components/ClaimableFees';
import ViniumVest from '../../components/ViniumVest';
import ViniumLock from '../../components/ViniumLock';

export default function ManageMain() {
  const intl = useIntl();
  const { currentAccount: user } = useUserWalletDataContext();

  return (
    <>
      {!user ? (
        <NoDataPanel
          title={!user ? intl.formatMessage(messages.connectWallet) : intl.formatMessage(messages.noDataTitle)}
          description={!user ? intl.formatMessage(messages.connectWalletDescription) : intl.formatMessage(messages.noDataDescription)}
          withConnectButton={!user}
        />
      ) : (
        <Grid container spacing={2} rowSpacing={2}>
          <Grid item xs={12} md={4}>
            <StakeVinium />
            <LockVinium />
          </Grid>
          <Grid item xs={12} md={8}>
            <ViniumClaim />
            <ViniumVest />
            <ViniumLock />
            <ClaimableFees />
          </Grid>
        </Grid>
      )}
    </>
  );
}