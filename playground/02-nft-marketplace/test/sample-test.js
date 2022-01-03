// run: npx hardhat test

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContactAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("100", "ether");

    // create 2 NFTs
    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");

    await market.createMarketItem(nftContactAddress, 1, auctionPrice, {
      value: listingPrice,
    });
    await market.createMarketItem(nftContactAddress, 2, auctionPrice, {
      value: listingPrice,
    });

    // generate fake accounts
    const [_, buyerAddress] = await ethers.getSigners(); // first address is the seller

    await market
      .connect(buyerAddress)
      .createMarketSale(nftContactAddress, 1, { value: auctionPrice });

    const items = await market.fetchMarketItems();

    console.log("items: ", items);
  });
});
