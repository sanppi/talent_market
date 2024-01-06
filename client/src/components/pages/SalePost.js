import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "../../styles/salepost.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SalePost() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const memberId = useSelector((state) => state.auth.memberId);
  const nickname = useSelector((state) => state.auth.nickname);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    // 이 부분 추가
    if (!isLoggedIn) {
      navigate("/member/signin"); // 변경된 부분
    }
  }, [isLoggedIn, navigate]);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    // 페이지 새로고침 방지
    e.preventDefault();

    if (category === "") {
      alert("카테고리를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("content", content);
    formData.append("memberId", memberId);
    formData.append("nickname", nickname);

    // 데이터 받으십쇼~~!!
    try {
      const response = await axios.post(
        "http://localhost:8000/product/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        navigate(`/product/${response.data.boardId}`);
      }
    } catch (error) {
      alert("상품 등록에 실패했습니다. 잠시 후 다시 시도해주세요");
    }
  };

  return (
    <>
      <Navbar />
      <div className="SalePost">
        <form
          onSubmit={handleSubmit}
          style={{ top: "140px", position: "absolute" }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>상품이미지</div>
              <label htmlFor="fileInput">
                {!image && (
                  <img
                    src="/static/img.png"
                    alt="img example"
                    className="exImage"
                  />
                )}
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                {image && (
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
            상품 등록하기
          </button>
        </form>
      </div>
    </>
  );
}
