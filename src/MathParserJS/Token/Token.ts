export enum Types {
    Number,
    Variable,
    Operator,
    LeftParenthesis,
    RightParenthesis,
    ArgumentSeperator,
    Function
};

export class Token {
    public _value : string;
    public _type : Types;

    public constructor(value : string, type : Types) { 
        this._value = value;
        this._type = type;
    }
}
