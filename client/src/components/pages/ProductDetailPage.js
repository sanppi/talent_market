import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "../../styles/productdetail.scss";
import { useSelector } from "react-redux";
import Review from "./Review";

export default function ProductDetailPage() {
  const [product, setProduct] = useState({});
  const [heart, setHeart] = useState(false);
  const { boardId } = useParams();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const memberId = useSelector((state) => state.auth.memberId);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, []);

  useEffect(() => {
    async function getProductDetail() {
      try {
        console.log(`Requested boardId: ${boardId}`);
        const response = await axios.get(
          `${process.env.REACT_APP_DB_HOST}product/${boardId}`,
          { params: { isDetailView: true } }
        );

        setProduct(response.data.product);
        console.log(response.data);
        console.log(response.data.product);
      } catch (error) {
        console.error("데이터를 불러오는데 실패하였습니다: ", error);
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
        console.error("찜 정보를 불러오는데 실패하였습니다: ", error);
      }
    }
    fetchLikeStatus();
  }, [boardId, memberId]);

  const handleHeartClick = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    setHeart(!heart);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DB_HOST}product/like/${boardId}/${memberId}`,
        {
          isLike: !heart,
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error("찜 정보를 보내는데 실패하였습니다: ", error);
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
              {heart ? "❤️" : "🤍"}
            </div>
          )}
        </div>
        <div className="productDescription">
          <div className="productTitle">{product.title}</div>
          <div className="productPrice">
            <p>{product.price}원</p>
          </div>
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
                  style={{ backgroundColor: "#2095b9" }}
                >
                  <Link to={`/product/edit/${boardId}`}>수정 / 삭제</Link>
                </button>
              </>
            ) : (
              <button
                className={`commonBtn ${heart ? "heartClicked" : ""}`}
                onClick={handleHeartClick}
              >
                찜하기
              </button>
            )}
            {memberId !== product.memberId && (
              <button className="commonBtn">연락하기</button>
            )}
          </div>
        </div>
      </div>
      <div className="productContent">
        <p>상품설명 : {product.content}</p>
      </div>
      <hr />
      <Review boardId={boardId} productMemberId={product.memberId} />
    </div>
  );
}
