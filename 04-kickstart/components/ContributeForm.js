import { Form, Input, Button, Message } from "semantic-ui-react";

function ContributeForm() {
  return (
    <Form>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input label="ether" labelPosition="right" />
      </Form.Field>
      <Button primary>Contribute</Button>
    </Form>
  );
}

export default ContributeForm;
