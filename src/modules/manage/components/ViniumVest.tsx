import { Box, Button, Card, CardContent, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useMultiFeeDistributionData } from '../../../libs/emission-reward-provider/hooks/use-multifee-distribution';
import { ethers } from 'ethers';
import { useUserWalletDataContext } from '../../../libs/web3-data-provider';
import { useTxBuilderContext } from '../../../libs/tx-provider';
import { SpinLoader, useThemeContext } from '@aave/aave-ui-kit';
import { useChefIncentiveData } from '../../../libs/emission-reward-provider/hooks/use-chef-incentive-controller';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ViniumVest = () => {
  const { currentTheme } = useThemeContext();
  const { userData, refresh: refreshMultiFee } = useMultiFeeDistributionData();
  const { totalClaimable, totalRewardTokens, refresh: refreshIncentive } = useChefIncentiveData();
  const { currentAccount } = useUserWalletDataContext();
  const { multiFeeDistribution, chefIncentiveController } = useTxBuilderContext();

  // const _vestings = userData?.earnedBalances?.earningsData!;
  const withdrawableBalance = userData?.withdrawableBalance!;

  const [value, setValue] = React.useState(0);
  const [claimLoading, setClaimLoading] = useState(false);
  const [earlyExitLoading, setEarlyExitLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const claimAll = async () => {
    if (!totalRewardTokens || !chefIncentiveController || !currentAccount) return;
    setClaimLoading(true);
    try {
      const tx = await chefIncentiveController.claim(currentAccount, totalRewardTokens);
      await tx.wait();
      await refreshIncentive();
    } catch (e) {
      console.log(e);
    }

    setClaimLoading(false);
  };

  const exitEarly = async () => {
    if (!multiFeeDistribution || !currentAccount) return;
    setEarlyExitLoading(true);
    try {
      const tx = await multiFeeDistribution.exitEarly(currentAccount);
      await tx.wait();
      await refreshMultiFee();
    } catch (e) {
      console.log(e);
    }
    setEarlyExitLoading(false);
  };

  const withdraw = async () => {
    if (!multiFeeDistribution || !currentAccount) return;
    setWithdrawLoading(true);
    try {
      const tx = await multiFeeDistribution.withdraw();
      await tx.wait();
      await refreshMultiFee();
    } catch (e) {
      console.log(e);
    }
    setWithdrawLoading(false);
  };

  return (
    <Card variant="outlined" sx={{ backgroundColor: 'transparent', borderRadius: '10px' }}>
      <CardContent>
        <Typography sx={{ fontSize: 18 }} gutterBottom>
          Vinium Vest
        </Typography>
        {/* <CustomTabPanel value={value} index={0}>
          <Typography>Vinium earned from lending and borrowing must vest for 28 days.</Typography>
        </CustomTabPanel> */}
        <CustomTabPanel value={value} index={0}>
          <Typography>Please wait until vesting end date.</Typography>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Typography>Vinium that has completed the 28 day vesting period.</Typography>
        </CustomTabPanel>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Ready to Vest" {...a11yProps(0)} />
              <Tab label="Current Vesting" {...a11yProps(1)} />
              <Tab label="Vested" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Typography>All Claimable Amount : {(+ethers.utils.formatEther(totalClaimable ?? 0)).toFixed(2)}</Typography>
            {claimLoading ? (
              <SpinLoader color={currentTheme.lightBlue.hex} className="TxTopInfo__spinner" />
            ) : (
              <Button variant="outlined" onClick={() => claimAll()}>
                Claim Rewards
              </Button>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Typography>
              Withdrawable Balance : {(+ethers.utils.formatEther(withdrawableBalance?.amount ?? 0)).toFixed(2)} <br /> Penalty Amount:
              {(+ethers.utils.formatEther(withdrawableBalance?.penaltyAmount.add(withdrawableBalance?.treausryAmount) ?? 0)).toFixed(2)}
            </Typography>
            {earlyExitLoading ? (
              <SpinLoader color={currentTheme.lightBlue.hex} className="TxTopInfo__spinner" />
            ) : (
              <Button variant="outlined" onClick={() => exitEarly()}>
                Exit Early
              </Button>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Typography>
              Earned Balance : {(+ethers.utils.formatEther(withdrawableBalance?.amountWithoutPenalty ?? 0)).toFixed(2)} <br />
            </Typography>
            {withdrawLoading ? (
              <SpinLoader color={currentTheme.lightBlue.hex} className="TxTopInfo__spinner" />
            ) : (
              <Button variant="outlined" onClick={() => withdraw()} disabled={(+withdrawableBalance?.amountWithoutPenalty! ?? 0) === 0}>
                Withdraw
              </Button>
            )}
          </CustomTabPanel>
        </Box>
      </CardContent>
      {/* <CardActions>
        <Button color="secondary">Claim All</Button>
      </CardActions> */}
    </Card>
  );
};

export default ViniumVest;
