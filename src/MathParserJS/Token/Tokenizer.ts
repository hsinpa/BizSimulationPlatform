import {Token, Types}  from './Token';
import {StaticDataSet} from '../Utility/StaticDataSet';

export class Tokenizer {

    public Parse(p_raw_expression : string) {
        let tokens : Token[] = [];
        let numberBuffer : Array<string> = [];
        let letterBuffer : Array<string> = [];

        p_raw_expression = p_raw_expression.replace(StaticDataSet.IgnoreSpace, "");
        let rawExpLength = p_raw_expression.length;

//#region Helper Method
        let RetrieveNumberBuffer = () : Token[] => {
            var r_tokens : Token[] = [];
    
            if (numberBuffer.length > 0) {
                let fullDigitalString = numberBuffer.join("");
    
                r_tokens.push(new Token(fullDigitalString, Types.Number));
            }
    
            numberBuffer = [];
    
            return r_tokens;
        }
    
        let RetrieveLetterBuffer = () : Token[] => {
            let length = letterBuffer.length;
            let r_tokens : Token[] = [] ;
    
            for (let i = 0; i < length; i++) {
                r_tokens.push(new Token(letterBuffer[i], Types.Variable));
    
                //Multiply letter variable together
                if (i < length - 1) {
                    r_tokens.push(new Token("*", Types.Operator));
                }
            }
    
            letterBuffer = [];
    
            return r_tokens;
        }
//#endregion

        for (let i = 0; i < rawExpLength; i++) {
            let part = p_raw_expression[i];

            if (this.IsNumber(part)) {
                numberBuffer.push(part);
                continue;
            }

            if (part == ".") {
                numberBuffer.push(part);
                continue;
            }

            if (this.IsVariable(part)) {

                if (numberBuffer.length > 0) {
                    tokens = tokens.concat(RetrieveNumberBuffer());
                    tokens.push(new Token("*", Types.Operator));
                }

                letterBuffer.push(part);
                continue;
            }

            if (this.IsOperator(part)) {

                if (part == "-") {
                    let tokenCount = tokens.length;
                    
                    //Example case, -({number})
                    if (tokenCount == 0 || tokens[tokenCount - 1]._type == Types.LeftParenthesis ||
                         (tokens[tokenCount - 1]._type == Types.Operator)) {
                        tokens.push(new Token("-1", Types.Number));
                        tokens.push(new Token("*", Types.Operator));

                        continue;
                    }
                }

                tokens = tokens.concat(RetrieveNumberBuffer());
                tokens = tokens.concat(RetrieveLetterBuffer());

                tokens.push(new Token(part, Types.Operator));
                continue;
            }

            if (this.IsLeftParenthesis(part)) {
                //If the char before leftParenthesis is letter, its  a function
                if (letterBuffer.length > 0) {
                    tokens.push(new Token(this.GetFullLetterString(letterBuffer), Types.Function));
                    letterBuffer = [];
                } else if (numberBuffer.length > 0) {
                    tokens = tokens.concat(RetrieveNumberBuffer());
                    tokens.push(new Token("*", Types.LeftParenthesis));
                }
                tokens.push(new Token(part, Types.LeftParenthesis));

                continue;
            }
            
            if (this.IsRightParenthesis(part) ) {
                tokens = tokens.concat(RetrieveLetterBuffer());
                tokens = tokens.concat(RetrieveNumberBuffer());
                
                tokens.push(new Token(part, Types.RightParenthesis));
                continue;
            }

            if (this.IsComma(part)) {
                tokens = tokens.concat(RetrieveNumberBuffer());
                tokens = tokens.concat(RetrieveLetterBuffer());
                
                tokens.push(new Token(part, Types.ArgumentSeperator));
            }
        }

        //If any variable left, concat into token array
        tokens = tokens.concat(RetrieveNumberBuffer());
        tokens = tokens.concat(RetrieveLetterBuffer());

        numberBuffer = null;
        letterBuffer = null;

        return tokens;
    }

//#region Private Helper Method
    private GetFullLetterString(letterBuffer : string[]) : string{
        return letterBuffer.join("");
    }
//#endregion 

//#region Qualifier Method
    private IsComma(p_char : string) : boolean {
        return p_char == ",";
    }

    private IsNumber(p_char : string) : boolean {
        return StaticDataSet.RexIsNum.test(p_char);
    }
    
    private IsVariable(p_char : string) : boolean {
        return StaticDataSet.RexIsVariable.test(p_char)
    }
    
    private IsOperator(p_char : string) : boolean {
        return StaticDataSet.RexIsOperator.test(p_char)
    }
    
    private IsRightParenthesis(p_char : string) : boolean {
        return (p_char == ")");
    }

    private IsLeftParenthesis(p_char : string) : boolean {
        return (p_char == "(");
    }
//#endregion

}

