import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "../../styles/main.scss";
import { useSelector } from "react-redux";

// 상품 카드..?
export function ProductCard({ product }) {
  return (
    // 상품 목록을 map 돌려서 이미지, 제목, 가격, 별점 받아오도록 했습니다.
    // UI는 db에 저장된 데이터가 생기면 추후 확인하며 수정해야 할 것 같아서 pass ~!
    <div className="productCard">
      <Link to={`/product/${product.boardId}`}>
        <div className="imgContainer">
          <img
            src={`http://localhost:8000/static/userImg/${product.image}`}
            alt={product.title}
          />
        </div>
        <h4>{product.title}</h4>
        <p>{product.price}원</p>
        <p>{product.rating}</p>
      </Link>
    </div>
  );
}

function Main() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 상품 검색 함수
  const searchProducts = (products, searchTerm) => {
    return products.filter(
      (product) =>
        product.title.includes(searchTerm) ||
        product.content.includes(searchTerm)
    );
  };

  const handleWriteButtonClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert("로그인이 필요한 기능입니다.");
    }
  };

  useEffect(() => {
    async function getProduct() {
      try {
        const response = await axios.get("http://localhost:8000/", {
          withCredentials: true,
        }); // 수정된 부분
        setProducts(response.data.products);
        console.log(response.data);
        console.log(response.data.products);
      } catch (error) {
        console.error("데이터를 불러오는데 실패하였습니다: ", error);
      }
    }

    getProduct();

    const writeButton = document.querySelector(".writeButton");
    writeButton.addEventListener("click", scrollToTop);

    return () => {
      writeButton.removeEventListener("click", scrollToTop);
    };
  }, []);

  return (
    <>
      <Navbar setSearchTerm={setSearchTerm} />
      <div className="mainPageWrapper">
        <div className="mainPage" style={{ top: "90px", position: "absolute" }}>
          <button className="writeButton" onClick={handleWriteButtonClick}>
            <Link to="/write">판매글 작성</Link>
          </button>
          {products &&
            searchProducts(products, searchTerm).map((product) => (
              <ProductCard key={product.boardId} product={product} />
            ))}
        </div>
      </div>
      <button className="chattingBtn">
        <Link to="/chatting">⌨️</Link>
      </button>
    </>
  );
}

export default Main;
