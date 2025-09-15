import { BlockMath } from "react-katex";
import "../../game/card.css"
// import "onSelect"

function Field({ state, data, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`card ${state.isChoosingBase ? "ring-4 ring-yellow-400 cursor-pointer z-50" : ""} ${selected ? "selected" : ""}`}
    >
      <BlockMath math={data.display} />
    </div>
  )
}
export default function ALLFieldView({ state, dispatch }) {
  const onSelectField = (cardId) => {
    dispatch({ type: "SET_SELECTED_FIELD", payload: cardId });
  };

  return (<>
    <h2>自分の場</h2>
    <div style={{ display: "flex" }}>
      {state.field.playerField.map((card) => {
        return (
          <Field
            key={card.id}
            state={state}
            data={card}
            selected={card.id === state.selectedField}
            onClick={() => onSelectField(card.id)}
          />
        )
      })}
    </div>
    <h2>相手の場</h2>
    <div style={{ display: "flex" }}>
      {state.field.opponentField.map((card) => {
        return (
          <Field
            key={card.id}
            state={state}
            data={card}
            selected={card.id === state.selectedField}
            onClick={() => onSelectField(card.id)}
          />
        )
      })}
    </div>
  </>)
}