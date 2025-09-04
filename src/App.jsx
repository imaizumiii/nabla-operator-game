//src/App.jsx
import "./App.css";
import CalculatorPage from "./pages/CalculatorPage.jsx";
import GamePage from "./pages/GamePage.jsx"
import { BrowserRouter as Router, Routes, Route, Link }  from "react-router-dom";


export default function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
        <Link to="/">Calculator</Link> | <Link to="/game">Game</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CalculatorPage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  );
}
