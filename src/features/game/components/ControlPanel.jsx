import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"
import { BlockMath } from "react-katex";

function Operator({ state, dispatch, card }) {

    function onUseOperator(card, dispatch) {
        console.log("card is", card);
        if (card.type === "function") {
            dispatch({ type: "ENTER_CHOOSE_FIELD", });
        } else if (card.target === "all") {
            dispatch({ type: "ENTER_CHOOSE_FIELD", });
        } else if (card.name === "derivative" || card.name === "integral") {
            dispatch({ type: "ENTER_USE_DIFFINT", });
        } else if (card.name === "multiply" || card.name === "divide") {
            dispatch({ type: "ENTER_CHOOSE_BASE", });
        } else {
            dispatch({ type: "ENTER_CHOOSE_BASE", });
        }
    }

    const onSelectOperator = (cardId) => {
        dispatch({ type: "SET_SELECTED_OPERATOR", payload: cardId });
    }
    const onUseMultOperator = (newCardId) => {
        let newMultOperator;
        if (state.selectedMultOperator.includes(newCardId)) {
            newMultOperator = state.selectedMultOperator.filter(id => id !== newCardId);
        } else {
            newMultOperator = [...state.selectedMultOperator, newCardId];
        }
        dispatch({ type: "SET_SELECTED_MULT_OPERATOR", payload: newMultOperator });
    }


    const [hovered, setHovered] = useState(false);
    const showDescription = hovered;

    return (
        <div
            onClick={(e) => {
                e.stopPropagation(); //カード選択と区別
                onUseMultOperator(card.instanceId);
                console.log(card);
                onUseOperator(card, dispatch);
                onSelectOperator(card.instanceId);
            }}
            className={`relative card
                ${card.instanceId === state.selectedOperator ? "choice" : ""}
                ${state.selectedMultOperator.includes(card.instanceId) ? "selected" : ""}
                ${state.isUsingDiffInt && (
                    card.name === "integral" || card.name === "derivative" ? "choice" : "")
                }`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <BlockMath math={card.display} />
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
                        <span className="card-type">カードタイプ : {card.type}</span>
                        <div className="card-description">{card.description}</div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); //カード選択と区別
                                onUseMultOperator(card.instanceId);
                                // console.log(card)
                                onUseOperator(card, dispatch)
                                onSelectOperator(card.instanceId);
                            }}
                            className="button-30 font-cinzel"
                        >使用</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function ControlPanel({ state, dispatch }) {

    return (<>
        {/* 関数カード */}
        <h2>自分の手札</h2>
        <div style={{ display: "flex" }}>
            {state.hand.playerHand.map((card) => {
                return (
                    <Operator //一旦funcもop扱い
                        key={card.instanceId}
                        state={state}
                        dispatch={dispatch}
                        card={card}
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
                        state={state}
                        dispatch={dispatch}
                        card={card}
                    />
                )
            })}
        </div>

    </>);
}