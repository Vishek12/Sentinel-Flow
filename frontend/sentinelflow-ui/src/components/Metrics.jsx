import { useEffect, useState } from "react";
import { getMetrics } from "../api/api";

export default function Metrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getMetrics();
      setMetrics(res.data);
    };

    fetchData();
  }, []);

  if (!metrics) return <p>Loading metrics...</p>;

  return (
    <div style={{ padding: 20, border: "1px solid #ddd", marginBottom: 20 }}>
      <h2>System Metrics</h2>
      <p>Total Requests: {metrics.total_requests}</p>
      <p>Fraud Detected: {metrics.fraud_detected}</p>
      <p>Normal Transactions: {metrics.normal_transactions}</p>
      <p>High Risk Alerts: {metrics.high_risk_alerts}</p>
    </div>
  );
}