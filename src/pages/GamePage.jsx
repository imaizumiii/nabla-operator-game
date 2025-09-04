import { useState } from 'react';
import FieldView from '../features/game/components/FieldView';

const initialField = [
  { id: "func-1", name: "1", display: "1", type: "function", func: "1" },
  { id: "func-2", name: "x", display: "x", type: "function", func: "x" },
  { id: "func-3", name: "x^2", display: "x^2", type: "function", func: "x^2" },
]

export default function GamePage() {
  const [status, setStatus] = useState("idle"); //idele or started
  const [field, setField] = useState(initialField);
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  const handleSelectField = (fieldId) => {
    setSelectedFieldId(fieldId === selectedFieldId ? null : fieldId); //toggle
  };

  if (status === "idle") {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Game Page</h1>
        <button onClick={() => setStatus("started")}>ゲームスタート</button>
      </div>
    );
  }
  if (status === "started") {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>ゲーム中</h1>
        <p>ここにゲームロジックを追加</p>
        <div className='p-2 space-y-4'>
          <h2 className='text-lg font-semibold'>場のカード</h2>
          <FieldView field={field} selectedFieldId={selectedFieldId} onSelectField={handleSelectField} />
        </div>
      </div>
    );
  }

  return null;
}