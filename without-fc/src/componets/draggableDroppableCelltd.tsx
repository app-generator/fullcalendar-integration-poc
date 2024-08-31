import React, { useEffect, useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import useApi from "../api";
import ContextMenu from "./contextMenu";

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

const DraggableDroppableCell: React.FC<{ 
  slot: Slot;
  index: number;
  time: string;
  isFreelancer: boolean;
  shift: Shift;
  row: number;
  col: number;
  onDrop: (item: any, time: string, shift: Shift, row: number, col: number) => void;
  onDoubleClick?: () => void;
  openModalSlotList?: (data: any) => void;
  refresh: () => void;
}> = ({ slot, index, time, isFreelancer, shift, row, col, onDrop, onDoubleClick, openModalSlotList, refresh }) => {

  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType.CELL,
    item: { index, time, isFreelancer, row, col, shift },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, dropRef] = useDrop({
    accept: ItemType.CELL,
    drop: (item) => {
      onDrop(item, time, shift, row, col);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const api = useApi();

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const cellRef = useRef<HTMLTableCellElement | null>(null);

  // Handle right-click event
  const handleRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setShowContextMenu(true);
  };

  // Close context menu when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (cellRef.current && !cellRef.current.contains(event.target as Node)) {
      setShowContextMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const onBook = () => {
    console.log(slot.company_slot_ids[0]);
    api.bookTimeSlot(slot.company_slot_ids[0]).then((response:any) => {
      refresh?.();
    }, (error) => {

    })
  }

  const value = isFreelancer ? slot.freelancer_slot : slot.company_slot;

  return (
    <td
      ref={(node) => {
        cellRef.current = node;
        dragRef(node);
        dropRef(node);
      }}
      className={`cursor-crosshair border border-gray-300 px-4 py-2 text-center w-20 ${
        isFreelancer
          ? slot.freelancer_slot > 0
            ? "bg-green-500"
            : ""
          : slot.company_slot > 0
          ? "bg-blue-500"
          : ""
      } ${isDragging ? "opacity-50" : ""} ${isOver ? "bg-yellow-400" : ""}`}
      onDoubleClick={value ? undefined : onDoubleClick}
      onContextMenu={handleRightClick}
    >
      {value ? (
        <a
          onClick={() => openModalSlotList && openModalSlotList(
            isFreelancer ? slot.freelancer_slot_ids : slot.company_slot_ids
          )}
          className="cursor-pointer"
        >
          {value}
        </a>
      ) : (
        ""
      )}
      {showContextMenu && (
        <ContextMenu 
          position={contextMenuPosition} 
          isFreelancer={isFreelancer} 
          onBook={onBook} 
          onEdit={() => {}} // Placeholder, since edit action is handled in ContextMenu
          onCancel={() => {}} // Placeholder, since cancel action is handled in ContextMenu
          shift={shift}
          slot_count={value}
          refresh={refresh}
          time={time}
        />
      )}
    </td>
  );
};

export default DraggableDroppableCell;
