import Algebrite from "algebrite";

const nearlyEqual = (a, b, atol = 1e-6, rtol = 1e-6) => {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  const diff = Math.abs(a - b);
  const tol = atol + rtol * Math.max(1, Math.abs(a), Math.abs(b));
  return diff <= tol;
};

const evaluateAt = (expressionStr, xVal) => {
  try {
    const v = /^[A-Za-z]\w*$/.test((variable || "").trim())
      ? (variable || "x").trim()
      : "x";
    const cmd = `float(subst((${expressionStr}), ${v}, (${xVal})))`;
    const raw = Algebrite.run(cmd);
    const num = Number(String(raw).replace(/\s+/g, ""));
    return Number.isFinite(num) ? num : NaN;
  } catch {
    return NaN;
  }
};

const evaluateDiffAt = (userStr, correctStr, xVal) => {
  try {
    const v = (variable || "x").trim();
    const diffExpr = `simplify(((${correctStr})) - ((${userStr})))`;
    const cmd = `float(subst((${diffExpr}), ${v}, (${xVal})))`;
    const raw = Algebrite.run(cmd);
    const num = Number(String(raw).replace(/\s+/g, ""));
    return Number.isFinite(num) ? num : NaN;
  } catch {
    return NaN;
  }
};

const detectConstantMultiple = (userStr, correctStr, variable) => {
  // 変数名の安全化
  const v = /^[A-Za-z]\w*$/.test((variable || "").trim())
    ? (variable || "x").trim()
    : "x";

  // 0) 記号的チェック：d( (u/c), v ) == 0 なら「定数倍」
  //   例外: c=0 の点は無視。比の導関数が 0 なら定数。
  try {
    const ratioExpr = `simplify(((${userStr})) / ((${correctStr})))`;
    const dRatio = Algebrite.run(`simplify(d((${ratioExpr}), ${v}))`).trim();
    if (dRatio === "0" || dRatio === "0.0") {
      return { isMultiple: true, k: 1, support: "symbolic" };
    } else {
      return { isMultiple: false };
    }
  } catch (e) {
    console.error("Error in symbolic constant multiple detection:", e);
  }
};

const symbolicOrNumericEqual = (userStr, correctStr) => {
  // 1) 記号比較：差が 0 なら即OK
  try {
    const diff = Algebrite.run(
      `simplify(((${correctStr})) - ((${userStr})))`
    ).trim();
    if (diff === "0" || diff === "0.0") {
      return {
        ok: true,
        almost: false,
        method: "symbolic",
        ratio: 1,
        total: null,
        match: null,
      };
    } else {
      return {
        ok: false,
        almost: false,
        method: "symbolic",
        ratio: 0,
        total: null,
        match: null,
      };
    }
  } catch (e) {
    console.error("Error in symbolic comparison:", e);
  }
};

const calcLogic = {
    nearlyEqual,
    evaluateAt,
    evaluateDiffAt,
    detectConstantMultiple,
    symbolicOrNumericEqual,
}

export default calcLogic;
