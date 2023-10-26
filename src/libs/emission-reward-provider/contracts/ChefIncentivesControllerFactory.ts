/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { ChefIncentivesController } from "./ChefIncentivesController";

export class ChefIncentivesControllerFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<ChefIncentivesController> {
    return super.deploy(overrides || {}) as Promise<ChefIncentivesController>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ChefIncentivesController {
    return super.attach(address) as ChefIncentivesController;
  }
  connect(signer: Signer): ChefIncentivesControllerFactory {
    return super.connect(signer) as ChefIncentivesControllerFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ChefIncentivesController {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ChefIncentivesController;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalSupply",
        type: "uint256",
      },
    ],
    name: "BalanceUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_allocPoint",
        type: "uint256",
      },
    ],
    name: "addPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_tokens",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_allocPoints",
        type: "uint256[]",
      },
    ],
    name: "batchUpdateAllocPoint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint128[]",
        name: "_startTimeOffset",
        type: "uint128[]",
      },
      {
        internalType: "uint128[]",
        name: "_rewardsPerSecond",
        type: "uint128[]",
      },
    ],
    name: "changeEmissionSchedule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_tokens",
        type: "address[]",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "claimReceiver",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_tokens",
        type: "address[]",
      },
    ],
    name: "claimableReward",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "emissionSchedule",
    outputs: [
      {
        internalType: "uint128",
        name: "startTimeOffset",
        type: "uint128",
      },
      {
        internalType: "uint128",
        name: "rewardsPerSecond",
        type: "uint128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_totalSupply",
        type: "uint256",
      },
    ],
    name: "handleAction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint128[]",
        name: "_startTimeOffset",
        type: "uint128[]",
      },
      {
        internalType: "uint128[]",
        name: "_rewardsPerSecond",
        type: "uint128[]",
      },
      {
        internalType: "address",
        name: "_poolConfigurator",
        type: "address",
      },
      {
        internalType: "contract IMultiFeeDistribution",
        name: "_rewardMinter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_maxMintable",
        type: "uint256",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "maxMintableTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mintedTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolConfigurator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "poolInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "totalSupply",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "allocPoint",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastRewardTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "accRewardPerShare",
        type: "uint256",
      },
      {
        internalType: "contract IOnwardIncentivesController",
        name: "onwardIncentives",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "registeredTokens",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardMinter",
    outputs: [
      {
        internalType: "contract IMultiFeeDistribution",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardsPerSecond",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
    ],
    name: "setClaimReceiver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "contract IOnwardIncentivesController",
        name: "_incentives",
        type: "address",
      },
    ],
    name: "setOnwardIncentives",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "start",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalAllocPoint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userBaseClaimable",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardDebt",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611b67806100206000396000f3fe608060405234801561001057600080fd5b50600436106101da5760003560e01c80638d75fe0511610104578063be9a6555116100a2578063e20c5a8a11610071578063e20c5a8a14610459578063e5b5349814610482578063eacdaabc146104a2578063f2fde38b146104ab57600080fd5b8063be9a65551461040b578063bfccff4514610413578063cd1a4d8614610433578063de7e410c1461044657600080fd5b80639a0ba2ea116100de5780639a0ba2ea1461035b5780639a7b5f111461036e5780639b8e5563146103e55780639f0e9a8a146103f857600080fd5b80638d75fe051461031a5780638da5cb5b146103235780638e2eba091461034857600080fd5b8063334d0bbd1161017c5780635c975abb1161014b5780635c975abb146102eb578063715018a61461030157806378e97925146103095780638456cb591461031257600080fd5b8063334d0bbd1461028a57806334c54230146102bd5780633ec89e69146102d05780633f4ba83a146102e357600080fd5b80631a848e01116101b85780631a848e011461024657806331873e2e1461024f57806332a9caba14610264578063332875641461027757600080fd5b8063081e3eda146101df5780630f208beb146101f657806317caf6f11461023d575b600080fd5b609c545b6040519081526020015b60405180910390f35b610228610204366004611618565b609f6020908152600092835260408084209091529082529020805460019091015482565b604080519283526020830191909152016101ed565b6101e360a15481565b6101e3609a5481565b61026261025d366004611651565b6104be565b005b610262610272366004611686565b610688565b610262610285366004611618565b61078e565b61029d6102983660046116b2565b6107e6565b604080516001600160801b039384168152929091166020830152016101ed565b6102626102cb366004611717565b61081b565b6102626102de366004611857565b61091f565b610262610b3e565b60335460ff1660405190151581526020016101ed565b610262610b50565b6101e360a25481565b610262610b62565b6101e3609b5481565b6065546001600160a01b03165b6040516001600160a01b0390911681526020016101ed565b6102626103563660046118e8565b610b72565b6103306103693660046116b2565b610cde565b6103b461037c36600461193d565b609d6020526000908152604090208054600182015460028301546003840154600490940154929391929091906001600160a01b031685565b6040805195865260208601949094529284019190915260608301526001600160a01b0316608082015260a0016101ed565b609854610330906001600160a01b031681565b61026261040636600461195a565b610d08565b610262610e17565b6101e361042136600461193d565b60a06020526000908152604090205481565b610262610441366004611618565b610e32565b609754610330906001600160a01b031681565b61033061046736600461193d565b60a3602052600090815260409020546001600160a01b031681565b6104956104903660046118e8565b610e90565b6040516101ed91906119be565b6101e360995481565b6102626104b936600461193d565b611033565b336000908152609d6020526040902060028101546104db57600080fd5b6104e36110ac565b6104ef8160a154611178565b336000908152609f602090815260408083206001600160a01b0388168452909152902080546003830154811561059157600183015460009061054a9061054464e8d4a5100061053e878761120f565b90611222565b9061122e565b9050801561058f576001600160a01b038816600090815260a06020526040902054610575908261123a565b6001600160a01b038916600090815260a060205260409020555b505b8583556105a764e8d4a5100061053e888461120f565b600184015584845560048401546001600160a01b0316156106395760048481015460405163ae0b537160e01b815233928101929092526001600160a01b0389811660248401526044830189905260648301889052169063ae0b537190608401600060405180830381600087803b15801561062057600080fd5b505af1158015610634573d6000803e3d6000fd5b505050505b60408051878152602081018790526001600160a01b0389169133917f526824944047da5b81071fb6349412005c5da81380b336103fbe5dd34556c776910160405180910390a350505050505050565b6097546001600160a01b0316331461069f57600080fd5b6001600160a01b0382166000908152609d6020526040902060020154156106c557600080fd5b6106cd6110ac565b60a1546106da908261123a565b60a155609c805460018181019092557faf85b9071dfafeac1409d3f1d19bafc9bc7c37974cde8df0ee6168f0086e539c0180546001600160a01b039485166001600160a01b031991821681179092556040805160a08101825260008082526020828101978852428385019081526060840183815260808501848152978452609d9092529390912091518255955194810194909455516002840155925160038301555160049091018054919093169116179055565b336001600160a01b03831614806107af57506065546001600160a01b031633145b6107b857600080fd5b6001600160a01b03918216600090815260a36020526040902080546001600160a01b03191691909216179055565b609e81815481106107f657600080fd5b6000918252602090912001546001600160801b038082169250600160801b9091041682565b610823611246565b82811461082f57600080fd5b6108376112a0565b60a15460005b84811015610915576000609d600088888581811061085d5761085d611a02565b9050602002016020810190610872919061193d565b6001600160a01b03166001600160a01b03168152602001908152602001600020905060008160020154116108a557600080fd5b6108de8585848181106108ba576108ba611a02565b905060200201356108d883600101548661122e90919063ffffffff16565b9061123a565b92508484838181106108f2576108f2611a02565b90506020020135816001018190555050808061090d90611a2e565b91505061083d565b5060a15550505050565b600054610100900460ff161580801561093f5750600054600160ff909116105b806109595750303b158015610959575060005460ff166001145b6109c15760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084015b60405180910390fd5b6000805460ff1916600117905580156109e4576000805461ff0019166101001790555b6109ec61130a565b6109f4611339565b609780546001600160a01b038087166001600160a01b03199283161790925560988054928616929091169190911790558551805b8015610ae457609e60405180604001604052808a600185610a499190611a49565b81518110610a5957610a59611a02565b60200260200101516001600160801b0316815260200189600185610a7d9190611a49565b81518110610a8d57610a8d611a02565b6020908102919091018101516001600160801b039081169092528354600181018555600094855293819020835193909101518216600160801b02929091169190911791015580610adc81611a60565b915050610a28565b5050609a829055600060a1558015610b36576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b505050505050565b610b46611246565b610b4e611368565b565b610b58611246565b610b4e60006113ba565b610b6a611246565b610b4e61140c565b610b7a611449565b610b826110ac565b6001600160a01b038316600090815260a06020526040812080549082905560a15490915b83811015610ccc576000609d6000878785818110610bc657610bc6611a02565b9050602002016020810190610bdb919061193d565b6001600160a01b03166001600160a01b0316815260200190815260200160002090506000816002015411610c0e57600080fd5b610c188184611178565b6000609f6000888886818110610c3057610c30611a02565b9050602002016020810190610c45919061193d565b6001600160a01b03908116825260208083019390935260409182016000908120918c1681529252812060038401548154919350610c8d9164e8d4a510009161053e919061120f565b9050610cb0610ca983600101548361122e90919063ffffffff16565b879061123a565b6001909201559350819050610cc481611a2e565b915050610ba6565b50610cd7858361148f565b5050505050565b609c8181548110610cee57600080fd5b6000918252602090912001546001600160a01b0316905081565b60005b609e54811015610d5057609e805480610d2657610d26611a77565b60008281526020812082016000199081019190915501905580610d4881611a2e565b915050610d0b565b508151805b8015610e1157609e604051806040016040528086600185610d769190611a49565b81518110610d8657610d86611a02565b60200260200101516001600160801b0316815260200185600185610daa9190611a49565b81518110610dba57610dba611a02565b6020908102919091018101516001600160801b039081169092528354600181018555600094855293819020835193909101518216600160801b02929091169190911791015580610e0981611a60565b915050610d55565b50505050565b610e1f611246565b60a25415610e2c57600080fd5b4260a255565b610e3a611246565b6001600160a01b0382166000908152609d6020526040902060020154610e5f57600080fd5b6001600160a01b039182166000908152609d6020526040902060040180546001600160a01b03191691909216179055565b606060008267ffffffffffffffff811115610ead57610ead611783565b604051908082528060200260200182016040528015610ed6578160200160208202803683370190505b50905060005b8381101561102a576000858583818110610ef857610ef8611a02565b9050602002016020810190610f0d919061193d565b6001600160a01b038082166000908152609d60209081526040808320609f8352818420948d16845293909152902060038201548254600284015494955092939192909142118015610f5d57508015155b15610fcc576000610f7b85600201544261122e90919063ffffffff16565b90506000610fa860a15461053e8860010154610fa26099548761120f90919063ffffffff16565b9061120f565b9050610fc7610fc08461053e8464e8d4a5100061120f565b859061123a565b935050505b610ff4836001015461054464e8d4a5100061053e86886000015461120f90919063ffffffff16565b87878151811061100657611006611a02565b6020026020010181815250505050505050808061102290611a2e565b915050610edc565b50949350505050565b61103b611246565b6001600160a01b0381166110a05760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016109b8565b6110a9816113ba565b50565b609e5460a254158015906110c05750600081115b156110a9576000609e6110d4600184611a49565b815481106110e4576110e4611a02565b6000918252602091829020604080518082019091529101546001600160801b03808216808452600160801b909204169282019290925260a25490925061112b90429061122e565b1115611174576111396112a0565b60208101516001600160801b0316609955609e80548061115b5761115b611a77565b6000828152602081208201600019908101919091550190555b5050565b81600201544211611187575050565b81548061119957505042600290910155565b60006111b284600201544261122e90919063ffffffff16565b905060006111d78461053e8760010154610fa26099548761120f90919063ffffffff16565b90506111fa6111ef8461053e8464e8d4a5100061120f565b60038701549061123a565b60038601555050426002909301929092555050565b600061121b8284611a8d565b9392505050565b600061121b8284611aac565b600061121b8284611a49565b600061121b8284611ace565b6065546001600160a01b03163314610b4e5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016109b8565b60a154609c5460005b81811015611305576112f5609d6000609c84815481106112cb576112cb611a02565b60009182526020808320909101546001600160a01b03168352820192909252604001902084611178565b6112fe81611a2e565b90506112a9565b505050565b600054610100900460ff166113315760405162461bcd60e51b81526004016109b890611ae6565b610b4e611557565b600054610100900460ff166113605760405162461bcd60e51b81526004016109b890611ae6565b610b4e61158a565b6113706115ba565b6033805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b606580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b611414611449565b6033805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25861139d3390565b60335460ff1615610b4e5760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b60448201526064016109b8565b609b54609a5461149f828461123a565b11156114b557609a546114b2908261122e565b91505b8115611305576114c5818361123a565b609b556001600160a01b03808416600090815260a3602052604090205416806114eb5750825b6098546040516340c10f1960e01b81526001600160a01b03838116600483015260248201869052909116906340c10f1990604401600060405180830381600087803b15801561153957600080fd5b505af115801561154d573d6000803e3d6000fd5b5050505050505050565b600054610100900460ff1661157e5760405162461bcd60e51b81526004016109b890611ae6565b6033805460ff19169055565b600054610100900460ff166115b15760405162461bcd60e51b81526004016109b890611ae6565b610b4e336113ba565b60335460ff16610b4e5760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b60448201526064016109b8565b6001600160a01b03811681146110a957600080fd5b6000806040838503121561162b57600080fd5b823561163681611603565b9150602083013561164681611603565b809150509250929050565b60008060006060848603121561166657600080fd5b833561167181611603565b95602085013595506040909401359392505050565b6000806040838503121561169957600080fd5b82356116a481611603565b946020939093013593505050565b6000602082840312156116c457600080fd5b5035919050565b60008083601f8401126116dd57600080fd5b50813567ffffffffffffffff8111156116f557600080fd5b6020830191508360208260051b850101111561171057600080fd5b9250929050565b6000806000806040858703121561172d57600080fd5b843567ffffffffffffffff8082111561174557600080fd5b611751888389016116cb565b9096509450602087013591508082111561176a57600080fd5b50611777878288016116cb565b95989497509550505050565b634e487b7160e01b600052604160045260246000fd5b80356001600160801b03811681146117b057600080fd5b919050565b600082601f8301126117c657600080fd5b8135602067ffffffffffffffff808311156117e3576117e3611783565b8260051b604051601f19603f8301168101818110848211171561180857611808611783565b60405293845285810183019383810192508785111561182657600080fd5b83870191505b8482101561184c5761183d82611799565b8352918301919083019061182c565b979650505050505050565b600080600080600060a0868803121561186f57600080fd5b853567ffffffffffffffff8082111561188757600080fd5b61189389838a016117b5565b965060208801359150808211156118a957600080fd5b506118b6888289016117b5565b94505060408601356118c781611603565b925060608601356118d781611603565b949793965091946080013592915050565b6000806000604084860312156118fd57600080fd5b833561190881611603565b9250602084013567ffffffffffffffff81111561192457600080fd5b611930868287016116cb565b9497909650939450505050565b60006020828403121561194f57600080fd5b813561121b81611603565b6000806040838503121561196d57600080fd5b823567ffffffffffffffff8082111561198557600080fd5b611991868387016117b5565b935060208501359150808211156119a757600080fd5b506119b4858286016117b5565b9150509250929050565b6020808252825182820181905260009190848201906040850190845b818110156119f6578351835292840192918401916001016119da565b50909695505050505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000600019821415611a4257611a42611a18565b5060010190565b600082821015611a5b57611a5b611a18565b500390565b600081611a6f57611a6f611a18565b506000190190565b634e487b7160e01b600052603160045260246000fd5b6000816000190483118215151615611aa757611aa7611a18565b500290565b600082611ac957634e487b7160e01b600052601260045260246000fd5b500490565b60008219821115611ae157611ae1611a18565b500190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b60608201526080019056fea264697066735822122093ca932478648397e70a148f427ca54fa0a1e76230bc35e3a8a216707e1fecb364736f6c634300080c0033";
