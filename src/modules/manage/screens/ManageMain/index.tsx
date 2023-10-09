import React from 'react';
import { useIntl } from 'react-intl';
import { gradient, useThemeContext } from '@aave/aave-ui-kit';

import Link from '../../../../components/basic/Link';
// import AboutStakingModal from '../../components/AboutStakingModal';
import InfoWrapper from '../../../../components/wrappers/InfoWrapper';
import InfoPanel from '../../../../components/InfoPanel';
// import TextFAQLink from '../../components/TextFAQLink';

import messages from './messages';
import staticStyles from './style';

import aaveIcon from '../../../../images/aave.svg';
import bptIcon from '../../../../images/bpt.svg';
import { useMultiFeeDistributionData } from '../../../../libs/emission-reward-provider/hooks/use-multifee-distribution';
import { useMultiFeeDistributionDataContext } from '../../../../libs/emission-reward-provider/providers/multifee-distribution-provider';
import ContentWrapper from '../../../../components/wrappers/ContentWrapper';
import ScreenWrapper from '../../../../components/wrappers/ScreenWrapper';
import Row from '../../../../components/basic/Row';
import Value from '../../../../components/basic/Value';

export default function ManageMain() {
  const intl = useIntl();
  const { currentTheme, xl, sm } = useThemeContext();

  const { data, userData } = useMultiFeeDistributionDataContext();

  const rowWeight = sm ? 'light' : 'normal';
  const elementsColor = sm ? 'white' : 'dark';

  console.log('userData', userData);

  return (
    <div className="ManageMain">
      <ScreenWrapper
        pageTitle={intl.formatMessage(messages.manage)}
        isTitleOnDesktop={true}
        withMobileGrayBg={false}
      >
        <div style={{ display: 'flex' }}>
          <ContentWrapper className="UserInformation__info-wrapper">
            {/* <div className="UserInformation__info-inner"> */}
            <Row
              title={intl.formatMessage(messages.lockedAndStakedBalance)}
              withMargin={true}
              weight={rowWeight}
              color={elementsColor}
            >
              <Value
                value={+userData?.totalBalance! || 0}
                minimumValueDecimals={2}
                maximumValueDecimals={2}
                color={elementsColor}
              />
            </Row>
            <Row
              title={intl.formatMessage(messages.lockedAndStakedBalance)}
              withMargin={true}
              weight={rowWeight}
              color={elementsColor}
            >
              <Value
                value={+userData?.totalBalance! || 0}
                minimumValueDecimals={2}
                maximumValueDecimals={2}
                color={elementsColor}
              />
            </Row>
            <Row
              title={intl.formatMessage(messages.lockedAndStakedBalance)}
              withMargin={true}
              weight={rowWeight}
              color={elementsColor}
            >
              <Value
                value={+userData?.totalBalance! || 0}
                minimumValueDecimals={2}
                maximumValueDecimals={2}
                color={elementsColor}
              />
            </Row>
            {/* <Row
          title={intl.formatMessage(messages.loanToValue)}
          withMargin={true}
          weight={rowWeight}
          color={elementsColor}
        >
          <ValuePercent value={user?.currentLoanToValue || 0} color={elementsColor} />
        </Row> */}
            {/* </div> */}
          </ContentWrapper>
          <ContentWrapper className="UserInformation__info-wrapper">
            {/* <div className="UserInformation__info-inner"> */}
            <Row
              title={intl.formatMessage(messages.lockedAndStakedBalance)}
              withMargin={true}
              weight={rowWeight}
              color={elementsColor}
            >
              <Value
                value={+userData?.totalBalance! || 0}
                minimumValueDecimals={2}
                maximumValueDecimals={2}
                color={elementsColor}
              />
            </Row>
            <Row
              title={intl.formatMessage(messages.lockedAndStakedBalance)}
              withMargin={true}
              weight={rowWeight}
              color={elementsColor}
            >
              <Value
                value={+userData?.totalBalance! || 0}
                minimumValueDecimals={2}
                maximumValueDecimals={2}
                color={elementsColor}
              />
            </Row>
            <Row
              title={intl.formatMessage(messages.lockedAndStakedBalance)}
              withMargin={true}
              weight={rowWeight}
              color={elementsColor}
            >
              <Value
                value={+userData?.totalBalance! || 0}
                minimumValueDecimals={2}
                maximumValueDecimals={2}
                color={elementsColor}
              />
            </Row>
          </ContentWrapper>
        </div>
      </ScreenWrapper>
      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .UserInformation {
          @import 'src/_mixins/screen-size';

          @include respond-to(sm) {
          }

          &__info-wrapper {
            background: #0b141be8;
            border: 1px solid #999;
            border-radius: 15px;
            padding: 10px;
            max-width: 400px;
            &:after {
              background: ${currentTheme.white.hex};
            }

            h3 {
              color: ${currentTheme.textDarkBlue.hex};
              @include respond-to(sm) {
                color: ${currentTheme.white.hex};
              }
            }
          }
        }
      `}</style>
    </div>
  );
}
