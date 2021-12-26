import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // we are in the browser and metamask is running: make sure the same version of web3 is used
  // reference: https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3
  web3 = new Web3(window.ethereum);
} else {
  // we are on the server OR the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    process.env.NEXT_PUBLIC_RINKEBY_ENDPOINT
  );
  web3 = new Web3(provider);
}

export default web3;
