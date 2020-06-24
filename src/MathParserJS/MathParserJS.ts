import {Tokenizer} from './Token/Tokenizer'
import {Token, Types} from './Token/Token'
import {ShuntingYard} from './ShuntingYard/ShutingYard'
import {ASTTreeParser} from './ShuntingYard/ASTTreeParser'

export class MathParserJS {
    private _tokenizer : Tokenizer;
    private _shuntingYard : ShuntingYard;
    private _astTreeParser : ASTTreeParser;

    public constructor() { 
        this._tokenizer = new Tokenizer();
        this._shuntingYard = new ShuntingYard();
        this._astTreeParser = new ASTTreeParser();
    }

    public Calculate(p_raw_expression:string) : number {

        p_raw_expression = p_raw_expression.toLowerCase();

        let tokens = this._tokenizer.Parse(p_raw_expression);
        console.log(tokens);

        let organzieTokens = this._shuntingYard.Parse(tokens);

        console.log(organzieTokens);

        let answer = this._astTreeParser.Parse(organzieTokens);
        
        return answer;
    }

}