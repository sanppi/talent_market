import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/navbar.scss';

export default function NavBar() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const handleHamburgerClick = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

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

        <Link to="/">HOME</Link>

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
        <h2 className="pageTitle">산은 산이요 강은 강이로다 - 산하</h2>

        {/* 검색창과 검색 버튼 */}
        <div className="searchSection">
          <input
            type="text"
            className="searchInput"
            placeholder="검색어를 입력하세요"
          />
          <button className="searchButton">검색</button>
        </div>

        {/* 로그인 버튼 */}
        <button className="loginButton">
          <Link to="/member/signin">로그인</Link>
        </button>
      </div>
    </>
  );
}