import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function ReviewList({ reviews }) {
  const reviewArray = Array.isArray(reviews) ? reviews : [reviews];

  // const formattedReviews = reviews.map((review) => ({
  //   review: review.review,
  //   title: review.title,
  //   isAnonymous: review.isAnonymous,
  //   stars: review.stars,
  //   boardId: review.Board.boardId,
  //   memberId: review.Member.memberId,
  // }));
  const memberId = useSelector((state) => state.auth.memberId);
  const [selectedReview, setSelectedReview] = useState(null);

  return (
    <>
      {reviewArray.length === 0 ? (
        <div className="noReviewNotice">아직 작성된 리뷰가 없습니다.</div>
      ) : (
        reviewArray.map((review, index) => (
          <div key={review.commentId}>
            <div
              onClick={() =>
                setSelectedReview(selectedReview !== index ? index : null)
              }
            >
              {index + 1}. {review.title} - {review.isAnonymous ? '익명' : ''} (
              {new Date(review.createdAt).toLocaleDateString()}){' '}
              {'★'.repeat(review.stars)}
            </div>
            {selectedReview === index && <p>{review.review}</p>}
          </div>
        ))
      )}
    </>
  );
}
