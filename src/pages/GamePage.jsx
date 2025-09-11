import { useState } from "react";
import FieldView from "../features/game/components/FieldView";
import ControlPanel from "../features/game/components/ControlPanel"

const initialField = [
  { id: "func-1", name: "sin(x)/x", display: "\\dfrac{\\sin\\left(x\\right)}{x}", type: "function", func: "sin(x)/x" },
  { id: "func-2", name: "x^2", display: "x^2", type: "function", func: "x^2" },
  { id: "func-3", name: "-exp(x)", display: "-e^x", type: "function", func: "-exp(x)" },
  { id: "func-4", name: "sin(x)", display: "\\sin\\left(x\\right)", type: "function", func: "sin(x)" },
  { id: "func-5", name: "log(x)", display: "\\log\\left(x\\right)", type: "function", func: "log(x)" },
  { id: "func-6", name: "x-x*log(x)", display: "x-x\\log\\left(x\\right)", type: "function", func: "x-x*log(x)" },


];

export default function GamePage() {
  const [status, setStatus] = useState("idle");
  const [field, setField] = useState(initialField);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);

  const onApplyOperator = async (operator, fieldId) => {
    if (!operator || !fieldId) return;

    const newField = await Promise.all(
      field.map(async operator => {
        if (operator.id !== fieldId) return operator;

        const newFunc = await operator.effect(operator.name);
        return {
          ...operator,
          name: String(newFunc.result),
          display: String(newFunc.display),
        };
      })
    );

    setField(newField);
  };

  const handleAddFunc = (func) => {
    if (!func) return;
    const newFunc = {
      ...func,
      name: String(func.name),
      display: String(func.display),
    };
    setField([...field, newFunc]);
    }
  
  const handleExecuteOperator = async () => {
    await onApplyOperator(selectedOperator, selectedFieldId);
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
            handleAddFunc={handleAddFunc}
            onExecuteOperator={handleExecuteOperator}
          />
        </div>
      </div>
    )
  }

}