import { useState } from "react";
import { cards } from "../data/cards.js";
import { BlockMath } from "react-katex";

export default function ControlPanel({ selectedFieldId, onApplyOperator, handleRequestAddFunc, onExecuteOperator }) {
    const [selectedOperatorId, setSelectedOperatorId] = useState(null);
    const [selectedFuncId, setSelectedFuncId] = useState(null);

    const funcCards = cards.filter(card => card.type === "function");
    const operatorAllCards = cards.filter(card => card.type === "operator" && card.target === "all");
    const operatorSingleTrueCards = cards.filter(card => card.type === "operator" && card.target === "single" && card.multipleAllowed);
    const operatorSingleFalseCards = cards.filter(card => card.type === "operator" && card.target === "single" && !card.multipleAllowed);
    const multiplierDividerCards = cards.filter(card => card.type === "multiplier" || card.type === "divider");

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

    const renderCardGrid = (cardList, selectedId, onSelect) => (
        <div className="grid grid-cols-4 gap-2">
            {cardList.map(card => (
                <div
                    key={card.id}
                    className={`p-2 border rounded cursor-pointer text-center
                    ${selectedId === card.id ? 'bg-blue-100 dark:bg-blue-800 border-blue-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    onClick={() => onSelect(card)}
                >
                    <BlockMath math={card.display} />
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold">関数カード</h3>
                {renderCardGrid(funcCards, selectedFuncId, handleSelectFunc)}
                <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    onClick={() => {
                        const selectedFunc = funcCards.find(f => f.id === selectedFuncId);
                        handleRequestAddFunc(selectedFunc);
                    }}
                    disabled={!selectedFuncId}
                >
                    追加
                </button>
            </div>

            <div>
                <h3 className="font-semibold">演算カード（全体対象）</h3>
                {renderCardGrid(operatorAllCards, selectedOperatorId, handleSelectOperator)}
            </div>

            <div>
                <h3 className="font-semibold">演算カード（個別・複数可）</h3>
                {renderCardGrid(operatorSingleTrueCards, selectedOperatorId, handleSelectOperator)}
            </div>

            <div>
                <h3 className="font-semibold">演算カード（個別・単独のみ）</h3>
                {renderCardGrid(operatorSingleFalseCards, selectedOperatorId, handleSelectOperator)}
            </div>

            <div>
                <h3 className="font-semibold">演算カード（乗法・除法）</h3>
                {renderCardGrid(multiplierDividerCards, selectedOperatorId, handleSelectOperator)}
            </div>

            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                onClick={handleApplyOperator}
                disabled={!selectedFieldId || !selectedOperatorId}
            >
                適用
            </button>
        </div>
    );
}