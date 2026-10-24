
import { useState } from "react";
import "./App.css";

// Deployed backend API
const API_URL = "https://youtube-explorer-server.vercel.app/api/search";

function App() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [nextCursor, setNextCursor] = useState("");

  // Fetch videos from the deployed backend
  const fetchVideos = async (searchTerm, cursor = "") => {
    const params = new URLSearchParams({
      q: searchTerm,
    });

    if (cursor) {
      params.set("cursor", cursor);
    }

    const response = await fetch(
      `${API_URL}?${params.toString()}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.details?.message ||
          data.error ||
          "Failed to fetch videos."
      );
    }

    const results = (data.contents || [])
      .filter((item) => item.type === "video" && item.video)
      .map((item) => item.video);

    return {
      videos: results,
      cursorNext: data.cursorNext || "",
    };
  };

  // Search videos
  const searchVideos = async (e) => {
    e.preventDefault();

    const searchTerm = query.trim();

    if (!searchTerm) {
      setError("Please enter a video name to search.");
      setVideos([]);
      setHasSearched(false);
      setNextCursor("");
      return;
    }

    setLoading(true);
    setError("");
    setVideos([]);
    setNextCursor("");
    setSearchedQuery(searchTerm);
    setHasSearched(true);

    try {
      const result = await fetchVideos(searchTerm);

      setVideos(result.videos);
      setNextCursor(result.cursorNext);
    } catch (err) {
      console.error("Search error:", err);

      setError(
        err.message ||
          "Could not load videos. Please check your backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load more videos
  const loadMoreVideos = async () => {
    if (!nextCursor || loadingMore) return;

    setLoadingMore(true);
    setError("");

    try {
      const result = await fetchVideos(
        searchedQuery,
        nextCursor
      );

      setVideos((previousVideos) => {
        const existingIds = new Set(
          previousVideos.map((video) => video.videoId)
        );

        const newVideos = result.videos.filter(
          (video) => !existingIds.has(video.videoId)
        );

        return [...previousVideos, ...newVideos];
      });

      setNextCursor(result.cursorNext);
    } catch (err) {
      console.error("Load more error:", err);

      setError(
        err.message ||
          "Could not load more videos. Please try again."
      );
    } finally {
      setLoadingMore(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setVideos([]);
    setError("");
    setSearchedQuery("");
    setHasSearched(false);
    setNextCursor("");
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>▶ YouTube Explorer</h1>
        <p>Discover videos using YouTube Data API</p>
      </header>

      <main className="container">
        {/* Search Form */}
        <form className="search-form" onSubmit={searchVideos}>
          <input
            type="text"
            placeholder="Search videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search YouTube videos"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Error Message */}
        {error && !loading && (
          <div className="error" role="alert">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state" role="status">
            <div className="spinner"></div>
            <p>Finding amazing videos...</p>
            <span>Please wait a moment</span>
          </div>
        )}

        {/* Search Results Header */}
        {!loading && !error && hasSearched && videos.length > 0 && (
          <div className="results-header">
            <div>
              <h2>Search Results</h2>
              <p>
                Found {videos.length} videos for{" "}
                <strong>"{searchedQuery}"</strong>
              </p>
            </div>

            <button
              className="clear-button"
              type="button"
              onClick={clearSearch}
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Empty Search Results */}
        {!loading && !error && hasSearched && videos.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔎</div>
            <h2>No videos found</h2>
            <p>
              We couldn't find videos for "{searchedQuery}".
              Try different keywords.
            </p>
          </div>
        )}

        {/* Welcome Screen */}
        {!loading && !error && !hasSearched && (
          <div className="welcome-state">
            <div className="welcome-icon">▶</div>
            <h2>Discover something interesting</h2>
            <p>
              Search for your favorite videos, creators, or topics.
            </p>
          </div>
        )}

        {/* Video Grid */}
        {!loading && videos.length > 0 && (
          <section className="video-grid">
            {videos.map((video) => (
              <a
                className="video-card"
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                key={video.videoId}
                aria-label={`Watch ${video.title || "YouTube video"}`}
              >
                <div className="thumbnail-container">
                  <img
                    src={
                      video.thumbnails?.[0]?.url ||
                      `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
                    }
                    alt={video.title || "YouTube video thumbnail"}
                    loading="lazy"
                  />

                  <div className="play-overlay">
                    <div className="play-button">▶</div>
                  </div>

                  {video.lengthSeconds != null && (
                    <span className="thumbnail-duration">
                      {Math.floor(video.lengthSeconds / 60)}:
                      {String(video.lengthSeconds % 60).padStart(2, "0")}
                    </span>
                  )}
                </div>

                <div className="video-info">
                  <h3>{video.title || "Untitled video"}</h3>
                  <p>{video.author?.title || "Unknown channel"}</p>

                  <small>
                    {typeof video.stats?.views === "number"
                      ? `${video.stats.views.toLocaleString()} views`
                      : "Views unavailable"}
                  </small>
                </div>
              </a>
            ))}
          </section>
        )}

        {/* Load More Button */}
        {!loading && !error && videos.length > 0 && nextCursor && (
          <div className="load-more-container">
            <button
              className="load-more-button"
              type="button"
              onClick={loadMoreVideos}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading more..." : "Load More Videos"}
            </button>
          </div>
        )}

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="loading-more-state" role="status">
            <div className="spinner"></div>
            <p>Loading more videos...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
