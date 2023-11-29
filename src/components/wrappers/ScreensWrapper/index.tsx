import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import classNames from 'classnames';

// import Footer from '../../Footer';
import Menu from '../../menu/Menu';
import { BottomDisclaimer, TopDisclaimer } from '../../../ui-config';

import messages from './messages';
import staticStyles from './style';

import starBackground from '../../../images/star.svg';
// import backgroundDark from '../../../images/05.png';

export interface ScreensWrapperProps {
  children: ReactNode;
}

export const TitleContext = createContext({
  title: '',
  setTitle: (title: string) => {},
});

export function useHeaderTitle() {
  const { title, setTitle } = useContext(TitleContext);
  return { title, setTitle };
}

export const TopPanelSmallContext = createContext({
  isTopPanelSmall: false,
  setTopPanelSmall: (isSmallTopLine: boolean) => {},
});

export function useWithDesktopTitle() {
  const { isTopPanelSmall, setTopPanelSmall } = useContext(TopPanelSmallContext);
  return { isTopPanelSmall, setTopPanelSmall };
}

export default function ScreensWrapper({ children }: ScreensWrapperProps) {
  const intl = useIntl();
  // const { currentTheme, isCurrentThemeDark } = useThemeContext();

  const [title, setTitle] = useState(intl.formatMessage(messages.pageTitle));
  const [isTopPanelSmall, setTopPanelSmall] = useState(localStorage.getItem('isTopPanelSmall') === 'true' || false);

  return (
    <div
      className={classNames('ScreensWrapper', {
        ScreensWrapper__topPanelSmall: isTopPanelSmall,
      })}
    >
      <BottomDisclaimer />

      <TopDisclaimer />
      <Menu title={title} />

      <main className="ScreensWrapper__content" id="ScreensWrapper__content-wrapper">
        <div className="ScreensWrapper__top-contentWrapper" />

        <TitleContext.Provider value={{ title, setTitle }}>
          <TopPanelSmallContext.Provider value={{ isTopPanelSmall, setTopPanelSmall }}>{children}</TopPanelSmallContext.Provider>
        </TitleContext.Provider>
      </main>

      {/* <Footer inside={true} /> */}
      <img style={{ opacity: 0.5, height: '100%' }} className="ScreensWrapper__background" src={starBackground} alt="" />

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      {/* <style jsx={true} global={true}>{`
        @import 'src/_mixins/screen-size';

        .ScreensWrapper {
          // background: #000;
          background: #051a2b;

          &__top-contentWrapper {
            background: ${currentTheme.headerBg.hex};
            // &:after {
            //   background: #000;
            // }
          }
        }
      `}</style> */}
    </div>
  );
}
