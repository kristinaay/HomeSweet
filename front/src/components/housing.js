import React from "react";
import { Link } from "react-router-dom";
import "../styles/housing.css";
import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { Container, Row, Col } from "reactstrap";
import { ButtonGroup, DropdownButton } from "react-bootstrap";

function Housing() {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);
  const [hovered, setHovered] = useState([]);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const _posts = await fetch("/getposts").then((res) => res.json());
        setPosts(_posts);
        console.log("done");
        setLoading(false);
      } catch (err) {
        console.log("error");
      }
    };
    getPosts();
  }, []);

  useEffect(() => {
    const getHovered = () => {
      try {
        const arr = [];
        for (let i = 0; i < 3010; i++) {
          arr.push(false);
        }
        setHovered(arr);
      } catch (err) {
        console.log("error", err);
      }
    };
    getHovered();
  }, []);

  const changeHovered = (index, value) => {
    let copyArr = [...hovered];
    copyArr[index] = value;
    setHovered(copyArr);
  };

  const getHov = (index) => {
    return hovered[index];
  };

  const indexLastPost = currentPage * postsPerPage;
  const indexFirstPost = indexLastPost - postsPerPage;
  const currPosts = posts.slice(indexFirstPost, indexLastPost);

  const renderPosts = (posts, loading) => {
    if (loading) {
      return <h2>Loading...</h2>;
    }

    return (
      <div>
        <Container>
          <Row>
            {posts.map((p, index) => (
              <Col md="4">
                <div className="container-card">
                  {" "}
                  <h4 className="card-header-1">{p["result-title"]}</h4>
                  {getHov(index) && (
                    <div
                      className="moreinfo"
                      onMouseLeave={() => changeHovered(index, false)}
                      onMouseOver={() => changeHovered(index, true)}
                    >
                      Click for more info!
                    </div>
                  )}
                  {!getHov(index) && (
                    <div className="whole-card">
                      <div
                        className="card-body"
                        id="card-body-1"
                        onMouseLeave={() => changeHovered(index, false)}
                        onMouseOver={() => changeHovered(index, true)}
                      >
                        <img
                          src={
                            p.images[0]
                              ? `${p.images[0].replace("50x50c", "600x450")}`
                              : "./images/notf.png"
                          }
                          onerror="this.onerror=null;this.src='./images/notf.png';"
                          alt="housing"
                          className="housing-img"
                        />

                        {p.postingbody
                          .replace(/<[^>]*>?/gm, "")
                          .replace("QR Code Link to This Post", "")}
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    );
  };
  const paginate = (pageNumber, totalPosts) => {
    if (pageNumber === "<<") {
      setCurrentPage(1);
    } else if (pageNumber === ">>") {
      setCurrentPage(Math.ceil(totalPosts / 12));
    } else {
      setCurrentPage(pageNumber);
    }
  };

  const Pagination = (postsPerPage, totalPosts, paginate, currentPage) => {
    const pageNumbers = [];

    const pages = Math.ceil(totalPosts / 12);
    if (currentPage <= 5) {
      currentPage = 5;
    }

    if (currentPage >= pages - 5) {
      currentPage = pages - 5;
    }
    pageNumbers.push("<<");

    for (
      let i = Math.max(1, currentPage - 5);
      i <= Math.min(currentPage + 5, totalPosts);
      i++
    ) {
      pageNumbers.push(i);
    }
    pageNumbers.push(">>");

    return (
      <nav className="pag">
        <ol className="pagination">
          {pageNumbers.map((i) => (
            <li key={i} className="page-item">
              <Button
                onClick={() => paginate(i, totalPosts)}
                className="page-link"
              >
                {i}
              </Button>
            </li>
          ))}
        </ol>
      </nav>
    );
  };

  const filterLoToHi = () => {
    const sorted = [...posts].sort(
      (a, b) =>
        b["result-price"].replace("$", "").replace(",", "") -
        a["result-price"].replace("$", "").replace(",", "")
    );

    setPosts(sorted);
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
      <div className="house-full">
        <div className="inner">
          <div className="filters">
            <div class="search" id="search-2">
              <input
                type="text"
                class="searchTerm"
                placeholder="Search by neighborhood..."
              />
              <button type="submit" class="searchButton">
                <i class="fa fa-search" aria-hidden="true"></i>
              </button>
              <ButtonGroup className="dropdown">
                <DropdownButton title="Sort By:" id="dropdown-btn">
                  <Button key="1" className="filter-btn" onClick={filterLoToHi}>
                    Price (low to high)
                  </Button>
                  <Button key="2" className="filter-btn">
                    Price (high to low){" "}
                  </Button>
                  <Button key="3" className="filter-btn">
                    Date posted{" "}
                  </Button>
                </DropdownButton>
              </ButtonGroup>
            </div>
          </div>
          <div className="rendered">{renderPosts(currPosts, loading)} </div>
          {Pagination(postsPerPage, posts.length, paginate, currentPage)}
        </div>
      </div>

      <footer className="other-footer">
        Image by @bradencollum on Unsplash.
      </footer>
    </div>
  );
}

export default Housing;
