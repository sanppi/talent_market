import "./App.css";
import Main from "./components/Main";
import SalePost from "./components/SalePost";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from "./components/Chatting";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route path="/write" element={<SalePost />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
