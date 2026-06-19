import { useEffect, useState } from "react";
import { getHistory } from "../api/api";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

export default function RiskChart({ refreshTrigger }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHistory(100);
        
        const counts = { LOW: 0, MEDIUM: 0, HIGH: 0 };
        
        if (res.data && Array.isArray(res.data)) {
          res.data.forEach((d) => {
            // Robust normalization: looks for risk_level or falls back to standard low
            const rawLevel = d.risk_level || d.risk_score || "LOW";
            const level = String(rawLevel).toUpperCase();
            
            if (level.includes("HIGH")) {
              counts.HIGH++;
            } else if (level.includes("MED") || level.includes("WARN")) {
              counts.MEDIUM++;
            } else {
              counts.LOW++;
            }
          });
        }

        // Map data arrays and filter out categories with 0 entries to keep layout crisp
        const formattedData = [
          { name: "LOW", value: counts.LOW },
          { name: "MEDIUM", value: counts.MEDIUM },
          { name: "HIGH", value: counts.HIGH }
        ].filter(item => item.value > 0);

        setData(formattedData);
      } catch (err) {
        console.error("Failed to update Risk Chart telemetry data:", err);
      }
    };

    fetchData();
  }, [refreshTrigger]); 

  return (
    <div className="section" style={{ width: "100%", boxSizing: "border-box" }}>
      <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Risk Distribution</h3>

      {/* Complete Flexbox centering alignment container */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", minHeight: "300px" }}>
        {data.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>No threat data logged yet</p>
        ) : (
          <PieChart width={400} height={300}>
            <Pie 
              data={data} 
              dataKey="value" 
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              cx="50%" 
              cy="50%" 
              outerRadius={90}
            >
              {data.map((entry, i) => {
                // Keep color index matched with color array positions even when filtered
                let color = COLORS[0]; // Default low green
                if (entry.name === "MEDIUM") color = COLORS[1];
                if (entry.name === "HIGH") color = COLORS[2];
                return <Cell key={`cell-${i}`} fill={color} />;
              })}
            </Pie>
            <Tooltip formatter={(value) => [`${value} Transactions`, "Count"]} />
          </PieChart>
        )}
      </div>
    </div>
  );
}