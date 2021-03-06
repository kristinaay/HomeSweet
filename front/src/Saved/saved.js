import React from "react";
import "./saved.css";
import { useState, useEffect } from "react";
import Navigation from "../components/navigation.js";
import Modal from "react-modal";
import { Button } from "react-bootstrap";
import { Container, Row, Col } from "reactstrap";

function Saved() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered] = useState([]);
  const [indexPost, setIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);
  const [change, setChanged] = useState(false);
  const getModal = () => {
    return showModal;
  };
  const [p, setP] = useState([null, [null]]);
  const indexLastPost = currentPage * postsPerPage;
  const indexFirstPost = indexLastPost - postsPerPage;
  const [currPosts, setCurrPosts] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }
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

  useEffect(() => {
    const getSavedPosts = async () => {
      setLoading(true);
      const _posts = await fetch("/getsavedposts", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user,
        }),
      }).then((res) => res.json());

      setPosts(_posts);
      setLoading(false);
    };
    getSavedPosts();
  }, [user, change]);

  useEffect(() => {
    const getCurrPosts = async () => {
      let curr = [];
      if (posts !== undefined && posts != null) {
        curr = posts.slice(indexFirstPost, indexLastPost);
      }
      setCurrPosts(curr);
    };
    getCurrPosts();
  }, [indexFirstPost, indexLastPost, posts]);

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
    if (p[7] !== undefined) {
      let arr = p[7].split(",");
      for (let i = 0; i < arr.length; i++) {
        items.push(
          <div className="indiv-img col-xs-6">
            <img
              src={
                arr
                  ? `${`${arr[i]}`.replace("50x50c", "600x450")}`
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
    }
  };

  const deletePost = async (username, title) => {
    let bool = window.confirm(
      "Are you sure you want to remove this post from favorites?"
    );
    if (bool) {
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
      setChanged(!change);
      closeModal();
    }
  };

  const updatePost = async (
    username,
    title,
    price,
    housinginfo,
    hood,
    date,
    body,
    address,
    images
  ) => {
    let notes = window.prompt("Add Notes to this Post: ");
    await fetch("/updatehousing", {
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
        notes: notes,
      }),
    });

    closeModal();
    await setChanged(!change);
  };

  const renderSavedPosts = (posts, loading) => {
    if (loading) {
      return <h2>Loading...</h2>;
    } else {
      return (
        <div>
          <Modal isOpen={showModal}>
            <div className="modal-header">
              <div className="buttons-post">
                <button className="heart" tab-index="0">
                  <img
                    onClick={() => {
                      updatePost(
                        user,
                        p[0],
                        p[1],
                        p[2],
                        p[3],
                        p[4],
                        p[5],
                        p[6],
                        p[7]
                      );
                    }}
                    src={"./images/edit.png"}
                    alt="pen button to edit the post"
                  />
                </button>
                <button
                  onClick={() => {
                    deletePost(user, p[0]);
                  }}
                  className="heart"
                  tab-index="0"
                >
                  <img
                    src={"./images/delete.png"}
                    alt="trash button to delete the post"
                  />
                </button>
                <button
                  onClick={closeModal}
                  className="close-btn"
                  tab-index="0"
                >
                  X
                </button>
              </div>
              <h2 className="modal-header-2">{p[0]}</h2>
            </div>

            <div className="modal-body">
              <div className="modal-img"></div>
              <div>
                <b>Your Notes: </b>
                {p[8]
                  ? p[8]
                  : " None yet. Click the pen icon in the top right corner to annotate this post!"}
              </div>{" "}
              <br />
              <div>
                <b>Price:</b> {p[1]}
              </div>
              <div>
                <b>Neighborhood:</b> {p[3]}
              </div>
              <div>
                <b>Map Address:</b> {p[6]}
              </div>
              <div>
                <b>Date Posted:</b> {p[4]}
              </div>
              <div>
                <b>Housing Information:</b> {p[2]}
              </div>
              <div>
                <b>About:</b>
                {`${p[5]}`
                  .replaceAll("&amp;", "and")
                  .replace(/<[^>]*>?/gm, "")
                  .replace("QR Code Link to This Post", "")}
              </div>
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
                      <div className="card-header-1">{p.title}</div>
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
                              p.images.split(",")[0]
                                ? `${p.images
                                    .split(",")[0]
                                    .replace("50x50c", "600x450")}`
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
    }
  };

  return (
    <div>
      <Navigation></Navigation>

      <section className="house-full" id="saved" role="main">
        <h1 className="pg-heading">Saved Posts </h1>
        <div className="rendered">{renderSavedPosts(currPosts, loading)} </div>

        {Pagination(
          postsPerPage,
          posts ? posts.length : 0,
          paginate,
          currentPage
        )}
      </section>
      <footer className="other-footer"></footer>
    </div>
  );
}

export default Saved;
