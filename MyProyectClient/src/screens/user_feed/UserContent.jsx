import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const UserContent = ({ userId }) => {
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const initialLoad = useRef(true);

  const fetchContent = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8081/api/auth/${userId}/content?page=${page}&size=${pageSize}`);
      if (response.data.length > 0) {
        setContent((prevContent) => {
          const newData = response.data.filter(
            (item) => !prevContent.some((existing) => existing.id === item.id)
          );
          return [...prevContent, ...newData];
        });
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialLoad.current) {
      fetchContent(0);
      initialLoad.current = false;
    }
  }, [userId, pageSize]);

  const handleScroll = useCallback(() => {
    const { innerHeight, scrollY } = window;
    const { scrollHeight } = document.documentElement;

    if (!loading && hasMore && scrollY + innerHeight >= scrollHeight - 1) {
      setCurrentPage((prevPage) => {
        fetchContent(prevPage + 1);
        return prevPage + 1;
      });
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div>
      <h2>User Content</h2>
      <ul>
        {content.map((item) => (
          <li key={item.id}>
            {item.contentType && item.contentType.startsWith("image/") && (
              <img src={item.url} alt={item.name} style={{ width: "200px" }} />
            )}
            {item.contentType && item.contentType.startsWith("video/") && (
              <video src={item.url} alt={item.name} style={{ width: "200px" }} />
            )}
            {item.content && (
              <div>
                <h3>{item.content}</h3>
                {item.description && <p>{item.description}</p>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserContent;
