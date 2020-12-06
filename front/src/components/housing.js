import React from "react";
import { Link } from "react-router-dom";
import "../styles/housing.css";
import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { Container, Row, Col } from "reactstrap";
import { ButtonGroup, DropdownButton } from "react-bootstrap";
import { useLocation } from "react-router-dom";

function Housing(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);
  const [hovered, setHovered] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [origPosts, setOrigPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  let textInput = React.createRef();
  let textInputProps =
    location.state === undefined ? "" : location.state.textInput;

  const handleClick = () => {
    const newSearch = textInput.current.value;
    setLoading(true);
    setPosts(
      origPosts.filter(
        (p) => p["result-hood"] && p["result-hood"].includes(newSearch)
      )
    );
    setLoading(false);
  };

  useEffect(() => {
    const getLoggedIn = async () => {
      try {
        const _loggedin = await fetch("/getlog", {
          method: "GET",
          credentials: "include",
        }).then((res) => res.json());
        setLoggedIn(_loggedin);
        console.log("logged in: ", _loggedin);
      } catch (err) {
        console.log("error");
      }
    };
    getLoggedIn();
  }, []);

  useEffect(() => {
    const getPosts = async () => {
      try {
        if (textInputProps !== null && textInputProps !== "") {
          setLoading(true);
          const _posts = await fetch("/getposts").then((res) => res.json());
          setOrigPosts(_posts);
          setLoading(false);
        } else {
          setLoading(true);
          const _posts = await fetch("/getposts").then((res) => res.json());
          setPosts(_posts);
          setOrigPosts(_posts);
          setLoading(false);
        }
      } catch (err) {
        console.log("error");
      }
    };
    getPosts();
  }, [textInputProps]);

  useEffect(() => {
    setPosts(
      origPosts.filter(
        (p) => p["result-hood"] && p["result-hood"].includes(textInputProps)
      )
    );
  }, [textInputProps, origPosts]);

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

  const renderNav = (loggedIn) => {
    if (!loggedIn) {
      return (
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
      );
    } else {
      return (
        <div
          className="navbar navbar-expand-lg navbar-light bg-light justify-content-end"
          role="navigation"
        >
          <Link to="/" className="logo-container">
            <h1 className="logo-header">HOMESWEET</h1>
          </Link>
          <ButtonGroup className="dropdown-menu-1">
            <DropdownButton
              id="dropdown-btn-menu"
              title=<i className="navbar-toggler-icon" />
            >
              <Button key="1" className="menu-btn">
                My Appointments
              </Button>
              <Button key="2" className="menu-btn">
                My Account
              </Button>
              <form className="form" action="/signout" method="post">
                <Button key="3" className="menu-btn" type="submit">
                  Sign Out
                </Button>
              </form>
            </DropdownButton>
          </ButtonGroup>
        </div>
      );
    }
  };

  const renderPosts = (posts, loading) => {
    if (loading) {
      return <h2>Loading...</h2>;
    } else if (posts.length === 0) {
      return <h2>No housing met your criteria.</h2>;
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
                          onError={(event) =>
                            event.target.setAttribute(
                              "src",
                              "./images/notf.png"
                            )
                          }
                          alt="housing"
                          className="housing-img"
                        />
                        {p.price}

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
        a["result-price"].replace("$", "").replace(",", "") -
        b["result-price"].replace("$", "").replace(",", "")
    );

    setPosts(sorted);
  };

  const filterHiToLo = () => {
    const sorted = [...posts].sort(
      (a, b) =>
        b["result-price"].replace("$", "").replace(",", "") -
        a["result-price"].replace("$", "").replace(",", "")
    );

    setPosts(sorted);
  };

  const filterOrig = () => {
    setPosts(origPosts);
  };

  return (
    <div>
      {renderNav(loggedIn)}

      <div className="house-full">
        <div className="inner">
          <div className="filters">
            <div className="search" id="search-2">
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
              <ButtonGroup className="dropdown">
                <DropdownButton title="Sort By:" id="dropdown-btn">
                  <Button key="1" className="filter-btn" onClick={filterLoToHi}>
                    Price (low to high)
                  </Button>
                  <Button key="2" className="filter-btn" onClick={filterHiToLo}>
                    Price (high to low){" "}
                  </Button>
                  <Button key="3" className="filter-btn" onClick={filterOrig}>
                    Random
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
