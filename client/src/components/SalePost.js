import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

export default function SalePost() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
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
    formData.append("description", description);

    // 데이터 받으십쇼~~!!
    try {
      const response = await axios.post("/board/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <form
        onSubmit={handleSubmit}
        style={{ top: "90px", position: "absolute" }}
      >
        <div>
          <label>
            <input type="file" onChange={handleImageUpload} />
            {/* 이미지 미리보기 되는데 크기는 css로 정해둘 예정 */}
            {/* 그런데 영상이나 음성 파일은...? 그냥 이미지로만 파일 타입 정하는 게 낫겠죠 */}
            {/* 하지만 성대모사 미리보기가 있다면 참 조을텐데. 아숩다 */}
            {image && <img src={URL.createObjectURL(image)} alt="preview" />}
          </label>
          <div>
            <input
              type="text"
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="가격"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
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
          <textarea
            placeholder="상품 소개"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">등록하기</button>
      </form>
    </>
  );
}
