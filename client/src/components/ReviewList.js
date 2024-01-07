import { Fragment } from 'react';
import useReviewListFunctions from './hook/UseReviewListFunctions';
import '../styles/reviewlist.scss';

const ReviewList = ({ boardId, reviews }) => {
  const { selectedReview, setSelectedReview } = useReviewListFunctions(boardId);

  return (
    <>
      {/* <div className="myReviewList"> */}
      {reviews.length === 0 ? (
        <div className="noReviewNotice">아직 작성된 리뷰가 없습니다.</div>
      ) : (
        <table className="reviewTable">
          <thead className="reviewTableList">
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>별점</th>
              {/* <th></th> */}
            </tr>
          </thead>
          <tbody className="reviewTableList">
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
                    {review.isAnonymous
                      ? '익명'
                      : review.Member.nickname || review.nickname}
                  </td>
                  <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td>{'★'.repeat(review.stars)}</td>
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
      {/* </div> */}
    </>
  );
};

export default ReviewList;
