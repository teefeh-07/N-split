
import { openContractCall } from '@stacks/connect';
import { 
  StacksNetwork, 
  PostConditionMode, 
  AnchorMode,
  ClarityValue
} from '@stacks/transactions';

export interface ContractCallOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  network: StacksNetwork;
  postConditions?: any[];
  postConditionMode?: PostConditionMode;
  onFinish?: (data: any) => void;
  onCancel?: () => void;
}

export async function callContract(options: ContractCallOptions) {
  const {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network,
    postConditions = [],
    postConditionMode = PostConditionMode.Deny,
    onFinish,
    onCancel
  } = options;

  await openContractCall({
    network,
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    postConditions,
    postConditionMode,
    anchorMode: AnchorMode.Any,
    onFinish,
    onCancel,
  });
}
