import { useEffect, useState } from "react";
import { getHistory } from "../api/api";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

// Destructure the refreshTrigger prop from the parent
export default function RiskChart({ refreshTrigger }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHistory(100);
        
        const counts = { LOW: 0, MEDIUM: 0, HIGH: 0 };
        
        // Guard checking just in case data isn't loaded or formatted correctly yet
        if (res.data && Array.isArray(res.data)) {
          res.data.forEach((d) => {
            // Normalize case in case your backend passes "High" or "HIGH"
            const level = (d.risk_level || "LOW").toUpperCase();
            if (counts[level] !== undefined) {
              counts[level]++;
            }
          });
        }

        setData([
          { name: "LOW", value: counts.LOW },
          { name: "MEDIUM", value: counts.MEDIUM },
          { name: "HIGH", value: counts.HIGH }
        ]);
      } catch (err) {
        console.error("Failed to update Risk Chart telemetry data:", err);
      }
    };

    fetchData();
  // 2. ✨ Track the parent trigger so the charts redraw automatically
  }, [refreshTrigger]); 

  return (
    <div className="section" style={{ width: "100%", boxSizing: "border-box" }}>
      <h3 style={{ textAlign: "center" }}>Risk Distribution</h3>

      {/* ✨ 3. Flexbox container wrapper to center align your chart canvas */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
        <PieChart width={400} height={300}>
          <Pie data={data} dataKey="value" label cx="50%" cy="50%" outerRadius={100}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}