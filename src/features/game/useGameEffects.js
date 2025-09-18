import { useEffect } from "react";
import katex from 'katex';
import 'katex/dist/katex.min.css'


export function useGameEffects(state, dispatch) {
    useEffect(() => {
        const selectedOperator = [...state.hand.playerHand, ...state.hand.opponentHand].find(c => c.instanceId === state.selectedOperator);
        const selectedBase = [...state.field.playerField, ...state.field.opponentField]
            .find(f => f.id === state.selectedBase);

        if (!selectedOperator) return;

        const deleteBase = (oldField) => {
            console.log("いったんnewField表示", oldField);
            console.log("newFieldのtypeは", typeof (oldField));
            const newField = {
                ...oldField,
                playerField: oldField.playerField.filter(item => (item.name !== "0" && item.name !== "oo" && item.name !== "-oo")),
                opponentField: oldField.opponentField.filter(item => (item.name !== "0" && item.name !== "oo" && item.name !== "-oo")),
            }
            return newField;
        }

        const runTargetAll = async () => {
            if (!state.selectedField) return;
            const updatedField = await Promise.all(
                state.selectedField.map(async card => {
                    const updatedName = await selectedOperator.effect(card.name);
                    return { ...card, name: updatedName.result, display: updatedName.display }
                })
            );

            let newField = {
                ...state.field,
                playerField: state.field.playerField === state.selectedField ? updatedField : state.field.playerField,
                opponentField: state.field.opponentField === state.selectedField ? updatedField : state.field.opponentField,
            }

            newField = deleteBase(newField);

            dispatch({ type: "SET_SELECTED_FIELD", payload: null });
            dispatch({ type: "SET_FIELD", payload: newField });
            dispatch({ type: "EXIT_CHOOSE_FIELD" });
        }

        const addFunc = async () => { }

        const runDiffInt = async () => { }

        const runMultDev = async () => { }


        const runEffect = async () => {

            if (!selectedBase) return;
            const updatedName = await selectedOperator.effect(selectedBase.name);

            let newField = {
                ...state.field,
                playerField: state.field.playerField.map(f =>
                    f.id === state.selectedBase ? { ...f, name: updatedName.result, display: updatedName.display } : f
                ),
                opponentField: state.field.opponentField.map(f =>
                    f.id === state.selectedBase ? { ...f, name: updatedName.result, display: updatedName.display } : f
                ),
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
        } else if (selectedOperator.name === "derivative" || selectedOperator === "integral") {
            runDiffInt()
        } else if (selectedOperator.name === "multiply" || selectedOperator === "devide") {
            runMultDev()
        } else {
            runEffect();
        }
    }, [state.selectedOperator, state.selectedBase, state.selectedField, state.field, state.hand, dispatch])
}