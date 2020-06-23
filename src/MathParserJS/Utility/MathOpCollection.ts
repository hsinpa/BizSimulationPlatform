
import {Token, Types} from '../Token/Token';

export function ComputeOperatorToken(token : Token, leftInput : number, rightInput : number) : number{
    switch (token._value)
    {
        case "+":
            return leftInput + rightInput;

        case "-":
            return leftInput - rightInput;

        case "/":
            return leftInput / rightInput;

        case "*":
            return leftInput * rightInput;

        case "^":
            return Math.pow(leftInput, rightInput);

        default:
            return 0;
    }
}

export function ComputeFunctionToken(token : Token, input : number[]) : number
{
    switch (token._value)
    {
        //#region Function with ONE input
        case "sin":
            return Math.sin(input[0]);

        case "cos":
            return Math.cos(input[0]);

        case "tan":
            return Math.tan(input[0]);

        case "arcsine":
            return Math.asin(input[0]);

        case "arccos":
            return Math.acos(input[0]);

        case "atan":
            return Math.atan(input[0]);

        case "sqrt":
            return Math.sqrt(input[0]);

        case "abs":
            return Math.abs(input[0]);

        case "floor":
            return Math.floor(input[0]);

        case "ceil":
            return Math.ceil(input[0]);

        case "round":
            return Math.round(input[0]);

        case "sign":
            return Math.sign(input[0]);
        //#endregion

        //#region Function with Two inputs
        case "rand":
            return Math.random() * (input[1] - input[0]) + input[0];

        case "min":
            return Math.min(...input);

        case "max":
            return Math.max(...input);

        case "atan2":
            return Math.atan2(input[0], input[1]);

        case "pow":
            return Math.pow(input[0], input[1]);

        case "step":
            return input[1] >= input[0] ? 1 : 0;
        //#endregion

        //#region Function with THREE input
        case "clamp":
            return  Math.min(Math.max(input[1], input[0]), input[2])

        case "lerp":
            return input[0] + (input[2] * (input[1] - input[0]));

        case "smoothstep":
            var x = Math.max(0, Math.min(1, (input[0]-input[1])/(input[2]-input[1])));
            return x*x*(3 - 2*x);

            //#endregion

        default:
            return 0;
    }
}