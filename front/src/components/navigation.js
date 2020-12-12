import { ButtonGroup, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router";

export default function Navigation() {
  const [loggedIn, setLoggedIn] = useState(false);
  const history = useHistory();

  const signOut = async () => {
    console.log("sign out");
    await fetch("/signout", {
      method: "POST",
      credentials: "include",
    });
    history.push({
      pathname: "/",
    });
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
        <ButtonGroup
          className="dropdown-menu-1"
          title="DropdownButton"
          aria-label="dropDownMenu"
        >
          <Dropdown>
            <Dropdown.Toggle
              className="navbar-dark"
              tabIndex="0"
              haspopup="true"
              expanded="false"
              label="dropdownMenu"
              aria-label="dropDown"
              id="dropdown-basic"
              title="menu"
            >
              <i className="navbar-toggler-icon" />
            </Dropdown.Toggle>

            <Dropdown.Menu role="menu">
              <Dropdown.Item
                className="menu-btn"
                tabIndex="0"
                role="menuitem"
                as={Link}
                to="/housing"
              >
                All Housing
              </Dropdown.Item>{" "}
              <Dropdown.Item
                className="menu-btn"
                tabIndex="0"
                role="menuitem"
                as={Link}
                to="/appointments"
              >
                My Appointments
              </Dropdown.Item>
              <Dropdown.Item
                className="menu-btn"
                tabIndex="0"
                role="menuitem"
                as={Link}
                to="/saved"
              >
                Saved Posts
              </Dropdown.Item>{" "}
              <Dropdown.Item
                className="menu-btn"
                tabIndex="0"
                role="menuitem"
                as={Link}
                to="/account"
              >
                My Account
              </Dropdown.Item>{" "}
              <Dropdown.Item
                className="menu-btn"
                tabIndex="0"
                role="menuitem"
                as={Button}
                onClick={() => {
                  signOut();
                }}
                aria-label="SignOutButton"
              >
                Sign Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ButtonGroup>
      </div>
    );
  }
}
