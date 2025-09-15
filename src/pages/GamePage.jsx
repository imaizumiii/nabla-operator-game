import { useReducer } from "react";
import { useGameLogic } from "../features/game/hooks/useGameLogic";
import ALLFieldView from "../features/game/components/FieldView";
import ControlPanel from "../features/game/components/ControlPanel";
import { Overlay } from "../features/game/components/operatorActions";
import { reducer, initialState } from "../features/game/reducer";


export default function GamePage() {

  const [state, dispatch] = useReducer(reducer, initialState);

  return (<>
    <div style={{ display: "flex", padding: "2rem" }}>
      <div className="p-2 space-y-4">
        <ALLFieldView state={state} dispatch={dispatch} />
      </div>
      <div className="p-2 mx-6 space-y-4">
        <ControlPanel state={state} dispatch={dispatch} />
      </div>
    </div>
    {/* Overlay */}
    {state.isChoosingBase && (
      <Overlay dispatch={dispatch} message="どの基底に使用しますか？" />
    )}
  </>)
}