import { useState } from "react";
import FieldView from "../features/game/components/FieldView";
import ControlPanel from "../features/game/components/ControlPanel"

const initialField = [
  { id: "func-1", name: "1", display: "1", type: "function", func: "1" },
  { id: "func-2", name: "x", display: "x", type: "function", func: "x" },
  { id: "func-3", name: "x^2", display: "x^2", type: "function", func: "x^2" },
];

export default function GamePage() {
  const [status, setStatus] = useState("idle");
  const [field, setField] = useState(initialField);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);

  const applyOperator = async (operator, fieldId) => {
    if (!operator || !fieldId) return;

    const newField = await Promise.all(
      field.map(async card => {
        if (card.id !== fieldId) return card;

        const newFunc = await operator.effect(card.func);
        return {
          ...card,
          func: String(newFunc),
          display: String(newFunc),
        };
      })
    );

    setField(newField);
  };
  
  const handleExecuteOperator = async () => {
    await applyOperator(selectedOperator, selectedFieldId);
  }

  if (status === "idle") {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>ゲーム中</h1>
        <div className="p-2 space-y-4">
          <h2 className="text-lg font-semibold">場のカード</h2>
          <FieldView
            field={field}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
          />
          <ControlPanel
            selectedFieldId={selectedFieldId}
            onApplyOperator={setSelectedOperator}
            onExecuteOperator={handleExecuteOperator}
          />
        </div>
      </div>
    )
  }

}