import {Dictionary} from 'typescript-collections';

export const StaticDataSet = {
    IgnoreSpace :  "\\s",
    IsNumber : "\\d",
    IsOperator : "\\+|-|\\*|\\/|\\^",
    IsVariable : "[a-zA-Z]",

    RexIsNum : RegExp("\\d"),
    RexIsOperator : RegExp("\\+|-|\\*|\\/|\\^"),
    RexIsVariable : RegExp("[a-zA-Z]"),
    RexIsLogicOperator : RegExp("\\>|\\<|\\="),
    FunctionEndSign : ";"
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
    "SIN": 1,
    "COS": 1,
    "TAN": 1,
    "ASIN": 1,
    "ACOS": 1,
    "ATAN": 1,
    "SQRT": 1,
    "ABS":1,
    "FLOOR":1,
    "CEILING": 1,
    "ROUND": 1,
    "SIGN": 1,
    "NORMSDIST":1, 

    "STEP" : 2,
    "RAND": 2,
    "ATAN2": 2,
    "POW": 2,

    "CLAMP": 3,
    "LERP" :3,
    "SMOOTHSTEP": 3,
    "If" : 3,

    "NORMDIST" : 4,

    //Customize Array size
    "MIN": -1,
    "MAX": -1,
};

export const PredefineVariableSet : { [id: string] : number; } = { 
    "TRUE": 1,
    "FALSE" : 0,
    "PI" : 3.141597
}