import { useRef, useState } from "react";
import Algebrite from "algebrite";
import Keypad from "./components/FunctionKeypad.jsx";
import "./App.css";
import MathView from "./components/MathView.jsx";
import calcLogic from "./utils/calcLogic.js";

export default function App() {
  const [expression, setExpression] = useState("x^2 + sin(x)");
  const [variable, setVariable] = useState("x");
  const [mode, setMode] = useState("difference"); // 'difference' | 'int'
  const [isDefinite, setIsDefinite] = useState(false);
  const [lower, setLower] = useState("0");
  const [upper, setUpper] = useState("1");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [verdict, setVerdict] = useState(null);
  const [verdictMessage, setVerdictMessage] = useState("");
  const [activeTarget, setActiveTarget] = useState("expression");

  const answerRef = useRef(null);
  const inputRef = useRef(null);

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
          value.focus();
          value.setSelectionRange(start, start);
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

        const { ok, method } = calcLogic.symbolicOrNumericEqual(
          user,
          correct
        );
        if (ok) {
          setVerdict("correct");
          setVerdictMessage(
            `正解 (${method === "symbolic" ? "記号的に一致" : "数値的に一致"})`
          );
        } else {
          const mult = calcLogic.detectConstantMultiple(user, correct, variable);
          if (mult.isMultiple) {
            setVerdict("wrong");
            setVerdictMessage(
              `不正解です。ただし定数倍の関係です。`
            );
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
          const mult = calcLogic.detectConstantMultiple(dUser, dCorrect, variable);
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

  return (
    <div className="container">
      <h1>微分・積分ミニ電卓</h1>

      <label className="block">
        ① 式（例: <code>x^2 + sin(x)</code>）
        <input
          ref={inputRef}
          className="expression-input"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onFocus={() => setActiveTarget("expression")}
          placeholder="例: x^2 + sin(x)"
        />
      </label>
      <div className="panel">
        <div className="label">問題（数式表示）</div>
        <MathView expression={expression} />
      </div>

      <div className="row">
        <label>
          ② 変数
          <input
            className="small-input"
            value={variable}
            onChange={(e) => setVariable(e.target.value || "x")}
          />
        </label>

        <label>
          ③ 操作
          <select
            className="select"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="difference">微分</option>
            <option value="int">積分</option>
          </select>
        </label>

        {mode === "int" && (
          <label className="checkbox">
            <input
              type="checkbox"
              checked={isDefinite}
              onChange={(e) => setIsDefinite(e.target.checked)}
            />
            定積分
          </label>
        )}
      </div>

      {mode === "int" && isDefinite && (
        <div className="row">
          <label>
            下限 a
            <input
              className="small-input"
              value={lower}
              onChange={(e) => setLower(e.target.value)}
              placeholder="0"
            />
          </label>
          <label>
            上限 b
            <input
              className="small-input"
              value={upper}
              onChange={(e) => setUpper(e.target.value)}
              placeholder="1"
            />
          </label>
        </div>
      )}

      {/* キーパッド入力先の切り替え */}
      <div className="toggle">
        <span>キーパッド入力先:</span>
        <button
          type="button"
          className={`toggle-btn ${
            activeTarget === "expression" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTarget("expression");
            inputRef.current?.focus();
          }}
        >
          式
        </button>
        <button
          type="button"
          className={`toggle-btn ${activeTarget === "answer" ? "active" : ""}`}
          onClick={() => {
            setActiveTarget("answer");
            answerRef.current?.focus();
          }}
        >
          解答
        </button>
      </div>

      <div className="panel">
        <div className="panel-left">
          <Keypad onInsert={insertTokenAtCaret} />
        </div>

        <div className="panel-right">
          <div className="actions">
            <button className="primary-btn" onClick={compute}>
              計算する（模範）
            </button>
            <button className="grade-btn" onClick={grade}>
              採点する
            </button>
          </div>

          <div className="answer-box">
            <div className="answer-title">あなたの解答</div>
            <textarea
              ref={answerRef}
              className="answer-input"
              rows={3}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onFocus={() => setActiveTarget("answer")}
              placeholder={answerPlaceholder}
            />
            {userAnswer && (
              <div className="answer-preview">
                <div className="label">解答（数式表示）</div>
                <MathView expression={userAnswer} />
              </div>
            )}
            {verdict && (
              <div className={`verdict ${verdict}`}>
                {verdict === "correct" && "✅ 正解"}
                {verdict === "almost" && "🟡 ほぼ正解"}
                {verdict === "wrong" && "❌ 不正解"}
                <span className="verdict-msg"> — {verdictMessage}</span>
              </div>
            )}
          </div>

          {error && <div className="error">エラー: {error}</div>}

          {result && (
            <div className="result">
              <div className="result-title">模範計算結果</div>
              <MathView expression={result} />
            </div>
          )}
        </div>
      </div>

      <p className="note">
        * 採点は 1
        変数前提です。入力や式が複数変数を含む場合は結果が不安定になることがあります。
        <br />* 不定積分は「定数差は許容」として判定します。
      </p>
    </div>
  );
}
