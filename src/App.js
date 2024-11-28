import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SignUpSignIn from "./components/Signup";
import PredictionForm from "./components/Prediction/Prediction";
import GoalForm from "./components/Goals/Goal"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpSignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/predict" element={< PredictionForm/>} />
        <Route path="/goal" element={<GoalForm />} />
      </Routes>
    </Router>
  );
}

export default App;
