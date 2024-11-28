import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./style.css";

function PredictionForm() {
  const [formData, setFormData] = useState({
    Income: "",
    Age: "",
    Dependents: "",
    Occupation: "Professional",
    City_Tier: "Tier_1",
    Disposable_Income: "",
    Total_Expenses: "",
  });

  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitPrediction = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch predictions: ${errorMessage}`);

      }

      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNavigateToGoal = () => {
    if (predictions) {
      navigate("/goal", { state: { risk: predictions.Risk_Category } });
    } else {
      setError("Please get predictions first before proceeding to the Goal page.");
    }
  };

  return (
    <div className="prediction-form">
      <h1>Prediction Form</h1>
      <form onSubmit={handleSubmitPrediction}>
        <div>
          <label>Income:</label>
          <input
            type="number"
            name="Income"
            value={formData.Income}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Dependents:</label>
          <input
            type="number"
            name="Dependents"
            value={formData.Dependents}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Occupation:</label>
          <select
            name="Occupation"
            value={formData.Occupation}
            onChange={handleChange}
          >
            <option value="Professional">Professional</option>
            <option value="Retired">Retired</option>
            <option value="Self_Employed">Self-Employed</option>
            <option value="Student">Student</option>
          </select>
        </div>
        <div>
          <label>City Tier:</label>
          <select
            name="City_Tier"
            value={formData.City_Tier}
            onChange={handleChange}
          >
            <option value="Tier_1">Tier 1</option>
            <option value="Tier_2">Tier 2</option>
            <option value="Tier_3">Tier 3</option>
          </select>
        </div>
        <div>
          <label>Disposable Income:</label>
          <input
            type="number"
            name="Disposable_Income"
            value={formData.Disposable_Income}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Total Expenses:</label>
          <input
            type="number"
            name="Total_Expenses"
            value={formData.Total_Expenses}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Get Predictions</button>
      </form>
      {predictions && (
        <div className="predictions">
          <h2>Predictions</h2>
          <p>Predicted Savings: {predictions.Predicted_Savings}</p>
          <p>Predicted Percentage: {predictions.Predicted_Percentage}</p>
          <p>Risk Category: {predictions.Risk_Category}</p>
          <button onClick={handleNavigateToGoal}>Proceed to Goal</button>
        </div>
      )}
      {error && <p className="error">Error: {error}</p>}
    </div>
  );
}

export default PredictionForm;
