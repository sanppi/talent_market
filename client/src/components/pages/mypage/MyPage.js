import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import '../../../styles/mypage.scss';
import { useEffect } from 'react';
// import axios from 'axios';

function MyPage({ user }) {
  const { memberId, nickname, id, redCard } = user;
  const navigate = useNavigate();
  const myDataList = ['찜 목록', '판매 상품', '내 리뷰', '채팅'];
  //

  // --- 마이페이지에서 회원정보 수정 페이지 이동 로직 ---
  // 1. FE) {type: 'nickname', 'email', 'pw'
  // ㄴtype이 pw(비밀번호 변경)이라면 data도 보냄(data: 'oldPw': ~~, 'newPw': ~~)
  // 2. BE)
  // -> if(type==='~~') 유저 찾기 findOne
  // -> 결과 전달({result, userData} 통일)
  // 3. FE) 받아온 정보를 라우터 이동하며 같이 전달해서 Update 화면에서 뿌리기
  //   const handleUserUpdate = async() => {
  //     try {
  //       const response = await axios.post('', {memberId: memberId})
  //       navigate(`http://localhost:8000/member/mypage/update/${memberId}`, response.data)
  //     }
  //     catch (err) {
  //       console.error('Mypage Err: ', err);
  //     }
  // }

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
