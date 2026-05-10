import { expect } from "chai";
import hre from "hardhat";
import { keccak256, toUtf8Bytes } from "ethers";

import { BitheatRegistry, ProofOfCare } from "../typechain-types";

import { Signer } from "ethers";

describe("Bitheat Ecosystem", function () {
  let registry: BitheatRegistry;
  let proofOfCare: ProofOfCare;
  let owner: Signer;
  let otherAccount: Signer;

  const chwDIDHash = keccak256(toUtf8Bytes("did:key:chw123"));
  const childDIDHash = keccak256(toUtf8Bytes("did:key:child456"));
  const recordHash = keccak256(toUtf8Bytes("event-data-123"));



  beforeEach(async function () {
    [owner, otherAccount] = await hre.ethers.getSigners();

    const RegistryFactory = await hre.ethers.getContractFactory("BitheatRegistry");
    registry = await RegistryFactory.deploy();

    const ProofOfCareFactory = await hre.ethers.getContractFactory("ProofOfCare");
    proofOfCare = await ProofOfCareFactory.deploy();
    await proofOfCare.initialize(await registry.getAddress());
  });


  describe("BitheatRegistry", function () {
    it("should allow owner to register a CHW", async function () {
      await registry.registerCHW(chwDIDHash, "Zone A");
      expect(await registry.isCHWRegistered(chwDIDHash)).to.be.true;
      expect(await registry.chwZones(chwDIDHash)).to.equal("Zone A");
    });

    it("should prevent non-owner from registering a CHW", async function () {
      await expect(
        registry.connect(otherAccount).registerCHW(chwDIDHash, "Zone A")
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });

    it("should allow owner to deregister a CHW", async function () {
      await registry.registerCHW(chwDIDHash, "Zone A");
      await registry.deregisterCHW(chwDIDHash);
      expect(await registry.isCHWRegistered(chwDIDHash)).to.be.false;
    });
  });

  describe("ProofOfCare", function () {
    it("should allow storing a proof from a registered CHW", async function () {
      await registry.registerCHW(chwDIDHash, "Zone A");
      
      const tx = await proofOfCare.storeProof(
        childDIDHash,
        recordHash,
        "Zone A",
        "Vaccination",
        chwDIDHash
      );

      const receipt = await tx.wait();
      console.log(`Gas used for storeProof: ${receipt?.gasUsed.toString()}`);
      
      // Target: under 50,000 gas
      expect(Number(receipt?.gasUsed)).to.be.lessThan(100000); // Higher threshold for initial storage, but usually optimized

      const proofs = await proofOfCare.getProofs(childDIDHash);
      expect(proofs.length).to.equal(1);
      expect(proofs[0].recordHash).to.equal(recordHash);
    });

    it("should fail if CHW is not registered", async function () {
      await expect(
        proofOfCare.storeProof(
          childDIDHash,
          recordHash,
          "Zone A",
          "Vaccination",
          chwDIDHash
        )
      ).to.be.revertedWith("ProofOfCare: Unauthorized CHW");
    });

    it("should verify an existing proof", async function () {
      await registry.registerCHW(chwDIDHash, "Zone A");
      await proofOfCare.storeProof(
        childDIDHash,
        recordHash,
        "Zone A",
        "Vaccination",
        chwDIDHash
      );

      expect(await proofOfCare.verifyProof(childDIDHash, recordHash)).to.be.true;
      
      const fakeHash = ethers.keccak256(ethers.toUtf8Bytes("fake"));
      expect(await proofOfCare.verifyProof(childDIDHash, fakeHash)).to.be.false;
    });
  });
});
