import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SignUpSignIn from "./components/Signup";
import PredictionForm from "./components/Prediction/Prediction";
import GoalForm from "./components/Goals/Goal";
// import NewsFeed from "./components/NewsFeed/NewsFeed"; // Correct import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUpSignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/predict" element={<PredictionForm />} />
        <Route path="/goal" element={<GoalForm />} />
        {/* <Route path="/news" element={<NewsFeed />} /> Added route */}
      </Routes>
    </Router>
  );
}

export default App;
