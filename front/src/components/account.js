import React from "react";
import { Link } from "react-router-dom";
import "../styles/account.css";
import { ButtonGroup, DropdownButton, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

function Account() {
  const [loggedIn, setLoggedIn] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get("error");
  const msg = urlParams.get("msg");

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
              <Link to="/housing">
                <Button key="1" className="menu-btn">
                  See All Housing
                </Button>
              </Link>

              <Link to="/appointments">
                <Button key="1" className="menu-btn">
                  My Appointments
                </Button>
              </Link>
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
  return (
    <div>
      {renderNav(loggedIn)}
      <section id="section1">
        <div className="account">
          <div className="container-fluid d-flex justify-content-center">
            <div className="acccard">
              <div className="card-header" id="my-acc-header">
                <h3>My Account</h3>
              </div>
              <div className="card-body" id="my-acc-body">
                <form action="/updateuser" method="POST" className="form-1">
                  <div className="form-group-1">
                    <label htmlFor="username">Current Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-control"
                      placeholder="Enter current username"
                    />
                  </div>
                  <div className="form-group-1">
                    <label htmlFor="newusername">New Username</label>
                    <input
                      type="text"
                      id="newusername"
                      name="newusername"
                      className="form-control"
                      placeholder="Enter new username"
                    />
                  </div>
                  <div className="form-group-1">
                    <input
                      type="submit"
                      value="Update Username"
                      className="edit-acc-btn"
                    />
                  </div>
                </form>
                <form action="/updatepass" method="POST" className="form-1">
                  <div className="form-group-1">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username-1"
                      name="username"
                      className="form-control"
                      placeholder="Enter current username"
                    />
                  </div>
                  <div className="form-group-1">
                    <label htmlFor="newpassword">New Password</label>
                    <input
                      type="password"
                      id="newpassword"
                      name="newpassword"
                      className="form-control"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="form-group-1">
                    <input
                      type="submit"
                      value="Update Password"
                      className="edit-acc-btn"
                    />
                  </div>
                </form>

                <form action="/deleteacc" method="POST" className="form-1">
                  <div className="form-group-2">
                    <label htmlFor="confirmusername">
                      I want to delete my account (Please enter username to
                      confirm)
                    </label>
                    <input
                      type="text"
                      id="confirmusername"
                      name="confirmusername"
                      className="form-control"
                      placeholder="Current Username"
                    />
                  </div>

                  <div className="form-group-2">
                    <input
                      type="submit"
                      value="Delete Account"
                      className="edit-acc-btn"
                      id="delete-acc-btn"
                    />
                  </div>
                </form>
                <div className="error">
                  {error ? <div className="danger">{error}</div> : ""}
                  {msg ? `${msg}` : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer>Image by @bradencollum on Unsplash.</footer>
    </div>
  );
}

export default Account;
