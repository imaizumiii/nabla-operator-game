export async function getLimitResult(expr, variable, point, boundValue) {
    try {
        const response = await fetch("http://localhost:8000/limit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ expr, variable, point: String(point), boundValue }), // ← ここが大事
        });
        const data = await response.json();
        console.log(`data.latex:${data.display}`);
        return data;

    } catch (error) {
        console.error("API呼び出しエラー:", error);
        return "エラー";
    }
}