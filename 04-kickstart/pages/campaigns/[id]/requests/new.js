import { useState } from "react";
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

  return (
    <Layout>
      <Link href={`/campaigns/${id}/requests`}>
        <a>Back</a>
      </Link>
      <h3>Create a Request</h3>
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
    </Layout>
  );
}

export default NewRequest;
