import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

// 상품 카드..?
function ProductCard({ product }) {
  return (
    // 상품 목록을 map 돌려서 이미지, 제목, 가격, 별점 받아오도록 했습니다.
    // UI는 db에 저장된 데이터가 생기면 추후 확인하며 수정해야 할 것 같아서 pass ~!
    <div className="productCard">
      <img src={product.image} alt={product.title} />
      <h4>{product.title}</h4>
      <p>{product.price}</p>
      <p>{product.rating}</p>
    </div>
  );
}

function Main() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getProduct() {
      // 일단 API 명세서 보고 경로 가져왔는데 아니라면 수정 부탁드립니다.
      // 에러 발생해서 주석 처리해뒀습니다.
      // const response = await axios.get('/board/:boardId');
      // setProducts(response.data);
    }

    getProduct();
  }, []);

  return (
    <>
      <Navbar />
      <div className="mainPage" style={{ top: "90px", position: "absolute" }}>
        <button className="writeButton">
          <Link to="/write">판매글 작성</Link>
        </button>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}

export default Main;
