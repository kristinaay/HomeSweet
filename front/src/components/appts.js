import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import "../styles/appts.css";
import { ButtonGroup, DropdownButton, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

function Appts() {
  const [loggedIn, setLoggedIn] = useState(false);

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
  return <div>{renderNav(loggedIn)}</div>;
}

export default Appts;
