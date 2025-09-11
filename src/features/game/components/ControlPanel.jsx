import { useState } from "react";
import { cards } from "../data/cards.js";
import { BlockMath } from "react-katex";

export default function ControlPanel({ selectedFieldId, onApplyOperator, handleRequestAddFunc, onExecuteOperator }) {
    const [selectedOperatorId, setSelectedOperatorId] = useState(null);
    const [selectedFuncId, setSelectedFuncId] = useState(null);
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

    const funcCards = cards.filter(card => card.type === "function");
    const operatorAllCards = cards.filter(card => card.type === "operator" && card.target === "all");
    const operatorSingleTrueCards = cards.filter(card => card.type === "operator" && card.target === "single" && card.multipleAllowed);
    const operatorSingleFalseCards = cards.filter(card => card.type === "operator" && card.target === "single" && !card.multipleAllowed);
    const multiplierDividerCards = cards.filter(card => card.type === "multiplier" || card.type === "divider");

    const selectedOperator = cards.find(card => card.id === selectedOperatorId);

    const handleSelectOperator = (operator) => {
        setSelectedOperatorId(operator.id);
        onApplyOperator(operator);
    };

    const handleSelectFunc = (func) => {
        setSelectedFuncId(func.id);
    };

    const handleApplyOperator = () => {
        if (!selectedOperator) return;
        if (selectedOperator.target === "all") {
            setIsTargetModalOpen(true);
        } else if (selectedFieldId) {
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
                disabled={!selectedOperatorId || (selectedOperator?.target !== "all" && !selectedFieldId)}
            >
                適用
            </button>

            {isTargetModalOpen && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
                    justifyContent: "center", alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "white", padding: "2rem", borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.3)", textAlign: "center",
                        minWidth: "300px",
                    }}>
                        <p style={{ marginBottom: "1rem"}}>誰に適用しますか</p>
                        <button style={{ marginRight: "1rem" }} onClick={() => {onExecuteOperator("player"); setIsTargetModalOpen(false); }}>
                            自分
                        </button>
                        <button style={{ marginRight: "1rem" }} onClick={() => {onExecuteOperator("opponent"); setIsTargetModalOpen(false); }}>
                            相手
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}