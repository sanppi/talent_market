import { Link } from 'react-router-dom';
import '../../styles/mypage.scss';

export default function MyPage() {
  return (
    <>
      <div className="myPage">
        <div className="myProfileContainer">
          <div className="myProfileBox1">
            <div className="myProfileImg">
              <img src="" alt="" />
            </div>
            <Link to="/member/mypage/update">
              <button>회원정보 수정</button>
            </Link>
          </div>
          <div className="myProfileBox2">
            <div className="myProfileNickname">닉네임</div>
            <div className="myProfileContent">
              소개글
              <button>수정</button>
            </div>
          </div>
        </div>

        <div className="myList">
          <ul className="myListTitle">
            <li>찜한 목록</li>
            <li>나의 판매상품</li>
            <li>후기</li>
          </ul>
          <div className="myListContent">각 카테고리에 맞는 내용</div>
        </div>
      </div>
    </>
  );
}
