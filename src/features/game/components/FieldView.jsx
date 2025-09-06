import { useState } from "react";
import { BlockMath } from "react-katex";

export default function FieldView({ field, selectedFieldId, onSelectField }) {

  const handleSelect = (id) => {
    const newSelected = selectedFieldId === id ? null : id;
    onSelectField(newSelected);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {field.map(card => (
        <div
          key={card.id}
          onClick={() => handleSelect(card.id)}
          className={`p-2 border rounded cursor-pointer text-center
            ${selectedFieldId === card.id ? "bg-blue-100 border-blue-500" : "hover:bg-gray-100"}
            `}
        >
          <BlockMath math={card.display} />
        </div>
      ))}
    </div>
  )
}