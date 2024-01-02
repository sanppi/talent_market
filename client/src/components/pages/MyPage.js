import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import '../../styles/mypage.scss';

function MyPage({ user }) {
  const { memberId, nickname, id, redCard } = user;
  const showNickname = user ? `${nickname} (${id})` : '게스트';

  return (
    <>
      <div className="myPage">
        <div className="myProfileContainer">
          <div className="myProfileBox1">
            <div className="myProfileImg">
              <img src="" alt="" />
            </div>
            <Link to={`/member/mypage/update/${memberId}`}>
              <button className="myProfileUpdate">회원정보 수정</button>
            </Link>
          </div>
          <div className="myProfileBox2">
            <div className="myProfileNickname">{showNickname}</div>
            <div className="myProfileContent">받은 신고 수 : {redCard}</div>
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

// mapStateToProps 함수 : state에서 필요한 데이터를 props로 매핑
const mapStateToProps = (state) => ({
  user: state.auth,
});

// connect 함수를 사용하여 redux 스토어와 연결된 컴포넌트 생성
const ConnectedMyPage = connect(mapStateToProps)(MyPage);

export default ConnectedMyPage;
