import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "../../styles/salepost.scss";

export default function SalePost() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

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

      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
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
              />
              <div className="priceInput">
                <input
                  type="number"
                  placeholder="가격"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
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
              <option value="category1">정치인 성대모사</option>
              <option value="category2">그림</option>
              <option value="category3">코디</option>
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
