import { useState } from "react";
import FieldView from "../features/game/components/FieldView";
import ControlPanel from "../features/game/components/ControlPanel"

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
  const [selectedField, setSelectedField] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingFunc, setPendingFunc] = useState(null);
  const [modalOperatorTarget, setModalOperatorTarget] = useState(false);

  const onApplyOperator = async (operator, target) => {
    if (!operator || !target) return;

    const { owner, id } = target;
    const sourceField = owner === "player" ? playerField : opponentField;
    const setField = owner === "player" ? setPlayerField : setOpponentField;

    const newField = await Promise.all(
      sourceField.map(async card => {
        if (operator.target !== "all" && card.id !== id) return card;
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

  const handleRequestAddFunc = (func) => {
    setPendingFunc(func);
    setIsModalOpen(true);
  };

  const handleConfirmAddFunc = (owner) => {
    handleAddFunc(pendingFunc, owner);
    setPendingFunc(null);
    setIsModalOpen(false);
  };

  const handleExecuteOperator = async (owner) => {
    if (!selectedOperator) return;
    if (selectedOperator.target === "all") {
      await onApplyOperator(selectedOperator, { owner });
    } else {
      await onApplyOperator(selectedOperator, selectedField);
    }
  }

  const handleApplyOperatorAll = async (owner) => {
    const sourceField = owner === "player" ? playerField : opponentField;
    const setField = owner === "player" ? setPlayerField : setOpponentField;

    const newField = await Promise.all(
      sourceField.map(async card => {
        const newFunc = await selectedOperator.effect(card.name);
        return {
          ...card,
          name: String(newFunc.result),
          display: String(newFunc.display),
        };
      })
    );
    setField(newField);
    setModalOperatorTarget(false);
  };

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
            selectedFieldId={selectedField?.id ?? null}
            onApplyOperator={setSelectedOperator}
            handleRequestAddFunc={handleRequestAddFunc}
            onExecuteOperator={handleExecuteOperator}
          />
        </div>
        {isModalOpen && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
            justifyContent: "center", alignItems: "center",
            zIndex: 1000,
          }}>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-lg shadow-lg text-center min-w-[300px]">
              <p style={{ marginBottom: "1rem" }}>どちらの場に追加しますか？</p>
              <button
                style={{ marginRight: "1rem" }}
                onClick={() => handleConfirmAddFunc("player")}
              >
                自分
              </button>
              <button
                style={{ marginRight: "1rem" }}
                onClick={() => handleConfirmAddFunc("opponent")}
              >
                相手
              </button>
              <button onClick={() => { setIsModalOpen(false); setPendingFunc(null); }}>
                キャンセル
              </button>
            </div>
          </div>
        )}
        {modalOperatorTarget && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
            justifyContent: "center", alignItems: "center",
            zIndex: 1000,
          }}>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-lg shadow-lg text-center min-w-[300px]">
              <p style={{ marginBottom: "1rem" }}>誰に演算を適用しますか？</p>
              <button
                style={{ marginRight: "1rem" }}
                onClick={() => handleApplyOperatorAll("player")}
              >
                自分
              </button>
              <button
                style={{ marginRight: "1rem" }}
                onClick={() => handleApplyOperatorAll("opponent")}
              >
                相手
              </button>
              <button onClick={() => setModalOperatorTarget(false)}>
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

}