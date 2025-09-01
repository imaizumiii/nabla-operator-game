export function derivative(func, variable = "x", order = 1) {
  //仮
  if (func === "x" && order === 1) return "1";
  if (func === "x^2" && order === 1) return "2x";
  if (func === "x^2" && order === 2) return "2";
  if (func === "sin(x)" && order === 1) return "cos(x)";
  if (func === "cos(x)" && order === 1) return "-sin(x)";
  if (func === "exp(x)" && order === 1) return "exp(x)";

  return `d^${order}/${variable}^${order}(${func})`;
}

export function integral(func, variable = "x") {
  //仮
  if (func === "x") return "x^2/2";
  if (func === "x^2") return "x^3/3";
  if (func === "sin(x)") return "-cos(x)";
  if (func === "cos(x)") return "sin(x)";
  if (func === "exp(x)") return "exp(x)";

  return `∫(${func})dx`;
}

export function multiply(func1, func2) {
  //仮
  return `(${func1})*(${func2})`;
}

export function divide(numerator, denominator) {
  //仮
  return `(${numerator})/(${denominator})`;
}

export function sqrt(func) {
  return `sqrt(${fucn})`;
}

export function log(func) {
  return `log(${func})`;
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

export function limit(func, variable = "x", point = "0") {
  return `lim(${func}, ${variable}->${point})`;
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
