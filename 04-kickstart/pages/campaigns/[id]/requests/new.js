import { useState, useEffect } from "react";
import { Form, Input, Button, Message } from "semantic-ui-react";
import { useRouter } from "next/router";
import Link from "next/link";

import getCampaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import Layout from "../../../../components/Layout";

function NewRequest() {
  const router = useRouter();
  const { id } = router.query;
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
    const campaign = getCampaign(id);
    setLoading(true);
    setErrorMessage("");
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          description,
          web3.utils.toWei(amount, "ether"),
          recipient
        )
        .send({ from: accounts[0] });
      router.push(`/campaigns/${id}/requests`);
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
    <Layout>
      <Link href={`/campaigns/${id}/requests`}>
        <a>Back</a>
      </Link>
      <h3>Create a Request</h3>
      {!checkingMetaMask && (
        <p>
          MetaMask is required to create a request! Please install MetaMask and
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
            <label>Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Value in Ether</label>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </Form.Field>
          <Message error header="Oops!" content={errorMessage} />
          <Button primary loading={loading}>
            Create
          </Button>
        </Form>
      )}
    </Layout>
  );
}

export default NewRequest;
