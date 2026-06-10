import "./App.css";
import MetricsDashboard from "./components/MetricsDashboard";
import FraudChart from "./components/FraudChart";
import RiskChart from "./components/RiskChart";
import PredictForm from "./components/PredictionForm";
import History from "./components/History";

///Users/visheklamba/Desktop/SentinelFlow/frontend/sentinelflow-ui/src/components

export default function App() {
  return (
    <div className="container">
      <div className="header">SentinelFlow Fraud Dashboard</div>

      <MetricsDashboard />

      <FraudChart />
      <RiskChart />

      <PredictForm />

      <History />
    </div>
  );
}