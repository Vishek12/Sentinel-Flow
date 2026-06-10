import { useEffect, useState } from "react";
import { getMetrics } from "../api/api";
import MetricCard from "./MetricCard";

export default function MetricsDashboard() {
  const [m, setM] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getMetrics();
      setM(res.data);
    };

    fetchData();
  }, []);

  if (!m) return <p>Loading...</p>;

  return (
    <div className="grid">
      <MetricCard title="Total Requests" value={m.total_requests} color="#38bdf8" />
      <MetricCard title="Fraud Transactions" value={m.fraud_count} color="#ef4444" />
      <MetricCard title="Normal Transactions" value={m.normal_count} color="#22c55e" />
      <MetricCard title="High Risk" value={m.high_risk} color="#f59e0b" />
    </div>
  );
}