import React, { useState, useEffect } from "react";

import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Summariser = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [error2, setError] = useState(false);
  // RTK lazy query
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  // Load data from localStorage on mount
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("not submitting");
    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );
    console.log(existingArticle);
    if (existingArticle) return setArticle(existingArticle);
    // console.log("not submitting 1");
    const data = await getSummary({ articleUrl: article.url });
    // console.log("not submitting 2");
    // console.log(article.url);
    // console.log(data);
    // if (data) {
    if (data === undefined) {
      setError(true);
    } else {
      const newArticle = { ...article, summary: data };
      const updatedAllArticles = [newArticle, ...allArticles];
      console.log(updatedAllArticles);
      // update state and local storage
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  // copy the url and toggle the icon for user feedback
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  return (
    <section>
      {/* Search */}
      <div>
        <form className="" onSubmit={handleSubmit}>
          <img src={linkIcon} alt="link-icon" />

          <input
            type="url"
            placeholder="Paste the article link"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            onKeyDown={handleKeyDown}
            required
            style={{
              width: "25%",
              height: "20px",
              borderRadius: "20px",
              padding: "15px",
              margin: "15px",
            }}
            className="url_input peer" // When you need to style an element based on the state of a sibling element, mark the sibling with the peer class, and use peer-* modifiers to style the target element
          />

          <button
            type="submit"
            style={{
              borderRadius: "20px",
            }}
          >
            <p>Summarize</p>
          </button>
        </form>

        {/* Browse History */}
        <div style={{ marginLeft: "20%" }}>
          {/* if({allArticles.size > 1}){
            <h2 style={{ color: "white", fontSize: "45px" }}>Article Links</h2>
          } */}
          {allArticles.reverse().map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
              align="left"
            >
              <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt={copied === item.url ? "tick_icon" : "copy_icon"}
                />
              </div>
              <p style={{ color: "white" }}>
                {index}. {`${item.url.substring(0, 100)}...`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Display Result */}
      <div>
        {isFetching ? (
          <img src={loader} alt="loader" />
        ) : error ? (
          <p style={{ color: "white", fontSize: "40px" }}>
            Invalid article! Please add a valid article link.
            <br />
            <span>{error2.data && error.data.error}</span>
          </p>
        ) : (
          article.summary && (
            <div style={{ marginLeft: "15%", marginRight: "15%" }}>
              <h2 style={{ color: "white", fontSize: "40px" }}>
                Article Summary
              </h2>

              <div>
                <p style={{ color: "white", fontSize: "20px" }}>
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Summariser;
