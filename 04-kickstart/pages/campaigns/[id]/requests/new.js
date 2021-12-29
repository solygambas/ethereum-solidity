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
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");

  return (
    <Layout>
      <h3>Create a Request</h3>
      <Form>
        <Form.Field>
          <label
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          >
            Description
          </label>
          <Input />
        </Form.Field>
        <Form.Field>
          <label value={value} onChange={(e) => setValue(e.target.value)}>
            Value in Ether
          </label>
          <Input />
        </Form.Field>
        <Form.Field>
          <label
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          >
            Recipient
          </label>
          <Input />
        </Form.Field>
        <Button primary>Create</Button>
      </Form>
    </Layout>
  );
}

export default NewRequest;
