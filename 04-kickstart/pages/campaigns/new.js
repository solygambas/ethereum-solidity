import { useState } from "react";
import { Button, Form, Input } from "semantic-ui-react";

import Layout from "../../components/Layout";

function CampaignNew() {
  const [minimumContribution, setMinimumContribution] = useState("");
  return (
    <Layout title="Create a Campaign">
      <h3>Create a Campaign</h3>
      <Form>
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
