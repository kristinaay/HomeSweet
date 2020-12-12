import { ButtonGroup, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

export default function Navigation() {
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

  if (!loggedIn) {
    return (
      <div
        className="navbar navbar-expand-lg navbar-light bg-light justify-content-end"
        role="navigation"
      >
        <Link to="/" className="logo-container">
          <div className="logo-header">HOMESWEET</div>
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
        <ButtonGroup className="dropdown-menu-1" title="DropdownButton">
          <DropdownButton
            id="dropdown-btn-menu"
            title=<i
              className="navbar-toggler-icon"
              haspopup="true"
              expanded="false"
              label="dropdownMenu"
              aria-label="searchBox"
            />
          >
            <Link to="/housing">
              <Button key="1" className="menu-btn">
                All Housing
              </Button>
            </Link>
            <Link to="/appointments">
              <Button
                key="2"
                className="menu-btn"
                aria-label="ButtonToAppointments"
              >
                My Appointments
              </Button>
            </Link>
            <Link to="/saved">
              <Button key="3" className="menu-btn" aria-label="ButtonToAccount">
                Saved Posts
              </Button>
            </Link>
            <Link to="/account">
              <Button key="4" className="menu-btn" aria-label="ButtonToAccount">
                My Account
              </Button>
            </Link>
            <form
              className="form"
              action="/signout"
              method="post"
              aria-label="SignOutButton"
            >
              <Button key="4" className="menu-btn" type="submit">
                Sign Out
              </Button>
            </form>
          </DropdownButton>
        </ButtonGroup>
      </div>
    );
  }
}
