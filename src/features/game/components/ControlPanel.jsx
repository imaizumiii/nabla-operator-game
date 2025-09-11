import { useState } from "react";
import { cards } from "../data/cards.js";
import { BlockMath } from "react-katex";

export default function ControlPanel({ selectedFieldId, onApplyOperator, handleRequestAddFunc, onExecuteOperator }) {
    const [selectedOperatorId, setSelectedOperatorId] = useState(null);
    const [selectedFuncId, setSelectedFuncId] = useState(null);

    const funcCards = cards.filter(card => card.type === "function");
    const operatorCards = cards.filter(card => card.type === "operator");

    const handleSelectOperator = (operator) => {
        setSelectedOperatorId(operator.id);
        onApplyOperator(operator);
    };

    const handleSelectFunc = (func) => {
        setSelectedFuncId(func.id);
    };

    const handleApplyOperator = () => {
        if (selectedFieldId && selectedOperatorId) {
            onExecuteOperator();
        }
    };

    return (
        <div className="space-y-2">
            <h3 className="font-semibold">関数カード</h3>
            <div className="grid grid-cols-4 gap-2">
                {funcCards.map(func => (
                    <div
                        key={func.id}
                        className={`p-2 border rounded cursor-pointer text-center
                        ${selectedFuncId === func.id ? 'bg-blue-100 dark:bg-blue-800 border-blue-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        onClick={() => handleSelectFunc(func)}
                    >
                        <BlockMath math={func.display} />
                    </div>
                ))}
            </div>
            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                onClick={() => {
                    const selectedFunc = funcCards.find((f) => f.id === selectedFuncId);
                    handleRequestAddFunc(selectedFunc)
                }}
                disabled={!selectedFuncId}
            >
                追加
            </button>
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
                onClick={handleApplyOperator}
                disabled={!selectedFieldId || !selectedOperatorId}
            >
                適用
            </button>
        </div>
    )

}