import { useRouter } from "next/router";
import Layout from "../../components/Layout";

const Campaign = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <h3>Campaign: {id}</h3>
    </Layout>
  );
};

Campaign.getInitialProps = async (ctx) => {
  console.log(ctx.query.id);
  return {};
};

export default Campaign;
