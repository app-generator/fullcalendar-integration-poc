import React, { useEffect, useState } from "react";
import Select from "react-select";
import useApi from "../api";


// Define the types for the options and cell data
interface OptionType {
  value: string;
  label: string;
}



interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  cellData?: any;
  fetchTimeSlot?: () => void;
}

const AddModal: React.FC<ModalProps> = ({ isOpen, onClose, cellData, fetchTimeSlot }) => {
  const [users, setUsers] = useState<OptionType[]>([]);
  const [modalFormData, setModalFormData] = useState({
    date: cellData,
    status: "PLANNED",
    slot_count: 1,
    company: "",
  });

  const api = useApi();

  useEffect(() => {
    api.getUser().then((response: any) => {
      setUsers(response)
    }, (error) => {

    })
  }, [cellData]);

  if (!isOpen) return null;

  const handleSave = () => {
    
    api.createTimeSlot(modalFormData).then((response: any) => {
      if (fetchTimeSlot) {  // Safe check
        fetchTimeSlot();
      }
    }, (error) => {
      console.log(error);
    })

    onClose();
  };

  const onSignleSelect = (name:string, value:string) => {
    setModalFormData({
      ...modalFormData,
      [name]: value,
    });
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Cell Details</h2>
        
        {/* Date Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Date and Time</label>
          <input
            type="text"
            value={cellData}
            disabled
            className="border border-gray-300 px-4 py-2 rounded w-full"
          />
        </div>
        
        {/* Team Select Field */}
   
        {/* Company Select Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Company</label>
          <Select
            options={users}
            // value={selectedCompany}
            onChange={(e:any) => onSignleSelect("company", e.value)}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Slot Count</label>
          <input
            type="text"
            onChange={(e) => onSignleSelect("slot_count", e.target.value)}
            defaultValue={modalFormData.slot_count}
            className="border border-gray-300 px-4 py-2 rounded w-full"
          />
        </div>
        
        
        <div className="flex justify-end gap-x-2">
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
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

export default AddModal;
