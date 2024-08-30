import { data } from "autoprefixer";
import React, { useEffect, useState } from "react";

import { useDrag, useDrop } from "react-dnd";
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

  }> = ({ slot, index, time, isFreelancer, shift, row, col, onDrop, onDoubleClick, openModalSlotList }) => {
    const [{ isDragging }, dragRef] = useDrag({
      type: ItemType.CELL,
      item: { index, time, isFreelancer, row, col, shift },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    const value = isFreelancer ? slot.freelancer_slot : slot.company_slot;
  
    const [{ isOver }, dropRef] = useDrop({
      accept: ItemType.CELL,
      drop: (item) => {
        onDrop(item, time, shift, row, col);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
      canDrop: (item) => {
        return true;
      }
    });
  
  
  
    return (
      <td
        ref={(node) => {
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
        onDoubleClick={onDoubleClick}
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
      </td>
    );
  };


export default DraggableDroppableCell;