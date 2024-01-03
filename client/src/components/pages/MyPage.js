import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import '../../styles/mypage.scss';

function MyPage({ user }) {
  const { memberId, nickname, id, redCard } = user;
  // const showNickname = user ? `${nickname} (${id})` : '게스트';

  return (
    <>
      {memberId ? (
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
              <div className="myProfileNickname">
                {nickname} <span>({id})</span>
              </div>
              <div className="myProfileContent">누적 신고 수 : {redCard}</div>
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
      ) : (
        '로그인이 필요합니다.'
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth,
});

const ConnectedMyPage = connect(mapStateToProps)(MyPage);

export default ConnectedMyPage;
