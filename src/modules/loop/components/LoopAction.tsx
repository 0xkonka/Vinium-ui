import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers, providers } from 'ethers';
import { Button, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { SpinLoader, useThemeContext } from '@aave/aave-ui-kit';
import { useERC20Data } from '../../../libs/erc20/use-erc20-token';
import { useDynamicPoolDataContext } from '../../../libs/pool-data-provider';
import { useProtocolDataContext } from '../../../libs/protocol-data-provider';
import { useUserWalletDataContext } from '../../../libs/web3-data-provider';
import { getContract } from '../../../libs/utils';
import VariableDebtTokenABI from '../libs/VariableDebtTokenABI.json';
import { ERC20Service } from '@aave/contract-helpers';
import { getProvider } from '../../../helpers/config/markets-and-network-config';
import { useTxBuilderContext } from '../../../libs/tx-provider';

const steps = ['Approve', 'Approve Delegate', '1-Click Loop', 'Finished'];

interface LoopActionProps {
  assetId: number;
  userAssetBal: string;
  loopCount: number;
}

const LoopAction = ({ assetId, userAssetBal, loopCount }: LoopActionProps) => {
  const { currentAccount } = useUserWalletDataContext();
  const { reserves } = useDynamicPoolDataContext();
  const { chainId: currentChainId, currentMarketData } = useProtocolDataContext();
  const { library: provider } = useWeb3React<providers.Web3Provider>();
  const { leveragerContract } = useTxBuilderContext();
  const { currentTheme } = useThemeContext();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [IsChecking, setIsChecking] = useState(false);

  const { erc20Contract: AssetContract } = useERC20Data(reserves[assetId].underlyingAsset);
  const leveragerAddr = currentMarketData.addresses.LEVERAGER!;

  useEffect(() => {
    const erc20Service = new ERC20Service(getProvider(currentChainId));
    const { isApproved } = erc20Service;
    const check = async () => {
      setIsChecking(true);
      console.log('reserves[assetId].underlyingAsset :>> ', reserves[assetId].underlyingAsset);
      console.log(
        'ethers.utils.parseUnits(userAssetBal, reserves[assetId].decimals ).toString() :>> ',
        ethers.utils.parseUnits(userAssetBal, reserves[assetId].decimals).toString()
      );
      const approved = await isApproved({
        token: reserves[assetId].underlyingAsset,
        user: currentAccount,
        spender: leveragerAddr,
        amount: ethers.utils.parseUnits(userAssetBal, reserves[assetId].decimals).toString(),
      });
      console.log('approved :>> ', approved);
      if (approved) setActiveStep(1);

      const debtTokenContract = getContract(reserves[assetId].variableDebtTokenAddress, VariableDebtTokenABI, provider!, currentAccount);
      const borrowAllowance = await debtTokenContract.borrowAllowance(currentAccount, leveragerAddr);

      if (+borrowAllowance > +ethers.utils.parseEther(userAssetBal)) setActiveStep(2);
      setIsChecking(false);
    };
    check();
  }, [currentAccount, assetId, currentChainId, leveragerAddr, userAssetBal]);

  const renderContent = () => {
    if (IsChecking) return;
    if (activeStep === 0) {
      // Approve
      return loading ? (
        <SpinLoader color={currentTheme.lightBlue.hex} className="TxTopInfo__spinner" />
      ) : (
        <Button onClick={() => handleApprove()}>Approve</Button>
      );
    } else if (activeStep === 1) {
      // Approve
      return loading ? (
        <SpinLoader color={currentTheme.lightBlue.hex} className="TxTopInfo__spinner" />
      ) : (
        <Button onClick={() => handleApproveDelegate()}>Approve Delegate</Button>
      );
    } else if (activeStep === 2) {
      // Approve
      return loading ? (
        <SpinLoader color={currentTheme.lightBlue.hex} className="TxTopInfo__spinner" />
      ) : (
        <Button onClick={() => handleLoop()}>Loop</Button>
      );
    } else return <Typography>Finished</Typography>;
  };

  const handleApprove = async () => {
    if (!leveragerAddr || !currentAccount || !AssetContract) return;
    setLoading(true);
    try {
      let tx = await AssetContract.approve(leveragerAddr, ethers.constants.MaxInt256);
      await tx.wait();
      setActiveStep(1);
    } catch (err) {
      console.log('err :>> ', err);
    }
    setLoading(false);
  };

  const handleApproveDelegate = async () => {
    if (!leveragerAddr || !currentAccount || !AssetContract || !provider) return;
    setLoading(true);
    try {
      const debtTokenContract = getContract(reserves[assetId].variableDebtTokenAddress, VariableDebtTokenABI, provider!, currentAccount);
      let tx = await debtTokenContract.approveDelegation(leveragerAddr, ethers.constants.MaxUint256);
      await tx.wait();
      setActiveStep(2);
    } catch (err) {
      console.log('err :>> ', err);
    }
    setLoading(false);
  };

  const handleLoop = async () => {
    if (!leveragerAddr || !currentAccount || !AssetContract || !provider || !leveragerContract) return;
    setLoading(true);
    try {
      let baseLTVasCollateral = +reserves[assetId].baseLTVasCollateral;
      if (baseLTVasCollateral === 0) baseLTVasCollateral = 9000;

      let tx = await leveragerContract.loop(
        reserves[assetId].underlyingAsset,
        ethers.utils.parseUnits(userAssetBal, reserves[assetId].decimals),
        2,
        baseLTVasCollateral,
        loopCount
      );
      await tx.wait();
      setActiveStep(3);
    } catch (err) {
      console.log('err :>> ', err);
    }
    setLoading(false);
  };

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {renderContent()}
    </>
  );
};

export default LoopAction;
