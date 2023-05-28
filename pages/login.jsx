import Layout from "../components/layout/Layout";
import LoginComponent from "../components/auth/Login";
import { getSession } from "next-auth/react";

export default function LoginPage() {
  return (
    <Layout title="Login">
      <LoginComponent />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
