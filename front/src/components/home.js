import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import { useState } from "react";

function Home() {
  let textInput = React.createRef();
  const [search, setSearch] = useState("");

  let newLinkToHousing = {
    pathname: "/housing",
    textInput: search,
  };

  const handleClick = () => {
    const newSearch = textInput.current.value;
    setSearch(newSearch);
  };

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
        <div className="subtitle">Find your perfect San Francisco housing.</div>
        <div class="search-container">
          <div class="search">
            <input
              type="text"
              class="searchTerm"
              ref={textInput}
              placeholder="Search by neighborhood..."
            />

            <button type="submit" class="searchButton" onClick={handleClick}>
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
