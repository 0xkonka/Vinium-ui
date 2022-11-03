import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { useThemeContext } from '@aave/aave-ui-kit';

import goToTop from '../../../helpers/goToTop';

import staticStyles from './style';

interface TableItemWrapperProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  withGoToTop?: boolean;
  darkOnDarkMode?: boolean;
}

export default function TableItemWrapper({
  onClick,
  disabled,
  className,
  children,
  withGoToTop,
  darkOnDarkMode,
}: TableItemWrapperProps) {
  const { currentTheme } = useThemeContext();

  return (
    <div
      className={classNames(
        'TableItemWrapper',
        { TableItemWrapper__disabled: disabled },
        className
      )}
      onClick={() => {
        !disabled && onClick();
        withGoToTop && goToTop();
      }}
    >
      {children}

      <style jsx={true}>{staticStyles}</style>
      <style jsx={true}>{`
        .TableItemWrapper {
          background: #000000e8;
          border: 1px solid #999;
          color: ${currentTheme.darkBlue.hex};
          &:hover {
            box-shadow: 0 0 9px 0 #FF002E;
            
          }
          &:active {
            box-shadow: none;
            border-color: #FF002E;
          }
        }
      `}</style>
    </div>
  );
}
