// Reference: https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";

const initWeb3 = async () => {
  let web3 = null;
  // Get the provider
  const provider = await detectEthereumProvider({ mustBeMetaMask: true });
  if (provider) {
    console.log("MetaMask Ethereum Provider successfully detected");
    const { ethereum } = window;
    // Handle changes and disconnect
    ethereum.on("chainChanged", (_chainId) => window.location.reload());
    ethereum.on("disconnect", (_error) => window.location.reload());
  } else {
    console.log("Please install Metamask!");
  }
  return web3;
};

export default initWeb3;
