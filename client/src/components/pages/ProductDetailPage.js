import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../../styles/productdetail.scss';
import { useSelector } from 'react-redux';
import Review from './Review';
import Footer from './Footer';

export default function ProductDetailPage() {
  const [product, setProduct] = useState({});
  const [heart, setHeart] = useState(false);
  const { boardId } = useParams();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const memberId = useSelector((state) => state.auth.memberId);
  const [chattingRoom, setChattingRoom] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, []);

  useEffect(() => {
    async function getProductDetail() {
      try {
        // console.log(`Requested boardId: ${boardId}`);
        const response = await axios.get(
          `${process.env.REACT_APP_DB_HOST}product/${boardId}`,
          { params: { isDetailView: true } }
        );

        if (response.data.product.isDelete) {
          alert('삭제된 게시글입니다.');
          navigate('/');
          return;
        }

        setProduct(response.data.product);
        // console.log(response.data);
        // console.log(response.data.product);
      } catch (error) {
        console.error('데이터를 불러오는데 실패하였습니다: ', error);
      }
    }
    getProductDetail();
  }, [boardId]);

  useEffect(() => {
    async function fetchLikeStatus() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DB_HOST}product/like/${boardId}/${memberId}`
        );
        setHeart(response.data.isLike);
      } catch (error) {
        console.error('찜 정보를 불러오는데 실패하였습니다: ', error);
      }
    }
    fetchLikeStatus();
  }, [boardId, memberId]);

  const handleHeartClick = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    setHeart(!heart);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DB_HOST}product/like/${boardId}/${memberId}`, {
          isLike: !heart,
        }
      );

      // console.log(response.data);
    } catch (error) {
      console.error('찜 정보를 보내는데 실패하였습니다: ', error);
    }
  };

  const handleContactClick = async () => {
    try {
      if (!isLoggedIn) {
        alert('로그인이 필요한 기능입니다.');
        return;
      }
      
      // 채팅방 생성
      const response = await axios.post(
        `${process.env.REACT_APP_DB_HOST}product/chatRoom/create`, {
          memberId: memberId,
          boardId: boardId,
        }
      );

      // console.log('콘솔 로그 ', response.data);

      // 채팅방 정보 업데이트 및 채팅방 ID 저장
      if (response.data.message === '채팅방이 생성되었습니다.') {
        setRoomId(response.data.roomId);
        // 채팅방이 생성되면 해당 채팅방 라우트로 이동
        navigate(`/chatRoom/${response.data.roomId}`);
      } else if (response.data.message === '채팅방이 이미 존재합니다.') {
        // 이미 존재하는 채팅방이므로 roomId 저장
        setRoomId(response.data.roomId);
        navigate(`/chatRoom/${response.data.roomId}`);
      } else {
        console.error('채팅방 생성에 실패하였습니다: ', response.data.message);
        // 서버로부터 받은 에러 메시지를 출력하거나, 적절한 에러 처리를 수행할 수 있습니다.
      }
    } catch (error) {
      console.error('채팅방 생성에 실패하였습니다: ', error);
      console.error('에러 응답 데이터: ', error.response?.data);
    }
  };

  return (
    <div className="productDetail">
      <div className="productInfo">
        <div className="productImageContainer">
          <img
            src={`${process.env.REACT_APP_DB_HOST}static/userImg/${product.image}`}
            alt={product.title}
            className="productImage"
          />
          {memberId !== product.memberId && (
            <div className="heart" onClick={handleHeartClick}>
              {heart ? '❤️' : '🤍'}
            </div>
          )}
        </div>
        <div className="productDescription">
          <div className="productTitle">{product.title}</div>
          {product.isOnMarket === 'stop' ? (
            <div className="productPrice">
              <p>판매 중단</p>
            </div>
          ) : product.isOnMarket === 'ends' ? (
            <div className="productPrice">
              <p>판매 종료</p>
            </div>
          ) : (
            <div className="productPrice">
              <p>{product.price}원</p>
            </div>
          )}
          <hr />
          {/* 이 상품을 판매하는 판매자 이름도 받아오고싶어요.. 클릭하면 판매자가 파는 물품들 쫘라락 나오게 만들고 싶어요.. */}
          <div className="sellerInfo">판매자: {product.Member?.nickname}</div>
          <div>조회수: {product.views}</div>
          {/* 찜한 횟수는 바로 볼 수 있도록 클라이언트에 적었습니다. 불필요하시다면 주석 또는 삭제해주세요. */}
          <div>찜 개수: {product.likeNum}</div>
          <div className="buttonsContainer">
            {memberId === product.memberId ? (
              <>
                <button
                  className="commonBtn"
                  style={{ backgroundColor: '#2095b9' }}
                >
                  <Link to={`/product/edit/${boardId}`}>수정 / 삭제</Link>
                </button>
              </>
            ) : (
              <button
                className={`commonBtn ${heart ? 'heartClicked' : ''}`}
                onClick={handleHeartClick}
              >
                찜하기
              </button>
            )}
            {memberId !== product.memberId &&
              (chattingRoom ? (
                <button className="commonBtn">
                  <Link to={`/chatRoom/${chattingRoom.roomId}`}>
                    채팅방으로 이동
                  </Link>
                </button>
              ) : (
                <button className="commonBtn" onClick={handleContactClick}>
                  연락하기
                </button>
              ))}
          </div>
        </div>
      </div>
      <div className="productContent">
        <p>상품설명 : {product.content}</p>
      </div>
      <hr />
      <Review boardId={boardId} productMemberId={product.memberId} />
      <Footer />
    </div>
  );
}
