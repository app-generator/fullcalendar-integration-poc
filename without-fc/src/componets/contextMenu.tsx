import React, { useState } from "react";
import EditShiftModal from "./updateShift"; 

interface ContextMenuProps {
  position: { x: number; y: number };
  isFreelancer: boolean;
  onBook: () => void;
  onEdit: () => void;
  onCancel: () => void;
  shift?: any;
  slot_count?: any;
  refresh: any;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ position, isFreelancer, onBook, onEdit, onCancel, shift, slot_count, refresh }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = () => {
    // You might want to pass some item data to the modal here
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    refresh?.();
    setIsEditModalOpen(false);
  };

  return (
    <div>
      <ul
        className="absolute bg-white border rounded shadow-md"
        style={{ top: position.y, left: position.x }}
      >
        {isFreelancer ? (
          <>
            <li onClick={onCancel} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Cancel</li>
            <li onClick={handleEdit} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit</li>
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
