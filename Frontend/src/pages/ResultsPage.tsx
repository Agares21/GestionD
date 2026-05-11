import React from "react";
import { Layout } from "@components/layout";
import { MatchResultsList } from "@components/index";

const ResultsPage: React.FC = () => {
  return (
    <Layout>
      <MatchResultsList />
    </Layout>
  );
};

export default ResultsPage;
