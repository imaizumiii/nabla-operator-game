import { div } from "framer-motion/client";
import { cards } from "../data/cards";


export function OverlayTargetSingle({ dispatch }) {
  return (
    <div className="overlay">
      <div className="text-white text-xl mb-4">どの基底に使用しますか？</div>
      <button
        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        onClick={() => {
          dispatch({ type: "EXIT_CHOOSE_BASE" });
          dispatch({ type: "SET_SELECTED_OPERATOR", payload: null });
        }}
      >
        キャンセル
      </button>
    </div>
  );
}

export function OverlaySelectField({ dispatch }) {
  return (
    <div className="overlay">
      <div className="text-white text-xl mb-4">どちらの場に適用しますか</div>
      <button
        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        onClick={() => {
          dispatch({ type: "EXIT_CHOOSE_FIELD" });
          dispatch({ type: "SET_SELECTED_OPERATOR", payload: null });
        }}
      >
        キャンセル
      </button>
    </div>
  );
}

export function OverlayUseDiffInt({ dispatch }) {
  return (
    <div className="overlay">
      <div className="text-white text-xl mb-4">使用するカードと基底を選択してください</div>
      <button
        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        onClick={() => {
          dispatch({ type: "EXIT_USE_DIFFINT" });
          dispatch({ type: "SET_SELECTED_OPERATOR", payload: null });
          dispatch({ type: "SET_SELECTED_MULT_OPERATOR", payload: [] });
        }}>
        キャンセル
      </button>
    </div>
  )
}