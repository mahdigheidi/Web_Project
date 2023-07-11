import React, { useState, useRef, useEffect } from 'react';
import {DayPilot, DayPilotScheduler} from "daypilot-pro-react";
import { Helmet } from 'react-helmet-async';
import { Grid, Container, Typography, Item } from '@mui/material';


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

const default_option = {id:-1, name:"All"}

const DailyViewPage2 = () => {
  const calendarRef = useRef();
  const fetchRooms  = async (officeid) => {
    const response = await fetch("http://localhost:8080/room/", {
    method: "GET", 
    })
    const rooms = await response.json()
    const frooms = rooms.filter(
      (r) => {
        return r.office_id == officeid
      }
    )
    const mappedRooms = frooms.map(
        (room) => {
        return {
            id: room.id, 
            name: room.name
        }
        }
    )
    return mappedRooms
}
  const [selectedOffice, setSelectedOffice] = useState(default_option);
  const [officeValue, setOfficeValue] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(default_option);
  const [roomValue, setRoomValue] = useState('')

  const handleEventCreation = async (args) => {
    const dp = calendarRef.current.control;
    let mod = await args.resource[0]
    let modal
    let roomid 
    if (mod == "r") {
      roomid = await args.resource.substring(1)
      modal = await DayPilot.Modal.form ([
        {name: "title", id:"title", type:"text"},
        {name: "attendees", id:"attendees", type:"text"},  
      ]);
    } else {
      const officeid = await args.resource.substring(1)
      const rooms = await fetchRooms(officeid);
      modal = await DayPilot.Modal.form ([
        {name: "title", id:"title", type:"text"},
        {name: "room", id:"room", type:"select", options:rooms},
        {name: "attendees", id:"attendees", type:"text"},
      ]);
      roomid = String(modal.result.room)  
    }

    console.log("AAA", args, modal.result);

    const response = await fetch("http://localhost:8080/add_booking/", {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credintials': 'true',
        'Access-Control-Allow-Origin': '*'
      },
      mode:'no-cors',
      credentials:'include',
      body: JSON.stringify({
        "Start": args.start,
        "End": args.end,
        "Title": modal.result.title,
        "RoomID": roomid,
        "Attendees": modal.result.attendees,
      })
    })
        
    dp.clearSelection();
    if (!modal.result) { return; }
    
    dp.events.add({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      text: modal.result.title,
      room: modal.result.room,
      resource: args.resource,
      office: modal.result.office,
      attendees: modal.result.attendees
    });
    console.log("add Done")

  }

  const handleEventEdition  = async (args) => {
    // TODO
    const dp = calendarRef.current.control;
  //   const modal = await DayPilot.Modal.prompt("Update Meeting Details:", args.e.text());
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


  const [calendarConfig, setCalendarConfig] = useState({
    // viewType: "Week",
    cellWidthSpec: "Fixed",
    cellWidth: 20,
    timeHeaders: [{"groupBy":"Day","format":"dddd, d MMMM yyyy"},{"groupBy":"Hour"},{"groupBy":"Cell","format":"mm"}],
    scale: "CellDuration",
    cellDuration: 15,
    days: DayPilot.Date.today().dayOfWeek(),
    startDate: new DayPilot.Date.today().addHours(6),
    eventHeight: 60,
    groupConcurrentEvents: true,
    allowEventOverlap: false,
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: handleEventCreation,
    // eventDeleteHandling: "Update",
    // onEventClick: handleEventEdition,
    eventMoveHandling: "Update",
    onEventMoved: (args) => {
      args.control.message("Meeting Moved: " , args.e.text());
    },
    eventResizeHandling: "Update",
    onEventResized: (args) => {
      args.control.message("Meeting Resized: " , args.e.text());
    },
    eventDeleteHandling: "Update",
    onEventDeleted: (args) => {
      args.control.message("Meeting Deleted: " , args.e.text());
    },
    eventClickHandling: "Disabled",
    eventHoverHandling: "Bubble",
    bubble: new DayPilot.Bubble({
      onLoad: (args) => {
        // if event object doesn't specify "bubbleHtml" property 
        // this onLoad handler will be called to provide the bubble HTML
        args.html = "Meeting Details";
      }
    }),
    treeEnabled: true,
  });

  const fetch_resources = async () => {
    let response = await fetch("http://localhost:8080/office/", {
        method: "GET", 
        })
    const offices = await response.json()
    const resources = []
    for (let i in offices) {
      let office = offices[i]
      let id = "o" + office.ID
      resources.push({
          id: id, 
          name: office.Name,
          expanded: false,
          children: [],
      });
    }
    response = await fetch("http://localhost:8080/room/", {
      method: "GET", 
      })
    const rooms = await response.json()
    let resource = 5
    for (let i in rooms) {
      let room = rooms[i];
      let id = "r" + room.id
      resource = resources.find(
        (r) => {
          let id = "o" + room.office_id
          return id === r.id
        }
      );
      (resource.children).push({
          id: id, 
          name: room.name,
      });
  }

    console.log("resources", resources)
    return resources
  }

  useEffect(() => {

    async function myfunc() {

      const resources = await fetch_resources()

      calendarRef.current.control.update({resources:resources});
      
      // get rooms from back
      const response = await fetch("http://localhost:8080/booking/", {
        method: "GET", 
      })
  
      const events = await response.json()
      
      const mappedEvents = []
      let id = 0
      for (let i in events) {
        let event = events[i]
        for (let j = 0; j < event.Starts.length; j++) {
          let rid = "r" + event.RoomID
          mappedEvents.push({
              id: id, 
              text: event.Title,
              room: event.RoomID,
              attendees: event.Attendees,
              // start: (event.Start).substring(0, (event.Start).indexOf(".")),
              // end: (event.End).substring(0, (event.End).indexOf(".")),
              start: (event.Starts)[j],
              end: (event.Ends)[j],
              backColor: getRandomColor(),
              resource: rid,
              office: event.OfficeID,
          });
          id++
          rid = "o" + event.OfficeID
          mappedEvents.push({
            id: id, 
            text: event.Title,
            room: event.RoomID,
            attendees: event.Attendees,
            // start: (event.Start).substring(0, (event.Start).indexOf(".")),
            // end: (event.End).substring(0, (event.End).indexOf(".")),
            start: (event.Starts)[j],
            end: (event.Ends)[j],
            backColor: getRandomColor(),
            resource: rid,
            office: event.OfficeID,
        });
          id++
        }
      }
      calendarRef.current.control.update({events: mappedEvents});
        }
        myfunc();
    }, [selectedRoom, selectedOffice]);

    return (
      <>
      <Helmet>
        <title> Daily view</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
              Daily Bookings
        </Typography>
      <div>
        <DayPilotScheduler
          {...calendarConfig}
          ref={calendarRef}
        />
      </div>
      </Container>
      </>
    );
}

export default DailyViewPage2;
