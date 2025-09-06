from fastapi import FastAPI
from pydantic import BaseModel
from sympy import Symbol, sympify, limit, oo, latex, AccumBounds
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
    boundValue: str = "max"

@app.post("/limit")
async def compute_limit(data: LimitRequest):
    expr = sympify(data.expr)
    variable = Symbol(data.variable)
    point = data.point
    boundValue = data.boundValue
    
    if point == "oo":
        point_val = oo
    elif point == "-oo":
        point_val = -oo
    else:
        point_val = sympify(point)

    try:
        result = limit(expr, variable, point_val)
        if isinstance(result, AccumBounds):
            if boundValue == 'max':
                result = result.max
            elif boundValue == 'min':
                result = result.min

        latex_result = latex(result)
        if result == oo:
            return {"result": "oo", "display": latex_result}
        elif result == -oo:
            return {"result": "-oo", "display": latex_result}
        elif result.is_number:
            return {"result": str(int(result.evalf())), "display": latex_result}
        else:
            return {"result": str(result), "display":latex_result}
    except Exception as e:
        return {"result": "定義不能"}