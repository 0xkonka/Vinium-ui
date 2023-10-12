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
import React from 'react';
import { useMultiFeeDistributionData } from '../../../libs/emission-reward-provider/hooks/use-multifee-distribution';
import { useDynamicPoolDataContext } from '../../../libs/pool-data-provider';
import { useProtocolDataContext } from '../../../libs/protocol-data-provider';
import { ethers } from 'ethers';

const ViniumVest = () => {
  const { userData } = useMultiFeeDistributionData();

  const _vestings = userData?.earnedBalances?.earningsData!;

  return (
    <Card variant="outlined" sx={{ backgroundColor: 'transparent', borderRadius: '10px' }}>
      <CardContent>
        <Typography sx={{ fontSize: 18 }} gutterBottom>
          Vinium Vest
        </Typography>

        <TableContainer component={Paper} sx={{ background: 'transparent' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Vesting</TableCell>
                <TableCell>Expiry</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_vestings &&
                _vestings.map((vesting, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {+ethers.utils.formatEther(vesting.amount)}
                    </TableCell>
                    <TableCell>{+vesting.unlockTime}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <CardActions>
        <Button color="secondary">Claim All</Button>
      </CardActions>
    </Card>
  );
};

export default ViniumVest;
