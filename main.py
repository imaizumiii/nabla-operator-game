from fastapi import FastAPI
from pydantic import BaseModel
from sympy import Symbol, sympify, limit, oo
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LimitRequest(BaseModel):
    expr: str
    variable: str = 'x'
    point: str = "oo"

@app.post("/limit")
async def compute_limit(data: LimitRequest):
    expr = sympify(data.expr)
    variable = Symbol(data.variable)
    point = data.point

    if point == "oo":
        point_val = oo
    elif point == "-oo":
        point_val = -oo
    else:
        point_val = sympify(point)

    try:
        result = limit(expr, variable, point_val)
        if result == oo:
            return {"result": "無限大"}
        elif result == -oo:
            return {"result": "-無限大"}
        elif result.is_number:
            return {"result": str(result.evalf())}
        else:
            return {"result": str(result)}
    except Exception as e:
        return {"result": "定義不能"}