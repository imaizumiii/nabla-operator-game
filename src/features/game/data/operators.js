import Algebrite from 'algebrite'
import { getInverseResult, getLimitResult, getDiffResult, getIntegrateResult, getSqrtResult, getLogResult } from './limitApi';

export async function derivative(func, variable = "x", order = 1) {
    try {
        const result = await getDiffResult(func, variable, order);
        console.log("effect result:", result, typeof result);
        return result;
    } catch (error) {
    console.error("微分計算エラー:", error);
}
}

export async function integrate(func, variable = 'x') {
    try {
        const result = await getIntegrateResult(func, variable);
        console.log("effect result:", result, typeof result);
        return result;
    } catch (error) {
        console.error("積分計算エラー:", error);
    }
}

export function multiply(func1, func2) { //複数演算は後回し
    try {
        const result = Algebrite.run(`simplify((${func1} * ${func2}))`);
        console.log("effect result:", result, typeof result);
        return result;
    } catch (error) {
        console.error("掛け算エラー:", error);
    }
}

export function divide(numerator, denominator) { //複数演算は後回し
    //仮
    return `(${numerator})/(${denominator})`;
}

export async function sqrt(func) {
    try {
        const result = await getSqrtResult(func);
        console.log("effect result:", result, typeof result);
        return result;
    } catch (error) {
        console.error("ルート計算エラー:", error);
    }
}

export async function log(func) {
    try {
        const result = await getLogResult(func);
        console.log("effect result:", result, typeof result);
        return result;
    } catch (error) {
        console.error("log計算エラー", error);
    }
}

export async function inverse(func, variable = "x") {
    try {
        const result = await getInverseResult(func, variable);
        console.log("effect result:", result, typeof result);
        return result
    } catch (error) {
        console.error("inverse API呼び出しエラー:", error);
    }
}

export async function limit(func, variable = "x", point = "0", boundValue = "plane") {
    try {
        const result = await getLimitResult(func, variable, point, boundValue);
        console.log("effect result:", result, typeof result);
        return result
    } catch (error) {
        console.error("limit API呼び出しエラー:", error);
    }
}
