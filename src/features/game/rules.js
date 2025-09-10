export function isZero(func) {
  return func.trim() === "0";
}

export function isDivergent(func) {
  return /∞|infinity|diverge/i.test(func);
}

export function isUndefined(func) {
  return /undefined|NaN|1\/0|log\(0\)|sqrt\(-1\)/i.test(expr);
}

export function isOscillating(func) {
    return /sin\(1\/x\)|oscillate/i.test(expr);
}

export function isLinearlyDependent(func1, func2) {
    // TODO: 線形従属性の評価ロジック
    return false;
}

export function isIllegalMove(func) {
    return isUndefined(expr) || isDivergent(expr) || isOscillating(expr);
}

export function checkWinCondition(func) {
    return fieldCards.every(card => isZero(card.expr));
}

export function checkLoseCondition(func) {
    return playerHand.every(card => isIllegalMove(card.func));
}