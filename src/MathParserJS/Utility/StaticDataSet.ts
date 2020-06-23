import {Dictionary} from 'typescript-collections';

export const StaticDataSet = {
    IgnoreSpace :  "\\s",
    IsNumber : "\\d",
    IsOperator : "\\+|-|\\*|\\/|\\^",
    IsVariable : "[a-z]",

    RexIsNum : RegExp("\\d"),
    RexIsOperator : RegExp("\\+|-|\\*|\\/|\\^"),
    RexIsVariable : RegExp("[a-z]")
}

export const AssociativityDict: { [id: string] : string; } = {
    "^" : "right",
    "*" : "left",
    "/" : "left",
    "+" : "left",
    "-" : "left"
};

//Priority
export const PrecedenceDict : { [id: string] : number; } = {
    "^" : 4,
    "*" : 3,
    "/" : 3,
    "+" : 2,
    "-" : 2
}

/// <summary>
/// string = function value
/// int = needed input length
/// </summary>
export const FunctionLookUpTable : { [id: string] : number; } = {
    "sin": 1,
    "cos": 1,
    "tan": 1,
    "arcsine": 1,
    "arccos": 1,
    "atan": 1,
    "sqrt": 1,
    "abs":1,
    "floor":1,
    "ceil": 1,
    "round": 1,
    "sign": 1,

    "step" : 2,
    "min": 2,
    "max": 2,
    "rand": 2,
    "atan2": 2,
    "pow": 2,

    "clamp": 3,
    "lerp" :3,
    "smoothstep": 3
};