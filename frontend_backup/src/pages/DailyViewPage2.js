import React, {Component} from 'react';
import {DayPilot, DayPilotScheduler} from "daypilot-pro-react";

class DailyViewPage2 extends Component {

  constructor(props) {
    super(props);
    this.schedulerRef = React.createRef();
    this.state = {
      cellWidthSpec: "Fixed",
      cellWidth: 50,
      timeHeaders: [{"groupBy":"Day","format":"dddd, d MMMM yyyy"},{"groupBy":"Hour"},{"groupBy":"Cell","format":"mm"}],
      scale: "CellDuration",
      cellDuration: 15,
      days: DayPilot.Date.today().daysInYear(),
      startDate: new DayPilot.Date().toString('yyyy-MM-dd'),
      eventHeight: 60,
      groupConcurrentEvents: true,
      allowEventOverlap: false,
      timeRangeSelectedHandling: "Enabled",
      onTimeRangeSelected: async (args) => {
        const dp = args.control;
        // const modal = await DayPilot.Modal.prompt("Book A New Meeting:", "Meet 1");
        const modal = await DayPilot.Modal.form({
            title: "Meeting title",
            room: "",
            attendees: "",
            // office: "",
        });
        dp.clearSelection();
        if (modal.canceled) { return; }
        dp.events.add({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          resource: args.resource,
          text: modal.result.title,
          room: modal.result.room,
        //   office: modal.result.office,
          attendees: modal.result.attendees,
        });
      },
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
    };
  }

  componentDidMount() {

    // load resource and event data
    this.setState({
      resources: [
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
      ],
      events: [
        {
          id: 1,
          text: "Meet 1",
          start: "2022-05-02T00:00:00",
          end: "2022-05-05T00:00:00",
          resource: "A"
        },
        {
          id: 2,
          text: "Meet 2",
          start: "2022-05-03T00:00:00",
          end: "2022-05-10T00:00:00",
          resource: "C",
          barColor: "#38761d",
          barBackColor: "#93c47d"
        },
        {
          id: 3,
          text: "Meet 3",
          start: "2022-05-02T00:00:00",
          end: "2022-05-08T00:00:00",
          resource: "D",
          barColor: "#f1c232",
          barBackColor: "#f1c232"
        },
        {
          id: 4,
          text: "Meet 3",
          start: "2022-05-02T00:00:00",
          end: "2022-05-08T00:00:00",
          resource: "E",
          barColor: "#cc0000",
          barBackColor: "#ea9999"
        }
      ]
    });

  }

//   get scheduler() {
//     return this.schedulerRef.current.control;
//   }

  render() {
    return (
      <div>
        <DayPilotScheduler
          {...this.state}
          ref={this.schedulerRef}
        />
      </div>
    );
  }
}

export default DailyViewPage2;
