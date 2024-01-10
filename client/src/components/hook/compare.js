const handleReviewSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingReview) {
        const updatedReview = {
          title: editingReview.title,
          memberId: memberId,
          review: editingReview.review,
          stars: editingReview.stars,
          boardId: boardId,
          isAnonymous: editingReview.isAnonymous,
        };

        const res = await handleReviewUpdate(editingReview.commentId, updatedReview);

        if (res) {
          setReviews((prevReviews) =>
            prevReviews.map((review) =>
              review.commentId === editingReview.commentId ? updatedReview : review
            )
          );
          setEditingReview(null); // 수정이 완료되면 상태를 초기화
        }
      }
    } catch (error) {
      alert('리뷰 작성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };
