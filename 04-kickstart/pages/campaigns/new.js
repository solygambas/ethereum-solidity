import { useState } from "react";
import { Button, Form, Input } from "semantic-ui-react";

import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import Layout from "../../components/Layout";

function CampaignNew() {
  const [minimumContribution, setMinimumContribution] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    await factory.methods
      .createCampaign(minimumContribution)
      .send({ from: accounts[0] });
  };

  return (
    <Layout title="Create a Campaign">
      <h3>Create a Campaign</h3>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minimumContribution}
            onChange={(e) => setMinimumContribution(e.target.value)}
          />
        </Form.Field>
        <Button type="submit" primary>
          Create
        </Button>
      </Form>
    </Layout>
  );
}

export default CampaignNew;
