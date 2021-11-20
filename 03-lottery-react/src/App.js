import { useEffect, useRef, useState } from "react";
import "./App.css";
import initWeb3 from "./utils/web3";

const { ethereum } = window;

function App() {
  const [web3, setWeb3] = useState(null);
  const [checkingMetamask, setCheckingMetamask] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isRinkebyNetwork, setIsRinkebyNetwork] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initWeb3WithProvider() {
      if (web3 == null) {
        if (!cancelled) {
          setCheckingMetamask(false);
          const web3Instance = await initWeb3();
          setWeb3(web3Instance);
          // Transactions done in this app must be done on the Rinkeby test network.
          const chainId = await ethereum.request({ method: "eth_chainId" });
          console.log(chainId);
          if (chainId === "0x4") {
            setIsRinkebyNetwork(true);
            setCheckingMetamask(true);
          } else {
            console.log("false is running");
            setIsRinkebyNetwork(false);
            setCheckingMetamask(true);
          }
          if (web3Instance !== null) {
            // Create contract
          }
        }
      }
    }
    initWeb3WithProvider();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <div className="test-site-msg">Lottery React App - Test-Only</div>
      {web3 === null && !checkingMetamask && (
        <div className="page-center">
          <div className="alert info">
            <h1 className="no-margin-top">Lottery Contract</h1>
            <p className="no-margin">
              Checking for MetaMask Ethereum Provider...
            </p>
          </div>
        </div>
      )}
      {!web3 && checkingMetamask && !isRinkebyNetwork && (
        <div className="page-center">
          <div className="alert error">
            <h1 className="no-margin-top">Lottery Contract</h1>
            <p className="no-margin">
              You must be connected to the <strong>Rinkeby test network</strong>{" "}
              for Ether transactions made via this app.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
