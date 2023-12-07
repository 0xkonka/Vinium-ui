import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useMultiFeeDistributionData } from '../../../libs/vinium-protocol-js/hooks/use-multifee-distribution';
import { useTxBuilderContext } from '../../../libs/tx-provider';
import { useUserWalletDataContext } from '../../../libs/web3-data-provider';
import { SpinLoader, useThemeContext } from '@aave/aave-ui-kit';

const ViniumClaim = () => {
  const { userData } = useMultiFeeDistributionData();
  const { multiFeeDistribution } = useTxBuilderContext();
  const { currentAccount } = useUserWalletDataContext();
  const { currentTheme } = useThemeContext();

  const _vestingBalance = userData?.earnedBalances.total;
  const _stakedBalance = userData?.withdrawableBalance.earned.sub(_vestingBalance!);
  const _withdrawableBalance = userData?.withdrawableBalance;
  const _unlockedableBalance = userData?.lockedBalances.unlockable;

  const [claimStakedloading, setClaimStakedloading] = useState(false);
  const [claimAllloading, setClaimAllloading] = useState(false);
  const [withdrawExpiredloading, setWithdrawExpiredloading] = useState(false);

  const handleClaimStakedVinium = async () => {
    if (!multiFeeDistribution || !currentAccount) return;
    setClaimStakedloading(true);
    try {
      const tx = await multiFeeDistribution.withdraw(_stakedBalance);
      await tx.wait();
    } catch (e) {
      console.log(e);
    }
    setClaimStakedloading(false);
  };

  const handleClaimAllVinium = async () => {
    if (!multiFeeDistribution || !currentAccount) return;
    setClaimAllloading(true);
    try {
      const tx = await multiFeeDistribution.exit(false);
      await tx.wait();
    } catch (e) {
      console.log(e);
    }
    setClaimAllloading(false);
  };

  const handleWithdrawExpiredLockVinium = async () => {
    if (!multiFeeDistribution || !currentAccount) return;
    setWithdrawExpiredloading(true);
    try {
      const tx = await multiFeeDistribution.withdrawExpiredLocks();
      await tx.wait();
    } catch (e) {
      console.log(e);
    }
    setWithdrawExpiredloading(false);
  };

  // const [open, setOpen] = React.useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    <>
      <Card variant="outlined" sx={{ backgroundColor: 'transparent', borderRadius: '10px', marginBottom: '10px' }}>
        <CardContent>
          <Box>
            <Typography sx={{ fontSize: 18 }} gutterBottom>
              Unlocked Vinium
            </Typography>

            <Typography sx={{ mb: 1.5 }}>Staked Vinium and expired Vinium vests</Typography>
            <Typography sx={{ fontSize: 18 }} gutterBottom>
              {(+ethers.utils.formatEther(_stakedBalance! ?? 0)).toFixed(2)}
            </Typography>
            {claimStakedloading ? (
              <SpinLoader color={currentTheme.lightBlue.hex} className="TxTopInfo__spinner" />
            ) : (
              <Button color="primary" onClick={() => handleClaimStakedVinium()} disabled={+_stakedBalance! <= 0}>
                Claim Vinium
              </Button>
            )}
          </Box>
          <Divider />
          <Box>
            <Typography sx={{ fontSize: 18 }} gutterBottom>
              Vesting Vinium
            </Typography>

            <Typography sx={{ mb: 1.5 }}>Vinium that can be claimed with a 50% penalty</Typography>
            <Typography sx={{ fontSize: 18 }} gutterBottom>
              {(+ethers.utils.formatEther(_vestingBalance! ?? 0)).toFixed(2)}
            </Typography>
          </Box>
          <Divider />
          {/* <Box>
            <Typography sx={{ fontSize: 18 }} gutterBottom>
              Claim all of the above
            </Typography>

            <Typography sx={{ mb: 1.5 }}>Early exit penalty {(+ethers.utils.formatEther(_withdrawableBalance?.penaltyAmount! ?? 0)).toFixed(2)} Vinium</Typography>

            {claimAllloading ? (
              <SpinLoader color={currentTheme.lightBlue.hex} className="TxTopInfo__spinner" />
            ) : (
              <Button color="primary" onClick={() => handleClaimAllVinium()} disabled={+_withdrawableBalance?.penaltyAmount! <= 0}>
                Claim All
              </Button>
            )}
          </Box> */}
          <Divider />
          <Box>
            <Typography sx={{ fontSize: 18 }} gutterBottom>
              Expired Locked Vinium
            </Typography>

            <Typography sx={{ mb: 1.5 }}>Vinium locks that have exceeded the 3 month lock period and are now withdrawable</Typography>
            <Typography sx={{ fontSize: 18 }} gutterBottom>
              {(+ethers.utils.formatEther(_unlockedableBalance! ?? 0)).toFixed(2)}
            </Typography>
            {withdrawExpiredloading ? (
              <SpinLoader color={currentTheme.lightBlue.hex} className="TxTopInfo__spinner" />
            ) : (
              <Button color="primary" onClick={() => handleWithdrawExpiredLockVinium()} disabled={+_unlockedableBalance! <= 0}>
                Withdraw
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
      {/* <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Claim Vinium</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates occasionally.
          </DialogContentText>
          <TextField autoFocus margin="dense" id="name" label="Email Address" type="email" fullWidth variant="standard" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
};

export default ViniumClaim;
