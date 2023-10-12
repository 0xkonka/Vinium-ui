import { Button, Card, CardActions, CardContent, OutlinedInput, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useViniumTokenData } from '../../../libs/emission-reward-provider/hooks/use-vinium-token';
import { ethers } from 'ethers';
import { useTxBuilderContext } from '../../../libs/tx-provider';
import { useUserWalletDataContext } from '../../../libs/web3-data-provider';
import { SpinLoader, useThemeContext } from '@aave/aave-ui-kit';
import { useProtocolDataContext } from '../../../libs/protocol-data-provider';

const LockVinium = () => {
  const { currentAccount } = useUserWalletDataContext();
  const { userData, refresh } = useViniumTokenData();
  const { multiFeeDistribution, viniumContract } = useTxBuilderContext();
  const { currentMarketData } = useProtocolDataContext();
  const { currentTheme } = useThemeContext();

  const [lockBal, setLockBal] = useState('0');
  const [LockViniumLoading, setLockViniumLoading] = useState(false);

  const userBal = userData && ethers.utils.formatEther(userData?.balance!);

  const handleLockVinium = async () => {
    if (!multiFeeDistribution || !viniumContract || !currentAccount) return;
    setLockViniumLoading(true);
    try {
      const allowance = await viniumContract.allowance(currentAccount, currentMarketData.addresses.MULTIFEE_DISTRIBUTION);
      if (+ethers.utils.formatEther(allowance) < +lockBal) {
        const tx = await viniumContract.approve(currentMarketData.addresses.MULTIFEE_DISTRIBUTION, ethers.utils.parseEther(lockBal));
        await tx.wait();
      }
      const tx = await multiFeeDistribution.stake(ethers.utils.parseEther(lockBal), true);
      await tx.wait();
      await refresh();
    } catch (e) {
      console.log(e);
    }
    setLockViniumLoading(false);
  };

  return (
    <Card variant="outlined" sx={{ backgroundColor: 'transparent', borderRadius: '10px', marginBottom: '10px' }}>
      <CardContent>
        <Typography sx={{ fontSize: 18 }} gutterBottom>
          Lock Vinium
        </Typography>

        <Typography sx={{ mb: 1.5 }}>
          Locked Vinium is subject to a three-month lock period and will continue to earn fees after the locks expire if you do not withdraw.
        </Typography>
      </CardContent>
      {userBal && (
        <CardActions>
          <OutlinedInput
            id="outlined-adornment-weight"
            // value={lockBal}
            type="number"
            value={lockBal}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setLockBal(event.target.value);
            }}
            endAdornment={
              <Button size="small" onClick={() => setLockBal(userBal!)}>
                Max
              </Button>
            }
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              'aria-label': 'weight',
            }}
          />
          {LockViniumLoading ? (
            <SpinLoader color={currentTheme.lightBlue.hex} className="TxTopInfo__spinner" />
          ) : (
            <Button color="primary" onClick={() => handleLockVinium()}>
              Lock
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default LockVinium;
