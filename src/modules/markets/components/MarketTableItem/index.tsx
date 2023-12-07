import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import TableItemWrapper from '../../../../components/BasicTable/TableItemWrapper';
import TableColumn from '../../../../components/BasicTable/TableColumn';
import Value from '../../../../components/basic/Value';
import FreezedWarning from '../../../../components/FreezedWarning';
import NoData from '../../../../components/basic/NoData';
import LiquidityMiningCard from '../../../../components/liquidityMining/LiquidityMiningCard';
import { getAssetInfo, TokenIcon } from '../../../../helpers/config/assets-config';

import staticStyles from './style';
import { ChefIncentiveHumanized, useChefIncentiveData } from '../../../../libs/vinium-protocol-js/hooks/use-chef-incentive-controller';
import { Box, Button, Typography } from '@mui/material';
import { ethers, providers } from 'ethers';
import { useTxBuilderContext } from '../../../../libs/tx-provider';
import { useUserWalletDataContext } from '../../../../libs/web3-data-provider';
import { SpinLoader, useThemeContext } from '@aave/aave-ui-kit';
import { useWeb3React } from '@web3-react/core';
import { useProtocolDataContext } from '../../../../libs/protocol-data-provider';
import { useStaticPoolDataContext } from '../../../../libs/pool-data-provider';
import { getDefaultChainId } from '../../../../helpers/config/markets-and-network-config';
import NetworkMismatchButton from '../../../../components/TxConfirmationView/NetworkMismatchButton';
import { ChainId } from '../../../../helpers/chainID';

export interface MarketTableItemProps {
  id: string;
  underlyingAsset: string;
  currencySymbol: string;
  totalLiquidity: number;
  totalLiquidityInUSD: number;
  totalBorrows: number;
  totalBorrowsInUSD: number;
  depositAPY: number;
  aincentivesAPR?: string;
  vincentivesAPR?: string;
  sincentivesAPR?: string;
  avg30DaysLiquidityRate: number;
  stableBorrowRate: number;
  variableBorrowRate: number;
  avg30DaysVariableRate: number;
  borrowingEnabled?: boolean;
  stableBorrowRateEnabled?: boolean;
  isFreezed?: boolean;
  isPriceInUSD?: boolean;
  viniumIncentive?: ChefIncentiveHumanized;
}

