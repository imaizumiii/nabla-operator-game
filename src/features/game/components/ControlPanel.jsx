import React from "react";
import { cards } from '../data/cards';
import { BlockMath } from "react-katex";

const operators = cards.filter(card => card.type === 'operator');

export default function ControlPanel({ selectedFieldId, onApplyOperator }) {
    const [selectedOperator, setSelectedOperator] = React.useState(null);

    const handleApply = () => {
        if (selectedFieldId && selectedOperator) {
            onApplyOperator(selectedOperator, selectedFieldId);
            setSelectedOperator(null);
        }
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow-md space-y-2">
            <h2 className="text-md font-semibold text-gray-900 dark:text-white">操作パネル</h2>
            <div className="flex space-x-2">
                {operators.map(operator => (
                    <button key={operator.id} className={`px-3 py-1 rounded border text-sm transition ${selectedOperator === operator.name ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
                        onClick={() => setSelectedOperator(operator.name)}>
                        <BlockMath math={operator.display} />
                    </button>
                ))}
                <button className="mt-2 px-4 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                    onClick={handleApply}
                    disabled={!selectedFieldId || !selectedOperator}>
                        適用
                    </button>
            </div>
        </div>
    )
}