import { useEffect } from "react";
import Layout from "../components/Layout";
import StatsCards from "../components/StatsCards";
import RigForm from "../components/RigForm";
import AlertFeed from "../components/AlertFeed";
import RigList from "../components/RigList";
import { useWebSocket } from "../hooks/useWebSocket";

export default function Dashboard() {
  useWebSocket();

  return (
    <Layout>
      <StatsCards />
      <RigForm />
      <AlertFeed />
      <RigList />
    </Layout>
  );
}
