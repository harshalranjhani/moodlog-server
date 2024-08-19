const axios = require("axios");
const qs = require("qs");
require("dotenv").config();

const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret

const auth_token = Buffer.from(
  `${client_id}:${client_secret}`,
  "utf-8"
).toString("base64");

const getAuth = async () => {
  try {
    const token_url = "https://accounts.spotify.com/api/token";
    const data = qs.stringify({ grant_type: "client_credentials" });

    const response = await axios.post(token_url, data, {
      headers: {
        Authorization: `Basic ${auth_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data.access_token;
  } catch (error) {
    return { error: error.message };
  }
};

const getAvailableGenres = async () => {
  const access_token = await getAuth();

  const api_url =
    "https://api.spotify.com/v1/recommendations/available-genre-seeds";
  try {
    const response = await axios.get(api_url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data.genres;
  } catch (error) {
    return { error: error.message };
  }
};

const getRecommendationsFromSpotify = async (recs) => {
  const access_token = await getAuth();

  const api_url = `https://api.spotify.com/v1/recommendations?seed_genres=${recs}&limit=30`;

  try {
    const response = await axios.get(api_url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = { getRecommendationsFromSpotify }
