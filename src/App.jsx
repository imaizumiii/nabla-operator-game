import { useRef, useState } from "react";
import Algebrite from "algebrite";
import Keypad from "./components/FunctionKeypad.jsx";
import "./App.css";

export default function App() {
  const [expr, setExpr] = useState("x^2 + sin(x)");
  const [variable, setVariable] = useState("x");
  const [mode, setMode] = useState("diff"); // 'diff' | 'int'
  const [isDefinite, setIsDefinite] = useState(false);
  const [lower, setLower] = useState("0");
  const [upper, setUpper] = useState("1");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [activeTarget, setActiveTarget] = useState("expr");

  const answerRef = useRef(null);
  const inputRef = useRef(null);

  const answerPlaceholder =
    mode === "diff"
      ? "例: 2*x + cos(x)"
      : isDefinite
      ? "例: 1/3 + cos(1) - cos(0)"
      : "例: x^2 + cos(x)";

  const insertTokenAtCaret = (token) => {
    const el = activeTarget === "answer" ? answerRef.current : inputRef.current;
    const value = activeTarget === "answer" ? userAnswer : expr;
    const setValue = activeTarget === "answer" ? setUserAnswer : setExpr;

    if (!el) return;

    if (token === "CLEAR") {
      setExpr("");
      setTimeout(() => el.focus(), 0);
      return;
    }
    if (token === "BACKSPACE") {
      const start = el.selectionStart ?? expr.length;
      const end = el.selectionEnd ?? expr.length;
      if (start !== end) {
        const next = expr.slice(0, start) + expr.slice(end);
        setExpr(next);
        setTimeout(() => {
          expr.focus();
          expr.setSelectionRange(start, start);
        }, 0);
      } else if (start > 0) {
        const next = expr.slice(0, start - 1) + expr.slice(end);
        const position = start - 1;
        setExpr(next);
        setTimeout(() => {
          el.focus();
          el.setSelectionRange(position, position);
        }, 0);
      }
      return;
    }

    const start = el.selectionStart ?? expr.length;
    const end = el.selectionEnd ?? expr.length;

    const caretMarker = "|";
    const markerIndex = token.indexOf(caretMarker);
    const tokenText = token.replace(caretMarker, "");

    const next = expr.slice(0, start) + tokenText + expr.slice(end);
    const caretPosition =
      markerIndex >= 0 ? start + markerIndex : start + tokenText.length;

    setExpr(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(caretPosition, caretPosition);
    }, 0);
  };

  const compute = () => {
    setError("");
    try {
      let out;
      if (mode === "diff") {
        // 微分（例: d(x^2 + sin(x), x)）
        out = Algebrite.run(`d(${expr}, ${variable})`);
      } else {
        if (isDefinite) {
          // 定積分（例: defint(x^2, x, 0, 1)）
          out = Algebrite.run(
            `defint(${expr}, ${variable}, ${lower}, ${upper})`
          );
        } else {
          // 不定積分（例: integral(x^2 + sin(x), x)）
          out = Algebrite.run(`integral(${expr}, ${variable})`);
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

  return (
    <div className="container">
      <h1>微分・積分ミニ電卓</h1>

      <label className="block">
        ① 式（例: <code>x^2 + sin(x)</code>）
        <input
          ref={inputRef}
          className="expr-input"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          onFocus={() => setActiveTarget("expr")}
          placeholder="例: x^2 + sin(x)"
        />
      </label>

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
            <option value="diff">微分</option>
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

      {/* ★ キーパッド入力先の切り替え */}
      <div className="toggle">
        <span>キーパッド入力先:</span>
        <button
          type="button"
          className={`toggle-btn ${activeTarget === "expr" ? "active" : ""}`}
          onClick={() => {
            setActiveTarget("expr");
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
          <button className="primary-btn" onClick={compute}>
            計算する
          </button>

          {/* ★ 解答入力欄 */}
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
            {/* 次ステップで「採点する」を実装予定 */}
            <button className="secondary-btn" type="button" disabled title="次のステップで実装します">
              採点する（次で実装）
            </button>
          </div>

          {error && <div className="error">エラー: {error}</div>}

          {result && (
            <div className="result">
              <div className="result-title">計算結果</div>
              <pre className="result-pre">{result}</pre>
            </div>
          )}
        </div>
      </div>

      <p className="note">
        * キーパッドは「式」「解答」のどちらにも挿入できます（上の切替ボタン or 直接フォーカス）。
      </p>
    </div>
  );
}
