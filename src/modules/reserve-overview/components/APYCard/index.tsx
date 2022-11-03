import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { useThemeContext } from '@aave/aave-ui-kit';

import staticStyles from './style';

interface APYCardProps {
  title: string;
  color?: 'orange' | 'primary' | 'secondary';
  children?: ReactNode;
}

export default function APYCard({ title, color = 'orange', children }: APYCardProps) {
  const { currentTheme } = useThemeContext();

  return (
    <div className={classNames('APYCard', `APYCard__${color}`)}>
      <div className="APYCard__title">
        <p>{title}</p>
      </div>
      <div className="APYCard__content">{children}</div>

      <style jsx={true}>{staticStyles}</style>
      <style jsx={true}>{`
        .APYCard {
          .APYCard__title {
            p {
              color: ${currentTheme.white.hex};
            }
          }

          &__orange {
            border-color: #79c982;
            .APYCard__title {
              background: #79c982;
            }
          }

          &__primary {
            border-color: ${currentTheme.primary.hex};
            .APYCard__title {
              background: ${currentTheme.primary.hex};
            }
          }

          &__secondary {
            border-color: #de5959;
            .APYCard__title {
              background: #de5959;
            }
          }
        }
      `}</style>
    </div>
  );
}
