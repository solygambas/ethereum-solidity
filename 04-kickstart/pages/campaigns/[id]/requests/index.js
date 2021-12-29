import Link from "next/link";
import { Button, Table } from "semantic-ui-react";

import getCampaign from "../../../../ethereum/campaign";
import Layout from "../../../../components/Layout";
import RequestRow from "../../../../components/RequestRow";

function RequestIndex({ id, requests, requestCount }) {
  const { Header, Row, HeaderCell, Body } = Table;
  return (
    <Layout>
      <h3>Requests</h3>
      <Link href={`/campaigns/${id}/requests/new`}>
        <a>
          <Button primary>Add Request</Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>
          {requests.map((request, index) => (
            <RequestRow key={index} request={request} address={id} id={index} />
          ))}
        </Body>
      </Table>
    </Layout>
  );
}

RequestIndex.getInitialProps = async (ctx) => {
  const { id } = ctx.query;
  const campaign = getCampaign(id);
  const requestCount = await campaign.methods.getRequestsCount().call();
  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );
  return { id, requests, requestCount };
};

export default RequestIndex;
