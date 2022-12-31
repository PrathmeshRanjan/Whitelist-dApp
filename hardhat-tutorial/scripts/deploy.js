const { ethers } = require("hardhat");

async function main() {
  const whitelistContract = await ethers.getContractFactory("Whitelist");

  const deployedwhitelistContract = await whitelistContract.deploy(10);

  await deployedwhitelistContract.deployed();

  console.log("Whitelist Contract Address", deployedwhitelistContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});