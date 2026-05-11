import React from "react";
import { Layout } from "@components/layout";
import { ReservationCalendar } from "@components/index";

const ReservationsPage: React.FC = () => {
  return (
    <Layout>
      <ReservationCalendar />
    </Layout>
  );
};

export default ReservationsPage;
