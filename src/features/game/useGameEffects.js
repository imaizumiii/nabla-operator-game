import { useEffect } from "react";
import katex from 'katex';
import 'katex/dist/katex.min.css'


export function useGameEffects(state, dispatch) {
    useEffect(() => {
        if (!state.selectedOperator || !state.selectedField) return;

        const runEffect = async () => {
            const card = [...state.hand.playerHand, ...state.hand.opponentHand].find(c => c.instanceId === state.selectedOperator);

            const fieldCard = [...state.field.playerField, ...state.field.opponentField]
                .find(f => f.id === state.selectedField);

            if (!fieldCard) return;
            let updatedName;

            if (card.type === "function") {
                updatedName = await card.effect(fieldCard.name);
            } else if (card.target === "all") {
                updatedName = await card.effect(fieldCard.name);
            } else if (card.name === "derivative" || card.name === "integral") {
                updatedName = await card.effect(fieldCard.name);
            } else if (card.name === "multiply" || card.name === "divide") {
                updatedName = await card.effect(fieldCard.name);
            } else {
                updatedName = await card.effect(fieldCard.name);
            }

            const newField = {
                ...state.field,
                playerField: state.field.playerField.map(f =>
                    f.id === state.selectedField ? { ...f, name: updatedName.result, display: updatedName.display } : f
                ),
                opponentField: state.field.opponentField.map(f =>
                    f.id === state.selectedField ? { ...f, name: updatedName.result, display: updatedName.display } : f
                ),
            }

            dispatch({ type: "SET_FIELD", payload: newField });
            dispatch({ type: "EXIT_CHOOSE_BASE" });
        };

        runEffect();
    }, [state.selectedOperator, state.selectedField, state.field, state.hand, dispatch])
}