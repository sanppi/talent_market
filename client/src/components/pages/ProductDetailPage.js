import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../styles/productdetail.scss";
import { useSelector } from "react-redux";

export default function ProductDetailPage() {
  const [product, setProduct] = useState({});
  const [heart, setHeart] = useState(false);
  const { boardId } = useParams();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [reviews, setReviews] = useState([]);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewImage, setReviewImage] = useState(null);
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const memberId = useSelector((state) => state.auth.memberId);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, []);

  useEffect(() => {
    async function getReviews() {
      try {
        const response = await axios.get(
          `http://localhost:8000/review/create/${boardId}`
        );
        console.log(response.data);
        if (response.data.reviews) {
          setReviews(response.data.reviews);
        }
      } catch (error) {
        console.error("리뷰를 불러오는데 실패하였습니다: ", error);
      }
    }
    getReviews();
  }, [boardId]);

  useEffect(() => {
    async function getProductDetail() {
      try {
        console.log(`Requested boardId: ${boardId}`);
        const response = await axios.get(
          `http://localhost:8000/product/${boardId}`
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

  const handleHeartClick = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    setHeart(!heart);

    try {
      const response = await axios.post(
        `http://localhost:8000/product/like/${boardId}`,
        {
          like: !heart,
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error("찜 정보를 보내는데 실패하였습니다: ", error);
    }
  };

  const handleReviewTitleChange = (event) => {
    setReviewTitle(event.target.value);
  };

  const handleReviewMemberIdChange = (event) => {
    setIsAnonymous(event.target.checked);
  };

  const handleReviewContentChange = (event) => {
    setReviewContent(event.target.value);
  };

  const handleReviewRatingChange = (event) => {
    setReviewRating(Number(event.target.value));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    const formData = new FormData();

    formData.append("title", reviewTitle);
    formData.append("memberId", memberId);
    formData.append("content", reviewContent);
    formData.append("rating", reviewRating);
    if (reviewImage) {
      formData.append("image", reviewImage);
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/product/review/${boardId}`,
        formData
      );

      console.log(response.data);

      setReviewTitle("");
      setReviewContent("");
      setReviewRating(5);
      setReviewImage(null);

      window.location.reload();
    } catch (error) {
      console.error("리뷰를 보내는데 실패하였습니다: ", error);

      alert("리뷰 작성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleReviewButtonClick = () => {
    setIsReviewFormVisible(!isReviewFormVisible);
  };

  return (
    <div className="productDetail">
      <div className="productInfo">
        <div className="productImageContainer">
          <img
            src={`http://localhost:8000/static/userImg/${product.image}`}
            alt={product.title}
            className="productImage"
          />
          <div className="heart" onClick={handleHeartClick}>
            {heart ? "❤️" : "🤍"}
          </div>
        </div>
        <div className="productDescription">
          <div className="productTitle">{product.title}</div>
          <div className="productPrice">
            <p>{product.price}원</p>
          </div>
          <div>(판매자 정보,...?넣기)</div>
          <div className="buttonsContainer">
            <button
              className={`commonBtn ${heart ? "heartClicked" : ""}`}
              onClick={handleHeartClick}
            >
              찜하기
            </button>
            <button className="commonBtn">연락하기</button>
          </div>
        </div>
      </div>
      <hr />
      <div className="productContent">
        <p>상품설명: {product.content}</p>
      </div>
      <hr />
      <div className="reviewSection">
        <div>리뷰 목록</div>
        <br />
        {/* 리뷰가 없는 경우 메시지를 표시하고, 리뷰가 있는 경우 각 리뷰를 표시합니다. */}
        {reviews.length === 0 ? (
          <p>아직 작성된 리뷰가 없습니다.</p>
        ) : (
          reviews.map((review) => <p key={review.id}>{review.content}</p>)
        )}
        <button onClick={handleReviewButtonClick}>리뷰 작성하기</button>
        {isReviewFormVisible && (
          <form onSubmit={handleReviewSubmit}>
            <input
              type="text"
              placeholder="제목"
              value={reviewTitle}
              onChange={handleReviewTitleChange}
              maxLength="15"
              required
            />
            <label>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={handleReviewMemberIdChange}
              />
              익명
            </label>
            <div>
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating}>
                  <input
                    type="radio"
                    value={rating}
                    checked={reviewRating === rating}
                    onChange={handleReviewRatingChange}
                    required
                  />
                  {"★".repeat(rating)} {/* 별 모양으로 표시합니다. */}
                </label>
              ))}
            </div>
            <textarea
              placeholder="내용"
              value={reviewContent}
              onChange={handleReviewContentChange}
              maxLength="50"
              required
            />
            <button type="submit">작성하기</button>
          </form>
        )}
      </div>
    </div>
  );
}
