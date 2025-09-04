    // src/features/game/components/FieldView.jsx

import React from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const FieldView = ({ field, selectedFieldId, onSelectField }) => {
  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded">
      {field.map((card) => (
        <div
          key={card.id}
          className={`flex items-center justify-center w-24 h-32 rounded-lg shadow-md bg-white border cursor-pointer transition
            ${selectedFieldId === card.id ? "border-green-500 bg-green-100" : "border-gray-300 hover:border-gray-500"}
          `}
          onClick={() => onSelectField(card.id)}
        >
          <BlockMath math={card.display} />
        </div>
      ))}
    </div>
  );
};

export default FieldView;