import { useEffect, useState } from "react";
import { getMetrics } from "../api/api";

export default function Metrics() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMetrics();
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to fetch system telemetry:", err);
        setError("Unable to load live system metrics.");
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <div style={{ padding: "1rem", background: "#fff5f5", color: "#c53030", borderRadius: "6px", border: "1px solid #feb2b2" }}>
         {error}
      </div>
    );
  }

  if (!metrics) return <p style={{ fontFamily: "system-ui, sans-serif", color: "#718096" }}>Loading system telemetry...</p>;

  // Fallback to safe defaults if any specific metrics calculation fields are zero/empty initially
  const totalTx = metrics.total_transactions || 0;
  const fraudRate = metrics.fraud_ratio ? (metrics.fraud_ratio * 100).toFixed(2) : "0.00";

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto 2rem auto", fontFamily: "system-ui, sans-serif", border: "1px solid #eaeaea", borderRadius: "8px", background: "#fff" }}>
      <h2 style={{ margin: "0 0 1.5rem 0", color: "#1a202c", borderBottom: "2px solid #f7fafc", paddingBottom: "0.5rem" }}>
        📊 Real-Time Pipeline Telemetry
      </h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div style={{ background: "#f7fafc", padding: "1.25rem", borderRadius: "6px", border: "1px solid #edf2f7" }}>
          <span style={{ fontSize: "0.85rem", color: "#718096", uppercase: "true", fontWeight: "bold", display: "block", marginBottom: "0.25rem" }}>TOTAL EVALUATIONS</span>
          <span style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#2d3748" }}>{totalTx}</span>
        </div>

        <div style={{ background: "#f7fafc", padding: "1.25rem", borderRadius: "6px", border: "1px solid #edf2f7" }}>
          <span style={{ fontSize: "0.85rem", color: "#718096", uppercase: "true", fontWeight: "bold", display: "block", marginBottom: "0.25rem" }}>AGGREGATE FRAUD RATIO</span>
          <span style={{ fontSize: "1.75rem", fontWeight: "bold", color: fraudTx > 0 ? "#e53e3e" : "#2d3748" }}>{fraudRate}%</span>
        </div>
      </div>
    </div>
  );
}