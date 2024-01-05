export default function ReviewList({
  reviews,
  selectedReview,
  setSelectedReview,
}) {
  // reviewData = {
  //     title: reviewTitle,
  //     memberId: memberId,
  //     review: reviewContent,
  //     stars: reviewRating,
  //     boardId: boardId,
  //     isAnonymous: isAnonymous,
  //   };

  return (
    <>
      {console.log(reviews)}
      {/* {reviews === undefined ? (
        <p>로딩 중...</p>
      ) : reviews.length === 0 ? (
        <div className="noReviewNotice">아직 작성된 리뷰가 없습니다.</div>
      ) : (
        reviews.map((review, index) => (
          <div key={review.commentId}>
            <div
              onClick={() =>
                setSelectedReview(selectedReview !== index ? index : null)
              }
            >
              {index + 1}. {review.title} -{' '}
              {review.isAnonymous ? '익명' : review.Member.nickname} (
              {new Date(review.createdAt).toLocaleDateString()}){' '}
              {'★'.repeat(review.stars)}
            </div>
            {selectedReview === index && <p>{review.review}</p>}
          </div>
        ))
      )} */}
    </>
  );
}
