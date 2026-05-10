import * as snarkjs from 'snarkjs';
import { Asset } from 'expo-asset';

/**
 * Verifies a vaccination proof locally without network access
 */
export async function verifyVaccinationProofLocally(proof: any, publicSignals: string[]): Promise<boolean> {
  try {
    const vkeyAsset = Asset.fromModule(require('../../../assets/zkp/verification_key.json'));
    await vkeyAsset.downloadAsync();
    
    const vkey = await fetch(vkeyAsset.localUri!).then(res => res.json());
    
    const res = await snarkjs.groth16.verify(vkey, publicSignals, proof);
    return res;
  } catch (error) {
    console.error('Local verification failed:', error);
    return false;
  }
}

/**
 * Verifies a vaccination proof on the Celo blockchain
 */
export async function verifyVaccinationProofOnChain(proof: any, publicSignals: string[]): Promise<boolean> {
  // In a real implementation, this would call the ZKPVerifier.sol contract via viem
  // for demo purposes, we simulate the on-chain call
  return new Promise((resolve) => setTimeout(() => resolve(true), 1500));
}
