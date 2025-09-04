import React from "react";
import useCalculatorLogic from "../features/calclator/useCalculatorLogic.js"
import MathView from "../components/MathView.jsx";
import FunctionKeypad from "../components/FunctionKeypad.jsx";

export default function CalculatorPage() {
  const {
    expression,
    variable,
    mode,
    isDefinite,
    lower,
    upper,
    dispatch,
    result,
    error,
    userAnswer,
    setUserAnswer,
    verdict,
    verdictMessage,
    activeTarget,
    setActiveTarget,
    answerRef,
    inputRef,
    compute,
    grade,
    insertTokenAtCaret,
    answerPlaceholder,
  } = useCalculatorLogic();

  return (
    <div className="container">
      <h1>微分・積分ミニ電卓</h1>

      <label className="block">
        ① 式（例: <code>x^2 + sin(x)</code>）
        <input
          ref={inputRef}
          className="expression-input"
          value={expression}
          onChange={(e) =>
            dispatch({ type: "SET_EXPRESSION", payload: e.target.value })
          }
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
            onChange={(e) =>
              dispatch({ type: "SET_VARIABLE", payload: e.target.value })
            }
          />
        </label>

        <label>
          ③ 操作
          <select
            className="select"
            value={mode}
            onChange={(e) => dispatch({ type: "SET_MODE", payload: e.target.value })}
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
              onChange={(e) => dispatch({ type: "SET_IS_DEFINITE", payload: e.target.value })}
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
              onChange={(e) => dispatch({ type: "SET_LOWER", payload: e.target.value })}
              placeholder="0"
            />
          </label>
          <label>
            上限 b
            <input
              className="small-input"
              value={upper}
              onChange={(e) => dispatch({ type: "SET_UPPER", payload: e.target.value })}
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
          <FunctionKeypad onInsert={insertTokenAtCaret} />
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
