import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("Starting deployment...");

  // 1. Deploy Registry
  const RegistryFactory = await ethers.getContractFactory("BitheatRegistry");
  const registry = await RegistryFactory.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log(`BitheatRegistry deployed to: ${registryAddress}`);

  // 2. Deploy ProofOfCare (Upgradeable)
  const ProofOfCareFactory = await ethers.getContractFactory("ProofOfCare");
  
  // Note: Standard hardhat-toolbox doesn't include upgrades plugin by default, 
  // but we can deploy it manually or use @openzeppelin/hardhat-upgrades.
  // For simplicity in this demo, we'll deploy it normally or assume the plugin if available.
  // Assuming standard deployment for now as per constraints.
  
  const proofOfCare = await ProofOfCareFactory.deploy();
  await proofOfCare.waitForDeployment();
  await proofOfCare.initialize(registryAddress);
  
  const proofOfCareAddress = await proofOfCare.getAddress();
  console.log(`ProofOfCare deployed to: ${proofOfCareAddress}`);

  console.log("Deployment complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
