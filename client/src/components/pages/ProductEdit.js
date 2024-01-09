import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import '../../styles/salepost.scss';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProductEdit() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isOnMarket, setIsOnMarket] = useState('');
  const [image, setImage] = useState(null);
  const memberId = useSelector((state) => state.auth.memberId);
  const nickname = useSelector((state) => state.auth.nickname);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { boardId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/member/signin');
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_DB_HOST}product/${boardId}`
        );

        // 추가: 삭제된 게시글인 경우 처리
        if (response.data.product.isDelete) {
          alert('삭제된 게시글입니다.');
          navigate('/'); // 삭제된 게시글이라면 홈페이지로 리다이렉트 또는 적절한 페이지로 이동
          return;
        }

        const board = response.data;
        setTitle(board.product.title || '');
        setPrice(board.product.price || '');
        setCategory(board.product.category || '');
        setContent(board.product.content || '');
        setIsOnMarket(board.product.isOnMarket || '');
        setImage(
          `${process.env.REACT_APP_DB_HOST}static/userImg/${board.product.image}` ||
            null
        );
        // console.log(image);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [isLoggedIn, navigate, boardId]);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (category === '') {
      alert('카테고리를 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('content', content);
    formData.append('isOnMarket', isOnMarket);

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_DB_HOST}product/update/${boardId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        navigate(`/product/${boardId}`);
      }
    } catch (error) {
      alert('상품 등록에 실패했습니다. 잠시 후 다시 시도해주세요');
      // console.log(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_DB_HOST}product/delete/${boardId}`,
          { isDelete: true } // 서버로 보낼 요청 바디에 isDelete: true 추가
        );

        if (response.status === 200) {
          alert('상품이 삭제되었습니다.');
          navigate('/'); // 홈 페이지 또는 적절한 페이지로 리다이렉션
        }
      } catch (error) {
        alert('상품 삭제에 실패했습니다. 나중에 다시 시도해주세요.');
        console.error(error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="SalePost">
        <form
          onSubmit={handleSubmit}
          style={{ top: '140px', position: 'absolute' }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>상품이미지</div>
              <label htmlFor="fileInput">
                {image && !(image instanceof Blob) && (
                  <img src={image} alt="img example" className="exImage" />
                )}
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                {image && image instanceof Blob && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    className="exImage"
                  />
                )}
              </label>
            </div>
            <br />
            <hr />
            <div>
              <input
                type="text"
                placeholder="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={20}
              />
              <div className="priceInput">
                <input
                  type="number"
                  placeholder="가격"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  maxLength={20}
                />
                {/* <div className="fakePlaceHolder">원</div> */}
              </div>
            </div>
          </div>
          <hr />
          <div>
            <select
              value={isOnMarket}
              onChange={(e) => setIsOnMarket(e.target.value)}
            >
              <option value="">상품 상태 선택</option>
              <option value="sale">판매 중</option>
              <option value="stop">판매 중단</option>
              <option value="ends">판매 종료</option>
            </select>
          </div>
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">카테고리 선택</option>
              <option value="언어">언어</option>
              <option value="음악">음악</option>
              <option value="예술">예술</option>
              <option value="취미">취미</option>
              <option value="상담">상담</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <hr />
          <div>
            <textarea
              placeholder="상품 소개"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <button type="submit" className="submitButton">
            상품 수정하기
          </button>
          <button type="button" className="submitButton" onClick={handleDelete}>
            상품 삭제하기
          </button>
        </form>
      </div>
    </>
  );
}
