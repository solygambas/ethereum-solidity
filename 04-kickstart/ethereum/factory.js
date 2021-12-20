import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0x90990a6a64B6Ab2BE5335342e54fCB52c27d512c"
);

export default instance;
