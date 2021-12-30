import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Form, Input, Message } from "semantic-ui-react";

import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import Layout from "../../components/Layout";

function CampaignNew() {
  const router = useRouter();
  const [minimumContribution, setMinimumContribution] = useState("");
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
    setErrorMessage("");
    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(minimumContribution)
        .send({ from: accounts[0] });
      router.push("/");
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
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
    <Layout title="Create a Campaign">
      <h3>Create a Campaign</h3>
      {!checkingMetaMask && (
        <p>
          MetaMask is required to create a campaign! Please install MetaMask and
          then refresh this page.
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
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={minimumContribution}
              onChange={(e) => setMinimumContribution(e.target.value)}
            />
          </Form.Field>
          <Message error header="Oops!" content={errorMessage} />
          <Button type="submit" primary loading={loading}>
            Create
          </Button>
        </Form>
      )}
    </Layout>
  );
}

export default CampaignNew;
