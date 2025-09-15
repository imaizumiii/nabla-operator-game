import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"
import { cards } from "../data/cards.js";
import { BlockMath } from "react-katex";
import { onUseOperator } from "./operatorActions.jsx";

function Operator({ data, selected, onClick, onUse }) {
    const [hovered, setHovered] = useState(false);

    const showDescription = hovered;

    return (
        <div
            onClick={onClick}
            className={`relative card ${selected ? "selected" : ""}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <BlockMath math={data.display} />
            {/* 説明パネル hovered = true の時のみ表示 */}
            <AnimatePresence>
                {showDescription && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-0 right-0 -translate-y-[95%] translate-x-[30%] w-72 panel-shadowverse z-10"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <span
                            className="font-cinzel
    inline-block px-2 py-1 mb-2 text-xs font-bold uppercase tracking-wide 
    border rounded shadow-inner
    text-amber-800 border-amber-600 bg-gradient-to-r from-amber-100 to-amber-200
    dark:text-amber-200 dark:border-amber-400 dark:bg-gradient-to-r dark:from-zinc-800 dark:to-zinc-700
  "
                        >
                            カードタイプ : {data.type}
                        </span>
                        <div
                            className="font-cinzel
    max-h-32 overflow-y-auto text-sm leading-relaxed p-2 rounded border shadow-inner
    text-gray-800 bg-white/70 border-gray-300
    dark:text-gray-200 dark:bg-black/30 dark:border-gray-600
  "
                        >
                            {data.description}
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); //カード選択と区別
                                // console.log(data)
                                onUse(data)
                            }}
                            className="button-30 font-cinzel"
                        >
                            使用</button>
                    </motion.div>
                )
                }
            </AnimatePresence>
        </div>
    )
}

export default function ControlPanel({ state, dispatch }) {

    const onSelectOperator = (cardId) => {
        dispatch({ type: "SET_SELECTED_OPERATOR", payload: cardId });
    }
    return (<>
        {/* 関数カード */}
        <h2>自分の手札</h2>
        <div style={{ display: "flex" }}>
            {state.hand.playerHand.map((card) => {
                return (
                    <Operator //一旦funcもop扱い
                        key={card.instanceId}
                        data={card}
                        selected={card.instanceId === state.selectedOperator}
                        onClick={() => onSelectOperator(card.instanceId)}
                        onUse={() => onUseOperator(card, dispatch)}
                    />
                )
            })}
        </div>
        <h2>相手の手札</h2>
        <div style={{ display: "flex" }}>
            {state.hand.opponentHand.map((card) => {
                return (
                    <Operator //一旦funcもop扱い
                        key={card.instanceId}
                        data={card}
                        selected={card.instanceId === state.selectedOperator}
                        onClick={() => onSelectOperator(card.instanceId)}
                        onUse={() => onUseOperator(card, dispatch)}
                    />
                )
            })}
        </div>

    </>);
}