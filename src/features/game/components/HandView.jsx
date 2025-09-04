// src/features/game/components/HandView.jsx

import React from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const HandView = ({ hand, selectedCardId, onSelectCard }) => {
  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded">
      {hand.map((card) => (
        <div
          key={card.id}
          className={`px-3 py-2 border rounded cursor-pointer transition min-w-[60px] text-center
            ${selectedCardId === card.id ? "border-blue-500 bg-blue-100" : "border-gray-300"}
          `}
          onClick={() => onSelectCard(card.id)}
        >
          <BlockMath math={card.display} />
        </div>
      ))}
    </div>
  );
};

export default HandView;
