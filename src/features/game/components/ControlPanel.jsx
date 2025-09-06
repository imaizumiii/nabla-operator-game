import { useState } from "react";
import { cards } from "../data/cards.js";
import { BlockMath } from "react-katex";

export default function ControlPanel({ selectedFieldId, onApplyOperator, onExecuteOperator }) {
    const [selectedOperatorId, setSelectedOperatorId] = useState(null);

    const operatorCards = cards.filter(card => card.type === "operator");

    const handleSelectOperator = (operator) => {
        setSelectedOperatorId(operator.id);
        onApplyOperator(operator);
    }

    const handleApply = () => {
        if (selectedFieldId && selectedOperatorId) {
            onExecuteOperator();
        }
    };

    return (
        <div className="space-y-2">
            <h3 className="font-semibold">演算カード</h3>
            <div className="grid grid-cols-4 gap-2">
                {operatorCards.map(operator => (
                    <div
                        key={operator.id}
                        className={`p-2 border rounded cursor-pointer text-center
                        ${selectedOperatorId === operator.id ? 'bg-blue-100 dark:bg-blue-800 border-blue-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        onClick={() => handleSelectOperator(operator)}
                    >
                        <BlockMath math={operator.display} />
                    </div>
                ))}
            </div>
            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                onClick={handleApply}
                disabled={!selectedFieldId || !selectedOperatorId}
            >
                適用
            </button>
        </div>
    )

}