import { useRouter } from "next/router";

import Layout from "../../components/Layout";
import getCampaign from "../../ethereum/campaign";

const CampaignShow = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <h3>Campaign: {id}</h3>
    </Layout>
  );
};

CampaignShow.getInitialProps = async (ctx) => {
  const campaign = getCampaign(ctx.query.id);
  const summary = await campaign.methods.getSummary().call();
  return {
    minimumContribution: summary[0],
    balance: summary[1],
    requestsCount: summary[2],
    approversCount: summary[3],
    manager: summary[4],
  };
};

export default CampaignShow;
