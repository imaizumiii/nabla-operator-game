export async function getLimitResult(expr, variable , point) {
    try {
        const response = await fetch("http://localhost:8000/limit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ expr, variable, point: String(point) }), // ← ここが大事
        });

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error("API呼び出しエラー:", error);
        return "エラー";
    }
}