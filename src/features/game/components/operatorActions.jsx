import { div } from "framer-motion/client";
import { cards } from "../data/cards";

export function onUseOperator(card, dispatch) {
    console.log(card, "in onUseOperator");
    dispatch({ type: "ENTER_CHOOSE_BASE", payload: card, });
}

export function Overlay({ dispatch, message }) {
  return (
    <div className="font-cinzel fixed inset-0 bg-black bg-opacity-70 z-40 flex flex-col items-center justify-end pb-10">
      <div className="text-white text-xl mb-4">{message}</div>
      <button
        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        onClick={() => dispatch({ type: "EXIT_CHOOSE_BASE" })}
      >
        キャンセル
      </button>
    </div>
  );
}