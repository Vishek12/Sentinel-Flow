export default function MetricCard({ title, value, color }) {
  return (
    <div className="card" style={{ borderLeft: `5px solid ${color}` }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}