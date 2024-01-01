import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ProductDetailPage() {
  const [product, setProduct] = useState({});
  const { boardId } = useParams();

  useEffect(() => {
    async function getProductDetail() {
      try {
        console.log(`Requested boardId: ${boardId}`);
        const response = await axios.get(`http://localhost:8000/product/${boardId}`);

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
    <div>
      <h2>{product.title}</h2>
      <img
        src={`http://localhost:8000/static/userImg/${product.image}`}
        alt={product.title}
      />
      <p>{product.price}원</p>
      {/* <p>{product.rating}</p> */}
      <p>{product.content}</p>
    </div>
  );
}
