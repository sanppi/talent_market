import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/productdetail.scss";
import { useSelector } from "react-redux";
import "../../styles/review.scss";

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
      const response = await axios.get(
        `http://localhost:8000/product/${boardId}`
      );
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
    event.preventDefault();

    const reviewData = {
      title: reviewTitle,
      memberId: memberId,
      review: reviewContent,
      stars: reviewRating,
      boardId: boardId,
      isAnonymous: isAnonymous,
    };

    try {
      const response = await axios.post(
        `http://localhost:8000/review/create`,
        reviewData
      );

      setReviewTitle("");
      setReviewContent("");
      setReviewRating(5);

      getReviews();
      alert("리뷰 작성이 완료되었습니다.");
    } catch (error) {
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
          <div className="noReviewNotice">아직 작성된 리뷰가 없습니다.</div>
        ) : (
          reviews.map((review, index) => (
            <div key={review.commentId}>
              <div
                onClick={() =>
                  setSelectedReview(selectedReview !== index ? index : null)
                }
              >
                {index + 1}. {review.title} -{" "}
                {review.isAnonymous ? "익명" : review.Member.nickname} (
                {new Date(review.createdAt).toLocaleDateString()}){" "}
                {"★".repeat(review.stars)}
              </div>
              {selectedReview === index && <p>{review.review}</p>}
            </div>
          ))
        )}
        <button onClick={handleReviewButtonClick} className="reviewButton">
          리뷰 작성하기
        </button>
        {isReviewFormVisible && (
          <form className="reviewForm" onSubmit={handleReviewSubmit}>
            <input
              type="text"
              placeholder="한 줄 리뷰 제목"
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
              placeholder="한 줄 리뷰 내용"
              value={reviewContent}
              onChange={handleReviewContentChange}
              maxLength="50"
              required
            />
            <button type="submit" className="reviewSumbitButton">
              작성하기
            </button>
          </form>
        )}
      </div>
    </>
  );
}
