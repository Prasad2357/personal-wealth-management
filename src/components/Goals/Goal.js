import React, { useState } from "react";
import "./style.css";

function GoalForm() {
  const [goalData, setGoalData] = useState(null);
  const [error, setError] = useState(null);

  // Handle form submission for goal calculation
  const handleSubmitGoal = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous error

    const data = {
      target_amount: parseFloat(e.target.target_amount.value),
      timeline_months: parseInt(e.target.timeline_months.value),
      predicted_savings: parseFloat(e.target.predicted_savings.value) || 0,
      // risk_tolerance: e.target.risk_tolerance.value,
    };

    console.log("Submitting data: ", data);

    try {
      const response = await fetch("http://127.0.0.1:5000/goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch goal data");
      }

      const result = await response.json();
      setGoalData(result);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="goal-form">
      <h1>Calculate Savings Goal</h1>
      <form onSubmit={handleSubmitGoal}>
        <div>
          <label htmlFor="target_amount">Target Amount (₹):</label>
          <input
            type="number"
            name="target_amount"
            id="target_amount"
            placeholder="Enter your target amount"
            required
          />
        </div>

        <div>
          <label htmlFor="timeline_months">Timeline (Months):</label>
          <input
            type="number"
            name="timeline_months"
            id="timeline_months"
            placeholder="Enter the timeline in months"
            required
          />
        </div>

        <div>
          <label htmlFor="predicted_savings">Predicted Savings (₹):</label>
          <input
            type="number"
            name="predicted_savings"
            id="predicted_savings"
            placeholder="Optional: Enter predicted savings"
          />
        </div>



        <button type="submit">Calculate Goal</button>
      </form>

      {goalData && (
        <div className="goal-insights">
          <h2>Goal Insights</h2>
          <p>Required Monthly Savings: ₹{goalData.Required_Monthly_Savings}</p>
          <p>Savings Gap: ₹{goalData.Savings_Gap}</p>
          <h3>Recommendations:</h3>
          <ul>
            {goalData.Recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="error">Error: {error}</p>}
    </div>
  );
}

export default GoalForm;
