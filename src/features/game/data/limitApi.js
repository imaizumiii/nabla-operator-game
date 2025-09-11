const BASE_URL = "http://localhost:8000";
const HEADERS = {
    "Content-Type": "application/json"
}

async function postToEndpoint(endpoint, payload) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`[${endpoint}] API呼び出しエラー:`, error);
    }
}

export async function getDiffResult(expr, variable, order ) {
    return postToEndpoint("/derivative", { expr, variable , order});
}

export async function getIntegrateResult(expr, variable) {
    return postToEndpoint("/integrate", { expr, variable });
}

export async function getLimitResult(expr, variable, point, boundValue) {
    return postToEndpoint("/limit", {expr, variable, point: String(point), boundValue });
}

export async function getInverseResult(expr, variable) {
    return postToEndpoint("/inverse", { expr, variable });
}

export async function getSqrtResult(expr) {
    return postToEndpoint("/sqrt", { expr });
}

export async function getLogResult(expr) {
    return postToEndpoint("/log", { expr });
}
