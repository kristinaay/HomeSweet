import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";
import { useState } from "react";
import { useHistory } from "react-router";

function Home() {
  let textInput = React.createRef();
  const history = useHistory();

  const handleClick = () => {
    const newSearch = textInput.current.value;

    history.push({
      pathname: "/housing",
      state: { textInput: newSearch },
    });
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
        <div className="search-container">
          <div className="search">
            <input
              type="text"
              className="searchTerm"
              ref={textInput}
              placeholder="Search by neighborhood..."
            />

            <button
              type="submit"
              className="searchButton"
              onClick={handleClick}
            >
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </section>
      <footer>Image by @bradencollum on Unsplash.</footer>
    </div>
  );
}

export default Home;
