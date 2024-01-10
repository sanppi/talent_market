import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { ProductCard } from '../Main';
import ReviewList from '../../ReviewList';
import Footer from '../Footer';
import '../../../styles/mypage.scss';
import axios from 'axios';
import Pattern from '../../Pattern';

function MyPage({ user }) {
  const { memberId, nickname, id, redCard } = user;
  const navigate = useNavigate();
  const myDataList = ['찜 목록', '판매 상품', '내 리뷰', '채팅 목록'];
  const endpointMapping = {
    '찜 목록': 'favorite',
    '판매 상품': 'selling',
    '내 리뷰': 'review',
    '채팅 목록': 'chatting',
  };
  const [selectedData, setSelectedData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (!memberId) navigate('/member/signin');
  }, [memberId]);

  useEffect(() => {
    handleData('찜 목록');
    setSelectedIndex(0);
  }, []);

  const handleData = async (endpoint) => {
    try {
      if (endpoint === '채팅 목록') {
        navigate('/chatting');
      } else {
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
      }
    } catch (err) {
      console.error('req error:', err);
    }
  };

  return (
    <>
      {memberId && (
        <div className="myPage slideIn">
          <div className="myProfileContainer">
            <div className="myProfileBox1">
              <div className="myProfileImg">
                <Pattern />
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
                <li
                  key={i}
                  className={selectedIndex === i ? 'selected' : ''}
                  onClick={() => {
                    handleData(myData);
                    setSelectedIndex(i);
                  }}
                >
                  {myData}
                </li>
              ))}
            </ul>
            <div className="myListContent">
              <div className="pageWrapper">
                {selectedData &&
                  selectedData.map((data, i) => {
                    switch (data.type) {
                      case 'favorite':
                      case 'selling':
                        return (
                          <ProductCard product={data} boardId={data.boardId} />
                        );
                      case 'review':
                        return (
                          <ReviewList
                            reviews={selectedData.filter(
                              (data) => data.type === 'review'
                            )}
                            boardId={data.boardId}
                          />
                        );
                      default:
                        return null;
                    }
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth,
});

const ConnectedMyPage = connect(mapStateToProps)(MyPage);

export default ConnectedMyPage;
