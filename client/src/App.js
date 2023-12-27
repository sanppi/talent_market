import "./App.css";
import Main from "./components/Main";
import SalePost from "./components/SalePost";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route path="/write" element={<SalePost />} />
      </Routes>
    </Router>
  );
}

export default App;
