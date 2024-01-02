import Main from './components/pages/Main';
import SalePost from './components/pages/SalePost';
import Navbar from './components/pages/Navbar';
import SignUp from './components/pages/SignUp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/pages/SignIn';
import Chatting from './components/pages/Chatting';
import ChatRoom from './components/pages/ChatRoom';
import MyPage from './components/pages/MyPage';
import MyPageUpdate from './components/pages/MyPageUpdate';
import ProductDetailPage from './components/pages/ProductDetailPage';
import SearchResults from './components/pages/SearchResult';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './module/action/authActions';

function App() {
  // mount시 유저 세션 정보(로그인 여부, memberId) 가져와서 user에 넣어두기
  // const dispatch = useDispatch();
  // // const location = useLocation(); // 현재 경로 정보

  // // mount 시 유저 세션 정보(로그인 여부, memberId) 가져와서 Redux에 저장
  // async function getSession() {
  //   try {
  //     const response = await axios.post('http://localhost:8000/getSession');

  //     if (response.data.result) {
  //       const userData = response.data.user;
  //       console.log('userData', userData);
  //       // 여기서 dispatch를 사용하여 Redux 상태를 업데이트
  //       dispatch(loginSuccess(userData));
  //     }
  //   } catch (error) {
  //     console.error('Error fetching session:', error.message);
  //   }
  // }

  // useEffect(() => {
  //   getSession();
  // }, []);

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
