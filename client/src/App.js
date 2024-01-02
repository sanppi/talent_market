import Main from "./components/pages/Main";
import SalePost from "./components/pages/SalePost";
import Navbar from "./components/pages/Navbar";
import SignUp from "./components/pages/SignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./components/pages/SignIn";
import Chatting from "./components/pages/Chatting";
import ChatRoom from "./components/pages/ChatRoom";
import MyPage from "./components/pages/MyPage";
import MyPageUpdate from "./components/pages/MyPageUpdate";
import ProductDetailPage from "./components/pages/ProductDetailPage";
import SearchResults from "./components/pages/SearchResult";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route path="/write" element={<SalePost />} />
        <Route path="/chatting" element={<Chatting />} />
        <Route path="/chatRoom/:id" element={<ChatRoom />} />
        <Route path="/product/:boardId" element={<ProductDetailPage />} />
        <Route path="/member/mypage" element={<MyPage />} />
        <Route
          path="/member/mypage/update:memberId"
          element={<MyPageUpdate />}
        />
        <Route path="/member/signup" element={<SignUp />} />
        <Route path="/member/signin" element={<SignIn />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </Router>
  );
}

export default App;
