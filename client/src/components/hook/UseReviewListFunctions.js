import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import useToggle from '../hook/UseToggle';

const useReviewListFunctions = (boardId) => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [toggleForm, onToggleForm] = useToggle(false);

  const memberId = useSelector((state) => state.auth.memberId);

  useEffect(() => {
    console.log('ee변경 review', reviews);
  }, [reviews]);

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

    try {
      if (editingReview) {
        // 수정 중인 리뷰가 있다면
        // 리뷰 업데이트
        const res = await handleReviewUpdate(editingReview.commentId, {
          title: editingReview.title,
          memberId: memberId,
          review: editingReview.review,
          stars: editingReview.stars,
          boardId: boardId,
          isAnonymous: editingReview.isAnonymous,
        });

        console.log(res);

        if (res) {
          getReviews();
          console.log('??', editingReview.title);
          setReviewTitle(editingReview.title);
          console.log(reviewTitle);
          setEditingReview(null); // 수정이 완료되면 상태를 초기화
        }
      }
    } catch (error) {
      alert('리뷰 작성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleReviewButtonClick = () => {
    onToggleForm();
  };

  const handleReviewUpdate = async (commentId, reviewData) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_DB_HOST}review/update/${commentId}`,
        reviewData
      );

      if (response.status === 200) {
        setReviews(reviewData);
        onToggleForm();
        return true;
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
    reviewTitle,
    reviewContent,
    reviewRating,
    selectedReview,
    editingReview,
    memberId,
    setReviewTitle,
    setReviewContent,
    setReviewRating,
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
    isAnonymous,
    toggleForm,
    onToggleForm,
  };
};

export default useReviewListFunctions;
