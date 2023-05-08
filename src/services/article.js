// import { createApi, fetchBaseQuery }article from "@reduxjs/toolkit/query/react";

// const rapidApiKey = process.env.VITE_RAPID_API_ARTICLE_KEY;

// export const articleApi = createApi({
//   reducerPath: "articleApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "https://article-extractor-and-summarizer.p.rapidapi.com/",
//     prepareHeaders: (headers) => {
//       headers.set("X-RapidAPI-Key", rapidApiKey);
//       headers.set(
//         "X-RapidAPI-Host",
//         "article-extractor-and-summarizer.p.rapidapi.com"
//       );

//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     getSummary: builder.query({
//       // encodeURIComponent() function encodes special characters that may be present in the parameter values
//       // If we do not properly encode these characters, they can be misinterpreted by the server and cause errors or unexpected behavior. Thus that RTK bug
//       query: (params) =>
//         `summarize?url=${encodeURIComponent(params.articleUrl)}&length=3`,
//     }),
//   }),
// });

// export const { useLazyGetSummaryQuery } = articleApi;

// import { eventWrapper } from "@testing-library/user-event/dist/utils";
import axios from "axios";
import { useState } from "react";

const rapidApiKey = process.env.REACT_APP_API_ARTICLE_KEY;

export const useLazyGetSummaryQuery = () => {
  // const [data, setData] = useState(null);
  // const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  // const [articleUrl, setArticleUrl] = useState("");
  // const axios = require("axios");

  const getSummary = async ({ articleUrl }) => {
    // console.log("Get it here");
    const options = {
      method: "GET",
      url: "https://article-extractor-and-summarizer.p.rapidapi.com/summarize",
      params: {
        url: articleUrl,
        length: "3",
      },
      headers: {
        "X-RapidAPI-Key": rapidApiKey,
        "X-RapidAPI-Host": "article-extractor-and-summarizer.p.rapidapi.com",
      },
    };

    try {
      setIsFetching(true);
      // setArticleUrl(articleUrl);
      const response = await axios.request(options);
      // setData(response.data.summary);
      console.log(response.data.summary);
      return response.data.summary;
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }

    // return data;
    // try {
    //   setIsFetching(true);
    //   const response = await axios.request(
    //     `https://article-extractor-and-summarizer.p.rapidapi.com/summarize?url=${encodeURIComponent(
    //       articleUrl
    //     )}&length=3`,
    //     {
    //       headers: {
    //         "X-RapidAPI-Key": rapidApiKey,
    //         "X-RapidAPI-Host":
    //           "article-extractor-and-summarizer.p.rapidapi.com",
    //       },
    //     }
    //   );

    //   setData(response.data);
    //   console.log("data1: " + response.data);
    // } catch (error) {
    //   console.log("data2: " + data);
    //   console.error(error);
    //   setError(error);
    // } finally {
    //   setIsFetching(false);
    // }
  };

  //   const summary = data ? data.join(" ") : "";
  return [getSummary, { error, isFetching }];
};
