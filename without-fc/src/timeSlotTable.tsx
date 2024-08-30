import React, { useEffect, useState } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useApi from "./api";
import { FaCalendar, FaClock, FaCalendarDay, FaUser } from "react-icons/fa";
import moment from "moment"; // Import Moment.js

import DraggableDroppableCell from "./componets/draggableDroppableCelltd";
import AddModal from "./componets/addModal";
import SlotListModal from "./componets/slotList";


interface Slot {
  time: string;
  company_slot: number;
  freelancer_slot: number;
  company_slot_ids: any[];
  freelancer_slot_ids: any[];
}

interface Shift {
  date: string;
  slots: Slot[];
}

const ItemType = {
  CELL: 'cell',
};



const TimeSlotTable: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [startDate, setStartDate] = useState(moment().startOf('week').add(1, 'days')); // Initialize to current week's Monday

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [slotListModalOpen, setSlotListModalOpen] = useState(false);
  const [addModalData, setAddModalData] = useState<string>("");
  const [clickedSlotIds, setClickedSlotIds] = useState<string[]>([]);

  const api = useApi();

  const openModal = (time: string, date: string) => {
    setAddModalData(`${date} ${time}`);
    setAddModalOpen(true);
  };

  const closeModal = () => {
    setAddModalOpen(false);
  }

  const fetchTimeSlot = (startDate:any) => {
    api
      .getTimeSlot({ start_date: startDate.format("YYYY-MM-DD") })
      .then((response: any) => {
        setShifts(response.shifts);
      })
      .catch((error) => {
        // Handle error
      });
  };

  const fetchTimeSlotViaOther = () => {
    fetchTimeSlot(startDate);
  }

  useEffect(() => {
    fetchTimeSlot(startDate);
  }, [startDate]);

  const handleDrop = (item: any, time: string, shift: Shift, row: number, col: number) => {
    const draggedShift = item.shift; // Retrieve the shift from the dragged item
    const draggedSlot = draggedShift.slots.find((slot: any) => slot.time === item.time);

    if (draggedSlot) {
      const idList = item.isFreelancer ? draggedSlot.freelancer_slot_ids : draggedSlot.company_slot_ids;

      const payload = {
        id_list: idList,
        date_time: `${shift.date} ${time}`
      };

      api.bulkUpdateTimeSlot(payload).then((response: any) => {
        fetchTimeSlot(startDate);
      }, (error: any) => {

      })
    }
  };

  const handleNext = () => {
    setStartDate(prevDate => moment(prevDate).add(1, 'week').startOf('week').add(1, 'days'));
  };

  const handleToday = () => {
    setStartDate(moment().startOf('week').add(1, 'days'));
  };

  const handlePrevious = () => {
    setStartDate(prevDate => moment(prevDate).subtract(1, 'week').startOf('week').add(1, 'days'));
  };

  const openModalSlotList = (data: any) => {
    setSlotListModalOpen(!slotListModalOpen);
    setClickedSlotIds(data);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="overflow-x-auto">
        {/* Button controls */}
        <div className="flex justify-start gap-x-2 mb-4">
          <button onClick={handlePrevious} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            Previous
          </button>
          <button onClick={handleToday} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            This Week
          </button>
          <button onClick={handleNext} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            Next
          </button>
          <h3>{startDate.format("ddd YYYY-MM-DD")}</h3>
        </div>

        <table className="min-w-full bg-white border border-gray-200 table-fixed">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-100"></th>
              {shifts.map((shift, index) => (
                <th key={index} colSpan={4} className="border border-gray-300 px-4 py-2 bg-gray-100 w-20">
                  {moment(shift.date).format("ddd M/D")}
                </th>
              ))}
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-100 w-20">Time</th>
              {shifts.map((shift, index) => (
                <React.Fragment key={index}>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-center w-20">
                    <FaCalendar className="mx-auto text-xl" />
                  </th>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 w-20">
                    <FaCalendarDay className="mx-auto text-xl" />
                  </th>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-center w-20">
                    <FaCalendarDay className="mx-auto text-xl" />
                  </th>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100 w-20">
                    <FaCalendarDay className="mx-auto text-xl" />
                  </th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 48 }, (_, i) => (
              <tr key={i}>
                <td className="border border-r-4  border-gray-300 px-4 py-2 w-20">
                  {`${Math.floor(i / 2).toString().padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`}
                </td>
                {shifts.map((shift, index) => {
                  const timeStr = `${Math.floor(i / 2).toString().padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`;
                  const slot = shift.slots.find((s) => s.time === timeStr) || {
                    time: timeStr,
                    company_slot: 0,
                    freelancer_slot: 0,
                    company_slot_ids: [],
                    freelancer_slot_ids: []
                  };

                  return (
                    <React.Fragment key={index}>
                      <DraggableDroppableCell
                        slot={slot}
                        index={index}
                        time={slot.time}
                        isFreelancer={false}
                        shift={shift}
                        row={i}
                        col={index * 4 + 2}
                        onDrop={(item, time, shift, row, col) => handleDrop(item, time, shift, row, col)}
                        onDoubleClick={() => openModal(slot.time, shift.date)}
                        openModalSlotList={openModalSlotList}
                      />
                      <td className="border border-gray-300 px-4 py-2 w-20"></td> {/* Empty Column */}
                      <DraggableDroppableCell
                        slot={slot}
                        index={index}
                        time={slot.time}
                        isFreelancer={true}
                        shift={shift}
                        row={i}
                        col={index * 4}
                        onDrop={(item, time, shift, row, col) => handleDrop(item, time, shift, row, col)}
                        openModalSlotList={openModalSlotList}
                        // onDoubleClick={() => openModal(slot.time, shift.date)}
                      />
                      <td className="border border-r-4 border-gray-300 px-4 py-2 w-20"></td> {/* Empty Column */}
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {addModalOpen && <AddModal isOpen={addModalOpen} onClose={closeModal} cellData={addModalData} fetchTimeSlot={fetchTimeSlotViaOther} />} 
        {slotListModalOpen && 
          <SlotListModal
            isOpen={slotListModalOpen}
            onClose={() => {
              setSlotListModalOpen(false);
              fetchTimeSlotViaOther();
            }}
            data={clickedSlotIds}
            fetchTimeSlot={fetchTimeSlotViaOther}
          />
        }
      </div>
    </DndProvider>
  );
};

export default TimeSlotTable;
