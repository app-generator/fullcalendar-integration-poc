import React, { useRef } from 'react';
import './App.css';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid'
import momentPlugin from '@fullcalendar/moment'
import interactionPlugin from '@fullcalendar/interaction'
import { AppBar, Box, Button, Toolbar } from '@mui/material';
import moment from 'moment';

const demoZone = {
  title: 'Demo Contract',
  start: moment().subtract(1, 'hour').startOf('hour').toDate(),
  end: moment().add(4, 'hours').startOf('hour').toDate(),
}

function App() {

  const calendarRef = useRef<FullCalendar>(null)

  const addEvent = (display: 'background' | 'block', info: { start: Date, end: Date, title: string }) => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;
    calendarApi.addEvent({
      ...info,
      display
    })
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Button onClick={() => addEvent('background', demoZone)} color="inherit">Add Event</Button>
        </Toolbar>
      </AppBar>
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, momentPlugin, interactionPlugin]}
        selectable={true}
        selectConstraint={demoZone}
        select={(selection: { start: Date, end: Date }) => addEvent('block', { ...selection, title: 'Booked this' })}
      />
    </Box>
  )
}

export default App;
