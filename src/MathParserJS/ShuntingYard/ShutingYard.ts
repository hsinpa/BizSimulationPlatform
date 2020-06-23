import {Tokenizer} from '../Token/Tokenizer';
import {Token, Types} from '../Token/Token';
import {Stack} from 'typescript-collections';
import {AssociativityDict, PrecedenceDict} from '../Utility/StaticDataSet';

export class ShuntingYard {
    public Parse(p_tokens : Token[]) : Token[] {
        let outputQueue : Token[] = [];
        let operatorStack = new Stack<Token>();
        let tokenLength = p_tokens.length;

        for (let i = 0; i < tokenLength; i++)
        {
            var t = p_tokens[i];

            //if the token is a number, then:
            //push it to the output queue.
            if (t._type == Types.Number || t._type == Types.Variable)
            {
                outputQueue.push((t));
            }

            //if the token is a function then:
            //push it onto the operator stack
            else if (t._type == Types.Function)
            {
                operatorStack.add(t);
            }

            //If the token is a function argument separator 
            else if (t._type == Types.ArgumentSeperator)
            {
                //Until the token at the top of the stack is a left parenthesis
                //pop operators off the stack onto the output queue.
                while (operatorStack.size() > 0
                    && operatorStack.peek()._type != Types.LeftParenthesis)
                {
                    outputQueue.push(operatorStack.pop());
                }
            }

            //if the token is an operator, then:
            else if (t._type == Types.Operator)
            {
                //while there is an operator token o2, at the top of the operator stack and either
                while (operatorStack.size() > 0 &&

                    ( (operatorStack.peek()._type == Types.Function)
                        || ((operatorStack.peek()._type == Types.Operator)

                                && (this.GetPrecedence(operatorStack.peek()._value) > this.GetPrecedence(t._value)
                            || (this.GetPrecedence(t._value) == this.GetPrecedence(operatorStack.peek()._value) && this.GetAssociativity(operatorStack.peek()._value) == "left"))
                    && (operatorStack.peek()._type != Types.LeftParenthesis)) ))
                    {
                        outputQueue.push(operatorStack.pop());
                    }


                //      while ((there is a function at the top of the operator stack)
                // or(there is an operator at the top of the operator stack with greater precedence)
                // or(the operator at the top of the operator stack has equal precedence and is left associative))
                //and(the operator at the top of the operator stack is not a left parenthesis):


                //at the end of iteration push o1 onto the operator stack
                operatorStack.push(t);
            }

            //if the token is a left paren (i.e. "("), then:
            else if (t._type == Types.LeftParenthesis)
            {
                operatorStack.add(t);
            }

            //if the token is a right paren(i.e. ")"), then:
            else if (t._type == Types.RightParenthesis)
            {
                //while the operator at the top of the operator stack is not a left paren:
                //pop the operator from the operator stack onto the output queue.
                while (operatorStack.size() > 0 && operatorStack.peek()._type != Types.LeftParenthesis)
                {
                    outputQueue.push(operatorStack.pop());
                }

                //if there is a left paren at the top of the operator stack, then:
                //pop the operator from the operator stack and discard it
                if (operatorStack.size() > 0 && operatorStack.peek()._type == Types.LeftParenthesis)
                    operatorStack.pop();

                //after while loop, if operator stack not null, pop everything to output queue
                //if (operatorStack.Count > 0 && operatorStack.Peek()._type == Token.Types.Function)
                //    outputQueue.Add(operatorStack.Pop());
            }

        }
                   
        //if there are no more tokens to read:
        //while there are still operator tokens on the stack:
        //pop the operator from the operator stack onto the output queue.
        while (operatorStack.size() > 0)
            outputQueue.push(operatorStack.pop());

        operatorStack = null;

        return outputQueue;

    }

    private GetAssociativity(p_operator : string) : string {
        if (AssociativityDict.hasOwnProperty(p_operator)) {
            return AssociativityDict[p_operator];
        }

        return "right";
    }

    private GetPrecedence(p_operator : string) : number
    {
        if (PrecedenceDict.hasOwnProperty(p_operator))
        {
            return PrecedenceDict[p_operator];
        }

        return 4;
    }

}