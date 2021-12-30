import { Table, Button } from "semantic-ui-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import web3 from "../ethereum/web3";
import getCampaign from "../ethereum/campaign";

function RequestRow({ request, address, id, approversCount }) {
  const { Row, Cell } = Table;
  const { description, value, recipient, approvalCount, complete } = request;
  const readyToFinalize = approvalCount > approversCount / 2;
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

  const onApprove = async () => {
    const campaign = getCampaign(address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(id).send({
      from: accounts[0],
    });
  };

  const onFinalize = async () => {
    const campaign = getCampaign(address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequest(id).send({ from: accounts[0] });
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
    <Row disabled={complete} positive={readyToFinalize && !complete}>
      <Cell>{id}</Cell>
      <Cell>{description}</Cell>
      <Cell>{web3.utils.fromWei(value, "ether")}</Cell>
      <Cell>{recipient}</Cell>
      <Cell>
        {approvalCount}/{approversCount}
      </Cell>
      <Cell>
        {checkingMetaMask && isRinkebyNetwork && connected && !complete && (
          <Button color="green" basic onClick={onApprove}>
            Approve
          </Button>
        )}
        {checkingMetaMask && isRinkebyNetwork && connected && complete && null}
      </Cell>
      <Cell>
        {checkingMetaMask && isRinkebyNetwork && connected && !complete && (
          <Button color="teal" basic onClick={onFinalize}>
            Finalize
          </Button>
        )}
        {checkingMetaMask && isRinkebyNetwork && connected && complete && null}
      </Cell>
    </Row>
  );
}

export default RequestRow;
