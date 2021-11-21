import { useEffect, useRef, useState } from "react";
import initWeb3 from "./utils/web3";
import { abi, contractAddress } from "./utils/lottery";
import "./App.css";

const { ethereum } = window;

function App() {
  const lotteryContract = useRef(null);
  const [web3, setWeb3] = useState(null);
  const [checkingMetamask, setCheckingMetamask] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isRinkebyNetwork, setIsRinkebyNetwork] = useState(false);

  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  const [enterLottery, setEnterLottery] = useState(false);
  const [pickWinner, setPickWinner] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initWeb3WithProvider() {
      if (web3 == null) {
        if (!cancelled) {
          setCheckingMetamask(false);
          const web3Instance = await initWeb3();
          setWeb3(web3Instance);
          setCheckingMetamask(true);
          // Transactions done in this app must be done on the Rinkeby test network.
          if (web3Instance) {
            const chainId = await ethereum.request({ method: "eth_chainId" });
            if (chainId === "0x4") {
              setIsRinkebyNetwork(true);
            }
            // Create local contract instance
            lotteryContract.current = new web3Instance.eth.Contract(
              abi,
              contractAddress
            );
            // Check if already connected
            try {
              const accounts = await ethereum.request({
                method: "eth_accounts",
              });
              if (accounts.length > 0 && ethereum.isConnected()) {
                setConnected(true);
              }
            } catch (error) {
              console.error(error);
            }
            // Handle account change
            ethereum.on("accountsChanged", handleAccountsChanged);
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

  useEffect(() => {
    let cancelled = false;
    if (connected) {
      async function initLottery() {
        const manager = await lotteryContract.current.methods.manager().call();
        if (!cancelled) {
          setManager(manager);
          await updatePlayersListAndBalance();
        }
      }
      initLottery();
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  const getAccount = async (_event) => {
    setConnecting(true);
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      setConnecting(false);
    }
  };

  const handleAccountsChanged = (_accounts) => window.location.reload();

  const updatePlayersListAndBalance = async () => {
    const players = await lotteryContract.current.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(
      lotteryContract.current.options.address
    );
    setPlayers(players);
    setBalance(balance);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    showMessage("");
    let enteredValue = parseFloat(value);
    if (isNaN(enteredValue)) {
      setValue("");
      return showMessage("Please enter a number...");
    } else if (enteredValue <= 0.01) {
      console.log(enteredValue);
      return showMessage(
        "The minimum amount must be greater than 0.01 ether..."
      );
    }
    setEnterLottery(true);
    const accounts = await web3.eth.getAccounts();
    showMessage("Waiting on transaction success...");
    await lotteryContract.current.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei(value, "ether") });
    setValue("");
    showMessage("You are now part of the lottery!");
    updatePlayersListAndBalance();
    setEnterLottery(false);
  };

  const onPickWinner = async (e) => {
    e.preventDefault();
    setPickWinner(true);
    const accounts = await web3.eth.getAccounts();
    showMessage("Waiting on transaction success...");
    await lotteryContract.current.methods
      .pickWinner()
      .send({ from: accounts[0] });
    showMessage("A winner has been picked!");
    updatePlayersListAndBalance();
    setPickWinner(false);
  };

  const showMessage = async (msg) => setMessage(msg);

  return (
    <div className="App">
      <div className="test-site-msg">Lottery - Test-Only</div>
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
      {web3 === null && checkingMetamask && (
        <div className="page-center">
          <div className="alert error">
            <h1 className="no-margin-top">Lottery Contract</h1>
            <p className="no-margin">
              MetaMask is required to run this app! Please install MetaMask and
              then refresh this page.
            </p>
          </div>
        </div>
      )}
      {web3 !== null && checkingMetamask && !isRinkebyNetwork && (
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
      {web3 !== null && !connected && isRinkebyNetwork && (
        <div className="page-center">
          <section className="card">
            <h1 className="no-margin-top">Lottery Contract</h1>
            <p>
              Want to try your luck in the lottery? Connect with MetaMask and
              start competing right away!
            </p>
            <div className="center">
              <button
                className="btn primaryBtn"
                type="button"
                onClick={getAccount}
                disabled={connecting}
              >
                Connect with MetaMask
              </button>
            </div>
          </section>
        </div>
      )}
      {web3 !== null && connected && isRinkebyNetwork && (
        <div className="page-center">
          <section className="card">
            <h1 className="no-margin-top">Lottery Contract</h1>
            <p>
              This contract is managed by {manager}.{" "}
              {players.length === 1
                ? ` There is currently ${players.length} person entered, `
                : ` There are currently ${players.length} people entered, `}
              competing to win {web3.utils.fromWei(balance, "ether")} ether!
            </p>
            <hr className="spacey" />
            <form onSubmit={onSubmit}>
              <h4>Want to try your luck?</h4>
              <div>
                <label>Amount of ether to enter:</label>{" "}
                <input
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                />{" "}
                <button
                  className="btn primaryBtn"
                  type="submit"
                  disabled={enterLottery}
                >
                  Enter
                </button>
              </div>
            </form>

            {manager.toLowerCase() === ethereum.selectedAddress && (
              <>
                <hr className="spacey" />

                <h4>Ready to pick a winner?</h4>
                <button
                  className="btn primaryBtn"
                  type="button"
                  onClick={onPickWinner}
                  disabled={pickWinner}
                >
                  Pick a winner!
                </button>
              </>
            )}

            <hr className="spacey" />

            <h2>{message}</h2>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
