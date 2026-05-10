pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";

template VaccinationProof() {
    // Private inputs
    signal input childDID;         // Child's decentralized ID (secret)
    signal input recordSalt;       // Random salt for the record hash
    signal input vaccineId;        // ID of the vaccine (e.g., 1 for Measles)
    signal input doseNumber;       // Dose number (e.g., 1)
    
    // Public inputs
    signal input recordHash;       // The hash stored on blockchain: Poseidon(childDID, vaccineId, doseNumber, recordSalt)
    signal input targetVaccineId;  // The vaccine we are proving status for
    
    // 1. Verify the record matches the hash on chain
    component hasher = Poseidon(4);
    hasher.inputs[0] <== childDID;
    hasher.inputs[1] <== vaccineId;
    hasher.inputs[2] <== doseNumber;
    hasher.inputs[3] <== recordSalt;
    
    hasher.out === recordHash;
    
    // 2. Verify the vaccineId matches the target we are proving
    component eq = IsEqual();
    eq.in[0] <== vaccineId;
    eq.in[1] <== targetVaccineId;
    
    eq.out === 1;
}

component main { public [recordHash, targetVaccineId] } = VaccinationProof();
