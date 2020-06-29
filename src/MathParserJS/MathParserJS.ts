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

        let organzieTokens = this.GetTokens(p_raw_expression);

        let answer = this._astTreeParser.Parse(organzieTokens);
        
        return answer;
    }

    public CalculateWithToken(p_tokens : Token[]) : number {
        let answer = this._astTreeParser.Parse(p_tokens);
        
        return answer;
    }

    public GetTokens(p_raw_expression:string) : Token[] {
        p_raw_expression = this.CleanUpExpression(p_raw_expression);

        let tokens = this._tokenizer.Parse(p_raw_expression);
        console.log(tokens);

        let organzieTokens = this._shuntingYard.Parse(tokens);

        console.log(organzieTokens);
        
        return organzieTokens;
    }

    private CleanUpExpression(p_raw_expression:string) {
        //p_raw_expression = p_raw_expression.toLowerCase();

        return p_raw_expression;
    }

}