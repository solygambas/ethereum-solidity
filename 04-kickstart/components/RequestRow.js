import { Table, Button } from "semantic-ui-react";

import web3 from "../ethereum/web3";
import getCampaign from "../ethereum/campaign";

function RequestRow({ request, address, id, approversCount }) {
  const { Row, Cell } = Table;
  const { description, value, recipient, approvalCount } = request;

  const onApprove = async () => {
    const campaign = getCampaign(address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(id).send({
      from: accounts[0],
    });
  };

  return (
    <Row>
      <Cell>{id}</Cell>
      <Cell>{description}</Cell>
      <Cell>{web3.utils.fromWei(value, "ether")}</Cell>
      <Cell>{recipient}</Cell>
      <Cell>
        {approvalCount}/{approversCount}
      </Cell>
      <Cell>
        <Button color="green" basic onClick={onApprove}>
          Approve
        </Button>
      </Cell>
    </Row>
  );
}

export default RequestRow;
