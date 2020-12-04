import React from "react";
import { Link } from "react-router-dom";
import "../styles/housing.css";
import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { Container, Row, Col } from "reactstrap";

function Housing(props) {
  const posts = props.posts;
  const loading = props.loading;
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);

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
            {posts.map((p) => (
              <Col md="4">
                <div className="container-card">
                  <h4 className="card-header-1">{p["result-title"]}</h4>
                  <img
                    src={`${p.images[0].replace("50x50c", "600x450")}`}
                    alt="housing"
                  />
                  <div className="card-body">
                    {p.postingbody
                      .replace(/<[^>]*>?/gm, "")
                      .replace("QR Code Link to This Post", "")}
                  </div>
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

    console.log(totalPosts);
    console.log(pageNumbers);

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
        <div className="inner">
          <div className="rendered">{renderPosts(currPosts, loading)} </div>
          {Pagination(postsPerPage, posts.length, paginate, currentPage)}
        </div>
      </section>
      <footer className="other-footer">
        Image by @bradencollum on Unsplash.
      </footer>
    </div>
  );
}

export default Housing;
