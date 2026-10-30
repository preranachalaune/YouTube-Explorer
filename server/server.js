const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const express = require("express");
const cors = require("cors");

const app = express();

// Allow requests from local and deployed Vite frontends
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://you-tube-explorer-front-git-e84fac-chalauneprena-7467s-projects.vercel.app",
  "https://youtube-explorer-fresh-hgxx.vercel.app",
  "https://youtube-explorer-frontend.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
  })
);

app.use(express.json());

// Check whether backend is running
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "YouTube Data backend is running!",
  });
});

// Search YouTube videos with cursor pagination
app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.q?.trim();
    const cursor = req.query.cursor;

    // Validate search query
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Please enter a search keyword.",
      });
    }

    // Validate cursor if provided
    if (cursor !== undefined && typeof cursor !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid cursor parameter.",
      });
    }

    // Check whether RapidAPI key exists
    if (!process.env.RAPIDAPI_KEY) {
      console.error("RapidAPI key is missing from environment variables.");

      return res.status(500).json({
        success: false,
        message: "Server configuration error. Please try again later.",
      });
    }

    // Build RapidAPI URL
    const url = new URL(
      "https://youtube-data8.p.rapidapi.com/search/"
    );

    url.searchParams.set("q", query);
    url.searchParams.set("hl", "en");
    url.searchParams.set("gl", "US");

    // Forward cursor for the next page
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }

    // Request data from RapidAPI
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host":
          process.env.RAPIDAPI_HOST ||
          "youtube-data8.p.rapidapi.com",
      },
    });

    // Parse API response safely
    let data;

    try {
      data = await response.json();
    } catch {
      console.error("RapidAPI returned an invalid JSON response.");

      return res.status(502).json({
        success: false,
        message: "Invalid response received from YouTube API.",
      });
    }

    // Handle RapidAPI errors
    if (!response.ok) {
      console.error("RapidAPI status:", response.status);

      if (response.status === 429) {
        return res.status(429).json({
          success: false,
          message: "API limit reached. Please try again later.",
        });
      }

      return res.status(502).json({
        success: false,
        message: "Unable to fetch YouTube videos. Please try again.",
      });
    }

    // Return API response including cursorNext
    return res.status(200).json(data);
  } catch (error) {
    console.error("Search error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong on the server.",
    });
  }
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});