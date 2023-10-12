import {
  Button,
  Card,
  CardActions,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useMultiFeeDistributionData } from '../../../libs/emission-reward-provider/hooks/use-multifee-distribution';
import { useDynamicPoolDataContext } from '../../../libs/pool-data-provider';
import { useProtocolDataContext } from '../../../libs/protocol-data-provider';
import { useTxBuilderContext } from '../../../libs/tx-provider';
import { useUserWalletDataContext } from '../../../libs/web3-data-provider';
import { ethers } from 'ethers';
import { SpinLoader, useThemeContext } from '@aave/aave-ui-kit';

const ClaimableFees = () => {
  const { currentAccount } = useUserWalletDataContext();
  const { userData } = useMultiFeeDistributionData();
  const { reserves } = useDynamicPoolDataContext();
  const { currentMarketData } = useProtocolDataContext();
  const { multiFeeDistribution } = useTxBuilderContext();
  const { currentTheme } = useThemeContext();

  const [claimAllloading, setClaimAllloading] = useState(false);

  const _claimableRewards = userData?.claimableRewards.map((reward) => {
    const reserve = reserves.find((reserve) => reserve.aTokenAddress === reward.token);
    if (!reserve) {
      return {
        address: currentMarketData.addresses.VINIUM_OFT,
        supplyTokenAddress: currentMarketData.addresses.VINIUM_OFT,
        balance: reward.amount,
        name: 'Vinium',
        symbol: 'VINIUM',
        decimals: 18,
      };
    }
    return {
      address: reserve?.underlyingAsset,
      supplyTokenAddress: reserve?.aTokenAddress,
      balance: reward.amount,
      value: +ethers.utils.formatEther(reward.amount) * +reserve?.priceInMarketReferenceCurrency, //tokensData[targetToken?.address]?.usdPrice?.mul(balance),
      name: reserve?.name,
      symbol: reserve?.symbol,
      decimals: reserve?.decimals,
    };
  });

  const totalClaimablePrice = _claimableRewards?.reduce((acc, item) => acc + (item.value ?? 0), 0);

  const handleClaimAll = async () => {
    if (!multiFeeDistribution || !currentAccount) return;
    setClaimAllloading(true);
    try {
      const tx = await multiFeeDistribution.getReward(_claimableRewards?.map((reward) => reward.supplyTokenAddress));
      await tx.wait();
    } catch (e) {
      console.log(e);
    }
    setClaimAllloading(false);
  };

  return (
    <Card variant="outlined" sx={{ backgroundColor: 'transparent', borderRadius: '10px' }}>
      <CardContent>
        <Typography sx={{ fontSize: 18 }} gutterBottom>
          Claimable Fees
        </Typography>

        <TableContainer component={Paper} sx={{ background: 'transparent' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Assets</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_claimableRewards &&
                _claimableRewards.map((row, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {row.symbol}
                    </TableCell>
                    <TableCell>{(+ethers.utils.formatEther(row.balance)).toFixed(2)}</TableCell>
                    <TableCell>{row.value && `$ ${row.value.toFixed(2)}`}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>

      <CardActions>
        <Typography sx={{ mr: 3 }}>Total Claimable Value: ${totalClaimablePrice}</Typography>
        {claimAllloading ? (
          <SpinLoader color={currentTheme.lightBlue.hex} className="TxTopInfo__spinner" />
        ) : (
          <Button color="secondary" onClick={() => handleClaimAll()} disabled={totalClaimablePrice! <= 0}>
            Claim All
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ClaimableFees;
