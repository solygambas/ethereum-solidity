// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

// local deployment
// 1) to run our node: npx hardhat node
// 2) to deploy locally: npx hardhat run scripts/deploy.js --network localhost
// 3) use metamask to connect to local network and import one of the given accounts with its private key

// deployment to Matic Mumbai Testnet
// 1) add Matic Mumbai Testnet to MetaMask https://docs.polygon.technology/docs/develop/network-details/network
// 2) send Matic to your account https://faucet.polygon.technology/
// 3) run: npx hardhat run scripts/deploy.js --network mumbai

const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contracts to deploy
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftmarket = await NFTMarket.deploy();
  await nftmarket.deployed();
  console.log("NFTMarket deployed to:", nftmarket.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftmarket.address);
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
