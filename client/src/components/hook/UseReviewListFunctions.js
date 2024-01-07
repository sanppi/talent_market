import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const useReviewListFunctions = (boardId) => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const memberId = useSelector((state) => state.auth.memberId);

  const getReviews = async () => {
    try {
      const response = await axios({
        url: `${process.env.REACT_APP_DB_HOST}member/mypage/review`,
        method: 'get',
        withCredentials: true,
      });

      if (response.data.result) {
        setReviews(response.data.userData);
      }
    } catch (error) {
      console.error('리뷰를 불러오는데 실패하였습니다: ', error);
    }
  };

  // useEffect(() => {
  //   getReviews();
  // }, [boardId, endpoint]);

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
          alert('리뷰가 성공적으로 작성되었습니다.');
          getReviews(); // 새 리뷰 작성 후 리뷰 목록을 갱신합니다.
        }
      }
      // 리뷰 작성 혹은 수정이 완료된 후, editingReview 상태를 초기화해줍니다.
      setEditingReview(null);
    } catch (error) {
      alert('리뷰 작성에 실패했습니다. 잠시 후 다시 시도해주세요.');
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
        alert('리뷰가 성공적으로 수정되었습니다.');
        getReviews(); // 리뷰 수정 후 리뷰 목록을 갱신합니다.
      }
    } catch (error) {
      alert('리뷰 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
      console.log(error);
    }
  };

  const handleReviewDelete = async (commentId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_DB_HOST}review/delete/${commentId}`
      );
      if (response.status === 200) {
        alert('리뷰가 성공적으로 삭제되었습니다.');
        getReviews();
      }
    } catch (error) {
      alert('리뷰 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return {
    reviews,
    selectedReview,
    editingReview,
    memberId,
    setReviewTitle,
    setReviewContent,
    setReviewRating,
    setIsReviewFormVisible,
    setIsAnonymous,
    setSelectedReview,
    setEditingReview,
    handleReviewTitleChange,
    handleReviewMemberIdChange,
    handleReviewContentChange,
    handleReviewRatingChange,
    handleReviewSubmit,
    handleReviewButtonClick,
    handleReviewUpdate,
    handleReviewDelete,
  };
};

export default useReviewListFunctions;
