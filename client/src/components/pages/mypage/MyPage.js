import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import '../../../styles/mypage.scss';
import { useEffect, useState } from 'react';

function MyPage({ user }) {
  const { memberId, nickname, id, redCard, email } = user;
  const navigate = useNavigate();
  const myDataList = ['찜 목록', '판매 상품', '내 리뷰', '채팅'];

  useEffect(() => {
    if (!memberId) navigate('/member/signin');
  }, [memberId]);

  return (
    <>
      {memberId && (
        <div className="myPage">
          <div className="myProfileContainer">
            <div className="myProfileBox1">
              <div className="myProfileImg">
                <img src="" alt="" />
              </div>
              <Link to={`/member/mypage/update/${memberId}`}>
                <button className="myProfileUpdate">내 정보 변경</button>
              </Link>
            </div>
            <div className="myProfileBox2">
              <div className="myProfileNickname">
                {nickname} <span>{id}</span>
              </div>
              <div className="myProfileContent">
                누적 신고 <span>{redCard}</span>번
              </div>
            </div>
          </div>

          <div className="myList">
            <ul className="myListTitle">
              {myDataList.map((myData, i) => (
                <li key={i}>{myData}</li>
              ))}
            </ul>
            <div className="myListContent">각 카테고리에 맞는 내용</div>
          </div>
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth,
});

const ConnectedMyPage = connect(mapStateToProps)(MyPage);

export default ConnectedMyPage;
