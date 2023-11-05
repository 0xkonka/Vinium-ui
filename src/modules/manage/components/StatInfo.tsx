import { Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import { useMultiFeeDistributionData } from '../../../libs/emission-reward-provider/hooks/use-multifee-distribution';
import { ethers } from 'ethers';

const StatInfo = () => {
  const { userData } = useMultiFeeDistributionData();

  const _lockedLPs = userData?.lockedBalances.locked!;
  const _vestingBalance = userData?.earnedBalances.total!;

  return (
    <Card variant="outlined" sx={{ backgroundColor: 'transparent', borderRadius: '10px', width: '100%' }}>
      <CardContent>
        <Typography sx={{ fontSize: 18 }} gutterBottom>
          Stats
        </Typography>
        <Typography>Locked LPs : {(+ethers.utils.formatEther(_lockedLPs ?? 0)).toFixed(2)} </Typography>
        <Typography>Vesting Vinium : {(+ethers.utils.formatEther(_vestingBalance ?? 0)).toFixed(2)} </Typography>
      </CardContent>
      {/* <CardActions>
        <Button color="secondary">Claim All</Button>
      </CardActions> */}
    </Card>
  );
};

export default StatInfo;
