/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from 'ethers';
import { Provider, TransactionRequest } from '@ethersproject/providers';
import { Contract, ContractFactory, Overrides } from '@ethersproject/contracts';

import type { Multicall } from './Multicall';

export class MulticallFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<Multicall> {
    return super.deploy(overrides || {}) as Promise<Multicall>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Multicall {
    return super.attach(address) as Multicall;
  }
  connect(signer: Signer): MulticallFactory {
    return super.connect(signer) as MulticallFactory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Multicall {
    return new Contract(address, _abi, signerOrProvider) as Multicall;
  }
}

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'target',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'callData',
            type: 'bytes',
          },
        ],
        internalType: 'struct Multicall.Call[]',
        name: 'calls',
        type: 'tuple[]',
      },
    ],
    name: 'aggregate',
    outputs: [
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
      {
        internalType: 'bytes[]',
        name: 'returnData',
        type: 'bytes[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
    ],
    name: 'getBlockHash',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'blockHash',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCurrentBlockCoinbase',
    outputs: [
      {
        internalType: 'address',
        name: 'coinbase',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCurrentBlockDifficulty',
    outputs: [
      {
        internalType: 'uint256',
        name: 'difficulty',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCurrentBlockGasLimit',
    outputs: [
      {
        internalType: 'uint256',
        name: 'gaslimit',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCurrentBlockTimestamp',
    outputs: [
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
    ],
    name: 'getEthBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLastBlockHash',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'blockHash',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const _bytecode =
  '0x608060405234801561001057600080fd5b506105ec806100206000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c806372425d9d1161005b57806372425d9d146100e657806386d516e8146100ec578063a8b0574e146100f2578063ee82ac5e1461010057600080fd5b80630f28c97d1461008d578063252dba42146100a257806327e86d6e146100c35780634d2301cc146100cb575b600080fd5b425b6040519081526020015b60405180910390f35b6100b56100b03660046102f1565b610112565b60405161009992919061047f565b61008f610252565b61008f6100d9366004610501565b6001600160a01b03163190565b4461008f565b4561008f565b604051418152602001610099565b61008f61010e366004610523565b4090565b8051439060609067ffffffffffffffff81111561013157610131610265565b60405190808252806020026020018201604052801561016457816020015b606081526020019060019003908161014f5790505b50905060005b835181101561024c576000808583815181106101885761018861053c565b6020026020010151600001516001600160a01b03168684815181106101af576101af61053c565b6020026020010151602001516040516101c89190610552565b6000604051808303816000865af19150503d8060008114610205576040519150601f19603f3d011682016040523d82523d6000602084013e61020a565b606091505b50915091508161021957600080fd5b8084848151811061022c5761022c61053c565b60200260200101819052505050808061024490610584565b91505061016a565b50915091565b600061025f60014361059f565b40905090565b634e487b7160e01b600052604160045260246000fd5b6040805190810167ffffffffffffffff8111828210171561029e5761029e610265565b60405290565b604051601f8201601f1916810167ffffffffffffffff811182821017156102cd576102cd610265565b604052919050565b80356001600160a01b03811681146102ec57600080fd5b919050565b6000602080838503121561030457600080fd5b823567ffffffffffffffff8082111561031c57600080fd5b818501915085601f83011261033057600080fd5b81358181111561034257610342610265565b8060051b6103518582016102a4565b918252838101850191858101908984111561036b57600080fd5b86860192505b83831015610442578235858111156103895760008081fd5b86016040601f19828d0381018213156103a25760008081fd5b6103aa61027b565b6103b58b85016102d5565b815282840135898111156103c95760008081fd5b8085019450508d603f8501126103df5760008081fd5b8a840135898111156103f3576103f3610265565b6104038c84601f840116016102a4565b92508083528e8482870101111561041a5760008081fd5b808486018d85013760009083018c0152808b0191909152845250509186019190860190610371565b9998505050505050505050565b60005b8381101561046a578181015183820152602001610452565b83811115610479576000848401525b50505050565b600060408201848352602060408185015281855180845260608601915060608160051b870101935082870160005b828110156104f357878603605f19018452815180518088526104d481888a0189850161044f565b601f01601f1916969096018501955092840192908401906001016104ad565b509398975050505050505050565b60006020828403121561051357600080fd5b61051c826102d5565b9392505050565b60006020828403121561053557600080fd5b5035919050565b634e487b7160e01b600052603260045260246000fd5b6000825161056481846020870161044f565b9190910192915050565b634e487b7160e01b600052601160045260246000fd5b60006000198214156105985761059861056e565b5060010190565b6000828210156105b1576105b161056e565b50039056fea2646970667358221220fb6be8302774729b761c9b1915a9e1345ed6b98d1b0f1341ac00826790f0b10f64736f6c634300080c0033';
