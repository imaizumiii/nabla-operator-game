import { useRef, useReducer, useState } from "react";
import Algebrite from "algebrite";
import calcLogic from "../../utils/calcLogic";

export default function useCalculatorLogic() {

  const answerRef = useRef(null);
  const inputRef = useRef(null);

  const initialFormState = {
    expression: "x^2 + sin(x)",
    variable: "x",
    mode: "difference",
    isDefinite: false,
    lower: "0",
    upper: "1",
  };

  function formReducer(state, action) {
    switch (action.type) {
      case "SET_EXPRESSION":
        return { ...state, expression: action.payload };
      case "SET_VARIABLE":
        return { ...state, variable: action.payload };
      case "SET_MODE":
        return { ...state, mode: action.payload };
      case "SET_IS_DEFINITE":
        return { ...state, isDefinite: action.payload };
      case "SET_LOWER":
        return { ...state, lower: action.payload };
      case "SET_UPPER":
        return { ...state, upper: action.payload };
      default:
        return state;
    }
  }

  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  // const [upper, setUpper] = useState("1");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [verdict, setVerdict] = useState(null);
  const [verdictMessage, setVerdictMessage] = useState("");
  const [activeTarget, setActiveTarget] = useState("expression");

  const {expression, variable, mode, isDefinite, lower, upper } = formState;

  const answerPlaceholder =
    mode === "difference"
      ? "例: 2*x + cos(x)"
      : isDefinite
      ? "例: 1/3 + cos(1) - cos(0)"
      : "例: x^2 + cos(x)";

  const insertTokenAtCaret = (token) => {
    const el = activeTarget === "answer" ? answerRef.current : inputRef.current;
    const value = activeTarget === "answer" ? userAnswer : expression;
    const setValue = activeTarget === "answer" ? setUserAnswer : setExpression;

    if (!el) return;

    if (token === "CLEAR") {
      setValue("");
      setTimeout(() => el.focus(), 0);
      return;
    }

    if (token === "BACKSPACE") {
      const start = el.selectionStart ?? value.length;
      const end = el.selectionEnd ?? value.length;
      if (start !== end) {
        const next = value.slice(0, start) + value.slice(end);
        setValue(next);
        setTimeout(() => {
          el.focus();
          el.setSelectionRange(start, start);
        }, 0);
      } else if (start > 0) {
        const next = value.slice(0, start - 1) + value.slice(end);
        const position = start - 1;
        setValue(next);
        setTimeout(() => {
          el.focus();
          el.setSelectionRange(position, position);
        }, 0);
      }
      return;
    }

    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;

    const caretMarker = "|";
    const markerIndex = token.indexOf(caretMarker);
    const tokenText = token.replace(caretMarker, "");

    const next = value.slice(0, start) + tokenText + value.slice(end);
    const caretPosition =
      markerIndex >= 0 ? start + markerIndex : start + tokenText.length;

    setValue(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(caretPosition, caretPosition);
    }, 0);
  };
  const compute = () => {
    setError("");
    try {
      let out;
      if (mode === "difference") {
        // 微分モード
        out = Algebrite.run(`d(${expression}, ${variable})`);
      } else {
        if (isDefinite) {
          // 定積分モード
          out = Algebrite.run(
            `defint(${expression}, ${variable}, ${lower}, ${upper})`
          );
        } else {
          // 不定積分モード
          out = Algebrite.run(`integral(${expression}, ${variable})`);
        }
      }
      // 仕上げに簡単化
      const simplified = Algebrite.run(`simplify(${out})`);
      setResult(simplified);
    } catch (e) {
      setError(String(e?.message || e));
      setResult("");
    }
  };

  const grade = () => {
    setVerdict(null);
    setVerdictMessage("");
    setError("");

    if (!userAnswer.trim()) {
      setVerdict("wrong");
      setVerdictMessage("解答が入力されていません。");
      return;
    }
    if (!expression.trim()) {
      setVerdict("wrong");
      setVerdictMessage("式が入力されていません。");
      return;
    }

    try {
      // 微分の場合
      if (mode === "difference") {
        const correct = Algebrite.run(
          `simplify(d((${expression}), ${variable}))`
        );
        const user = Algebrite.run(`simplify((${userAnswer}))`);
        console.log("[grade/diff] user(simplified)   =", user); //Debug log
        console.log("[grade/diff] correct(simplified)=", correct); //Debug log

        const { ok, method } = calcLogic.symbolicOrNumericEqual(user, correct);
        if (ok) {
          setVerdict("correct");
          setVerdictMessage(
            `正解 (${method === "symbolic" ? "記号的に一致" : "数値的に一致"})`
          );
        } else {
          const mult = calcLogic.detectConstantMultiple(
            user,
            correct,
            variable
          );
          if (mult.isMultiple) {
            setVerdict("wrong");
            setVerdictMessage(`不正解です。ただし定数倍の関係です。`);
          } else {
            setVerdict("wrong");
            setVerdictMessage(
              "不正解です。導関数が一致しません。(定数差以外の差があります)"
            );
          }
        }
        return;
      }

      // 不定積分の場合
      if (!isDefinite) {
        const correctIntegral = Algebrite.run(
          `simplify(integral((${expression}), ${variable}))`
        );
        const dCorrect = Algebrite.run(
          `simplify(d((${correctIntegral}), ${variable}))`
        );
        const dUser = Algebrite.run(
          `simplify(d((${userAnswer}), ${variable}))`
        );

        const { ok, almost, method, ratio } = calcLogic.symbolicOrNumericEqual(
          dUser,
          dCorrect
        );
        if (ok) {
          setVerdict("correct");
          setVerdictMessage(
            `正解 (導関数が${
              method === "symbolic" ? "記号的" : "数値的"
            }に一致。定数差は許容)`
          );
        } else {
          const mult = calcLogic.detectConstantMultiple(
            dUser,
            dCorrect,
            variable
          );
          if (mult.isMultiple) {
            setVerdict("wrong");
            setVerdictMessage(`不正解です。ただし、定数倍の関係です。`);
          } else {
            setVerdict("wrong");
            setVerdictMessage(
              "不正解です。導関数が一致しません。(定数差以外の差があります)"
            );
          }
        }
        return;
      }

      // 定積分の場合
      const correctDef = Algebrite.run(
        `simplify(defint((${expression}), ${variable}, ${lower}, ${upper}))`
      );
      const fCorrect = Number(
        String(Algebrite.run(`float(${correctDef}))`)).replace(/\s+/g, "")
      );
      const fUser = Number(
        String(Algebrite.run(`float((${userAnswer}))`)).replace(/\s+/g, "")
      );

      if (!isFinite(fCorrect) || !isFinite(fUser)) {
        setVerdict("wrong");
        setVerdictMessage(
          "数値評価に失敗しました。式や範囲を確認してください。"
        );
        return;
      }
      if (calcLogic.nearlyEqual(fUser, fCorrect)) {
        setVerdict("correct");
        setVerdictMessage("正解 (数値的に一致)");
      } else {
        setVerdict("wrong");
        setVerdictMessage(
          `不正解です。正しい値と一致しません（あなた： ${fUser}, 正解：${fCorrect}）`
        );
      }
    } catch (error) {
      setError(String(error?.message || error));
      setVerdict("wrong");
      setVerdictMessage(
        "計算中にエラーが発生しました。式や変数を確認してください。"
      );
    }
  };

  return {
    expression,
    variable,
    mode,
    isDefinite,
    lower,
    upper,
    dispatch,
    result,
    setResult,
    error,
    setError,
    userAnswer,
    setUserAnswer,
    verdict,
    setVerdict,
    verdictMessage,
    setVerdictMessage,
    activeTarget,
    setActiveTarget,
    inputRef,
    answerRef,
    answerPlaceholder,
    insertTokenAtCaret,
    compute,
    grade,
  };
}
