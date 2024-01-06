import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { ProductCard } from "./Main.js";

export default function CategoryResult() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const category = new URLSearchParams(location.search).get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/category?category=${category}`
        );
        setProducts(response.data.products);
      } catch (error) {
        console.error("Cannot fetch products", error);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <>
      <span className="categoryNotice">
        {category} 카테고리 상품이 {products.length}개 존재합니다.
      </span>
      <div className="categoryProducts">
        {products.map((product) => (
          <ProductCard key={product.boardId} product={product} />
        ))}
      </div>
    </>
  );
}
