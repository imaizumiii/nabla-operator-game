import { useReducer } from "react";
import { reducer, initialState } from "../reducer";

export function useGameLogic() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const selectField = (field) => {
        dispatch({ type: "SET_SELECTED_FIELD", payload: field });
    }

    const handleRequestAddFunc = (func) => {
        dispatch({ type: "SET_PENDING_FUNC", payload: func });
        dispatch({ type: "SET_IS_MODAL_OPEN", payload: true });
    }

    const handleConfirmAddFunc = (owner) => {
        const { pendingFunc } = state;
        if (!pendingFunc) return;

        dispatch({ type: "ADD_FUNC", payload: { func: pendingFunc, owner } });
        dispatch({ type: "SET_PENDING_FUNC", payload: null });
        dispatch({ type: "SET_IS_MODAL_OPEN", payload: false });
    }

    const handleExecuteOperator = (operator) => {
        dispatch({ type: "EXECUTE_OPERATOR", payload: operator });
    }

    return {
        ...state,
        selectField,
        handleRequestAddFunc,
        handleConfirmAddFunc,
        handleExecuteOperator,
    };
}