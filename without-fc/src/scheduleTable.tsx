import React, { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import moment from 'moment';
import useApi from './api';

type Slot = {
  time: string; // Format: HH:mm
  company_slot: number;
  freelancer_slot: number;
};

type Shift = {
  date: string; // Format: YYYY-MM-DD
  slots: Slot[];
};

const ScheduleTable: React.FC = () => {
  const [startDate, setStartDate] = useState(moment().startOf('week'));
  const api = useApi();
  const [shifts, setShifts] = useState<Shift[]>([]);

  const days = Array.from({ length: 7 }, (_, i) =>
    startDate.clone().add(i, 'days')
  );

  const times = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const handleNextWeek = () => {
    setStartDate(prev => prev.clone().add(7, 'days'));
  };

  const handlePreviousWeek = () => {
    setStartDate(prev => prev.clone().subtract(7, 'days'));
  };

  const handleToday = () => {
    setStartDate(moment().startOf('week'));
  };

  const getCellStyle = (day: moment.Moment, time: string, subColIndex: number) => {
    // Find the shift for the current day
    const shift = shifts.find(shift => shift.date === day.format('YYYY-MM-DD'));
    
    // Find the matching slot for the given time
    const matchingSlot = shift?.slots.find(slot => slot.time === time);

    // Initialize variables to track slot presence
    let companySlot = 0;
    let freelancerSlot = 0;

    // Assign values if a matching slot is found
    if (matchingSlot) {
      companySlot = matchingSlot.company_slot;
      freelancerSlot = matchingSlot.freelancer_slot;
    }

    // Determine which style to apply based on the subColIndex
    if (subColIndex === 0 && freelancerSlot > 0) {
      return {
        style: 'bg-blue-300',
        slot: freelancerSlot,
      };
    } else if (subColIndex === 2 && companySlot > 0) {
      return {
        style: 'bg-green-300',
        slot: companySlot,
      };
    }

    // Default style if no matching slots
    return { style: 'bg-white', slot: 0 };
  };

  const moveShift = (shift: Shift, newDate: string, newTime: string) => {
    // Placeholder function for moving a shift, implement your business logic here.
    console.log(`Shift moved to ${newDate} at ${newTime}`);
    console.log(shift);
  };

  useEffect(() => {
    api.getTimeSlot().then((response: any) => {
      console.log(response.shifts);
      setShifts(response.shifts);
    }).catch(error => {
      console.error('API fetch error:', error);
    });
  }, [startDate]);

  // Draggable Shift Component
  const DraggableShift: React.FC<{ slot: number }> = ({ slot }) => {
    const [, drag] = useDrag(() => ({
      type: 'SHIFT',
      item: { slot },
    }));
  
    return (
      <div ref={drag} className="cursor-pointer">
        {slot}
      </div>
    );
  };
  
  // Droppable Cell Component
  const DroppableCell: React.FC<{ day: moment.Moment; time: string; subColIndex: number }> = ({ day, time, subColIndex }) => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
      accept: 'SHIFT',
      drop: (item: { slot: number }) => {
        console.log(item, 'dropped');
        moveShift({ date: day.format('YYYY-MM-DD'), slots: [] }, day.format('YYYY-MM-DD'), time);
      },
      collect: monitor => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }), [day, time]);
  
    const { style, slot } = getCellStyle(day, time, subColIndex);
  
    // Determine additional border classes for first and last sub-columns
    const borderClasses =
      subColIndex === 0
        ? 'border-l-2'
        : subColIndex === 3
        ? 'border-r-2'
        : '';
  
    return (
      <div
        ref={drop}
        className={`${style} border border-gray-300 ${borderClasses} p-2 text-center ${canDrop && isOver ? 'bg-yellow-200' : ''}`}
      >
        {slot > 0 ? <DraggableShift slot={slot} /> : ''}
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      {/* Navigation Buttons */}
      <div className="flex justify-start mb-4 space-x-2">
        <button onClick={handlePreviousWeek} className="bg-black text-white py-2 px-4">Previous</button>
        <button onClick={handleToday} className="bg-black text-white py-2 px-4">Today</button>
        <button onClick={handleNextWeek} className="bg-black text-white py-2 px-4">Next</button>
      </div>

      {/* Header Row */}
      <div className="grid grid-cols-[100px_repeat(7,_4fr)]">
        <div className="border border-gray-300 bg-gray-100 p-2 text-center font-semibold">Time</div>
        {days.map((day, index) => (
          <div key={index} className="grid grid-cols-4 border-t border-b-2 border-l-2 border-r border-gray-300 bg-gray-100">
            {day.format('ddd DD/MM')}
          </div>
        ))}
      </div>

      {/* Time Slots */}
      {times.map((time, timeIndex) => (
        <div key={timeIndex} className="grid grid-cols-[100px_repeat(7,_4fr)]">
          <div className="border border-gray-300 p-2 text-center">{time}</div>
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="grid grid-cols-4">
              {['0', '1', '2', '3'].map((_, subColIndex) => (
                <DroppableCell key={subColIndex} day={day} time={time} subColIndex={subColIndex} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ScheduleTable;
