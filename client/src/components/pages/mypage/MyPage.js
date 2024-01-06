import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { ProductCard } from '../Main';
import '../../../styles/mypage.scss';
import axios from 'axios';
import ReviewList from '../../ReviewList';

function MyPage({ user }) {
  const { memberId, nickname, id, redCard } = user;
  const navigate = useNavigate();
  const myDataList = ['찜 목록', '판매 상품', '내 리뷰', '채팅 목록'];
  const endpointMapping = {
    '찜 목록': 'favorite',
    '판매 상품': 'selling',
    '내 리뷰': 'review',
    '채팅 목록': 'chat',
  };
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    if (!memberId) navigate('/member/signin');
  }, [memberId]);

  const handleData = async (endpoint) => {
    try {
      const response = await axios({
        url: `${process.env.REACT_APP_DB_HOST}member/mypage/${endpointMapping[endpoint]}`,
        method: 'get',
        withCredentials: true,
      });

      if (response.data.result) {
        const resData = response.data.userData.map((data) => ({
          ...data,
          type: endpointMapping[endpoint],
        }));
        setSelectedData(resData);
      } else {
        console.error('result error:', response.data.message);
      }
    } catch (err) {
      console.error('req error:', err);
    }
  };

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
                <li key={i} onClick={() => handleData(myData)}>
                  {myData}
                </li>
              ))}
            </ul>
            <div className="myListContent">
              <div className="pageWrapper">
                {selectedData !== null &&
                  // TODO : 기본으로 찜 목록, 해당 리스트 color 주기
                  selectedData.map((data, i) => {
                    switch (data.type) {
                      case 'favorite':
                      case 'selling':
                        return (
                          <ProductCard key={data.boardId} product={data} />
                        );
                      case 'review':
                        // TODO : 데이터바인딩
                        return <ReviewList key={data.boardId} reviews={data} />;
                      default:
                        return null;
                    }
                  })}
              </div>
            </div>
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
