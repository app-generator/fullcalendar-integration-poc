import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import ScheduleTable from './scheduleTable';
import TimeSlotTable from './timeSlotTable';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
    {/* <ScheduleTable /> */}
    <TimeSlotTable />
  </DndProvider>
    
  );
}

export default App;
