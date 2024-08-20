import React, { useRef } from 'react';
import './App.css';
import FullCalendar from '@fullcalendar/react';
import momentPlugin from '@fullcalendar/moment'
import interactionPlugin from '@fullcalendar/interaction'
import { Box } from '@mui/material';
import columnDayView, { ColumnDayEvents } from './ColumnDayView'

function App() {

  const calendarRef = useRef<FullCalendar>(null)
  const businessHours = {
    // days of week. an array of zero-based day of week integers (0=Sunday)
    daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday

    startTime: '8:00', // a start time (10am in this example)
    endTime: '20:00', // an end time (6pm in this example)
  }

  const callbacks: ColumnDayEvents = {
    onCompanyColumnDrag(start, end) {
      const calendarApi = calendarRef.current?.getApi();
      if (!calendarApi) return;
      calendarApi.addEvent({
        start, end, type: 'company'
      })
    },

    onCompanyEventClick(event) {
      console.log(event)
    },

    onFreelancerEventClick(event) {
      console.log(event)
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <FullCalendar
        ref={calendarRef}
        plugins={[columnDayView(callbacks), momentPlugin, interactionPlugin]}
        initialView='columnDayView'
        selectable={true}
        timeZone='utc'
        dateIncrement={{ weeks: 1 }}
      />
    </Box>
  )
}

export default App;
