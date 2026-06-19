import "./App.css";
import MetricsDashboard from "./components/MetricsDashboard";
import FraudChart from "./components/FraudChart";
import RiskChart from "./components/RiskChart";
import PredictForm from "./components/PredictionForm";
import History from "./components/History";
import { useState } from "react";

///Users/visheklamba/Desktop/SentinelFlow/frontend/sentinelflow-ui/src/components

export default function App() {
  
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);
  
  
 return (
    <div className="container">
      <div className="header">SentinelFlow Fraud Dashboard</div>

      {/* The Dashboard recalculates metrics when refreshTrigger increments */}
      <MetricsDashboard refreshTrigger={refreshTrigger} />

      {/* Passing it to your charts ensures your visualizations update instantly too */}
      <FraudChart refreshTrigger={refreshTrigger} />
      <RiskChart refreshTrigger={refreshTrigger} />

      {/* The Form calls triggerRefresh() inside its handleSubmit function upon a 200 OK API response */}
      <PredictForm onPredictionComplete={triggerRefresh} />

      {/* The history log table pulls the 20 newest logs right after a new submission occurs */}
      <History refreshTrigger={refreshTrigger} />
    </div>
  );
}