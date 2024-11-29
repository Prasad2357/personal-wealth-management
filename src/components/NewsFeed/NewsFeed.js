// import React, { useEffect, useState } from "react";
// import { Spin, Card } from "antd";
// import axios from "axios";

// const NewsFeed = () => {
//   const [news, setNews] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const NEWS_API_URL = "https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=237063670ba54165ac9952355a2ddbc0";

//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         const response = await axios.get(NEWS_API_URL);
//         setNews(response.data.articles);
//       } catch (error) {
//         console.error("Error fetching news:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchNews();
//   }, []);

//   return (
//     <Card bordered={true} style={{ minWidth: "100%" }}>
//       <h2>Latest Business News</h2>
//       {isLoading ? (
//         <Spin tip="Loading News..." />
//       ) : (
//         <ul>
//           {news.slice(0, 5).map((article, index) => (
//             <li key={index}>
//               <a href={article.url} target="_blank" rel="noopener noreferrer">
//                 {article.title}
//               </a>
//             </li>
//           ))}
//         </ul>
//       )}
//     </Card>
//   );
// };

// export default NewsFeed;









/*
import React, { useEffect, useState } from 'react';
import './NewsFeed.css';

const NewsFeed = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Fetch news from the backend API
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:5000/news');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="news-feed">
      <h2>Latest Financial News</h2>
      {news.length === 0 ? (
        <p>Loading news...</p>
      ) : (
        news.map((article, index) => (
          <div key={index} className="news-item">
            <h3><a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a></h3>
            <p>{article.description}</p>
            <p><em>{new Date(article.publishedAt).toLocaleString()}</em></p>
          </div>
        ))
      )}
    </div>
  );
};

export default NewsFeed;

*/
