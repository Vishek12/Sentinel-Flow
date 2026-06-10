import { useEffect, useState } from "react";
import { getHistory } from "../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function FraudChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getHistory(50);
      setData(res.data);
    };

    fetchData();
  }, []);

  return (
    <div className="section">
      <h3>Fraud Probability Distribution</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="fraud_probability" fill="#38bdf8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}