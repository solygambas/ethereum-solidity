// import { useEffect } from "react";
import Link from "next/link";
import { Card, Button } from "semantic-ui-react";

import Layout from "../components/Layout";
import factory from "../ethereum/factory";

export default function Home({ campaigns }) {
  // useEffect(() => {
  //   const getCampaigns = async () => {
  //     const campaigns = await factory.methods.getDeployedCampaigns().call();
  //     console.log(campaigns);
  //   };
  //   getCampaigns();
  // }, []);
  const items = campaigns.map((address) => {
    return {
      header: address,
      description: (
        <Link href={`/campaigns/${address}`}>
          <a>View Campaign</a>
        </Link>
      ),
      fluid: true,
    };
  });

  return (
    <div>
      <Layout>
        <h3>Open Campaigns</h3>
        <Link href="/campaigns/new">
          <a>
            <Button
              floated="right"
              content="Create Campaign"
              icon="add circle"
              primary
            />
          </a>
        </Link>
        <Card.Group items={items} />
      </Layout>
    </div>
  );
}

Home.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { campaigns };
};
