import React, { useState } from "react";
import EditShiftModal from "./updateShift"; 
import Swal from "sweetalert2";
import useApi from "../api";
import { error } from "console";
interface ContextMenuProps {
  position: { x: number; y: number };
  isFreelancer: boolean;
  onBook: () => void;
  onEdit: () => void;
  onCancel: () => void;
  shift?: any;
  slot_count?: any;
  refresh: any;
  time: any;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ position, isFreelancer, onBook, onEdit, onCancel, shift, slot_count, refresh, time }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const api = useApi();

  const handleEdit = () => {
    // You might want to pass some item data to the modal here
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    refresh?.();
    setIsEditModalOpen(false);
  };

  const cancelMultipleSlot = () => {
    const draggedCell = shift.slots.find((slot: any) => slot.time === time);
    if (draggedCell) {
      const ids = isFreelancer ? draggedCell.freelancer_slot_ids : draggedCell.company_slot_ids;
      
      // Add SWEATALET2 confirmation here
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to cancel these slots?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!'
      }).then((result) => {
        if (result.isConfirmed) {
          api.cancelTimeSlot({ 'slot_ids': ids }).then(
            (response) => {
              Swal.fire('Cancelled!', 'Your slots have been cancelled.', 'success');
              onCancel();
              refresh();
            },
            (error) => {
              Swal.fire('Error!', 'There was an issue cancelling the slots.', 'error');
              console.error(error);
            }
          );
        }
      });
    }
  };

  const handleFreelancerSlotEdit = () => {

  }

  return (
    <div>
      <ul
        className="absolute bg-white border rounded shadow-md"
        style={{ top: position.y, left: position.x }}
      >
        {isFreelancer ? (
          <>
            <li onClick={cancelMultipleSlot} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Cancel</li>
            <li onClick={handleFreelancerSlotEdit} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit</li>
          </>
        ) : (
          <>
            <li onClick={onBook} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Book</li>
            <li onClick={handleEdit} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit</li>
          </>
        )}
      </ul>
      
      {/* Conditionally render the modal */}
      <EditShiftModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={shift}  // Pass the item data as needed
        slot_count={slot_count}
        onSave={handleSave}
      />
    </div>
  );
};

export default ContextMenu;
