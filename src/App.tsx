import React, { useRef, useState } from 'react';
import './App.css';
import FullCalendar from '@fullcalendar/react';
import momentPlugin from '@fullcalendar/moment';
import interactionPlugin from '@fullcalendar/interaction';
import { Box } from '@mui/material';
import ColumnWeekView, { ColumnDayEvents } from './ColumnWeekView';

function App() {

  const calendarRef = useRef<FullCalendar>(null);
  const [currentStartDate, setCurrentStartDate] = useState<Date | null>(null);

  const businessHours = {
    daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday
    startTime: '8:00',
    endTime: '20:00',
  };

  const callbacks: ColumnDayEvents = {
    onCompanyColumnDrag(start, end) {
      const calendarApi = calendarRef.current?.getApi();
      if (!calendarApi) return;
      calendarApi.addEvent({
        start, end, type: 'company'
      });
    },

    onCompanyEventClick(event) {
      console.log(event);
    },

    onFreelancerEventClick(event) {
      console.log(event);
    }
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      let newStartDate = new Date(currentStartDate ?? calendarApi.view.currentStart);
      newStartDate.setDate(newStartDate.getDate() + 7); // Jump 7 days forward

      calendarApi.gotoDate(newStartDate);
      setCurrentStartDate(newStartDate);
    }
  };

  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      let newStartDate = new Date(currentStartDate ?? calendarApi.view.currentStart);
      newStartDate.setDate(newStartDate.getDate() - 7); // Jump 7 days backward

      const today = new Date();
      if (newStartDate < today) {
        alert("You can't choose a date that is in the past.");
        return;
      }

      calendarApi.gotoDate(newStartDate);
      setCurrentStartDate(newStartDate);
    }
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const today = new Date();
      calendarApi.gotoDate(today);
      setCurrentStartDate(today);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <FullCalendar
        ref={calendarRef}
        plugins={[ColumnWeekView(callbacks), momentPlugin, interactionPlugin]}
        initialView='ColumnWeekView'
        selectable={true}
        timeZone='utc'
        customButtons={{
          prevButton: {
            text: '<',
            click: handlePrev
          },
          nextButton: {
            text: '>',
            click: handleNext
          },
          todayButton: {
            text: 'Today',
            click: handleToday
          }
        }}
        headerToolbar={{
          left: 'prevButton,todayButton,nextButton',
          center: '',
          right: ''
        }}
      />
    </Box>
  );
}

export default App;
