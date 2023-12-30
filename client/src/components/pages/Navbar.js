import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../styles/navbar.scss";

export default function NavBar({ setSearchTerm }) {
  console.log(typeof setSearchTerm);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchTermLocal, setSearchTermLocal] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleHamburgerClick = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const handleSearchTermChange = (event) => {
    setSearchTermLocal(event.target.value);
  };

  const handleSearchButtonClick = () => {
    setSearchTerm(searchTermLocal);
    navigate(`/?search=${searchTermLocal}`);
    setSearchTermLocal("");
  };

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchButtonClick(); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };

  useEffect(() => {
    if (!location.search) {
      if (typeof setSearchTerm === "function") {
        setSearchTerm("");
      }
    }
  }, [location.search, setSearchTerm]);

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

        {/* <Link to="/">HOME</Link> */}

        {/* 카테고리 창 */}
        {isCategoryOpen && (
          <div className="categoryWindow">
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
          <Link to="/">로고</Link>
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

        {/* 로그인 버튼 */}
        <button className="loginButton">
          <Link to="/member/signin">로그인</Link>
        </button>
      </div>
    </>
  );
}
