import { Button, Card, CardActions, CardContent, OutlinedInput, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useViniumTokenData } from '../../../libs/emission-reward-provider/hooks/use-vinium-token';
import { ethers } from 'ethers';
import { useTxBuilderContext } from '../../../libs/tx-provider';
import { useUserWalletDataContext } from '../../../libs/web3-data-provider';
import { SpinLoader, useThemeContext } from '@aave/aave-ui-kit';
import { useProtocolDataContext } from '../../../libs/protocol-data-provider';

const StakeVinium = () => {
  const { currentAccount } = useUserWalletDataContext();
  const { userData, refresh } = useViniumTokenData();
  const { multiFeeDistribution, viniumContract } = useTxBuilderContext();
  const { currentMarketData } = useProtocolDataContext();
  const { currentTheme } = useThemeContext();

  const [stakeBal, setStakeBal] = useState('0');
  const [stakeViniumLoading, setStakeViniumLoading] = useState(false);

  const userBal = userData && ethers.utils.formatEther(userData?.balance!);

  const handleStakeVinium = async () => {
    if (!multiFeeDistribution || !viniumContract || !currentAccount) return;
    setStakeViniumLoading(true);
    try {
      const allowance = await viniumContract.allowance(currentAccount, currentMarketData.addresses.MULTIFEE_DISTRIBUTION);
      if (+ethers.utils.formatEther(allowance) < +stakeBal) {
        const tx = await viniumContract.approve(currentMarketData.addresses.MULTIFEE_DISTRIBUTION, ethers.utils.parseEther(stakeBal));
        await tx.wait();
      }
      const tx = await multiFeeDistribution.stake(ethers.utils.parseEther(stakeBal), false);
      await tx.wait();
      await refresh()
    } catch (e) {
      console.log(e);
    }
    setStakeViniumLoading(false);
  };

  return (
    <Card variant="outlined" sx={{ backgroundColor: 'transparent', borderRadius: '10px', marginBottom: '10px' }}>
      <CardContent>
        <Typography sx={{ fontSize: 18 }} gutterBottom>
          Stake Vinium
        </Typography>

        <Typography sx={{ mb: 1.5 }}>Stake Vinium and earn platform fees with no lockup period.</Typography>
      </CardContent>
      {userBal && (
        <CardActions>
          <OutlinedInput
            id="outlined-adornment-weight"
            // value={stakeBal}
            type='number'
            value={stakeBal}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setStakeBal(event.target.value);
            }}
            endAdornment={
              <Button size="small" onClick={() => setStakeBal(userBal!)}>
                Max
              </Button>
            }
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              'aria-label': 'weight',
            }}
          />
          {stakeViniumLoading ? (
            <SpinLoader color={currentTheme.lightBlue.hex} className="TxTopInfo__spinner" />
          ) : (
            <Button color="primary" onClick={() => handleStakeVinium()}>
              Stake
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default StakeVinium;
