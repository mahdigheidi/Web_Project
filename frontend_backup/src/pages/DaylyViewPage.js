import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { getDate } from 'date-fns';
import { React, Component, useState} from 'react';

// @mui
// import { useTheme } from '@mui/material/styles';
// import { Grid, Container, Typography } from '@mui/material';
// // scheduler 
// import { Scheduler } from "@aldabil/react-scheduler";
// components
// import Iconify from '../components/iconify';
// sections
// import {
//   AppTasks,
//   AppNewsUpdate,
//   AppOrderTimeline,
//   AppCurrentVisits,
//   AppWebsiteVisits,
//   AppTrafficBySite,
//   AppWidgetSummary,
//   AppCurrentSubject,
//   AppConversionRates,
// } from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DailyViewPage() {
  // const theme = useTheme();
 
  const [currentDate, setCurrentDate] = useState(new Date());

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleNextClick = () => {
    const nextDate = new Date(currentDate); // Create a new date object based on the current date
    nextDate.setDate(nextDate.getDate() + 1); // Add 1 day to the current date

    setCurrentDate(nextDate); // Update the current date state
  };

  const handlePrevClick = () => {
    const nextDate = new Date(currentDate); // Create a new date object based on the current date
    nextDate.setDate(nextDate.getDate() - 1); // Add 1 day to the current date

    setCurrentDate(nextDate); // Update the current date state
  }

  return (
    <>
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <h1 >Day Schedule</h1>
        <button style={{marginRight: '-10em'}} type="button" className="btn btn-outline-secondary" id="prev" onClick={handlePrevClick}>prev</button>
        <span style={{ marginLeft: '-22em', marginRight: '-22em'}}>{ formattedDate }</span>
        <button style={{marginRight: '10em'}} type="button" className="btn btn-outline-secondary" id="next" onClick={handleNextClick}>next</button>
          
      </div>
    </nav>

      {/* <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>
        
        <Scheduler
          view="month"
          events={[
            {
              event_id: 1,
              title: "Event 1",
              start: new Date("2021/5/2 09:30"),
              end: new Date("2021/5/2 10:30"),
            },
            {
              event_id: 2,
              title: "Event 2",
              start: new Date("2021/5/4 10:00"),
              end: new Date("2021/5/4 11:00"),
            },
          ]}
        />

        
      </Container> */}
    </>
  );
}
