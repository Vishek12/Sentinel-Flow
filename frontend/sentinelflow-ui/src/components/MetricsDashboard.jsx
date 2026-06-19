import { useEffect, useState } from "react";
import { getMetrics } from "../api/api";
import MetricCard from "./MetricCard";

export default function MetricsDashboard({ refreshTrigger }) {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔄 STATE CHANGE DETECTED: Fetching fresh metrics from API...");
        const res = await getMetrics();
        console.log("📥 RAW METRICS RECEIVED FROM BACKEND:", res.data);
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to fetch system telemetry:", err);
        setError("Unable to load live dashboard data.");
      }
    };
    
    fetchData();
  }, [refreshTrigger]);

  if (error) {
    return (
      <div style={{ padding: "1rem", color: "#ef4444", fontFamily: "system-ui" }}>
          {error}
      </div>
    );
  }

  if (!metrics) return <p style={{ fontFamily: "system-ui", color: "#64748b" }}>Loading dashboard...</p>;

  // ✨ FIXED MAPPING: Directly extracting the exact keys printing in your console!
  const totalRequests = metrics.total_requests || 0;
  const fraudCount = metrics.fraud_count || 0;
  const normalCount = metrics.normal_count || 0;
  
  // Dynamically calculate the fraud percentage rate string
  const fraudPercentageString = totalRequests > 0 
    ? `${((fraudCount / totalRequests) * 100).toFixed(1)}%` 
    : "0.0%";

  return (
    <div className="grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", padding: "1rem" }}>
      <MetricCard title="Total Requests" value={totalRequests} color="#38bdf8" />
      <MetricCard title="Fraud Count" value={fraudCount} color="#ef4444" />
      <MetricCard title="Normal Transactions" value={normalCount} color="#22c55e" />
      <MetricCard title="Aggregate Fraud Rate" value={fraudPercentageString} color="#f59e0b" />
    </div>
  );
}