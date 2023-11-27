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
  loopBal: string;
  loopCount: number;
  loopType: string;
}

const LoopAction = ({ assetId, loopBal, loopCount, loopType }: LoopActionProps) => {
  const { currentAccount } = useUserWalletDataContext();
  const { reserves } = useDynamicPoolDataContext();
  const { chainId: currentChainId, currentMarketData } = useProtocolDataContext();
  const { library: provider } = useWeb3React<providers.Web3Provider>();
  const { leveragerContract } = useTxBuilderContext();
  const { currentTheme } = useThemeContext();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const { erc20Contract: AssetContract } = useERC20Data(reserves[assetId].underlyingAsset);
  const leveragerAddr = currentMarketData.addresses.LEVERAGER!;

  const getCollateralTokenInfo = () => {
    let underlyingAssetAddress = '';
    let variableDebtTokenAddress = '';

    if (loopType === 'single') {
      underlyingAssetAddress = reserves[assetId].underlyingAsset;
      variableDebtTokenAddress = reserves[assetId].variableDebtTokenAddress;
    } else if (loopType === 'vault') {
      if (reserves[assetId].symbol === 'sDAI') {
        underlyingAssetAddress = reserves.filter((reserve) => reserve.symbol === 'DAI')[0].underlyingAsset;
        variableDebtTokenAddress = reserves.filter((reserve) => reserve.symbol === 'DAI')[0].variableDebtTokenAddress;
      } else if (reserves[assetId].symbol === 'sFRAX') {
        underlyingAssetAddress = reserves.filter((reserve) => reserve.symbol === 'FRAX')[0].underlyingAsset;
        variableDebtTokenAddress = reserves.filter((reserve) => reserve.symbol === 'FRAX')[0].variableDebtTokenAddress;
      } else if (reserves[assetId].symbol === 'stETH') {
        underlyingAssetAddress = reserves.filter((reserve) => reserve.symbol === 'ETH')[0].underlyingAsset;
        variableDebtTokenAddress = reserves.filter((reserve) => reserve.symbol === 'ETH')[0].variableDebtTokenAddress;
      }
    }
    return [underlyingAssetAddress, variableDebtTokenAddress];
  };

  useEffect(() => {
    if (!provider || !reserves || !currentAccount) return;
    const erc20Service: ERC20Service = new ERC20Service(getProvider(currentChainId));
    const { isApproved } = erc20Service;
    const check = async () => {
      setLoading(true);
      console.log('reserves[assetId].underlyingAsset :>> ', reserves[assetId].underlyingAsset);
      console.log(
        'ethers.utils.parseUnits(loopBal, reserves[assetId].decimals ).toString() :>> ',
        ethers.utils.parseUnits(loopBal, reserves[assetId].decimals).toString()
      );

      const approved = await isApproved({
        token: reserves[assetId].underlyingAsset,
        user: currentAccount,
        spender: leveragerAddr,
        amount: loopBal,
      });
      console.log('approved :>> ', approved);
      if (approved) {
        setActiveStep(1);
        const variableDebtTokenAddress = getCollateralTokenInfo()[1];
        console.log('variableDebtTokenAddress', variableDebtTokenAddress);
        const debtTokenContract = getContract(variableDebtTokenAddress, VariableDebtTokenABI, provider, currentAccount);
        const borrowAllowance = await debtTokenContract.borrowAllowance(currentAccount, leveragerAddr);
        console.log('borrowAllowance', borrowAllowance);

        if (+borrowAllowance > +ethers.utils.parseEther(loopBal)) setActiveStep(2);
      }

      setLoading(false);
    };
    check();
  }, [currentAccount, assetId, currentChainId, leveragerAddr, loopBal]);

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
      console.log('loopType', loopType);
      // need to approve collateral asset's debtToken ex: in case of sDAI, need to approve delegate dai token's dbToken

      const variableDebtTokenAddress = getCollateralTokenInfo()[1];
      if (variableDebtTokenAddress === '') return;
      const debtTokenContract = getContract(variableDebtTokenAddress, VariableDebtTokenABI, provider!, currentAccount);
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
      let baseLTVasCollateral = +reserves[assetId].baseLTVasCollateral * 10000;
      if (baseLTVasCollateral === 0) baseLTVasCollateral = 9000;

      if (loopType === 'single') {
        let tx = await leveragerContract.singleLoop(
          reserves[assetId].underlyingAsset,
          ethers.utils.parseUnits(loopBal, reserves[assetId].decimals),
          2,
          baseLTVasCollateral,
          loopCount
        );
        await tx.wait();
      } else if (loopType === 'vault') {
        const underlyingAsset = getCollateralTokenInfo()[0];
        let tx = await leveragerContract.vaultLoop(
          underlyingAsset,
          reserves[assetId].underlyingAsset,
          ethers.utils.parseUnits(loopBal, reserves[assetId].decimals),
          2,
          baseLTVasCollateral,
          loopCount
        );
        await tx.wait();
      }

      setActiveStep(3);
    } catch (err) {
      console.log('err :>> ', err);
    }
    setLoading(false);
  };

  const renderContent = () => {
    if (loading) return <SpinLoader color={currentTheme.lightBlue.hex} className="TxTopInfo__spinner" />;
    if (activeStep === 0) {
      // Approve
      return <Button onClick={() => handleApprove()}>Approve</Button>;
    } else if (activeStep === 1) {
      // ApproveDelegate
      return <Button onClick={() => handleApproveDelegate()}>Approve Delegate</Button>;
    } else if (activeStep === 2) {
      // Loop
      return (
        <Button variant="outlined" onClick={() => handleLoop()}>
          Loop
        </Button>
      );
    } else return <Typography>Finished</Typography>;
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
