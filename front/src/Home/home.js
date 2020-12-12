import React from "react";
import { Link } from "react-router-dom";
import "./home.css";
import { useState } from "react";
import { useHistory } from "react-router";
import Navigation from "../components/navigation.js";

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
      <Navigation></Navigation>
      <section id="section1" role="main">
        <h1 className="discover">Rediscover Home</h1>
        <div className="subtitle">Find your perfect San Francisco housing.</div>
        <div className="search-container">
          <div className="search">
            <input
              aria-label="searchBox"
              type="text"
              className="searchTerm"
              ref={textInput}
              placeholder="Search by neighborhood..."
            />

            <button
              aria-label="searchButton"
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
