// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface IBitheatRegistry {
    function isCHWRegistered(bytes32 chwDIDHash) external view returns (bool);
}

/**
 * @title ProofOfCare
 * @dev Stores immutable proofs of health care events anchored to child DID hashes.
 * Designed for upgradeability and extreme gas efficiency on Celo.
 */
contract ProofOfCare is Initializable, OwnableUpgradeable {
    struct ProofRecord {
        bytes32 recordHash;
        string campZone;
        string eventType;
        uint256 timestamp;
        bytes32 chwDIDHash;
    }

    IBitheatRegistry public registry;
    mapping(bytes32 => ProofRecord[]) private proofsByChildHash;

    event ProofStored(bytes32 indexed childDIDHash, bytes32 recordHash, uint256 timestamp);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _registryAddress) public initializer {
        __Ownable_init(msg.sender);
        registry = IBitheatRegistry(_registryAddress);
    }

    /**
     * @notice Records a new care event proof.
     * @dev Only authorized CHWs (checked via Registry) can store proofs.
     * @param childDIDHash Hashed DID of the child receiving care.
     * @param recordHash Hashed content of the care event (offline record).
     * @param campZone The zone where the event occurred.
     * @param eventType The type of care provided (e.g., "vaccination").
     * @param chwDIDHash Hashed DID of the CHW providing care.
     */
    function storeProof(
        bytes32 childDIDHash,
        bytes32 recordHash,
        string calldata campZone,
        string calldata eventType,
        bytes32 chwDIDHash
    ) external {
        require(registry.isCHWRegistered(chwDIDHash), "ProofOfCare: Unauthorized CHW");

        proofsByChildHash[childDIDHash].push(ProofRecord({
            recordHash: recordHash,
            campZone: campZone,
            eventType: eventType,
            timestamp: block.timestamp,
            chwDIDHash: chwDIDHash
        }));

        emit ProofStored(childDIDHash, recordHash, block.timestamp);
    }

    /**
     * @notice Retrieves all proofs for a given child.
     * @param childDIDHash Hashed DID of the child.
     * @return ProofRecord[] Array of proof records.
     */
    function getProofs(bytes32 childDIDHash) external view returns (ProofRecord[] memory) {
        return proofsByChildHash[childDIDHash];
    }

    /**
     * @notice Verifies if a specific record hash exists for a child.
     * @param childDIDHash Hashed DID of the child.
     * @param recordHash Hash to verify.
     * @return bool True if record exists.
     */
    function verifyProof(bytes32 childDIDHash, bytes32 recordHash) external view returns (bool) {
        ProofRecord[] storage proofs = proofsByChildHash[childDIDHash];
        for (uint i = 0; i < proofs.length; i++) {
            if (proofs[i].recordHash == recordHash) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Updates the registry address if needed.
     * @param _newRegistry Address of the new BitheatRegistry.
     */
    function updateRegistry(address _newRegistry) external onlyOwner {
        registry = IBitheatRegistry(_newRegistry);
    }
}
