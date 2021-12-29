import { useRouter } from "next/router";
import { Card, Grid, Button } from "semantic-ui-react";
import Link from "next/link";

import ContributeForm from "../../../components/ContributeForm";
import Layout from "../../../components/Layout";
import getCampaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";

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
    {
      header: minimumContribution,
      meta: "Minimum Contribution (wei)",
      description:
        "You must contribute at least this much wei to become an approver",
    },
    {
      header: requestsCount,
      meta: "Number of Requests",
      description:
        "A request tries to withdraw money from the contract. Requests must be approved by approvers",
    },
    {
      header: approversCount,
      meta: "Number of Approvers",
      description: "Number of people who have already donated to this campaign",
    },
    {
      header: web3.utils.fromWei(balance, "ether"),
      meta: "Campaign Balance (ether)",
      description:
        "The balance is how much money this campaign has left to spend",
    },
  ];

  return (
    <Layout>
      <h3>Campaign Details: {id}</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={id} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${id}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
