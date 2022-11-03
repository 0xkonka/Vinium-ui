import React, { useEffect } from 'react';
import classNames from 'classnames';
import { DarkModeSwitcher, useThemeContext, ThemeNames } from '@aave/aave-ui-kit';

import LangSwitcher from '../basic/LangSwitcher';

import staticStyles from './style';

interface FooterProps {
  inside?: boolean;
}

export default function Footer({ inside }: FooterProps) {

  const { changeTheme } = useThemeContext();

  useEffect(() => {
    if (localStorage.getItem('theme') == null) changeTheme(ThemeNames.dark);
  }, [])

  return (
    <footer className={classNames('Footer', { Footer__inside: inside })}>
      {/*<DarkModeSwitcher />
      <LangSwitcher />*/}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </footer>
  );
}
