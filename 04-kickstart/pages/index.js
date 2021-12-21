// import { useEffect } from "react";
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
      description: <a>View Campaign</a>,
      fluid: true,
    };
  });

  return (
    <div>
      <Layout>
        <h3>Open Campaigns</h3>
        <Button
          floated="right"
          content="Create Campaign"
          icon="add circle"
          primary
        />
        <Card.Group items={items} />
      </Layout>
    </div>
  );
}

Home.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { campaigns };
};
