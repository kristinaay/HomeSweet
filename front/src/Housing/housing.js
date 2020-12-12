import React from "react";
import Modal from "react-modal";
import "./housing.css";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Container, Row, Col } from "reactstrap";
import { ButtonGroup, DropdownButton } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Navigation from "../components/navigation.js";

function Housing(props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);
  const [hovered, setHovered] = useState([]);
  const [posts, setPosts] = useState([]);
  const [origPosts, setOrigPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [p, setP] = useState([null, [null]]);
  const [imgHovered, setImgHovered] = useState([]);
  const [imgString, setImgString] = useState([]);
  const [heartSaved, setHeartSaved] = useState([]);
  const [indexPost, setIndex] = useState(0);
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUser] = useState("");
  const urlParams = new URLSearchParams(window.location.search);
  const user = urlParams.get("username");
  if (user !== null && user !== undefined && user !== "") {
    localStorage.setItem("username", user);
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

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
    const saveHeartsinDB = async () => {
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
    saveHeartsinDB();
  }, [heartSaved]);

  useEffect(() => {
    const dbSavedHearts = async () => {
      const saved = await fetch("/getsavedhearts", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
        }),
      });
      const arr = [];
      for (let i = 0; i < 3010; i++) {
        arr.push(false);
      }
      const newArr = saved ? saved.heartsarr : arr;
      setHeartSaved(newArr);
    };
    dbSavedHearts();
  }, [username]);

  useEffect(() => {
    const fillImgString = () => {
      try {
        const arr = [];
        for (let i = 0; i < 3010; i++) {
          arr.push("./images/heart.png");
        }
        setImgHovered(arr);
      } catch (err) {
        console.log("error", err);
      }
    };
    fillImgString();
  }, []);
  useEffect(() => {
    const fillImgHovered = () => {
      try {
        const arr = [];
        for (let i = 0; i < 3010; i++) {
          arr.push(false);
        }
        setImgHovered(arr);
      } catch (err) {
        console.log("error", err);
      }
    };
    fillImgHovered();
  }, []);

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
  let textInput = React.createRef();
  let textInputProps =
    location.state === undefined ? "" : location.state.textInput;

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
    const getImgString = async () => {
      let copyArr = [...heartSaved];
      let value;
      if (heartSaved[indexPost] && imgHovered[indexPost]) {
        value = "./images/heart-fill.png";
      } else if (!heartSaved[indexPost] && imgHovered[indexPost]) {
        value = "./images/heart-hover.png";
      } else if (heartSaved[indexPost] && !imgHovered[indexPost]) {
        value = "./images/heart-fill.png";
      } else if (!heartSaved[indexPost] && !imgHovered[indexPost]) {
        value = "./images/heart.png";
      }
      copyArr[indexPost] = value;
      setImgString(copyArr);
    };
    getImgString();
  }, [heartSaved, imgHovered, indexPost]);

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

  const getModal = () => {
    return showModal;
  };

  const indexLastPost = currentPage * postsPerPage;
  const indexFirstPost = indexLastPost - postsPerPage;
  const currPosts = posts.slice(indexFirstPost, indexLastPost);

  const clickedInfo = (p, index) => {
    setIndex(index);
    console.log(index);
    setP(Object.values(p));
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const renderImg = () => {
    const items = [];
    for (let i = 0; i < p[1].length; i++) {
      items.push(
        <div className="indiv-img col-xs-6">
          <img
            src={
              p[1]
                ? `${`${p[1][i]}`.replace("50x50c", "600x450")}`
                : "./images/notf.png"
            }
            onError={(event) =>
              event.target.setAttribute("src", "./images/notf.png")
            }
            alt="housing"
            className="housing-img-2"
          />
        </div>
      );
    }

    return (
      <div>
        {" "}
        <div className="container-fluid" id="cont">
          <div className="row">{items}</div>
        </div>
      </div>
    );
  };

  const changeSavedHeart = (index, value) => {
    let copyArr = [...heartSaved];
    copyArr[index] = value;
    setHeartSaved(copyArr);
  };

  const changeImgHovered = (value) => {
    let copyArr = [...imgHovered];
    copyArr[indexPost] = value;
    setImgHovered(copyArr);
  };
  const savePost = async (
    title,
    price,
    housinginfo,
    hood,
    date,
    body,
    address,
    images
  ) => {
    let val = heartSaved[indexPost];
    changeSavedHeart(indexPost, !val);
    if (!heartSaved[indexPost]) {
      try {
        console.log("Add", username);
        await fetch("/savehousing", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            title: title,
            price: price,
            housinginfo: housinginfo,
            hood: hood,
            date: date,
            body: body,
            address: address,
            images: images,
          }),
        });
      } catch (err) {
        console.log("error", err);
      }
    } else {
      console.log("Delete");
      try {
        await fetch("/deletehousing", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            title: title,
          }),
        });
      } catch (err) {
        console.log("error", err);
      }
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
        <Modal isOpen={showModal}>
          <div className="modal-header">
            <div className="buttons-post">
              {loggedIn && (
                <button
                  onMouseLeave={() => changeImgHovered(false)}
                  onMouseOver={() => changeImgHovered(true)}
                  onClick={() =>
                    savePost(
                      `${p[3]}`,
                      `${p[4]}`,
                      `${p[5]}`,
                      `${p[6]}`,
                      `${p[8]}`,
                      `${p[9]}`,
                      `${p[13]}`,
                      `${p[1]}`
                    )
                  }
                  className="heart"
                  tab-index="0"
                >
                  <img
                    src={imgString[indexPost]}
                    alt="heart button to save a post"
                  />
                </button>
              )}
              <button onClick={closeModal} className="close-btn" tab-index="0">
                X
              </button>
            </div>
            <h2 className="modal-header-2">{p[3]}</h2>
          </div>

          <div className="modal-body">
            <div className="modal-img"></div>
            <div>
              <b>Price:</b> {p[4]}
            </div>
            <div>
              <b>Neighborhood:</b> {p[6]}
            </div>
            <div>
              <b>Map Address:</b> {p[13]}
            </div>
            <div>
              <b>Date posted:</b> {p[8]}
            </div>
            <div>
              <b>Housing information:</b> {p[5]}
            </div>
            <div>
              <b>About:</b>
              {`${p[9]}`
                .replaceAll("&amp;", "and")
                .replace(/<[^>]*>?/gm, "")
                .replace("QR Code Link to This Post", "")}
            </div>{" "}
          </div>

          <div className="modal-img">{renderImg()}</div>
        </Modal>

        <Container>
          <Row>
            {posts.map((p, index) => (
              <Col md="4">
                <div className="container-card">
                  {" "}
                  <b>
                    <div className="card-header-1">{p["result-title"]}</div>
                  </b>
                  {getHov(index) && (
                    <div
                      className="moreinfo"
                      onMouseLeave={() => changeHovered(index, false)}
                      onMouseOver={() => changeHovered(index, true)}
                      tabIndex="0"
                    >
                      <Button
                        className="click"
                        onClick={() => clickedInfo(p, index)}
                      >
                        Click for more info!{" "}
                      </Button>
                    </div>
                  )}
                  {!getHov(index) && (
                    <div className="whole-card">
                      <div
                        className="card-body-1"
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
      <Navigation></Navigation>

      <div className="house-full" role="main">
        <h1 className="pg-heading">All Housing </h1>
        <div className="inner">
          <div className="filters">
            <div className="search" id="search-2">
              <input
                type="text"
                className="searchTerm"
                ref={textInput}
                placeholder="Search by neighborhood..."
                aria-label="searchBox"
              />
              <button
                type="submit"
                className="searchButton"
                onClick={handleClick}
              >
                <i
                  className="fa fa-search"
                  aria-hidden="true"
                  aria-label="searchButton"
                ></i>
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
                    Default
                  </Button>
                </DropdownButton>
              </ButtonGroup>
            </div>
          </div>
          <div className="rendered">{renderPosts(currPosts, loading)} </div>
          {Pagination(postsPerPage, posts.length, paginate, currentPage)}
        </div>
      </div>

      <footer className="other-footer"></footer>
    </div>
  );
}

export default Housing;
