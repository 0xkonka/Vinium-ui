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
import { useMultiFeeDistributionData } from '../../../libs/vinium-protocol-js/hooks/use-multifee-distribution';
import { ethers } from 'ethers';

const ViniumLock = () => {
  const { userData } = useMultiFeeDistributionData();

  const _locks = userData?.lockedBalances.lockData;

  return (
    <Card variant="outlined" sx={{ backgroundColor: 'transparent', borderRadius: '10px' }}>
      <CardContent>
        <Typography sx={{ fontSize: 18 }} gutterBottom>
          Vinium Lock
        </Typography>

        <TableContainer component={Paper} sx={{ background: 'transparent' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Locked</TableCell>
                <TableCell>Expiry</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_locks &&
                _locks.map((lock, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {+ethers.utils.formatEther(lock.amount)}
                    </TableCell>
                    <TableCell>{+lock.unlockTime}</TableCell>
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

export default ViniumLock;
