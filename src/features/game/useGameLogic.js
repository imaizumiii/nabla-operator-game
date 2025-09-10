import { useReducer } from 'react';
import { isIllegalMove, checkWinCondition, checkLoseCondition } from './rules';

function gameReducer(state, action) {
    switch (action.type) {
        case "PLAY_CARD":
            const { card, targetIndex } = action.payload;

            const resultFunc = mockApplyCardToTarget(card, state.field[targetIndex]);

            const illegal = isIllegalMove(resultFunc);
            if (illegal) {
                return {
                    ...state,
                    log: [...state.log, `不正な操作: ${card.label}`],
                    invalidMoves: [...state.invalidMoves, card],
                };
            }
        
        const newField = [...state.field];
        newField[targetIndex] = { ...newField[targetIndex], func: resultFunc };

        const win = checkWinCondition(newField);
        const lose = checkLoseCondition(state.hand);

        return {
            ...state,
            field: newField,
            hand: state.hand.filter(c => c.id !== card.id),
            log: [
                ...state.log,
                `${card.label} を適用: ${resultFunc}`,
                win ? "勝利条件を満たしました!" : "",
                lose ? "敗北条件に達しました..." : "",
            ],
            gameOver : win || lose,
            winner: win ? "player" : lose ? "opponent" : null,
        };

    default:
        return state;
    }
}

function mockApplyCardToTarget(card, target) {
    return `${card.label}(${target.func})`;
}

export function useGameLogic(initialState) {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    return { state, dispatch };
}