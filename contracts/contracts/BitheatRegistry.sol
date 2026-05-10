// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BitheatRegistry
 * @dev Manages authorized Community Health Workers (CHWs) for the Bitheat ecosystem.
 * Uses hashed DIDs to maintain privacy while ensuring authorization.
 */
contract BitheatRegistry is Ownable {
    mapping(bytes32 => bool) public registeredCHWs;
    mapping(bytes32 => string) public chwZones;

    event CHWRegistered(bytes32 indexed chwDIDHash, string zone);
    event CHWDeregistered(bytes32 indexed chwDIDHash);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Registers a new Community Health Worker.
     * @param chwDIDHash The keccak256 hash of the CHW's Decentralized Identifier (DID).
     * @param zone The camp zone or health facility assigned to the CHW.
     */
    function registerCHW(bytes32 chwDIDHash, string calldata zone) external onlyOwner {
        registeredCHWs[chwDIDHash] = true;
        chwZones[chwDIDHash] = zone;
        emit CHWRegistered(chwDIDHash, zone);
    }

    /**
     * @notice Revokes a CHW's authorization.
     * @param chwDIDHash The keccak256 hash of the CHW's DID.
     */
    function deregisterCHW(bytes32 chwDIDHash) external onlyOwner {
        registeredCHWs[chwDIDHash] = false;
        delete chwZones[chwDIDHash];
        emit CHWDeregistered(chwDIDHash);
    }

    /**
     * @notice Checks if a CHW is currently authorized.
     * @param chwDIDHash The keccak256 hash of the CHW's DID.
     * @return bool True if authorized, false otherwise.
     */
    function isCHWRegistered(bytes32 chwDIDHash) external view returns (bool) {
        return registeredCHWs[chwDIDHash];
    }
}
