import { useEffect, useState } from 'react';
import useApi from '../api';

const EditShiftModal: React.FC<{ isOpen: boolean; onClose: () => void; item: any; onSave: any; slot_count: number; }> = ({ isOpen, onClose, item, onSave, slot_count }) => {
  const [editFormData, setEditFormData] = useState({ shift_name: '', slot_count: 0 });

  const api = useApi();

  const handleSave = () => {
    api.updateShift(item.shift, editFormData).then((response) => {
      onSave();
    }, (error) => {
      console.log(error);
    });
    onClose();
  };

  useEffect(() => {
    setEditFormData({'shift_name': item?.shift_name, 'slot_count': slot_count});
  }, [item]);

  if (!isOpen) return null;

  const onInputChange = (name: string, value: any) => {
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Edit Shift</h2>

        {/* Shift Name Input Field */}
        <input 
          type="text" 
          placeholder="Shift Name"
          defaultValue={editFormData.shift_name || ''} 
          onChange={(e) => onInputChange('shift_name', e.target.value)} 
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        />

        {/* Slot Count Input Field */}
        <input 
          type="number" 
          placeholder="Slot Count"
          defaultValue={editFormData.slot_count || ''} 
          onChange={(e) => onInputChange('slot_count', parseInt(e.target.value) || 0)} 
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        />

        <div className="flex justify-end gap-x-2">
          <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
          <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Edit</button>
        </div>
      </div>
    </div>
  );
};

export default EditShiftModal;
