import React from "react";
import { Layout } from "@components/layout";
import { FixtureList } from "@components/index";

const FixturePage: React.FC = () => {
  return (
    <Layout>
      <FixtureList />
    </Layout>
  );
};

export default FixturePage;
