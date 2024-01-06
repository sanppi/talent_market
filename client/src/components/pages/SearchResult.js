import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "../../styles/main.scss";
import "../../styles/searchresult.scss";

export default function SearchResults() {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const [searchParam, setSearchParam] = useState("");

  useEffect(() => {
    const searchParam = new URLSearchParams(location.search).get("search");
    setSearchParam(searchParam);

    if (searchParam) {
      const fetchSearchResults = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/search?search=${searchParam}`
          );
          if (Array.isArray(response.data)) {
            setSearchResults(response.data);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Search failed", error);
        }
      };

      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [location.search]);

  return (
    <>
      <span className="searchNotice">
        '{searchParam}'를 포함한 상품이 {searchResults.length}개 존재합니다.
      </span>
      <div className="searchResultsWrapper">
        <div className="searchResultsPage">
          {searchResults.map((product) => (
            <div key={product.boardId} className="searchResultCard">
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
          ))}
        </div>
      </div>
    </>
  );
}
