import { cards } from "./data/cards"

let instanceCounter = 0;

function createDeck(baseCards, copies = 2) {
    return baseCards.flatMap(card =>
        Array.from({ length: copies }, () => ({
            ...card,
            instanceId: `${card.id}-${instanceCounter++}`,
        }))
    );
}

function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function buildInitialDeck(cards, handSize = 7) {
    const deck = createDeck(cards);
    const shuffledDeck = shuffle(deck);
    const initialPlayerHand = shuffledDeck.slice(0, handSize);
    const initialOpponentHand = shuffledDeck.slice(handSize, handSize * 2);
    const initialRestDeck = shuffledDeck.slice(handSize * 2);

    return { initialPlayerHand, initialOpponentHand, initialRestDeck };
}

//最初の状態
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

const { initialPlayerHand, initialOpponentHand, initialRestDeck } = buildInitialDeck(cards);

//state一覧
export const initialState = {
    field: {
        playerField: initialPlayerField,
        opponentField: initialOpponentField,
    },
    hand: {
        playerHand: initialPlayerHand,
        opponentHand: initialOpponentHand,
    },
    restDeck: initialRestDeck,
    selectedField: null,
    selectedOperator: null,
    isChoosingBase: false,
};

//dispatch一覧
export function reducer(state, action) {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, field: action.payload };
        case "SET_HAND":
            return { ...state, hand: action.payload };
        case "SET_REST_DECK":
            return { ...state, restDeck: action.payload };
        case "SET_SELECTED_FIELD":
            return { ...state, selectedField: action.payload };
        case "SET_SELECTED_OPERATOR":
            return { ...state, selectedOperator: action.payload };
        case "ENTER_CHOOSE_BASE":
            return { ...state, isChoosingBase: true, selectedOperator: action.payload, };
        case "EXIT_CHOOSE_BASE":
            return { ...state, isChoosingBase: false, selectedOperator: null, };
        default:
            return state;
    }
}
