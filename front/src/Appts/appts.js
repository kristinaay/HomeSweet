import React from "react";
import "./appts.css";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "react-confirm-alert/src/react-confirm-alert.css";
import Navigation from "../components/navigation.js";

function Appts() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const getEventData = async () => {
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

        let events2 = _events;

        setEvents(events2);
        console.log("front", events2);
      } catch (err) {
        console.log("error ", err);
      }
    };
    getEventData();
  }, [user]);

  const getEvents = () => {
    let rtn =
      events !== null
        ? events.eventsarr
        : { title: "demo", start: "2020-12-08 05:00", end: "2020-12-08 05:30" };
    return rtn;
  };

  return (
    <div className="cal-cont">
      <Navigation></Navigation>
      <div role="main">
        <h1 className="pg-heading" id="appt-heading">
          Appointments
        </h1>
        <div className="create-appt">
          <h2 className="header-appt"> Schedule a Viewing appointment: </h2>
          <form action="/senddata2" method="POST" className="form-events">
            <div className="form-group-appt">
              <label htmlFor="username">Username: </label>
              <input
                type="text"
                id="appt-username"
                name="username"
                className="form-control"
                placeholder="Your username"
              />
            </div>
            <div className="form-group-appt">
              <label htmlFor="title">Event Title: </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                placeholder="Name your event"
              />
            </div>
            <div className="form-group-appt">
              <label htmlFor="startdate">Start Date and Time: </label>
              <input
                type="text"
                id="startdate"
                name="startdate"
                className="form-control"
                placeholder="Use the format YYYY-MM-DD HH:MM"
              />
            </div>
            <div className="form-group-appt">
              <label htmlFor="enddate">End Date and Time: </label>
              <input
                type="text"
                id="enddate"
                name="enddate"
                className="form-control"
                placeholder="Use the format YYYY-MM-DD HH:MM"
              />
            </div>

            <div className="form-group-appt-2">
              <input
                type="submit"
                value="Add Event"
                className="add-event-btn"
              />
            </div>
          </form>

          <h2 className="header-appt"> Delete a Viewing appointment: </h2>
          <form action="/deletedata2" method="POST" className="form-events">
            <div className="form-group-appt">
              <label htmlFor="username">Username: </label>
              <input
                type="text"
                id="appt-username-2"
                name="username"
                className="form-control"
                placeholder="Your username"
              />
            </div>
            <div className="form-group-appt">
              <label htmlFor="title-2">Event Title: </label>
              <input
                type="text"
                id="title-2"
                name="title"
                className="form-control"
                placeholder="Event to be deleted"
              />
            </div>
            <div className="form-group-appt">
              <label htmlFor="start">Start Date and Time: </label>
              <input
                type="text"
                id="startdate-2"
                name="start"
                className="form-control"
                placeholder="Use the format YYYY-MM-DD HH:MM"
              />
            </div>
            <div className="form-group-appt">
              <label htmlFor="end">End Date and Time: </label>
              <input
                type="text"
                id="enddate-2"
                name="end"
                className="form-control"
                placeholder="Use the format YYYY-MM-DD HH:MM"
              />
            </div>

            <div className="form-group-appt-2">
              <input
                type="submit"
                value="Delete Event"
                className="add-event-btn"
              />
            </div>
          </form>
          <h2 className="header-appt">
            {" "}
            Or Click & Drag on the Calendar Below to Create an Event <br />&
            Click An Existing Event to Delete{" "}
          </h2>
          <br />
        </div>
        <div className="cal" tabindex="0">
          <FullCalendar
            plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            defaultDate={new Date()}
            selectable={true}
            displayEventTime={true}
            events={getEvents()}
            tabindex="0"
            eventColor="#42692d"
            eventClick={async (clickInfo) => {
              let bool = window.confirm(
                "Are you sure you want to delete this event?"
              );
              if (bool) {
                await fetch("/deletedata", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    username: user,
                    title: clickInfo.event.title,
                    start: clickInfo.event.startStr,
                    end: clickInfo.event.endStr,
                    allDay: clickInfo.event.allDay,
                  }),
                });
                clickInfo.event.remove();
              }
            }}
            select={async (selectInfo) => {
              let title = prompt("Please enter a new title for your event");

              let calendar = selectInfo.view.calendar;

              if (title !== null && title != "") {
                calendar.addEvent({
                  title: title,
                  start: selectInfo.startStr,
                  end: selectInfo.endStr,
                  allDay: selectInfo.allDay,
                });
                try {
                  await fetch("/senddata", {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      username: user,
                      title: title,
                      start: selectInfo.startStr,
                      end: selectInfo.endStr,
                      allDay: selectInfo.allDay,
                    }),
                  });
                  console.log("done");
                } catch (err) {
                  console.log("error");
                }
              }
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
    </div>
  );
}

export default Appts;
