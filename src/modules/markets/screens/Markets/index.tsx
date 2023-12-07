import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { valueToBigNumber } from '@aave/protocol-js';
import { useThemeContext } from '@aave/aave-ui-kit';

import { useDynamicPoolDataContext, useStaticPoolDataContext } from '../../../../libs/pool-data-provider';
import toggleLocalStorageClick from '../../../../helpers/toggle-local-storage-click';
import TopPanelWrapper from '../../../../components/wrappers/TopPanelWrapper';
import ScreenWrapper from '../../../../components/wrappers/ScreenWrapper';
import SelectMarketPanel from '../../components/SelectMarketPanel';
import MarketTable from '../../components/MarketTable';
import MarketTableItem from '../../components/MarketTableItem';
import TotalMarketsSize from '../../components/TotalMarketsSize';
import LabeledSwitcher from '../../../../components/basic/LabeledSwitcher';
import MarketMobileCard from '../../components/MarketMobileCard';

import messages from './messages';
import staticStyles from './style';
import { useIncentivesDataContext } from '../../../../libs/pool-data-provider/hooks/use-incentives-data-context';
import { useChefIncentiveData } from '../../../../libs/vinium-protocol-js/hooks/use-chef-incentive-controller';

export default function Markets() {
  const intl = useIntl();
  const { currentTheme } = useThemeContext();
  const { marketRefPriceInUsd } = useStaticPoolDataContext();
  const { reserves } = useDynamicPoolDataContext();
  const { reserveIncentives } = useIncentivesDataContext();
  const [isPriceInUSD, setIsPriceInUSD] = useState(localStorage.getItem('marketsIsPriceInUSD') === 'true');

  const { data: incentiveData } = useChefIncentiveData();

  const [sortName, setSortName] = useState('');
  const [sortDesc, setSortDesc] = useState(false);
  let totalLockedInUsd = valueToBigNumber('0');
  let sortedData = reserves
    .filter((res) => res.isActive && !res.isFrozen)
    .map((reserve) => {
      totalLockedInUsd = totalLockedInUsd.plus(
        valueToBigNumber(reserve.totalLiquidity).multipliedBy(reserve.priceInMarketReferenceCurrency).multipliedBy(marketRefPriceInUsd)
      );

      const totalLiquidity = Number(reserve.totalLiquidity);
      const totalLiquidityInUSD = valueToBigNumber(reserve.totalLiquidity)
        .multipliedBy(reserve.priceInMarketReferenceCurrency)
        .multipliedBy(marketRefPriceInUsd)
        .toNumber();

      const totalBorrows = Number(reserve.totalDebt);
      const totalBorrowsInUSD = valueToBigNumber(reserve.totalDebt)
        .multipliedBy(reserve.priceInMarketReferenceCurrency)
        .multipliedBy(marketRefPriceInUsd)
        .toNumber();
      const reserveIncentiveData = reserveIncentives[reserve.underlyingAsset.toLowerCase()];
      return {
        totalLiquidity,
        totalLiquidityInUSD,
        totalBorrows: reserve.borrowingEnabled ? totalBorrows : -1,
        totalBorrowsInUSD: reserve.borrowingEnabled ? totalBorrowsInUSD : -1,
        id: reserve.id,
        underlyingAsset: reserve.underlyingAsset,
        currencySymbol: reserve.symbol,
        depositAPY: reserve.borrowingEnabled ? Number(reserve.supplyAPY) : -1,
        avg30DaysLiquidityRate: Number(reserve.avg30DaysLiquidityRate),
        stableBorrowRate: reserve.stableBorrowRateEnabled && reserve.borrowingEnabled ? Number(reserve.stableBorrowAPY) : -1,
        variableBorrowRate: reserve.borrowingEnabled ? Number(reserve.variableBorrowAPY) : -1,
        avg30DaysVariableRate: Number(reserve.avg30DaysVariableBorrowRate),
        borrowingEnabled: reserve.borrowingEnabled,
        stableBorrowRateEnabled: reserve.stableBorrowRateEnabled,
        isFreezed: reserve.isFrozen,
        aincentivesAPR: reserveIncentiveData ? reserveIncentiveData.aIncentives.incentiveAPR : '0',
        vincentivesAPR: reserveIncentiveData ? reserveIncentiveData.vIncentives.incentiveAPR : '0',
        sincentivesAPR: reserveIncentiveData ? reserveIncentiveData.sIncentives.incentiveAPR : '0',
        viniumIncentive: incentiveData?.filter((data) => data.id === reserve.id)[0],
      };
    });

  if (sortDesc) {
    if (sortName === 'currencySymbol') {
      sortedData.sort((a, b) => (b.currencySymbol.toUpperCase() < a.currencySymbol.toUpperCase() ? -1 : 0));
    } else {
      // @ts-ignore
      sortedData.sort((a, b) => a[sortName] - b[sortName]);
    }
  } else {
    if (sortName === 'currencySymbol') {
      sortedData.sort((a, b) => (a.currencySymbol.toUpperCase() < b.currencySymbol.toUpperCase() ? -1 : 0));
    } else {
      // @ts-ignore
      sortedData.sort((a, b) => b[sortName] - a[sortName]);
    }
  }

  return (
    <ScreenWrapper pageTitle={intl.formatMessage(messages.pageTitle)} className="Markets" withMobileGrayBg={false}>
      <TopPanelWrapper isCollapse={true} withoutCollapseButton={true}>
        <div className="Markets__top-content">
          <TotalMarketsSize value={totalLockedInUsd.toNumber()} />
          {/*<SelectMarketPanel />*/}
        </div>
      </TopPanelWrapper>

      <div className="Markets__size">
        <TotalMarketsSize value={totalLockedInUsd.toNumber()} />
      </div>

      <div className="Markets__price-switcher">
        <LabeledSwitcher
          value={!isPriceInUSD}
          leftOption="USD"
          rightOption={intl.formatMessage(messages.native)}
          onToggle={() => toggleLocalStorageClick(isPriceInUSD, setIsPriceInUSD, 'marketsIsPriceInUSD')}
        />
      </div>

      <MarketTable sortName={sortName} setSortName={setSortName} sortDesc={sortDesc} setSortDesc={setSortDesc}>
        {sortedData.map((item, index) => (
          <MarketTableItem {...item} isPriceInUSD={isPriceInUSD} key={index} />
        ))}
      </MarketTable>

      <div className="Markets__mobile--cards">
        {sortedData.map((item, index) => (
          <MarketMobileCard {...item} key={index} />
        ))}
      </div>

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
      <style jsx={true} global={true}>{`
        .Markets {
          &__top-content {
            color: ${currentTheme.white.hex};
          }
          &__marketSwitcher--title {
            color: ${currentTheme.textDarkBlue.hex};
          }
        }
      `}</style>
    </ScreenWrapper>
  );
}
