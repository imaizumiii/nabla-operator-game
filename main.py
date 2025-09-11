from fastapi import FastAPI
from pydantic import BaseModel
from sympy import Symbol, sympify, limit, oo, latex, AccumBounds, solve, diff, integrate, sqrt, log
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CalcRequest(BaseModel):
    expr: str
    variable: str = 'x'
    order: int = 1
    point: str = "oo"
    boundValue: str = "max"

@app.post("/limit")
async def compute_limit(data: CalcRequest):
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

@app.post("/inverse")
async def compute_inverse(data: CalcRequest):
    expr = sympify(data.expr)
    variable = Symbol(data.variable)
    
    try:
        result = solve(expr - Symbol('y'), variable)
        if not (result or "0"):
            return {"result": "解なし", "display": ""}
        
        # デフォルトでは最初の解を使用
        if len(result) == 1:
            result = result[0].subs(Symbol('y'), Symbol(data.variable))
        else:
            result = result[1].subs(Symbol('y'), Symbol(data.variable))
        latex_result = latex(result, inv_trig_style="full")
        print("result: ", result, "latex_result: ", latex_result)
        return {
            "result": str(result),
            "display": latex_result
        }
    except Exception as e:
        return {"result": "逆関数を求められません", "display": ""}
    
@app.post("/derivative")
async def compute_derivative(data: CalcRequest):
    expr = sympify(data.expr)
    variable = Symbol(data.variable)
    order = data.order
    
    try:
        result = expr
        for i in range(order):
            result = diff(result, variable)
        if not (result or "0"):
            return {"result": "解なし", "display": ""}

        latex_result = latex(result)
        return {
            "result": str(result),
            "display": latex_result
        }
    except Exception as e:
        return {"result": "微分を求められません", "display": ""}
    
@app.post("/integrate")
async def compute_integrate(data: CalcRequest):
    expr = sympify(data.expr)
    variable = Symbol(data.variable)
    
    try:
        result = integrate(expr, variable)
        if not (result or "0"):
            return {"result": "解なし", "display": ""}
                    
        latex_result = latex(result)
        return {
            "result": str(result),
            "display": latex_result
        }
    except Exception as e:
        return {"result": "積分を求められません", "display": ""}
    
@app.post("/sqrt")
async def compute_sqrt(data:CalcRequest):
    x = Symbol(data.variable, positive = True)      
    expr = sympify( data.expr,locals={data.variable: x})

    try:
        result = sqrt(expr)
        print(result)
        if not (result or "0"):
            return {"result": "解なし", "display": ""}
        
        latex_result = latex(result)
        return {"result": str(result), "display": latex_result}
    except Exception as e:
        return {"result": "平方根を求められません", "display": ""}

@app.post("/log")
async def compute_log(data:CalcRequest):
    x = Symbol(data.variable, positive = True)      
    expr = sympify( data.expr,locals={data.variable: x})

    try:
        result = log(expr)
        print(result)
        if not (result or "0"):
            return {"result": "解なし", "display": ""}
        
        latex_result = latex(result)
        return {"result": str(result), "display": latex_result}
    except Exception as e:
        return {"result": "平方根を求められません", "display": ""}
        

    
    
            
        