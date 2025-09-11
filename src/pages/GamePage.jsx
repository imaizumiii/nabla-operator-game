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

const initialPlayerField = [
  { id: "player-func-1", name: "1", display: "1", type: "function", func: "1" },
  { id: "player-func-2", name: "x", display: "x", type: "function", func: "x" },
  { id: "player-func-3", name: "x^2", display: "x^2", type: "function", func: "x^2" },
]

const initialOpponentField = [
  { id: "opponent-func-1", name: "1", display: "1", type: "function", func: "1" },
  { id: "opponent-func-2", name: "x", display: "x", type: "function", func: "x" },
  { id: "opponent-func-3", name: "x^2", display: "x^2", type: "function", func: "x^2" },
]

export default function GamePage() {
  const [status] = useState("idle");
  const [playerField, setPlayerField] = useState(initialPlayerField);
  const [opponentField, setOpponentField] = useState(initialOpponentField);
  // const [field, setField] = useState(initialField);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);

  const onApplyOperator = async (operator, target) => {
    if (!operator || !target) return;

    const { owner, id } = target;
    const sourceField = owner === "player" ? playerField : opponentField;
    const setField = owner === "player" ? setPlayerField : setOpponentField;

    const newField = await Promise.all(
      sourceField.map(async card => {
        if (card.id !== id) return card;

        const newFunc = await operator.effect(card.name);
        return {
          ...card,
          name: String(newFunc.result),
          display: String(newFunc.display),
        };
      })
    );
    setField(newField);
  }
  // const onApplyOperator = async (operator, fieldId) => {
  //   if (!operator || !fieldId) return;

  //   const newField = await Promise.all(
  //     field.map(async card => {
  //       if (card.id !== fieldId) return card;

  //       const newFunc = await operator.effect(card.name);
  //       console.log("In onApplyOperator...[newFunc.result]: ",newFunc.result);
  //       return {
  //         ...card,
  //         name: String(newFunc.result),
  //         display: String(newFunc.display),
  //       };
  //     })
  //   );

  //   setField(newField);
  // };

  const handleAddFunc = (func, owner) => {
    if (!func || !owner) return;
    const newFunc = {
      ...func,
      name: String(func.name),
      display: String(func.display),
    };
    if (owner === "player") {
      setPlayerField([...playerField, newFunc]);
    } else {
      setOpponentField([...opponentField, newFunc]);
    }
  };

  const handleExecuteOperator = async () => {
    await onApplyOperator(selectedOperator, selectedField);
  }

  if (status === "idle") {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>ゲーム中</h1>
        <div className="p-2 space-y-4">
          <h2 className="text-lg font-semibold">プレイヤーの場</h2>
          <FieldView
            owner="player"
            field={playerField}
            selectedField={selectedField}
            onSelectField={(selected) => {
              if (selectedField && selected && selectedField.owner === "player" && selectedField.id === selected.id) {
                setSelectedField(null);
              } else {
                setSelectedField(selected);
              }
            }}
          />

          <h2 className="text-lg font-semibold">相手の場</h2>
          <FieldView
            owner="opponent"
            field={opponentField}
            selectedField={selectedField}
            onSelectField={(selected) => {
              if (selectedField && selected && selectedField.owner === "opponent" && selectedField.id === selected.id) {
                setSelectedField(null);
              } else {
                setSelectedField(selected);
              }
            }}
          />

          <ControlPanel
            selectedField={selectedField}
            onApplyOperator={setSelectedOperator}
            handleAddFunc={handleAddFunc}
            onExecuteOperator={handleExecuteOperator}
          />
        </div>
      </div>
    )
  }

}