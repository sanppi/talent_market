import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/productdetail.scss";
import { useSelector } from "react-redux";

export default function Review({ boardId }) {
  const [reviews, setReviews] = useState([]);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const memberId = useSelector((state) => state.auth.memberId);
  const [selectedReview, setSelectedReview] = useState(null);

  const getReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/review/create`);
      if (response.data.reviews) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error("리뷰를 불러오는데 실패하였습니다: ", error);
    }
  };

  useEffect(() => {
    getReviews();
  }, [boardId]);

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

    const reviewData = {
      title: reviewTitle,
      memberId: memberId,
      review: reviewContent,
      stars: reviewRating,
      boardId: boardId,
    };

    try {
      const response = await axios.post(
        `http://localhost:8000/review/create`,
        reviewData
      );

      console.log(response.data);

      setReviewTitle("");
      setReviewContent("");
      setReviewRating(5);

      setTimeout(getReviews, 2000);
    } catch (error) {
      console.error("리뷰를 보내는데 실패하였습니다: ", error);

      alert("리뷰 작성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleReviewButtonClick = () => {
    setIsReviewFormVisible(!isReviewFormVisible);
  };

  console.log("review: ", reviews);

  return (
    <>
      <div className="reviewSection">
        <div>리뷰 목록</div>
        <br />
        {reviews.length === 0 ? (
          <p>아직 작성된 리뷰가 없습니다.</p>
        ) : (
          reviews.map((review, index) => (
            <div key={review.id}>
              <p
                onClick={() =>
                  setSelectedReview(selectedReview !== index ? index : null)
                }
              >
                {index + 1}. {review.title} - {review.author} (
                {new Date(review.date).toLocaleDateString()})
              </p>
              {selectedReview === index && <p>{review.content}</p>}
            </div>
          ))
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
    </>
  );
}
