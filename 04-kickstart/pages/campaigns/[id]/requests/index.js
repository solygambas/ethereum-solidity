import Link from "next/link";
import { Button } from "semantic-ui-react";

import getCampaign from "../../../../ethereum/campaign";
import Layout from "../../../../components/Layout";

function RequestIndex({ id, requests, requestCount }) {
  return (
    <Layout>
      <h3>Requests</h3>
      <Link href={`/campaigns/${id}/requests/new`}>
        <a>
          <Button primary>Add Request</Button>
        </a>
      </Link>
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
