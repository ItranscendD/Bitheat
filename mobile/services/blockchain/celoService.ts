import { 
  createPublicClient, 
  createWalletClient, 
  http, 
  parseAbi, 
  keccak256, 
  stringToBytes 
} from 'viem';
import { celoAlfajores } from 'viem/chains';

// ABI for the ProofOfCare contract
const PROOF_OF_CARE_ABI = parseAbi([
  'function storeProof(bytes32 childDIDHash, bytes32 recordHash, string calldata campZone, string calldata eventType, bytes32 chwDIDHash) external',
  'function getProofs(bytes32 childDIDHash) external view returns (tuple(bytes32 recordHash, string campZone, string eventType, uint256 timestamp, bytes32 chwDIDHash)[])',
  'function verifyProof(bytes32 childDIDHash, bytes32 recordHash) external view returns (bool)'
]);

const PROOF_OF_CARE_ADDRESS = process.env.EXPO_PUBLIC_PROOF_OF_CARE_ADDRESS as `0x${string}`;

/**
 * Creates a public client for Celo Alfajores
 */
export const createCeloClient = () => {
  return createPublicClient({
    chain: celoAlfajores,
    transport: http()
  });
};

/**
 * Stores a proof on the Celo blockchain
 */
export const storeProofOnChain = async (
  walletClient: any, // Viem wallet client
  account: `0x${string}`,
  childDID: string,
  recordHash: string,
  campZone: string,
  eventType: string,
  chwDID: string
) => {
  const publicClient = createCeloClient();
  
  const childDIDHash = keccak256(stringToBytes(childDID));
  const chwDIDHash = keccak256(stringToBytes(chwDID));
  const recHash = recordHash.startsWith('0x') ? (recordHash as `0x${string}`) : keccak256(stringToBytes(recordHash));

  const { request } = await publicClient.simulateContract({
    address: PROOF_OF_CARE_ADDRESS,
    abi: PROOF_OF_CARE_ABI,
    functionName: 'storeProof',
    args: [childDIDHash, recHash, campZone, eventType, chwDIDHash],
    account
  });

  const hash = await walletClient.writeContract(request);
  return hash;
};

/**
 * Verifies if a proof exists on-chain
 */
export const verifyProofOnChain = async (
  childDID: string,
  recordHash: string
): Promise<boolean> => {
  const publicClient = createCeloClient();
  const childDIDHash = keccak256(stringToBytes(childDID));
  const recHash = recordHash.startsWith('0x') ? (recordHash as `0x${string}`) : keccak256(stringToBytes(recordHash));

  const isValid = await publicClient.readContract({
    address: PROOF_OF_CARE_ADDRESS,
    abi: PROOF_OF_CARE_ABI,
    functionName: 'verifyProof',
    args: [childDIDHash, recHash]
  });

  return isValid as boolean;
};

/**
 * Estimates gas cost for storeProof
 */
export const estimateGasCost = async (
  account: `0x${string}`,
  childDID: string,
  recordHash: string,
  campZone: string,
  eventType: string,
  chwDID: string
): Promise<bigint> => {
  const publicClient = createCeloClient();
  const childDIDHash = keccak256(stringToBytes(childDID));
  const chwDIDHash = keccak256(stringToBytes(chwDID));
  const recHash = recordHash.startsWith('0x') ? (recordHash as `0x${string}`) : keccak256(stringToBytes(recordHash));

  const gas = await publicClient.estimateContractGas({
    address: PROOF_OF_CARE_ADDRESS,
    abi: PROOF_OF_CARE_ABI,
    functionName: 'storeProof',
    args: [childDIDHash, recHash, campZone, eventType, chwDIDHash],
    account
  });

  return gas;
};
