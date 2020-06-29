export enum Types {
    Number,
    Variable,
    Operator,
    LogicOperator,
    LeftParenthesis,
    RightParenthesis,
    ArgumentSeperator,
    Function,
    FunctionEnd
};

export class Token {
    public _value : string;
    public _type : Types;

    public constructor(value : string, type : Types) { 
        this._value = value;
        this._type = type;
    }
}
