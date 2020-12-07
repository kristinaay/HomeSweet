import React from "react";
import { Link } from "react-router-dom";
import "../styles/appts.css";
import { ButtonGroup, DropdownButton, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

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
              <Link to="/account">
                <Button key="2" className="menu-btn">
                  My Account
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
      {renderNav(loggedIn)}{" "}
      <div className="cal">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          defaultDate={new Date()}
          selectable={true}
          displayEventTime={false}
          eventColor="#8DA562"
          defaultView="timeGridWeek"
          header={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
          }}
        />
      </div>
    </div>
  );
}

export default Appts;
