import React, { useState, useRef, useEffect } from 'react';
import {DayPilot, DayPilotScheduler} from "daypilot-pro-react";

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

  const [selectedOffice, setSelectedOffice] = useState(default_option);
  const [officeValue, setOfficeValue] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(default_option);
  const [roomValue, setRoomValue] = useState('')

  const handleEventCreation = async (args) => {
    const dp = calendarRef.current.control;
  //   const modal = await DayPilot.Modal.prompt("Book A New Meeting: Specify Room No", "Meeting Title");
  const modal = await DayPilot.Modal.form ([
    {name: "title", id:"title", type:"text"},
    // {name: "office", id:"office", type:"text"},
    // {name: "room", id:"room", type:"text"},
    {name: "attendees", id:"attendees", type:"text"},

  ]);
  console.log("AAA", args, modal.result);

    // const response = await fetch("http://localhost:8080/add_booking/", {
    //   method: "POST", 
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Credintials': 'true',
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   mode:'no-cors',
    //   credentials:'include',
    //   body: JSON.stringify({
    //     "Start": args.start,
    //     "End": args.end,
    //     "Title": modal.result.title,
    //     "RoomID": modal.result.room,
    //     "Attendees": modal.result.attendees,
    //   })
    // })
        
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
    viewType: "Week",
    cellWidthSpec: "Fixed",
    cellWidth: 50,
    timeHeaders: [{"groupBy":"Day","format":"dddd, d MMMM yyyy"},{"groupBy":"Hour"},{"groupBy":"Cell","format":"mm"}],
    scale: "CellDuration",
    cellDuration: 15,
    days: DayPilot.Date.today().daysInYear(),
    startDate: new DayPilot.Date().toString('yyyy-MM-dd'),
    eventHeight: 60,
    // groupConcurrentEvents: true,
    // allowEventOverlap: false,
    // timeRangeSelectedHandling: "Enabled",
    // onTimeRangeSelected: handleEventCreation,
    // eventDeleteHandling: "Update",
    // onEventClick: handleEventEdition,
    // onEventMoved: (args) => {
    //   args.control.message("Meeting Moved: " , args.e.text());
    // },
    // eventResizeHandling: "Update",
    // onEventResized: (args) => {
    //   args.control.message("Meeting Resized: " , args.e.text());
    // },
    // eventDeleteHandling: "Update",
    // onEventDeleted: (args) => {
    //   args.control.message("Meeting Deleted: " , args.e.text());
    // },
    // eventClickHandling: "Disabled",
    // eventHoverHandling: "Bubble",
    // bubble: new DayPilot.Bubble({
    //   onLoad: (args) => {
    //     // if event object doesn't specify "bubbleHtml" property 
    //     // this onLoad handler will be called to provide the bubble HTML
    //     args.html = "Meeting Details";
    //   }
    // }),
    // treeEnabled: true,
  });

  const fetch_resources = async () => {
    console.log("fetching...")
    // {
      //     "name": "Office 1",
      //     "id": "G1",
      //     "expanded": false,
      //     "children": [
      //       {
      //         "name": "Room 1",
      //         "id": "R1"
      //       },
      //       {
      //         "name": "Room 2",
      //         "id": "R2"
      //       }
      //     ]
      //   },
    let response = await fetch("http://localhost:8080/office/", {
        method: "GET", 
        })
    const offices = await response.json()
    const resources = []
    for (let i in offices) {
      let office = offices[i]
      resources.push({
          id: office.ID, 
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
      let room = rooms[i]
      resource = resources.find(
        (r) => (r.id === room.office_id)
      );
      (resource.children).push({
          id: room.id, 
          name: room.name,
      });
  }

    console.log("resources", resources)
    return resources
  }

  useEffect(() => {

    async function myfunc() {

      // const resources = await fetch_resources()

      const resources = [
        {
          "name": "Office 1",
          "id": "G1",
          "expanded": false,
          "children": [
            {
              "name": "Room 1",
              "id": "R1"
            },
            {
              "name": "Room 2",
              "id": "R2"
            }
          ]
        },
        {
          "name": "Office 2",
          "id": "G2",
          "expanded": false,
          "children": [
            {
              "name": "Room 3",
              "id": "R3"
            },
            {
              "name": "Room 4",
              "id": "R4"
            }
          ]
        }
      ]
      calendarRef.current.control.update({resources:resources});
      console.log("Done!")
      
      const mappedEvents= [
        {
          id: 100,
          text: "Meet 1",
          start: "2023-07-11T01:30:00",
          end: "2023-07-11T02:30:00",
          resource: "G1",
          barBackColor: "#93c47d",
        },
        // {
        //   id: 2,
        //   text: "Meet 2",
        //   start: "2022-05-03T00:00:00",
        //   end: "2022-05-10T00:00:00",
        //   resource: "C",
        //   barColor: "#38761d",
        //   barBackColor: "#93c47d"
        // },
        // {
        //   id: 3,
        //   text: "Meet 3",
        //   start: "2022-05-02T00:00:00",
        //   end: "2022-05-08T00:00:00",
        //   resource: "D",
        //   barColor: "#f1c232",
        //   barBackColor: "#f1c232"
        // },
        // {
        //   id: 4,
        //   text: "Meet 3",
        //   start: "2022-05-02T00:00:00",
        //   end: "2022-05-08T00:00:00",
        //   resource: "E",
        //   barColor: "#cc0000",
        //   barBackColor: "#ea9999"
        // }
      ]
      // get rooms from back
      const response = await fetch("http://localhost:8080/booking/", {
        method: "GET", 
      })
  
      const events = await response.json()
      console.log("got events:", events)
      
      // const mappedEvents = []
      // let id = 0
      // for (let i in events) {
      //   let event = events[i]
      //   for (let j = 0; j < event.Starts.length; j++) {
      //     mappedEvents.push({
      //         id: id, 
      //         text: event.Title,
      //         room: event.RoomID,
      //         attendees: event.Attendees,
      //         // start: (event.Start).substring(0, (event.Start).indexOf(".")),
      //         // end: (event.End).substring(0, (event.End).indexOf(".")),
      //         start: (event.Starts)[j],
      //         end: (event.Ends)[j],
      //         backColor: getRandomColor(),
      //         resource: event.OfficeID,
      //         office: event.OfficeID,
      //     });
      //     id++
      //   }
      // }

      // console.log("mapped : ", mappedEvents)
      // const filteredEvents = events.filter(event => event.room === selectedRoom && event.office === selectedOffice);
      // console.log(selectedRoom.toString());
      // console.log(selectedOffice.toString());
      // const filteredEvents = events.filter(event => event.room === selectedRoom.toString() && eve);
  
      // const dash = "-";
      // const zero = "0";
      // const currentDate = new Date();
      // const year = currentDate.getFullYear();
      // const month = (zero + (currentDate.getMonth() + 1)).slice(-2);
      // const day = (zero + currentDate.getDate()).slice(-2);
      // const startDate = year + dash + month + dash + day;      
      // calendarRef.current.control.update({startDate, events: mappedEvents});
      calendarRef.current.control.update({events: mappedEvents});
      console.log("Done!!!")
        }
        myfunc();
    }, [selectedRoom, selectedOffice]);

  // componentDidMount() {

  //   // load resource and event data
  //   this.setState({
  //     resources: [
  //       {
  //         "name": "Office 1",
  //         "id": "G1",
  //         "expanded": false,
  //         "children": [
  //           {
  //             "name": "Room 1",
  //             "id": "R1"
  //           },
  //           {
  //             "name": "Room 2",
  //             "id": "R2"
  //           }
  //         ]
  //       },
  //       {
  //         "name": "Office 2",
  //         "id": "G2",
  //         "expanded": false,
  //         "children": [
  //           {
  //             "name": "Room 3",
  //             "id": "R3"
  //           },
  //           {
  //             "name": "Room 4",
  //             "id": "R4"
  //           }
  //         ]
  //       }
  //     ],
  //     events: [
  //       {
  //         id: 1,
  //         text: "Meet 1",
  //         start: "2022-05-02T00:00:00",
  //         end: "2022-05-05T00:00:00",
  //         resource: "A"
  //       },
  //       {
  //         id: 2,
  //         text: "Meet 2",
  //         start: "2022-05-03T00:00:00",
  //         end: "2022-05-10T00:00:00",
  //         resource: "C",
  //         barColor: "#38761d",
  //         barBackColor: "#93c47d"
  //       },
  //       {
  //         id: 3,
  //         text: "Meet 3",
  //         start: "2022-05-02T00:00:00",
  //         end: "2022-05-08T00:00:00",
  //         resource: "D",
  //         barColor: "#f1c232",
  //         barBackColor: "#f1c232"
  //       },
  //       {
  //         id: 4,
  //         text: "Meet 3",
  //         start: "2022-05-02T00:00:00",
  //         end: "2022-05-08T00:00:00",
  //         resource: "E",
  //         barColor: "#cc0000",
  //         barBackColor: "#ea9999"
  //       }
  //     ]
  //   });

  // }

//   get scheduler() {
//     return this.schedulerRef.current.control;
//   }

    return (
      <div>
        <DayPilotScheduler
          {...calendarConfig}
          ref={calendarRef}
        />
      </div>
    );
}

export default DailyViewPage2;
