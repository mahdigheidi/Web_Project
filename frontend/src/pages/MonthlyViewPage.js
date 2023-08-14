import React, { useState, useRef, useEffect } from 'react';
import {DayPilot, DayPilotMonth} from "@daypilot/daypilot-lite-react";
import "./MonthStyles.css";
import "./icons/style.css";
import { OfficeSelect, RoomSelect } from './Selectors'
import { Helmet } from 'react-helmet-async';
import { Grid, Container, Typography, Item } from '@mui/material';

const default_option = {id:-1, name:"All"}
const styles = {
  wrap: {
    display: "flex"
  },
  left: {
    marginRight: "10px"
  },
  main: {
    flexGrow: "1"
  }
};

const event_colors = [
  "#6aa84f",
  "#f1c232",
  "#cc4125"
]

function getRandomColor() {
  return event_colors[(Math.floor(Math.random() * event_colors.length))];
}

const MonthlyCalendar = (props) => {
  const [selectedOffice, setSelectedOffice] = useState(default_option);
  const [officeValue, setOfficeValue] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(default_option);
  const [roomValue, setRoomValue] = useState('')

  const fetchRooms  = async (args) => {
    const response = await fetch("http://localhost:8080/room/", {
    method: "GET", 
    })
    const rooms = await response.json()
    const mappedRooms = rooms.map(
        (room) => {
        return {
            id: room.id, 
            name: room.name
        }
        }
    )
    return mappedRooms
}

  const handleEventCreation = async (args) => {
    const rooms = await fetchRooms();
    const dp = calendarRef.current.control;
    const modal = await DayPilot.Modal.form ([
      {name: "Title", id:"title", type:"text"},
      // {name: "office", id:"office", type:"text"},
      {name: "Room", id:"room", type:"select", options:rooms},
      {name: "Attendees", id:"attendees", type:"text"},
      {name: "Start hour", id:"start_hour", type:"text"},
      {name: "End hour", id:"end_hour", type:"text"},
    ]);
    console.log(modal.result.end_hour)

    const response = await fetch("http://localhost:8080/add_week_booking/", {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credintials': 'true',
        'Access-Control-Allow-Origin': '*'
      },
      mode:'no-cors',
      credentials:'include',
      body: JSON.stringify({
        "start_day": args.start,
        "end_day": args.end,
        "Title": modal.result.title,
        "RoomID": String(modal.result.room),
        "Attendees": modal.result.attendees,
        "start_hour": modal.result.start_hour,
        "end_hour": modal.result.end_hour,
      })
    })
        
    dp.clearSelection();
    if (!modal.result) { return; }

    const dist = " ";
    const dash = "-"
    dp.events.add({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      text: modal.result.title + dist + modal.result.room + dist + modal.result.start_hour + dash + modal.result.end_hour,
      office: modal.result.office,
      room: modal.result.room,
      attendees: modal.result.attendees,
      start_hour: modal.result.start_hour,
      end_hour: modal.result.end_hour,
    });
  }

  const handleEventEdition  = async (args) => {
    // TODO
    const dp = calendarRef.current.control;
    const modal = await DayPilot.Modal.form({
        // "Update Meeting Details:",
        title: args.e.text(),
        room: args.e.data.room,
        office: args.e.data.office,
        attendees: args.e.data.attendees,
    });
    if (!modal.result) { return; }
    const e = args.e;
    e.data.text = modal.result.title;
    e.data.room = modal.result.room;
    e.data.office = modal.result.office;
    e.data.attendees = modal.result.attendees;
    dp.events.update(e);
  }

  const calendarRef = useRef();
  const [calendarConfig, setCalendarConfig] = useState({
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: handleEventCreation,
    eventDeleteHandling: "Update",
    onEventClick: handleEventEdition,
    eventHeight: 30,
    headerHeight: 30,
    cellHeaderHeight: 25,
    onBeforeEventRender: args => {
      args.data.borderColor = "darker";
      if (args.data.backColor) {
        args.data.barColor = DayPilot.ColorUtil.darker(args.data.backColor, -1);
      }
    }
  });

  useEffect(() => {

    async function myfunc() {
      // get rooms from back
      const response = await fetch("http://localhost:8080/booking/", {
        method: "GET", 
      })
  
      const events = await response.json()

      const filteredEvents = events.filter(
          (event) =>
            (selectedRoom === default_option || event.RoomID === selectedRoom.id)  &&
            (selectedOffice === default_option || event.OfficeID === selectedOffice.id)
        );
      const mappedEvents = []
      for (let i in filteredEvents) {
        let event = filteredEvents[i]
        mappedEvents.push({
            id: event.ID, 
            text: event.Title,
            room: event.RoomID,
            office: event.OfficeID,
            attendees: event.Attendees,
            start: (event.Starts)[0],
            end: (event.Ends)[(event.Ends).length - 1],
            backColor: getRandomColor(),
        });
        }
      console.log(mappedEvents)

      const dash = "-";
      const zero = "0";
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (zero + (currentDate.getMonth() + 1)).slice(-2);
      const day = (zero + currentDate.getDate()).slice(-2);
      const startDate = year + dash + month + dash + day;
  
      calendarRef.current.control.update({startDate, events: mappedEvents});
        }
        myfunc();
    }, [selectedRoom, selectedOffice]);

  return (
      <>
      <Helmet>
        <title> Monthly view</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
              Monthly Bookings
        </Typography>
      <div>
        <label htmlFor="btn-check5" className="btn btn-primary-border" >Select Office: 
          <OfficeSelect selectedOffice={selectedOffice} setSelectedOffice={setSelectedOffice} officeValue={officeValue} setOfficeValue={setOfficeValue}/>
        </label>
        <label htmlFor="btn-check5" className="btn btn-primary-border">Select Room: 
          <RoomSelect selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} roomValue={roomValue} setRoomValue={setRoomValue}/>
        </label>
      </div>
      <div>
        <DayPilotMonth
          {...calendarConfig}
          ref={calendarRef}
        />
      </div>
      </Container>
      </>
    );
}

export default MonthlyCalendar;
