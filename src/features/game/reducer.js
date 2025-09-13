const initialPlayerField = [
    { id: "player-func-1", name: "1", display: "1", type: "function", func: "1" },
    { id: "player-func-2", name: "x", display: "x", type: "function", func: "x" },
    { id: "player-func-3", name: "x^2", display: "x^2", type: "function", func: "x^2" },
]

const initialOpponentField = [
    { id: "opponent-func-1", name: "1", display: "1", type: "function", func: "1" },
    { id: "opponent-func-2", name: "x", display: "x", type: "function", func: "x" },
    { id: "opponent-func-3", name: "x^3", display: "x^3", type: "function", func: "x^3" },
]

const initialField = {
    playerField: initialPlayerField,
    opponentField: initialOpponentField,
}

export const initialState = {
    field: initialField,
    selectedField: null,
    selectedOperator: null,
    isModalOpen: false,
};

export function reducer(state, action) {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, field: action.payload };
        case "SET_SELECTED_FIELD":
            return { ...state, selectedField: action.payload };
        case "SET_SELECTED_OPERATOR":
            return { ...state, selectedOperator: action.payload };
        case "SET_IS_MODAL_OPEN":
            return { ...state, isModalOpen: action.payload };
        default:
            return state;
    }
}
