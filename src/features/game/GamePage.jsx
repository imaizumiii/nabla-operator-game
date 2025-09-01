import { useState } from 'react';

export default function GamePage() {
  const [status, setStatus] = useState("idle"); //idele or started

  if (status === "idle") {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Game Page</h1>
        <button onClick={() => setStatus("started")}>ゲームスタート</button>
      </div>
    );
  }
  if (status === "started"){
    return (
      <div style={{ padding: "2rem" }}>
        <h1>ゲーム中</h1>
        <p>ここにゲームロジックを追加</p>
      </div>
    );
  }

  return null;
}