import {Tokenizer} from '../Token/Tokenizer';
import {Token, Types} from '../Token/Token';
import {Stack} from 'typescript-collections';
import {FunctionLookUpTable, StaticDataSet} from '../Utility/StaticDataSet';
import {ComputeOperatorToken, ComputeFunctionToken, AnalyzeStringOperator} from '../Utility/MathOpCollection';

export class ASTTreeParser {

    public Parse(shunting_tokens : Token[]) : number {
        let outputStack = new Stack<any>();

        try {
            let tokenLength = shunting_tokens.length;

            for (let i = 0; i < tokenLength; i++) {
                let t  = shunting_tokens[i];

                //For User Define Function size
                if (t._type == Types.FunctionEnd) {
                    outputStack.add(t._value);
                }

                else if (t._type == Types.Number)
                    outputStack.add(parseFloat(t._value));
                else if (t._type == Types.Operator)
                {
                    let rightInput = outputStack.pop(),
                        leftInput = outputStack.pop();

                    outputStack.add(ComputeOperatorToken(t, leftInput, rightInput));
                }

                else if (t._type == Types.LogicOperator) {
                    let rightInput = outputStack.pop(),
                        leftInput = outputStack.pop();

                    outputStack.add(AnalyzeStringOperator(t._value, rightInput, leftInput));
                }

                else if (t._type == Types.Function) {
                    if (FunctionLookUpTable.hasOwnProperty(t._value))
                    {
                        let inputLength = FunctionLookUpTable[t._value];
                        let inputArray : number[] = new Array();

                        //User define size
                        if (inputLength == -1) {
                            while (true) {
                                if (outputStack.peek() != StaticDataSet.FunctionEndSign) {

                                    inputArray.push(outputStack.pop());

                                } else {
                                    break;   
                                }
                            }
                        } else {
                            for (let k = 0; k < inputLength; k++)
                                inputArray[k] = outputStack.pop();
                        }
                        
                        //Pop out the FunctionEnd sign
                        outputStack.pop();

                        inputArray = inputArray.reverse();

                        outputStack.add(ComputeFunctionToken(t, inputArray ));
                    }
                    else {
                        console.warn("Function " + t._value + " is not define");
                        break;
                    }
                }
            }

        } catch {
            console.warn("Encounter incorrect syntax, have you assign value to variable?");
        }

        if (outputStack.size() <= 0)
            return 0;

        return outputStack.pop();
    }

}