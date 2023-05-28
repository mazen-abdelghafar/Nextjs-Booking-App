import React from "react";
import Layout from "../../../components/layout/Layout";
import NewPasswordComponent from "../../../components/user/NewPassword";

const ResetPasswordPage = () => {
  return (
    <Layout title="Reset Password">
      <NewPasswordComponent />
    </Layout>
  );
};

export default ResetPasswordPage;
