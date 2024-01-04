import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "../../styles/navbar.scss";
import "../../styles/main.scss";

export default function NavBar() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchTermLocal, setSearchTermLocal] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      dispatch({ type: "LOGOUT" });
    }
  };

  const handleHamburgerClick = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const handleSearchTermChange = (event) => {
    setSearchTermLocal(event.target.value);
  };

  const handleSearchButtonClick = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/search?search=${searchTermLocal}`
      );
      // response.data가 배열인지 확인
      if (Array.isArray(response.data)) {
        setSearchResults(response.data);
      } else {
        // 배열이 아니면 빈 배열로 설정
        setSearchResults([]);
      }
      navigate(`/search?search=${searchTermLocal}`); // 이 부분을 수정
      setSearchTermLocal("");
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchButtonClick();
    }
  };

  useEffect(() => {
    if (!location.search) {
      setSearchResults([]);
    }
  }, [location.search]);

  return (
    <>
      {isCategoryOpen && (
        <div className="dimmedBackground" onClick={handleHamburgerClick}></div>
      )}
      <div className="navBar">
        {/* 햄버거 버튼 */}
        <button className="hamburgerButton" onClick={handleHamburgerClick}>
          ☰
        </button>

        {/* 카테고리 창 */}
        {isCategoryOpen && (
          <div className={`categoryWindow ${isCategoryOpen ? "open" : ""}`}>
            <div>성대모사</div>
            <div>코디</div>
            <div>그림</div>
            <div>사주 / 타로</div>
            <div>연애상담</div>
            <div>악기</div>
            <div>노래</div>
          </div>
        )}

        {/* 페이지 이름 부분 */}
        <h2 className="pageTitle">
          <Link to="/">재능마켓🏞️</Link>
        </h2>

        {/* 검색창과 검색 버튼 */}
        <div className="searchSection">
          <input
            type="text"
            className="searchInput"
            placeholder="검색어를 입력하세요"
            value={searchTermLocal}
            onChange={handleSearchTermChange}
            onKeyPress={handleOnKeyPress}
          />
          <button className="searchButton" onClick={handleSearchButtonClick}>
            검색
          </button>
        </div>

        <div className="authButtons">
          {isLoggedIn ? (
            <>
              <Link to="/member/mypage">
                <button className="mypageButton">마이페이지</button>
              </Link>
              <button className="logoutButton" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <button className="loginButton">
              <Link to="/member/signin">로그인</Link>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
