import { useEffect, useState } from 'react';
import Select from 'react-select';
import useApi from '../api';

const EditModal: React.FC<{ isOpen: boolean; onClose: () => void; item: any; onSave: any; }> = ({ isOpen, onClose, item, onSave }) => {
  const [editFormData, setEditFormData] = useState({ status: '', shift_name: '' });

  const api = useApi();

  const handleSave = () => {
    api.updateTImeSlot(item, editFormData).then((response) => {
        onSave();
    }, (error) => {
        console.log(error);
    });
    onClose();
  };

  useEffect(() => {
    api.getTimeSlotDetail(item).then((response:any) => {
        setEditFormData({'status': response.status, 'shift_name': response?.shift?.name});
    }, (error) => {

    })
  }, [item]);

  if (!isOpen) return null;

  // Example options for the status select field
  const statusOptions = [
    // { value: 'BOOKED', label: 'Booked' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'PLANNED', label: 'Planned' }
  ];

  const onSingleChange = (name: string, value: string) => {
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Edit Slot</h2>

        {/* Shift Name Input Field */}
        <input 
          type="text" 
          placeholder="Shift Name"
          defaultValue={editFormData.shift_name || ''} 
          onChange={(e) => onSingleChange('shift_name', e.target.value)} 
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        />

        {/* Status Select Field */}
        <Select
          value={statusOptions.find(option => option.value === editFormData.status)}
          onChange={(e:any) => onSingleChange('status', e.value)}
          options={statusOptions}
          className="mb-4"
        />

        <div className="flex justify-end gap-x-2">
          <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
          <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Edit</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
