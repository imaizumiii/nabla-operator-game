import { BlockMath } from "react-katex";
import "../../game/card.css"
// import "onSelect"

function Field({ data, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`card ${selected ? "selected" : ""}`}
    >
      <BlockMath math={data.display} />
    </div>
  )
}
export default function ALLFieldView({ state, dispatch }) {
  const onSelectField = (cardId) => {
    console.log("Do onSelectField");
    console.log(`state.selectedField is ${state.selectedField}`);
    dispatch({ type: "SET_SELECTED_FIELD", payload: cardId });
  };

  return (<>
  <h2>自分の場</h2>
    <div style={{ display: "flex" }}>
      {state.field.playerField.map((card) => {
        return (
          <Field
            key={card.id}
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
            data={card}
            selected={card.id === state.selectedField}
            onClick={() => onSelectField(card.id)}
          />
        )
      })}
    </div>
  </>)
}