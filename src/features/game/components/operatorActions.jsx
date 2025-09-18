import { div } from "framer-motion/client";
import { cards } from "../data/cards";

export function onUseOperator(state, card, dispatch) {
  console.log("card is", card);
  if(card.type === "function") {
    //「どちらの場に追加しますか？」 -> (3枚以上の時 or 未満の時)
  } else if (card.target === "all") {
    dispatch({ type: "ENTER_CHOOSE_FIELD", });

  } else if (card.name === "derivative" || card.name === "integral"){
    dispatch({ type: "ENTER_CHOOSE_BASE", });

  } else if (card.name === "multiply" || card.name === "divide"){
    dispatch({ type: "ENTER_CHOOSE_BASE", });

  } else {
    dispatch({ type: "ENTER_CHOOSE_BASE", });

  }
}

export function OverlayTargetSingle({ dispatch }) {
  return (
    <div className="font-cinzel fixed inset-0 bg-black bg-opacity-70 z-40 flex flex-col items-center justify-end pb-10">
      <div className="text-white text-xl mb-4">どの基底に使用しますか？</div>
      <button
        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        onClick={() => dispatch({ type: "EXIT_CHOOSE_BASE" })}
      >
        キャンセル
      </button>
    </div>
  );
}

export function OverlayTargetAll({ dispatch }) {
  return (
    <div className="font-cinzel fixed inset-0 bg-black bg-opacity-70 z-40 flex flex-col items-center justify-end pb-10">
      <div className="text-white text-xl mb-4">どちらの場に適用しますか</div>
      <button
        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
        onClick={() => dispatch({ type: "EXIT_CHOOSE_FIELD" })}
      >
        キャンセル
      </button>
    </div>
  );
}