import { useEffect } from "react";
import katex from 'katex';
import 'katex/dist/katex.min.css'

export function useGameEffects(state, dispatch) {
    useEffect(() => {
        const selectedOperator = [...state.hand.playerHand, ...state.hand.opponentHand].find(c => c.instanceId === state.selectedOperator);
        const selectedBase = [...state.field.playerField.cards, ...state.field.opponentField.cards].find(f => f.id === state.selectedBase);
        const selectedMultOperator = [...state.hand.playerHand, ...state.hand.opponentHand].filter(item => (state.selectedMultOperator.includes(item.instanceId)));

        if (!selectedOperator) return;

        const deleteBase = (oldField) => {
            console.log("newField表示", oldField);
            const newField = {
                ...oldField,
                playerField: { ...state.field.playerField, cards: oldField.playerField.cards.filter(item => (item.name !== "0" && item.name !== "oo" && item.name !== "-oo")) },
                opponentField: { ...state.field.opponentField, cards: oldField.opponentField.cards.filter(item => (item.name !== "0" && item.name !== "oo" && item.name !== "-oo")) },
            }
            return newField;
        }

        const runTargetAll = async () => {
            if (!state.selectedField) return;

            const updatedCards = await Promise.all(
                state.selectedField.cards.map(async card => {
                    const updatedName = await selectedOperator.effect(card.name);
                    return { ...card, name: updatedName.result, display: updatedName.display }
                })
            );

            let newField = {
                ...state.field,
                playerField: state.selectedField.side === "player" ? { ...state.field.playerField, cards: updatedCards } : { ...state.field.playerField },
                opponentField: state.selectedField.side === "opponent" ? { ...state.field.opponentField, cards: updatedCards } : { ...state.field.opponentField },
            }

            newField = deleteBase(newField);

            dispatch({ type: "SET_SELECTED_FIELD", payload: null });
            dispatch({ type: "SET_FIELD", payload: newField });
            dispatch({ type: "EXIT_CHOOSE_FIELD" });
        }

        const addFunc = async () => {
            if (!state.selectedField) return;

            const count = state.count;
            const maxBase = 3; //sideキー分で+1
            const newBase = {
                id: `${state.selectedField.side}-func-${state.count}`,
                display: selectedOperator.display,
                func: selectedOperator.name,
                name: selectedOperator.name,
                type: "function",
            }
            const newField = {
                ...state.field,
                playerField: state.selectedField.side === "player" ? { ...state.field.playerField, cards: [...state.selectedField.cards, newBase] } : { ...state.field.playerField },
                opponentField: state.selectedField.side === "opponent" ? { ...state.field.opponentField, cards: [...state.selectedField.cards, newBase] } : { ...state.field.opponentField },
            }

            if (state.selectedField.cards.length >= maxBase) {
                dispatch({ type: "SET_SELECTED_FIELD", payload: null });
            } else {
                dispatch({ type: "SET_COUNT", payload: count + 1 });
                dispatch({ type: "SET_SELECTED_FIELD", payload: null });
                dispatch({ type: "SET_FIELD", payload: newField });
                dispatch({ type: "EXIT_CHOOSE_FIELD" });
            }
        }

        const runDiffInt = async () => {
            if (!selectedBase) return;

            console.log("selectedMultOperator is", selectedMultOperator);

            let updatedName = selectedBase.name;
            let updatedDisplay = selectedBase.display;

            for (const operator of selectedMultOperator) {
                const result = await operator.effect(updatedName);
                updatedName = result.result;
                updatedDisplay = result.display;
            }
            console.log("updatedName is", updatedName);
            console.log("updatedDisplay is", updatedDisplay);

            let newField = {
                ...state.field,
                playerField: {
                    ...state.field.playerField, cards: state.field.playerField.cards.map(f =>
                        f.id === state.selectedBase ? { ...f, name: updatedName, display: updatedDisplay } : f
                    )
                },
                opponentField: {
                    ...state.field.playerField, cards: state.field.opponentField.cards.map(f =>
                        f.id === state.selectedBase ? { ...f, name: updatedName, display: updatedDisplay } : f
                    )
                }
            }

            newField = deleteBase(newField);

            dispatch({ type: "SET_SELECTED_BASE", payload: null });
            dispatch({ type: "SET_FIELD", payload: newField });
            dispatch({ type: "EXIT_USE_DIFFINT"})
            dispatch({ type: "SET_SELECTED_MULT_OPERATOR", payload: [] });
        }

        const runMultDev = async () => { }


        const runEffect = async () => {

            if (!selectedBase) return;
            const updatedName = await selectedOperator.effect(selectedBase.name);

            let newField = {
                ...state.field,
                playerField: {
                    ...state.field.playerField, cards: state.field.playerField.cards.map(f =>
                        f.id === state.selectedBase ? { ...f, name: updatedName.result, display: updatedName.display } : f
                    )
                },
                opponentField: {
                    ...state.field.playerField, cards: state.field.opponentField.cards.map(f =>
                        f.id === state.selectedBase ? { ...f, name: updatedName.result, display: updatedName.display } : f
                    )
                },
            }

            newField = deleteBase(newField);

            dispatch({ type: "SET_SELECTED_BASE", payload: null });
            dispatch({ type: "SET_FIELD", payload: newField });
            dispatch({ type: "EXIT_CHOOSE_BASE" });
        };


        if (selectedOperator.type === "function") {
            addFunc()
        } else if (selectedOperator.target === "all") {
            runTargetAll()
        } else if (selectedOperator.name === "derivative" || selectedOperator.name === "integral") {
            runDiffInt()
        } else if (selectedOperator.name === "multiply" || selectedOperator.name === "devide") {
            runMultDev()
        } else {
            runEffect();
        }
        console.log("selectedMultOperator is", state.selectedMultOperator);
    }, [state.selectedOperator, state.selectedBase, state.selectedBase, state.selectedField, state.selectedMultOperator, state.field, state.hand, dispatch])
}