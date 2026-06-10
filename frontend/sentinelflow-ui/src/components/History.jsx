import { useEffect, useState } from "react";
import { getHistory } from "../api/api";

export default function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getHistory(20);
      setData(res.data);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: 20, border: "1px solid #ddd" }}>
      <h2>Prediction History</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Probability</th>
            <th>Risk</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.fraud_probability}</td>
              <td>{row.risk_level}</td>
              <td>{row.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}