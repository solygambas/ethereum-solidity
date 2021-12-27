import { useRouter } from "next/router";
import { Card } from "semantic-ui-react";

import Layout from "../../components/Layout";
import getCampaign from "../../ethereum/campaign";

const CampaignShow = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const {
    balance,
    manager,
    minimumContribution,
    requestsCount,
    approversCount,
  } = props;
  const items = [
    {
      header: manager,
      meta: "Address of Manager",
      description:
        "The manager created this campaign and can create requests to withdraw money",
      style: { overflowWrap: "break-word" },
    },
  ];

  return (
    <Layout>
      <h3>Campaign: {id}</h3>
      <Card.Group items={items} />
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
