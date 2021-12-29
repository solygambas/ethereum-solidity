import Link from "next/link";
import { Button, Table } from "semantic-ui-react";

import getCampaign from "../../../../ethereum/campaign";
import Layout from "../../../../components/Layout";
import RequestRow from "../../../../components/RequestRow";

function RequestIndex({ id, requests, requestCount, approversCount }) {
  const { Header, Row, HeaderCell, Body } = Table;
  return (
    <Layout>
      <Link href={`/campaigns/${id}`}>
        <a>Back</a>
      </Link>
      <h3>Requests</h3>
      <Link href={`/campaigns/${id}/requests/new`}>
        <a>
          <Button primary floated="right" style={{ marginBottom: 10 }}>
            Add Request
          </Button>
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
            <RequestRow
              key={index}
              request={request}
              address={id}
              id={index}
              approversCount={approversCount}
            />
          ))}
        </Body>
      </Table>
      <div>Found {requestCount} requests</div>
    </Layout>
  );
}

RequestIndex.getInitialProps = async (ctx) => {
  const { id } = ctx.query;
  const campaign = getCampaign(id);
  const requestCount = await campaign.methods.getRequestsCount().call();
  const approversCount = await campaign.methods.approversCount().call();
  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );
  return { id, requests, requestCount, approversCount };
};

export default RequestIndex;
