import React from "react";

export default function FunctionKeypad({ onInsert }) {
  const rows = [
    [
      { label: "7", token: "7" },
      { label: "8", token: "8" },
      { label: "9", token: "9" },
      { label: "(", token: "(" },
      { label: ")", token: ")" },
      { label: "⌫", token: "BACKSPACE", kind: "action" },
    ],
    [
      { label: "4", token: "4" },
      { label: "5", token: "5" },
      { label: "6", token: "6" },
      { label: "+", token: "+" },
      { label: "-", token: "-" },
      { label: "CLEAR", token: "CLEAR", kind: "action" },
    ],
    [
      { label: "1", token: "1" },
      { label: "2", token: "2" },
      { label: "3", token: "3" },
      { label: "×", token: "*" },
      { label: "÷", token: "/" },
      { label: "^", token: "^(|)" },
    ],
    [
      { label: "0", token: "0" },
      { label: ".", token: "." },
      { label: ",", token: "," },
      { label: "π", token: "pi" },
      { label: "e", token: "e" },
      { label: "√", token: "sqrt(|)" },
    ],
    [
      { label: "sin", token: "sin(|)" },
      { label: "cos", token: "cos(|)" },
      { label: "tan", token: "tan(|)" },
      { label: "log", token: "log(|)" },
      { label: "ln", token: "ln(|)" },
      { label: "exp", token: "exp(|)" },
    ],
    [
      { label: "d/dx", token: "d(|, x)" },
      { label: "∫", token: "integral(|, x)" },
      { label: "∫ab", token: "defint(|, x, a, b)" },
      { label: "abs", token: "abs(|)" },
      { label: "lim", token: "lim(|, x)" },
      { label: "=", token: "=" },
    ]
  ];

  const handleClick = (btn) => {
    if (!onInsert) return;
    if (btn.token === "BACKSPACE" || btn.token === "CLEAR") {
      onInsert(btn.token);
    } else {
      onInsert(btn.token);
    }
    /**
* onInsert は「'|' をキャレット位置マーカー」とする文字列を受け取ります。
* 例: "sin(|)" を渡すと、"sin()" を挿入してキャレットを()の中に置く。
*/
  };

  return (
    <div className="keypad">
      {rows.map((row, i) => (
        <div className="keypad-row" key={i}>
          {row.map((btn, j) => (
            <button
              key={j}
              className={`px-3 py-2 m-1 rounded-md border shadow-sm text-sm transition
              ${btn.kind === "action"
                  ? "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100 border-red-300 dark:border-red-700"
                  : "bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"}
            `}
              type="button"
              onClick={() => handleClick(btn)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}