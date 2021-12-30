import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Message } from "semantic-ui-react";

import getCampaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

function ContributeForm({ address }) {
  const router = useRouter();
  const [contribution, setContribution] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingMetaMask, setCheckingMetaMask] = useState(false);
  const [isRinkebyNetwork, setIsRinkebyNetwork] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const getAccount = async () => {
    setConnecting(true);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      router.reload();
    } catch (error) {
      setConnecting(false);
    }
  };

  const handleAccountsChanged = (_accounts) => router.reload();

  const onSubmit = async (e) => {
    e.preventDefault();
    const campaign = getCampaign(address);
    setErrorMessage("");
    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contribution, "ether"),
      });
      router.replace(`/campaigns/${address}`);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
    setContribution("");
  };

  useEffect(() => {
    let cancelled = false;
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      setCheckingMetaMask(true);
      const { ethereum } = window;
      const checkRinkeby = async () => {
        if (!cancelled) {
          const chainId = await ethereum.request({
            method: "eth_chainId",
          });
          if (chainId === "0x4") {
            setIsRinkebyNetwork(true);
            const accounts = await ethereum.request({
              method: "eth_accounts",
            });
            if (accounts.length > 0 && ethereum.isConnected()) {
              setConnected(true);
            }
          }
          ethereum.on("accountsChanged", handleAccountsChanged);
        }
      };
      checkRinkeby();
    } else {
      setCheckingMetaMask(false);
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!checkingMetaMask && (
        <p>
          MetaMask is required to contribute to this campaign! Please install
          MetaMask and then refresh this page.
        </p>
      )}
      {checkingMetaMask && !isRinkebyNetwork && (
        <p>
          You must be connected to the <strong>Rinkeby test network</strong> for
          Ether transactions made via this app.
        </p>
      )}
      {checkingMetaMask && isRinkebyNetwork && !connected && (
        <Button onClick={getAccount} disabled={connecting}>
          Connect with MetaMask
        </Button>
      )}
      {checkingMetaMask && isRinkebyNetwork && connected && (
        <Form onSubmit={onSubmit} error={!!errorMessage}>
          <Form.Field>
            <label>Amount to Contribute</label>
            <Input
              label="ether"
              labelPosition="right"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
            />
          </Form.Field>
          <Message error header="Oops!" content={errorMessage} />
          <Button primary loading={loading}>
            Contribute
          </Button>
        </Form>
      )}
    </>
  );
}

export default ContributeForm;
