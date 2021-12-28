import { useState } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Message } from "semantic-ui-react";

import getCampaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

function ContributeForm({ address }) {
  const router = useRouter();
  const [contribution, setContribution] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
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
  );
}

export default ContributeForm;
