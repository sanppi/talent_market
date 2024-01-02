import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../styles/productdetail.scss";

export default function ProductDetailPage() {
  const [product, setProduct] = useState({});
  const { boardId } = useParams();

  useEffect(() => {
    async function getProductDetail() {
      try {
        console.log(`Requested boardId: ${boardId}`);
        const response = await axios.get(
          `http://localhost:8000/product/${boardId}`
        );

        setProduct(response.data.product);
        console.log(response.data);
        console.log(response.data.product);
      } catch (error) {
        console.error("데이터를 불러오는데 실패하였습니다: ", error);
      }
    }
    getProductDetail();
  }, [boardId]);

  return (
    <div className="productDetail">
      <div className="productInfo">
        <div>
          <img
            className="productImage"
            src={`http://localhost:8000/static/userImg/${product.image}`}
            alt={product.title}
          />
        </div>
        <div className="productDescription">
          <div className="productTitle">{product.title}</div>
          <div className="productPrice">
            <p>{product.price}원</p>
          </div>
          <div>(판매자 정보,...?넣기)</div>
          <button>연락하기</button>
        </div>
      </div>
      <hr />
      <div className="productContent">
        <p>{product.content}</p>
      </div>
    </div>
  );
}
