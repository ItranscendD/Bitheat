import * as snarkjs from 'snarkjs';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export interface ZKPProof {
  proof: any;
  publicSignals: string[];
}

/**
 * Generates a Zero-Knowledge Proof for vaccination status
 * @param inputs Private and Public inputs for the circuit
 */
export async function generateVaccinationProof(inputs: {
  childDID: string;
  recordSalt: string;
  vaccineId: number;
  doseNumber: number;
  recordHash: string;
  targetVaccineId: number;
}): Promise<ZKPProof> {
  try {
    // 1. Load the compiled circuit WASM and proving key
    // These should be bundled in the app binary
    const wasmAsset = Asset.fromModule(require('../../../assets/zkp/vaccinationProof.wasm'));
    const zkeyAsset = Asset.fromModule(require('../../../assets/zkp/vaccinationProof_final.zkey'));
    
    await wasmAsset.downloadAsync();
    await zkeyAsset.downloadAsync();

    // 2. Format inputs for snarkjs
    const snarkInputs = {
      childDID: inputs.childDID,
      recordSalt: inputs.recordSalt,
      vaccineId: inputs.vaccineId,
      doseNumber: inputs.doseNumber,
      recordHash: inputs.recordHash,
      targetVaccineId: inputs.targetVaccineId
    };

    // 3. Generate the proof (Groth16)
    // Note: In a real mobile app, this might be offloaded to a native module or webview
    // if snarkjs is too heavy for the JS engine.
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      snarkInputs,
      wasmAsset.localUri!,
      zkeyAsset.localUri!
    );

    return { proof, publicSignals };
  } catch (error) {
    console.error('Failed to generate ZKP proof:', error);
    throw new Error('Cryptographic proof generation failed');
  }
}
