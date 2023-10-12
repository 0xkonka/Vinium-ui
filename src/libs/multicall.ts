import { Interface } from '@ethersproject/abi';

interface Call {
  address: string; // Address of the contract
  name: string; // Function name on the contract (exemple: balanceOf)
  params?: any[]; // Function params
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const multicall = async (
  multiContract: any,
  abi: any[],
  calls: Call[],
) => {
  const itf = new Interface(abi);
  const calldata = calls.map((call) => [
    call.address.toLowerCase(),
    itf.encodeFunctionData(call.name, call.params),
  ]);
  const { returnData } = await multiContract.callStatic.aggregate(calldata);
  const res = returnData.map((call: any, i: number) =>
    itf.decodeFunctionResult(calls[i].name, call)
  );
  return res;
};

export default multicall;
