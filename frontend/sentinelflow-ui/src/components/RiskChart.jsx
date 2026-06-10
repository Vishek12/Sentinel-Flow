import { useEffect, useState } from "react";
import { getHistory } from "../api/api";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

export default function RiskChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getHistory(100);

      const counts = { LOW: 0, MEDIUM: 0, HIGH: 0 };

      res.data.forEach((d) => {
        counts[d.risk_level]++;
      });

      setData([
        { name: "LOW", value: counts.LOW },
        { name: "MEDIUM", value: counts.MEDIUM },
        { name: "HIGH", value: counts.HIGH }
      ]);
    };

    fetchData();
  }, []);

  return (
    <div className="section">
      <h3>Risk Distribution</h3>

      <PieChart width={400} height={300}>
        <Pie data={data} dataKey="value" label>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}