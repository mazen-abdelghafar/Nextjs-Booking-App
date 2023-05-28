import React from "react";
import Head from "next/head";

import Header from "./Header";
import Footer from "./Footer";

import { ToastContainer } from "react-toastify";
import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ children, title = "Book Best Hotels for your holiday" }) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Book Best Hotels for your holiday" />
        <title>{title}</title>
      </Head>

      <Header />
      <ToastContainer
        theme="colored"
        hideProgressBar={true}
        transition={Slide}
        autoClose={3000}
      />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