export default function MarketTableItem({
  id,
  underlyingAsset,
  currencySymbol,
  totalLiquidity,
  totalLiquidityInUSD,
  totalBorrows,
  totalBorrowsInUSD,
  depositAPY,
  aincentivesAPR,
  vincentivesAPR,
  sincentivesAPR,
  avg30DaysLiquidityRate,
  stableBorrowRate,
  variableBorrowRate,
  avg30DaysVariableRate,
  borrowingEnabled,
  stableBorrowRateEnabled,
  isFreezed,
  isPriceInUSD,
  viniumIncentive,
}: MarketTableItemProps) {
  const history = useHistory();
  const { currentAccount, currentProviderName } = useUserWalletDataContext();
  const { chefIncentiveController } = useTxBuilderContext();
  const { refresh: refreshIncentive } = useChefIncentiveData();
  const { currentTheme } = useThemeContext();

  const { chainId } = useWeb3React<providers.Web3Provider>();
  const { chainId: currentMarketChainId } = useProtocolDataContext();
  const { chainId: txChainId } = useStaticPoolDataContext();
  const currentWalletChainId = chainId as number;
  const asset = getAssetInfo(currencySymbol);

  const [loading, setLoading] = useState(false);

  let networkMismatch = false;
  let neededChainId = getDefaultChainId();

  if (currentMarketChainId !== currentWalletChainId) {
    networkMismatch = true;
    neededChainId = currentMarketChainId;
  }

  if (txChainId !== currentWalletChainId) {
    networkMismatch = true;
    neededChainId = txChainId;
  }

  const handleClick = () => {
    history.push(`/reserve-overview/${underlyingAsset}-${id}`);
  };

  const claimVinium = async () => {
    if (!viniumIncentive || !chefIncentiveController || !currentAccount) return;
    setLoading(true);
    try {
      const tx = await chefIncentiveController.claim(currentAccount, viniumIncentive.rewardTokens);
      await tx.wait();
      await refreshIncentive();
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <TableItemWrapper onClick={handleClick} className="MarketTableItem" withGoToTop={true}>
      <TableColumn className="MarketTableItem__column">
        <TokenIcon tokenSymbol={currencySymbol} height={35} width={35} tokenFullName={asset.name} className="MarketTableItem__token" />
      </TableColumn>
      <TableColumn className="MarketTableItem__column">
        <Value
          value={isPriceInUSD ? totalLiquidityInUSD : totalLiquidity}
          compact={true}
          maximumValueDecimals={2}
          withoutSymbol={true}
          tooltipId={`market-size-${asset.symbol}`}
          symbol={isPriceInUSD ? 'USD' : ''}
          tokenIcon={isPriceInUSD}
          className="MarketTableItem__value"
        />
      </TableColumn>
      <TableColumn className="MarketTableItem__column">
        {borrowingEnabled ? (
          <Value
            value={isPriceInUSD ? totalBorrowsInUSD : totalBorrows}
            compact={true}
            maximumValueDecimals={2}
            className="MarketTableItem__value"
            withoutSymbol={true}
            symbol={isPriceInUSD ? 'USD' : ''}
            tokenIcon={isPriceInUSD}
            tooltipId={`borrows-size-${asset.symbol}`}
          />
        ) : (
          <NoData color="dark" />
        )}
      </TableColumn>

      {!isFreezed && (
        <>
          <TableColumn className="MarketTableItem__column">
            <LiquidityMiningCard
              value={depositAPY}
              thirtyDaysValue={avg30DaysLiquidityRate}
              liquidityMiningValue={aincentivesAPR}
              symbol={currencySymbol}
              type="deposit"
            />
          </TableColumn>

          <TableColumn className="MarketTableItem__column">
            {borrowingEnabled && +variableBorrowRate >= 0 ? (
              <LiquidityMiningCard
                value={variableBorrowRate}
                thirtyDaysValue={avg30DaysVariableRate}
                liquidityMiningValue={vincentivesAPR}
                symbol={currencySymbol}
                type="borrow-variable"
              />
            ) : (
              <NoData color="dark" />
            )}
          </TableColumn>

          <TableColumn className="MarketTableItem__column">
            {viniumIncentive && +viniumIncentive?.claimableReward !== 0 ? (
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography color={'white'}>{(+ethers.utils.formatEther(viniumIncentive?.claimableReward!)).toFixed(2)}</Typography>
                {networkMismatch && currentProviderName ? (
                  <NetworkMismatchButton
                    neededChainId={neededChainId}
                    currentChainId={chainId as ChainId}
                    currentProviderName={currentProviderName}
                  />
                ) : loading ? (
                  <SpinLoader className="DotStatus__loader" color={currentTheme.orange.hex} />
                ) : (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      claimVinium();
                    }}
                  >
                    Claim
                  </Button>
                )}
              </Box>
            ) : (
              <Typography color={'white'} sx={{ alignSelf: 'start' }}>
                0
              </Typography>
            )}
          </TableColumn>

          {/*<TableColumn className="MarketTableItem__column">
            {stableBorrowRateEnabled && borrowingEnabled && stableBorrowRate >= 0 ? (
              <LiquidityMiningCard
                value={stableBorrowRate}
                liquidityMiningValue={sincentivesAPR}
                symbol={currencySymbol}
                type="borrow-stable"
              />
            ) : (
              <NoData color="dark" />
            )}
            </TableColumn>*/}
        </>
      )}

      {isFreezed && (
        <>
          <div />
          <div className="MarketTableItem__isFreezed-inner">
            <FreezedWarning symbol={currencySymbol} />
          </div>
        </>
      )}

      <style jsx={true} global={true}>
        {staticStyles}
      </style>
    </TableItemWrapper>
  );
}
