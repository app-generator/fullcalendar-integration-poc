import React, { useEffect, useState } from "react";
import useApi from "../api";
import { error } from "console";


interface SlotListModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; // Array of items to display
  fetchTimeSlot?: () => void;
}

const SlotListModal: React.FC<SlotListModalProps> = ({
  isOpen,
  onClose,
  data,
  fetchTimeSlot,
}) => {
  
  const [slotList, setSlotList] = useState<any[]>([]);
  const api = useApi();

  const onDelete = (id: string) => {
    api.deleteSlot(id).then((response) => {
      fetchTimeSlitFilter();
    }, (error) => {
      console.log(error);
    })
  };

  const onEdit = (id: string) => {
    
  }

  const onBook = (id: string) => {
    api.bookTimeSlot(id).then((response) => {
      fetchTimeSlot?.();
      onClose();
    }, (error) => {

    })
  }

  const fetchTimeSlitFilter = () => {
    const params = {
      ids: data,
    };

    api.getSlotListFilter(params).then((response: any) => {
      setSlotList(response);
    }, (error) => {
      console.log(error);
    })
  }

  useEffect(() => {
    fetchTimeSlitFilter();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Shif Slot List</h2>

        {/* List of Items */}
        <ul className="mb-4">
          {slotList.map((item:any) => (
            <li
              key={item.id}
              className="flex justify-between items-center mb-2 p-2 border border-gray-300 rounded"
            >
              <span>{item?.company?.label}</span>
              <span>{item.status}</span>
              <div className="flex gap-x-2">
                <button
                  onClick={() => onBook(item.id)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                >
                  Book
                </button>
                <button
                  onClick={() => onEdit(item.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-end gap-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotListModal;
