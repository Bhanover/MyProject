import React, { useState, useEffect } from "react";
import axios from "axios";

const UserContent = ({ userId }) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(0);
  const [count, setCount] = useState(3);
  const [hasMore, setHasMore] = useState(true);

  const fetchContent = async () => {
    if (hasMore) {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8081/api/auth/${userId}/content`,
          {
            params: {
              start: start,
              count: count,
            },
          }
        );
        
        const processedContent = response.data.map(item => {
          if (item.entityType === 'file') {
            return {
              id: item.id,
              url: item.url,
              contentType: item.contentType,
              filename: item.filename,
              fileDescription: item.fileDescription,
              entityType: item.entityType,
            }
          } else if (item.entityType === 'publication') {
            return {
              id: item.id,
              content: item.content,
              creationTime: item.creationTime,
              entityType: item.entityType,
            }
          }
        });

        setContent((prevContent) => [...prevContent, ...processedContent]);
        
        if (response.data.length < count) {
          setHasMore(false);
        } else {
          setStart(start + count);
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchContent();
  };

  useEffect(() => {
    fetchContent();
  }, [userId]);

  return (
    <div>
      <h2>User Content</h2>
      <ul>
        {content.map((item) => (
          <li key={item.id}>
            {item.contentType && item.contentType.startsWith("image/") && (
              <img
                src={item.url}
                alt={item.filename}
                style={{ width: "200px" }}
              />
            )}
            {item.contentType && item.contentType.startsWith("video/") && (
              <video
                src={item.url}
                alt={item.filename}
                style={{ width: "200px" }}
              />
            )}
            {item.content && (
              <div>
                <h3>Esto es una publicacion {item.content}</h3>
                {item.description && <p>{item.description}</p>}
              </div>
            )}
          </li>
        ))}
      </ul>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        hasMore && (
          <button onClick={handleLoadMore} disabled={loading}>
            Cargar más
          </button>
        )
      )}
    </div>
  );
};

export default UserContent;
