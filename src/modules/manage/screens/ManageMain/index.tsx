import React from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { Grid } from '@mui/material';
import NoDataPanel from '../../../../components/NoDataPanel';
import { useUserWalletDataContext } from '../../../../libs/web3-data-provider';
import ViniumVest from '../../components/ViniumVest';
import StatInfo from '../../components/StatInfo';
import LockLP from '../../components/LockLP';

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
          <Grid item xs={12}>
            <StatInfo />
          </Grid>
          <Grid item xs={12} md={6}>
            <LockLP />
          </Grid>
          <Grid item xs={12} md={6}>
            <ViniumVest />
          </Grid>
          {/* </Grid> */}
          {/* <Grid item xs={12} md={8}>
            <ViniumClaim />
            <ViniumVest />
            <ViniumLock />
            <ClaimableFees />
          </Grid> */}
        </Grid>
      )}
    </>
  );
}
