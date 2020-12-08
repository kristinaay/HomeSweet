import React from "react";
import { Link } from "react-router-dom";
import "../styles/appts.css";
import { ButtonGroup, DropdownButton, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

function Appts() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    const getEventData = async () => {
      console.log(`getting events ${user}`);
      try {
        const _events = await fetch("/getevents", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user,
          }),
        }).then((res) => res.json());

        events.push({
          title: _events.title,
          start: _events.start,
          end: _events.end,
        });
        setEvents(events);
        console.log(events);
      } catch (err) {
        console.log("error ", err);
      }
    };
    getEventData();
  }, [user, events]);

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

  const getEvents = () => {
    return events;
  };

  return (
    <div>
      {renderNav(loggedIn)}{" "}
      <div className="cal">
        <FullCalendar
          plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          defaultDate={new Date()}
          selectable={true}
          displayEventTime={true}
          events={events}
          eventColor="#8DA562"
          eventClick={(clickInfo) => {
            if (
              prompt(
                `Are you sure you want to delete the event '${clickInfo.event.title}'`
              ) === "yes"
            ) {
              clickInfo.event.remove();
            }
          }}
          select={(selectInfo) => {
            let title = prompt("Please enter a new title for your event");

            let calendar = selectInfo.view.calendar;

            // valid?
            calendar.addEvent({
              title: title,
              start: selectInfo.startStr,
              end: selectInfo.endStr,
              allDay: selectInfo.allDay,
            });
          }}
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
