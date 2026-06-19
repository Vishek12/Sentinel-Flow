import { useEffect, useState } from "react";
import { getHistory } from "../api/api";

export default function History() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHistory(20);
        // Safely ensure data is always parsed as an array
        setData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to retrieve transactional evaluation logs:", err);
        setError("Unable to process historical pipeline records.");
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <div style={{ padding: "1rem", color: "#ef4444", fontFamily: "system-ui" }}>
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "system-ui, sans-serif", border: "1px solid #eaeaea", borderRadius: "8px", background: "#fff" }}>
      <h2 style={{ margin: "0 0 1.5rem 0", color: "#1a202c" }}>📜 Evaluation Logging History</h2>

      {data.length === 0 ? (
        <p style={{ color: "#64748b" }}>No historical evaluations logged in this session session.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #edf2f7", color: "#718096", fontSize: "0.85rem" }}>
                <th style={{ padding: "0.75rem" }}>INDEX</th>
                <th style={{ padding: "0.75rem" }}>AMOUNT</th>
                <th style={{ padding: "0.75rem" }}>FRAUD PROBABILITY</th>
                <th style={{ padding: "0.75rem" }}>RISK SEVERITY</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                // Formatting the decimal probabilities into clean, readable percentages
                const formattedProb = row.fraud_probability !== undefined 
                  ? `${(row.fraud_probability * 100).toFixed(1)}%` 
                  : "N/A";
                
                const isHighRisk = row.risk_level === "High" || row.risk_level === "High Risk";

                return (
                  <tr key={row.transaction_id || row.id || idx} style={{ borderBottom: "1px solid #edf2f7", fontSize: "0.95rem", color: "#2d3748" }}>
                    <td style={{ padding: "0.75rem", fontFamily: "monospace", color: "#a0aec0" }}>
                      #{row.transaction_id || row.id || idx + 1}
                    </td>
                    <td style={{ padding: "0.75rem", fontWeight: "600" }}>
                      ${row.amount !== undefined ? parseFloat(row.amount).toFixed(2) : "0.00"}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {formattedProb}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span style={{ 
                        padding: "0.2rem 0.5rem", 
                        borderRadius: "4px", 
                        fontSize: "0.8rem", 
                        fontWeight: "bold",
                        background: isHighRisk ? "#fff5f5" : "#f0fff4",
                        color: isHighRisk ? "#c53030" : "#22543d",
                        border: `1px solid ${isHighRisk ? "#feb2b2" : "#c6f6d5"}`
                      }}>
                        {row.risk_level || "Unknown"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}