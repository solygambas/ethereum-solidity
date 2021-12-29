import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "semantic-ui-react";

import Layout from "../../../../components/Layout";

function RequestIndex() {
  const router = useRouter();
  const { id } = router.query;
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

export default RequestIndex;
