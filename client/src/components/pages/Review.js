import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import "../../styles/productdetail.scss";
import { useSelector } from "react-redux";
import "../../styles/review.scss";

export default function Review({ boardId, productMemberId }) {
  const [reviews, setReviews] = useState([]);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const memberId = useSelector((state) => state.auth.memberId);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  const getReviews = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DB_HOST}product/${boardId}`
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
      if (editingReview) {
        // 수정 중인 리뷰가 있다면
        // 리뷰 업데이트
        await handleReviewUpdate(editingReview.commentId, {
          title: editingReview.title,
          memberId: memberId,
          review: editingReview.review,
          stars: editingReview.stars,
          boardId: boardId,
          isAnonymous: editingReview.isAnonymous,
        });
        setEditingReview(null); // 수정이 완료되면 상태를 초기화
      } else {
        // 새 리뷰 작성
        const response = await axios.post(
          `${process.env.REACT_APP_DB_HOST}review/create`,
          reviewData
        );

        if (response.status === 200) {
          alert("리뷰가 성공적으로 작성되었습니다.");
          getReviews(); // 새 리뷰 작성 후 리뷰 목록을 갱신합니다.
        }
      }
      // 리뷰 작성 혹은 수정이 완료된 후, editingReview 상태를 초기화해줍니다.
      setEditingReview(null);
    } catch (error) {
      alert("리뷰 작성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleReviewButtonClick = () => {
    setIsReviewFormVisible(!isReviewFormVisible);
  };

  const handleReviewUpdate = async (commentId, reviewData) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_DB_HOST}review/update/${commentId}`,
        reviewData
      );

      if (response.status === 200) {
        alert("리뷰가 성공적으로 수정되었습니다.");
        getReviews(); // 리뷰 수정 후 리뷰 목록을 갱신합니다.
      }
    } catch (error) {
      alert("리뷰 수정에 실패했습니다. 잠시 후 다시 시도해주세요.");
      console.log(error);
    }
  };

  const handleReviewDelete = async (commentId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_DB_HOST}review/delete/${commentId}`
      );
      if (response.status === 200) {
        alert("리뷰가 성공적으로 삭제되었습니다.");
        getReviews();
      }
    } catch (error) {
      alert("리뷰 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  console.log("review: ", reviews);

  return (
    <>
      <div className="reviewSection">
        <span className="reviewList">리뷰 목록</span>
        <br />
        {reviews.length === 0 ? (
          <div className="noReviewNotice">아직 작성된 리뷰가 없습니다.</div>
        ) : (
          <table className="reviewTable">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>별점</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => (
                <Fragment key={review.commentId}>
                  <tr
                    onClick={() =>
                      setSelectedReview(selectedReview !== index ? index : null)
                    }
                  >
                    <td>{index + 1}</td>
                    <td>{review.title}</td>
                    <td>
                      {review.isAnonymous ? "익명" : review.Member.nickname}
                    </td>
                    <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td>{"★".repeat(review.stars)}</td>
                    <td>
                      {memberId === review.memberId && (
                        <>
                          <button
                            className="editButton"
                            onClick={(event) => {
                              event.stopPropagation();
                              if (
                                editingReview &&
                                editingReview.commentId === review.commentId
                              ) {
                                setEditingReview(null);
                                setReviewTitle("");
                                setIsAnonymous(false);
                                setReviewRating("");
                                setReviewContent("");
                              } else {
                                setEditingReview(review);
                                setReviewTitle(review.title);
                                setIsReviewFormVisible(true);
                              }
                            }}
                          >
                            {editingReview &&
                            editingReview.commentId === review.commentId
                              ? "수정 취소"
                              : "수정"}
                          </button>
                          <button
                            className="deleteButton"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleReviewDelete(review.commentId);
                            }}
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                  {selectedReview === index && (
                    <tr>
                      <td colSpan="5">{review.review}</td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
        {memberId !== productMemberId && (
          <button onClick={handleReviewButtonClick} className="reviewButton">
            리뷰 작성하기
          </button>
        )}
        {isReviewFormVisible && (
          <form className="reviewForm" onSubmit={handleReviewSubmit}>
            <input
              type="text"
              placeholder="한 줄 리뷰 제목"
              value={editingReview ? editingReview.title : reviewTitle}
              onChange={(event) => {
                if (editingReview) {
                  setEditingReview({
                    ...editingReview,
                    title: event.target.value,
                  });
                } else {
                  setReviewTitle(event.target.value);
                }
              }}
              maxLength="15"
              required
            />
            <label>
              <input
                type="checkbox"
                checked={
                  editingReview ? editingReview.isAnonymous : isAnonymous
                }
                onChange={(event) => {
                  const newValue = event.target.checked;
                  if (editingReview) {
                    setEditingReview((prev) => ({
                      ...prev,
                      isAnonymous: newValue,
                    }));
                  } else {
                    setIsAnonymous(newValue);
                  }
                }}
              />
              익명
            </label>
            <div>
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating}>
                  <input
                    type="radio"
                    value={rating}
                    checked={
                      editingReview
                        ? editingReview.stars === rating
                        : reviewRating === rating
                    }
                    onChange={(event) => {
                      const newValue = Number(event.target.value);
                      if (editingReview) {
                        setEditingReview((prev) => ({
                          ...prev,
                          stars: newValue,
                        }));
                      } else {
                        setReviewRating(newValue);
                      }
                    }}
                    required
                  />
                  {"★".repeat(rating)}
                </label>
              ))}
            </div>
            <textarea
              placeholder="한 줄 리뷰 내용"
              value={editingReview ? editingReview.review : reviewContent}
              onChange={(event) => {
                const newValue = event.target.value;
                if (editingReview) {
                  setEditingReview((prev) => ({ ...prev, review: newValue }));
                } else {
                  setReviewContent(newValue);
                }
              }}
              maxLength="50"
              required
            />
            <button type="submit" className="reviewSumbitButton">
              {editingReview ? "수정하기" : "작성하기"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
