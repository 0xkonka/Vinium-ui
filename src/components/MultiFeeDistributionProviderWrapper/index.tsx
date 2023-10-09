import React, { ReactNode } from 'react';
import { useIntl } from 'react-intl';

import Preloader from '../basic/Preloader';
import ErrorPage from '../ErrorPage';

import messages from './messages';
import { MultiFeeDistributionProvider } from '../../libs/emission-reward-provider/providers/multifee-distribution-provider';

interface MultiFeeDistributionProviderWrapperProps {
  children: ReactNode;
}

export default function MultiFeeDistributionProviderWrapper({
  children,
}: MultiFeeDistributionProviderWrapperProps) {
  const intl = useIntl();
  return (
    <MultiFeeDistributionProvider
      loader={<Preloader withBackground={true} />}
      errorPage={
        <ErrorPage
          title={intl.formatMessage(messages.errorTitle)}
          description={intl.formatMessage(messages.errorDescription)}
          buttonType="reload"
        />
      }
    >
      {children}
    </MultiFeeDistributionProvider>
  );
}
