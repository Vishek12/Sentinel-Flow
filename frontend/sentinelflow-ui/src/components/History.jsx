import { useEffect, useState } from "react";
import { getHistory } from "../api/api";

// 1. ✨ Add 'refreshTrigger' to the parameters so the table auto-updates!
export default function History({ refreshTrigger }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHistory(20);
        setData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to retrieve transactional evaluation logs:", err);
        setError("Unable to process historical pipeline records.");
      }
    };
    fetchData();
    // 2. ✨ Link the refresh trigger to the tracking hook array
  }, [refreshTrigger]); 

  if (error) {
    return (
      <div style={{ padding: "1rem", color: "#ef4444", fontFamily: "system-ui" }}>
        ⚠️ {error}
      </div>
    );
  }

  return (
    // Styled beautifully to match your App.css deep slate dark aesthetic
    <div className="section" style={{ padding: "2rem", width: "100%", boxSizing: "border-box" }}>
      <h3 style={{ margin: "0 0 1.5rem 0" }}>📜 Evaluation Logging History</h3>

      {data.length === 0 ? (
        <p style={{ color: "#64748b" }}>No historical evaluations logged in this session.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "#94a3b8", fontSize: "0.85rem" }}>
                <th style={{ padding: "1rem 0.75rem" }}>INDEX</th>
                <th style={{ padding: "1rem 0.75rem" }}>AMOUNT</th>
                <th style={{ padding: "1rem 0.75rem" }}>FRAUD PROBABILITY</th>
                <th style={{ padding: "1rem 0.75rem" }}>RISK SEVERITY</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const formattedProb = row.fraud_probability !== undefined 
                  ? `${(row.fraud_probability * 100).toFixed(1)}%` 
                  : "N/A";
                
                // 3. ✨ DYNAMIC SEVERITY BADGES LOOKUP 
                const rawLevel = (row.risk_level || "LOW").toUpperCase();
                
                let badgeStyles = {
                  background: "rgba(34, 197, 94, 0.1)", // Green tint
                  color: "#22c55e",
                  border: "1px solid rgba(34, 197, 94, 0.2)"
                };

                if (rawLevel.includes("HIGH")) {
                  badgeStyles = {
                    background: "rgba(239, 68, 68, 0.1)", // Red tint
                    color: "#ef4444",
                    border: "1px solid rgba(239, 68, 68, 0.2)"
                  };
                } else if (rawLevel.includes("MED") || rawLevel.includes("WARN")) {
                  badgeStyles = {
                    background: "rgba(245, 158, 11, 0.1)", // Orange/Yellow tint
                    color: "#f59e0b",
                    border: "1px solid rgba(245, 158, 11, 0.2)"
                  };
                }

                return (
                  <tr key={row.transaction_id || row.id || idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)", fontSize: "0.95rem", color: "#e2e8f0" }}>
                    <td style={{ padding: "1rem 0.75rem", fontFamily: "'JetBrains Mono', monospace", color: "#64748b" }}>
                      #{row.transaction_id || row.id || idx + 1}
                    </td>
                    <td style={{ padding: "1rem 0.75rem", fontWeight: "600", fontFamily: "'JetBrains Mono', monospace" }}>
                      ${row.amount !== undefined ? parseFloat(row.amount).toFixed(2) : "0.00"}
                    </td>
                    <td style={{ padding: "1rem 0.75rem", fontFamily: "'JetBrains Mono', monospace" }}>
                      {formattedProb}
                    </td>
                    <td style={{ padding: "1rem 0.75rem" }}>
                      <span style={{ 
                        padding: "0.3rem 0.6rem", 
                        borderRadius: "6px", 
                        fontSize: "0.75rem", 
                        fontWeight: "600",
                        letterSpacing: "0.03em",
                        display: "inline-block",
                        ...badgeStyles
                      }}>
                        {(row.risk_level || "Low").toUpperCase()}
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