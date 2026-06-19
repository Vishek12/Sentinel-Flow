import { useState } from "react";
import { predictTransaction } from "../api/api";

export default function PredictForm({ onPredictionComplete }){
  const [formData, setFormData] = useState({
    amount: "15.99",
    merchant: "Spotify_Premium",
    merchant_category: "Entertainment_Tickets",
    country: "US",
    is_international: false,
    device_type: "Tablet",
    new_device: false,
    account_age_days: "310",
    transactions_last_hour: "0",
    total_spent_today: "15.99",
    time_of_day: "Night",
    vpn_detected: false,
    email_verified: true,
    phone_verified: true,
    two_factor_enabled: true,
    failed_login_attempts: "0",
    distance_from_home_km: "0.0"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const fullPayload = {
        ...formData,
        amount: parseFloat(formData.amount) || 0.0,
        is_international: Boolean(formData.is_international),
        new_device: Boolean(formData.new_device),
        account_age_days: parseInt(formData.account_age_days, 10) || 0,
        transactions_last_hour: parseInt(formData.transactions_last_hour, 10) || 0,
        total_spent_today: parseFloat(formData.total_spent_today) || 0.0,
        vpn_detected: Boolean(formData.vpn_detected),
        email_verified: Boolean(formData.email_verified),
        phone_verified: Boolean(formData.phone_verified),
        two_factor_enabled: Boolean(formData.two_factor_enabled),
        failed_login_attempts: parseInt(formData.failed_login_attempts, 10) || 0,
        distance_from_home_km: parseFloat(formData.distance_from_home_km) || 0.0
      };

      const res = await predictTransaction(fullPayload);
      setResult(res.data);
      
      // ✨ Successfully calls the trigger app function to tell other components to refetch
      if (onPredictionComplete) {
        onPredictionComplete();
      }
    } catch (err) {
      console.error("Prediction failed:", err);
      setError(err.response?.data?.detail || "Could not connect to SentinelFlow evaluation core.");
    } finally {
      setLoading(false);
    }
  };

  const isHighRisk = result?.risk_level === "High";

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ borderBottom: "2px solid #eaeaea", paddingBottom: "1rem", marginBottom: "2rem" }}>
        <h1 style={{ margin: 0, color: "#1a202c" }}>🛡️ SentinelFlow Evaluation Engine</h1>
        <p style={{ margin: "0.5rem 0 0", color: "#718096" }}>Real-time transactional security scoring & network profiling pipeline</p>
      </header>
      
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ gridColumn: "span 2", background: "#f7fafc", padding: "1rem", borderRadius: "6px", fontWeight: "bold", color: "#2d3748" }}>
          💵 1. Transaction & Merchant Details
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Transaction Amount ($)</label>
          <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e0" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Merchant Identifier</label>
          <input type="text" name="merchant" value={formData.merchant} onChange={handleChange} required style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e0" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Merchant Industry Category</label>
          <input type="text" name="merchant_category" value={formData.merchant_category} onChange={handleChange} required style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e0" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Aggregate Spend Across Today ($)</label>
          <input type="number" step="0.01" name="total_spent_today" value={formData.total_spent_today} onChange={handleChange} required style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e0" }} />
        </div>

        <div style={{ gridColumn: "span 2", background: "#f7fafc", padding: "1rem", borderRadius: "6px", fontWeight: "bold", color: "#2d3748", marginTop: "1rem" }}>
          🌐 2. Network Profile & User Metadata
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Country Code (ISO)</label>
          <input type="text" maxLength="2" name="country" value={formData.country} onChange={handleChange} required style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e0" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Device Type Vector</label>
          <select name="device_type" value={formData.device_type} onChange={handleChange} style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e0", background: "#fff" }}>
            <option value="iOS_Device">iOS Device</option>
            <option value="Android_Device">Android Device</option>
            <option value="Tablet">Tablet</option>
            <option value="Desktop">Desktop Web Browser</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Account History (Days)</label>
          <input type="number" name="account_age_days" value={formData.account_age_days} onChange={handleChange} required style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e0" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Velocity Tracker (Transactions Last Hour)</label>
          <input type="number" name="transactions_last_hour" value={formData.transactions_last_hour} onChange={handleChange} required style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e0" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Geographic Distance from Home (km)</label>
          <input type="number" step="0.1" name="distance_from_home_km" value={formData.distance_from_home_km} onChange={handleChange} required style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e0" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Evaluation Timestamp Block</label>
          <input type="text" name="time_of_day" value={formData.time_of_day} onChange={handleChange} required style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e0" }} />
        </div>

        <div style={{ gridColumn: "span 2", background: "#f7fafc", padding: "1rem", borderRadius: "6px", fontWeight: "bold", color: "#2d3748", marginTop: "1rem" }}>
          🔐 3. Security Check vectors
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem" }}>Consecutive Failed Login Attempts</label>
          <input type="number" name="failed_login_attempts" value={formData.failed_login_attempts} onChange={handleChange} required style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #cbd5e0" }} />
        </div>
        
        <div style={{ gridColumn: "span 2", display: "flex", gap: "1.5rem", flexWrap: "wrap", background: "#fff", padding: "0.5rem 0" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}><input type="checkbox" name="is_international" checked={formData.is_international} onChange={handleChange} /> Cross-border Payload</label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}><input type="checkbox" name="new_device" checked={formData.new_device} onChange={handleChange} /> Unrecognized Device Flag</label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}><input type="checkbox" name="vpn_detected" checked={formData.vpn_detected} onChange={handleChange} /> Active Proxy/VPN Tunnel</label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}><input type="checkbox" name="email_verified" checked={formData.email_verified} onChange={handleChange} /> Email Cleared</label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}><input type="checkbox" name="phone_verified" checked={formData.phone_verified} onChange={handleChange} /> MFA Phone Enrolled</label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}><input type="checkbox" name="two_factor_enabled" checked={formData.two_factor_enabled} onChange={handleChange} /> Secure 2FA Hardened</label>
        </div>

        <button type="submit" style={{ gridColumn: "span 2", padding: "1rem", background: "#3182ce", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", transition: "background 0.2s", marginTop: "1rem" }} disabled={loading}>
          {loading ? "Executing Network Scoring Iterations..." : "Transmit Transaction Verification"}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: "2rem", padding: "1rem", background: "#fff5f5", color: "#c53030", borderRadius: "6px", border: "1px solid #feb2b2" }}>
          ⚠️ <strong>System Exception:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: "2.5rem", padding: "1.5rem", background: isHighRisk ? "#fff5f5" : "#f0fff4", border: `2px solid ${isHighRisk ? "#feb2b2" : "#c6f6d5"}`, borderRadius: "8px" }}>
          <h2 style={{ margin: "0 0 1rem 0", color: isHighRisk ? "#9b2c2c" : "#22543d", display: "flex", justifyContent: "space-between" }}>
            <span>Result Status: {result.transaction_status}</span>
            <span style={{ fontSize: "1rem", background: "#fff", padding: "0.2rem 0.6rem", borderRadius: "4px", border: "1px solid" }}>Level: {result.risk_level}</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.95rem" }}>
            <p style={{ margin: 0 }}><strong>Computed Fraud Vector Probability:</strong> {(result.fraud_probability * 100).toFixed(2)}%</p>
            <p style={{ margin: 0 }}><strong>Active Core Processing Model:</strong> {result.model_version || "XGBoost-V1"}</p>
          </div>
        </div>
      )}
    </div>
  );
}