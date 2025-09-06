import Algebrite from 'algebrite'
import { getLimitResult } from './limitApi';

export function derivative(func, variable = "x", order = 1) {
    try {
        console.log(`func:${func}, Done derivative`)
        let result = func;
        for (let i = 0; i < order; i++) {
            result = Algebrite.run(`d(${result}, ${variable})`);
        }
        return Algebrite.run(`simplify(${result})`);
    } catch (error) {
        console.error("微分計算エラー:", error);
    }
}

export function integral(func, variable = 'x') {
    try {
        console.log(`func:${func}, Done integral`)
        return Algebrite.run(`simplify(integral(${func}, ${variable}))`);
    } catch (error) {
        console.error("積分計算エラー:", error);
    }
}

export function multiply(func1, func2) { //複数演算は後回し
    try {
        console.log(`func1:${func1}, func2:${func2} , Done multiply`)
        const result = Algebrite.run(`simplify((${func1} * ${func2}))`);
        return result;
    } catch (error) {
        console.error("掛け算エラー:", error);
    }
}

export function divide(numerator, denominator) { //複数演算は後回し
    //仮
    return `(${numerator})/(${denominator})`;
}

export function sqrt(func) {
    try {
        console.log(`func:${func}, Done integral`)
        return Algebrite.run(`sqrt(${func})`);
    } catch (error) {
        console.error("ルート計算エラー:", error);
    }
}

export function log(func) {
    try {
        return Algebrite.run(`log(${func})`);
    } catch (error) {
        console.error("log計算エラー", error);
    }
}

export function inverse(func, variable = "x") {
    if (func === "exp(x)") return "log(x)";
    if (func === "log(x)") return "exp(x)";
    if (func === "x") return "x";
    if (func === "x^3") return "cbrt(x)";
    if (func === "sin(x)") return "arcsin(x)";
    if (func === "cos(x)") return "arccos(x)";
    if (func === "x^2") return "sqrt(x)";

    return `inverse(${func})`;
}

export async function limit(func, variable = "x", point = "0", boundValue = "plane") {
    try {
        const result = await getLimitResult(func, variable, point, boundValue);
        return result.display
    } catch (error) {
        console.error("limit API呼び出しエラー:", error);
    }
}

export function limsup(func, variable = "x") {
    if (func === "sin(x)") return "1";
    if (func === "cos(x)") return "1";

    return `limsup(${func}, ${variable}->∞)`;
}

export function liminf(func, variable = "x") {
    if (func === "sin(x)") return "-1";
    if (func === "cos(x)") return "-1";

    return `liminf(${func}, ${variable}->∞)`;
}
