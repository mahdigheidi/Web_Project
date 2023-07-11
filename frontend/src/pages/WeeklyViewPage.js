import React, { useState, useRef, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import "./WeekStyle.css";
import { indexOf } from 'lodash';
import { OfficeSelect, RoomSelect } from './Selectors'

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

const Calendar = () => {
  const [selectedOffice, setSelectedOffice] = useState(default_option);
  const [officeValue, setOfficeValue] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(default_option);
  const [roomValue, setRoomValue] = useState('')

  const fetchOffices  = async (args) => {
    const response = await fetch("http://localhost:8080/office/", {
    method: "GET", 
    })
    const offices = await response.json()
    const mappedOffices = offices.map(
        (office) => {
        return {
            id: office.ID, 
            name: office.Name
        }
        }
    )
    return mappedOffices
  }

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
    const offices = await fetchOffices();
    const rooms = await fetchRooms();
    const dp = calendarRef.current.control;
    const modal = await DayPilot.Modal.form([
      {name: "title", id:"title", type:"text"},
      // {name: "office", id:"office", type:"select", options:offices},
      {name: "room", id:"room", type:"select", options:rooms},
      {name: "attendees", id:"attendees", type:"text"},
    ]);

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
        "RoomID": String(modal.result.room),
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
      // office: modal.result.office,
      attendees: modal.result.attendees
    });
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


  const calendarRef = useRef();
  const [calendarConfig, setCalendarConfig] = useState({
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: handleEventCreation,
    eventDeleteHandling: "Update",
    onEventClick: handleEventEdition,
  });
  

  useEffect(() => {

  async function myfunc() {
    // get rooms from back
    const response = await fetch("http://localhost:8080/booking/", {
      method: "GET", 
    })

    const events = await response.json()
    // console.log("got events:", events)

    const filteredEvents = events.filter(
        (event) =>
          (selectedRoom === default_option || event.RoomID === selectedRoom.id)  &&
          (selectedOffice === default_option || event.OfficeID === selectedOffice.id)
      );
    // console.log("filtered events:", filteredEvents)
    // const mappedEvents = filteredEvents.map(
        // (event) => {
    const mappedEvents = []
    for (let i in filteredEvents) {
      let event = filteredEvents[i]
      for (let i = 0; i < event.Starts.length; i++) {
        mappedEvents.push({
            id: event.ID, 
            text: event.Title,
            room: event.RoomID,
            office: event.OfficeID,
            attendees: event.Attendees,
            // start: (event.Start).substring(0, (event.Start).indexOf(".")),
            // end: (event.End).substring(0, (event.End).indexOf(".")),
            start: (event.Starts)[i],
            end: (event.Ends)[i],
            backColor: getRandomColor(),
        });
      }
    }

    console.log(mappedEvents)
    // const filteredEvents = events.filter(event => event.room === selectedRoom && event.office === selectedOffice);
    // console.log(selectedRoom.toString());
    // console.log(selectedOffice.toString());
    // const filteredEvents = events.filter(event => event.room === selectedRoom.toString() && eve);

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
  // }, [selectedRoom, selectedOffice]);

  return (
    <>
    <div>
    <label htmlFor="btn-check5" className="btn btn-primary-border" >Select Office: 
      <OfficeSelect selectedOffice={selectedOffice} setSelectedOffice={setSelectedOffice} officeValue={officeValue} setOfficeValue={setOfficeValue}/>
    </label>
    <label htmlFor="btn-check5" className="btn btn-primary-border">Select Room: 
      <RoomSelect selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} roomValue={roomValue} setRoomValue={setRoomValue}/>
    </label>
    </div>
    <div style={styles.wrap}>
      <div style={styles.left}>
        <DayPilotNavigator
          selectMode={"Week"}
          showMonths={3}
          skipMonths={3}
          startDate={new Date()}
          selectionDay={new Date()}
          onTimeRangeSelected={ args => {
            calendarRef.current.control.update({
              startDate: args.day
            });
          }}
        />
      </div>
      <div style={styles.main}>
        <DayPilotCalendar
          {...calendarConfig}
          ref={calendarRef}
        />
      </div>
    </div>
    </>
  );
}

export default Calendar;
