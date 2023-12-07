import { Button, Card, CardActions, CardContent, OutlinedInput, Typography } from '@mui/material';
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useTxBuilderContext } from '../../../libs/tx-provider';
import { useUserWalletDataContext } from '../../../libs/web3-data-provider';
import { SpinLoader, useThemeContext } from '@aave/aave-ui-kit';
import { useProtocolDataContext } from '../../../libs/protocol-data-provider';
import { useERC20Data } from '../../../libs/erc20/use-erc20-token';
import { useMultiFeeDistributionData } from '../../../libs/vinium-protocol-js/hooks/use-multifee-distribution';

const LockLP = () => {
  const { currentAccount } = useUserWalletDataContext();
  const { currentMarketData } = useProtocolDataContext();
  const { userData } = useMultiFeeDistributionData();
  const { userData: LPData, refresh } = useERC20Data(currentMarketData.addresses.VINIUM_LP!);
  const { multiFeeDistribution, viniumLPContract } = useTxBuilderContext();

  const { currentTheme } = useThemeContext();

  const [lockBal, setLockBal] = useState('0');
  const [LockLPLoading, setLockLPLoading] = useState(false);
  const [UnlockLPLoading, setUnlockLPLoading] = useState(false);

  const userBal = LPData && ethers.utils.formatEther(LPData?.balance!);
  const unlockableBal = userData && (+userData.lockedBalances.unlockable! ?? 0);

  const handleLockLP = async () => {
    if (!multiFeeDistribution || !viniumLPContract || !currentAccount) return;
    setLockLPLoading(true);
    try {
      const allowance = await viniumLPContract.allowance(currentAccount, currentMarketData.addresses.MULTIFEE_DISTRIBUTION);
      if (+ethers.utils.formatEther(allowance) < +lockBal) {
        const tx = await viniumLPContract.approve(currentMarketData.addresses.MULTIFEE_DISTRIBUTION, ethers.utils.parseEther(lockBal));
        await tx.wait();
      }
      const tx = await multiFeeDistribution.lock(ethers.utils.parseEther(lockBal), currentAccount);
      await tx.wait();
      await refresh();
    } catch (e) {
      console.log(e);
    }
    setLockLPLoading(false);
  };

  const handleUnlockLP = async () => {
    if (!multiFeeDistribution || !viniumLPContract || !currentAccount) return;
    setUnlockLPLoading(true);
    try {
      const tx = await multiFeeDistribution.withdrawExpiredLocks();
      await tx.wait();
      await refresh();
    } catch (e) {
      console.log(e);
    }
    setUnlockLPLoading(false);
  };

  return (
    <Card variant="outlined" sx={{ backgroundColor: 'transparent', borderRadius: '10px', marginBottom: '10px' }}>
      <CardContent>
        <Typography sx={{ fontSize: 18 }} gutterBottom>
          Lock Vinium-ETH LP
        </Typography>

        <Typography sx={{ mb: 1.5 }}>Lock Vinium-ETH LPs and earn platform fees and penalty fees in unlocked Vinium.</Typography>
      </CardContent>
      {userBal && (
        <CardActions>
          <OutlinedInput
            id="outlined-adornment-weight"
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
          {LockLPLoading ? (
            <SpinLoader color={currentTheme.lightBlue.hex} className="TxTopInfo__spinner" />
          ) : (
            <Button color="primary" onClick={() => handleLockLP()}>
              Lock
            </Button>
          )}

          {UnlockLPLoading ? (
            <SpinLoader color={currentTheme.lightBlue.hex} className="TxTopInfo__spinner" />
          ) : (
            <Button color="primary" onClick={() => handleUnlockLP()} disabled={unlockableBal! === 0}>
              Unlock
            </Button>
          )}
        </CardActions>
      )}
      <CardContent>
        <Typography sx={{ fontSize: 18 }} gutterBottom>
          ViniumsETH LPs can be generated from providing liquidity at
          <a href="https://app.uniswap.org/add/v2/ETH/0x2f058f16223d0c74a1A2e6a9a47ba9c78f8776b8" target="_blank" rel="noreferrer">
            uniswap.com
          </a>
        </Typography>

        <Card variant="outlined" sx={{ backgroundColor: 'transparent', borderRadius: '10px', padding: 1 }}>
          Locked LPs are subject to 8 weeks lock (56 days) and will continue to earn fees after the locks expire if you do not withdraw.
        </Card>
      </CardContent>
    </Card>
  );
};

export default LockLP;
