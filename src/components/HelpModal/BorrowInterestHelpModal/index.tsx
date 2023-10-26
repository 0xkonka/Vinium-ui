import React from 'react';
import { useIntl } from 'react-intl';

import HelpItem from '../../HelpItem';
import TextWithModal from '../../TextWithModal';

import messages from './messages';

import { HelpModalProps } from '../types';

export default function BorrowInterestHelpModal({
  text,
  iconSize,
  className,
  lightWeight,
  color,
  onWhiteBackground,
}: HelpModalProps) {
  const intl = useIntl();
  
  return (
    <TextWithModal
      text={text}
      iconSize={iconSize}
      className={className}
      color={color}
      lightWeight={lightWeight}
      onWhiteBackground={onWhiteBackground}
    >
      {/*<HelpItem
        caption={intl.formatMessage(messages.firstHelpItemCaption)}
        description={
          <p className="BorrowInterestHelpModal__text">
            {intl.formatMessage(messages.firstHelpItemDescription, {
              stay: (
                <b>
                  {intl.formatMessage(messages.stayTheSame)}
                </b>
              ),
            })}
          </p>
        }
        captionColor="primary"
      />*/}
      <HelpItem
        caption={intl.formatMessage(messages.secondHelpItemCaption)}
        description={intl.formatMessage(messages.secondHelpItemDescription, {
          fluctuate: (
            <b>
              {intl.formatMessage(messages.fluctuate)}
            </b>
          ),
        })}
        captionColor="secondary"
      />
    </TextWithModal>
  );
}
