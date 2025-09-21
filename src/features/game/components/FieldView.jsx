import { BlockMath } from "react-katex";
import "../../game/card.css"
import { div } from "framer-motion/client";
// import "onSelect"

function Field({ state, data, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`card
        ${state.isChoosingBase || state.isUsingDiffInt ? "ring-4 ring-yellow-400 cursor-pointer z-50" : ""}
        ${selected ? "selected" : ""}`}
    >
      <BlockMath math={data.display} />
    </div>
  )
}
export default function ALLFieldView({ state, dispatch }) {
  const onSelectBase = (cardId) => {
    dispatch({ type: "SET_SELECTED_BASE", payload: cardId });
  };
  const onSelectField = (field) => {
    dispatch({ type: "SET_SELECTED_FIELD", payload: field });
  }

  return (<>
    <h2>自分の場</h2>
    <div style={{ display: "flex" }}
      className={`p-4 border rounded ${state.isChoosingField ? "ring-4 ring-yellow-400 cursor-pointer relative z-50" : ""}`}
      onClick={() => onSelectField(state.field.playerField)}
    >
      {state.field.playerField.cards.map((card) => {
        return (
          <Field
            key={card.id}
            state={state}
            data={card}
            selected={card.id === state.selectedBase}
            onClick={() => onSelectBase(card.id)}
          />
        )
      })}
    </div >
    <h2>相手の場</h2>
    <div style={{ display: "flex" }}
      className={`p-4 border rounded ${state.isChoosingField ? "ring-4 ring-yellow-400 cursor-pointer relative z-50" : ""}`}
      onClick={() => onSelectField(state.field.opponentField)}
    >
      {state.field.opponentField.cards.map((card) => {
        return (
          <Field
            key={card.id}
            state={state}
            data={card}
            selected={card.id === state.selectedBase}
            onClick={() => onSelectBase(card.id)}
          />
        )
      })}
    </div>
  </>)
}