import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  return (
    <div>
      <div
        className="navbar navbar-expand-lg navbar-light bg-light justify-content-end"
        role="navigation"
      >
        <Link to="/" className="logo-container">
          <h1 className="logo-header">HOMESWEET</h1>
        </Link>
        <Link to="/signin" className="nav-links">
          Sign In
        </Link>
        <Link to="/signup" className="nav-links">
          Sign Up
        </Link>
      </div>
      <section id="section1">
        <h2 className="discover">Rediscover Home</h2>
        <div className="subtitle">
          Find your perfect San Francisco housing with HomeSweet.
        </div>
        <div class="search-container">
          <div class="search">
            <input
              type="text"
              class="searchTerm"
              placeholder="Enter a neighborhood in San Francisco to start searching..."
            />
            <button type="submit" class="searchButton">
              <i class="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </section>
      <footer>Image by @bradencollum on Unsplash.</footer>
    </div>
  );
}

export default Home;
