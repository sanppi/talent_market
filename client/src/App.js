import Main from './components/Main';
import SalePost from './components/SalePost';
import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import Chat from './components/Chatting';
import MyPage from './components/MyPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route path="/write" element={<SalePost />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/member/mypage" element={<MyPage />} />
        <Route path="/member/signup" element={<SignUp />} />
        <Route path="/member/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
