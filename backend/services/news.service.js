const axios = require("axios");

exports.getCyberNews = async () => {
  const res = await axios.get(
    "https://newsapi.org/v2/everything?q=cybersecurity&language=en&sortBy=publishedAt",
    {
      headers: { "X-Api-Key": process.env.NEWS_API_KEY }
    }
  );

  return res.data.articles.slice(0, 5); // top 5
};
