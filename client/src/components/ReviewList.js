import { Fragment, useEffect, useState } from 'react';
import useReviewListFunctions from './hook/UseReviewListFunctions';
import '../styles/mypage.scss';
import axios from 'axios';

const ReviewList = ({ boardId, reviews }) => {
  const {
    reviewTitle,
    reviewContent,
    reviewRating,
    selectedReview,
    editingReview,
    setReviewTitle,
    setReviewContent,
    setReviewRating,
    setIsAnonymous,
    setSelectedReview,
    setEditingReview,
    handleReviewSubmit,
    handleReviewDelete,
    isAnonymous,
    toggleForm,
    onToggleForm,
  } = useReviewListFunctions(boardId);

  const [reviewData, setReviewData] = useState(reviews);

  const reviewEdit = async (event) => {
    await handleReviewSubmit(event);

    const response = await axios({
      url: `${process.env.REACT_APP_DB_HOST}member/mypage/review`,
      method: 'get',
      withCredentials: true,
    });

    if (response.data.result) {
      setReviewData(response.data.userData);
    }
  };

  return (
    <>
      {reviews.length === 0 ? (
        <div className="noReviewNotice">아직 작성된 리뷰가 없습니다.</div>
      ) : (
        <table className="reviewTable">
          <thead className="reviewTableList">
            <tr>
              <th></th>
              <th>제목</th>
              <th>작성일</th>
              <th>별점</th>
              <th>수정/삭제</th>
            </tr>
          </thead>
          <tbody className="reviewTableContents">
            {reviewData.map((review, index) => (
              <Fragment key={review.commentId}>
                <tr
                  className="reviewInfo"
                  onClick={() =>
                    setSelectedReview(selectedReview !== index ? index : null)
                  }
                >
                  <td>{index + 1}</td>
                  <td>{review.title}</td>
                  <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td>{'★'.repeat(review.stars)}</td>
                  <td className="editButtonBox">
                    <button
                      className="editButton"
                      onClick={(event) => {
                        event.stopPropagation();
                        setEditingReview(review);
                        setReviewTitle(review.title);
                        onToggleForm();
                      }}
                    >
                      {toggleForm ? '수정 취소' : '수정'}
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

      {toggleForm && (
        <form className="reviewForm" onSubmit={reviewEdit}>
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
              checked={editingReview ? editingReview.isAnonymous : isAnonymous}
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
                {'★'.repeat(rating)}
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
            수정하기
          </button>
        </form>
      )}
      {/* </div> */}
    </>
  );
};

export default ReviewList;
