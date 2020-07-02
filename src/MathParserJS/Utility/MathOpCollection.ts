
import {Token, Types} from '../Token/Token';
import {CumulativeNormalDist, NormalDist} from './ComplexExcelFormula';

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

export function AnalyzeStringOperator(p_operator : string, p_value : number, self_value : number) : number{
    let isValid = false;
    switch (p_operator)
    {
        case ">":
            isValid = self_value > p_value;
            break;

        case ">=":
            isValid = self_value >= p_value;
            break;

        case "<=":
            isValid = self_value <= p_value;
            break;

        case "<":
            isValid = self_value < p_value;
            break;

        case "=":
            isValid = self_value == p_value;
            break;

        case "!=":
            isValid = self_value != p_value;
            break;
    }

    return isValid ? 1 : 0;
}

function ParseLogicOperation(p_raw_expression : string) : boolean {
    let c_varaibles = p_raw_expression.split(' ');
    let startIndex = 0;

    //Allow space between &|
    if (c_varaibles[0] == " " || c_varaibles[0] == "")
        startIndex = 1;

    let base_value = parseFloat(c_varaibles[startIndex]);
    let operator_string = c_varaibles[startIndex + 1];
    let c_value = parseInt(c_varaibles[startIndex + 2]);

    return AnalyzeStringOperator(operator_string, c_value, base_value) == 1;
}

export function ComputeFunctionToken(token : Token, input : number[]) : number
{
    switch (token._value)
    {
        //#region Function with ONE input
        case "SIN":
            return Math.sin(input[0]);

        case "COS":
            return Math.cos(input[0]);

        case "TAN":
            return Math.tan(input[0]);

        case "ASIN":
            return Math.asin(input[0]);

        case "ACOS":
            return Math.acos(input[0]);

        case "ATAN":
            return Math.atan(input[0]);

        case "SQRT":
            return Math.sqrt(input[0]);

        case "ABS":
            return Math.abs(input[0]);

        case "FLOOR":
            return Math.floor(input[0]);

        case "CEILING":
            return Math.ceil(input[0]);

        case "ROUND":
            return Math.round(input[0]);

        case "SIGN":
            return Math.sign(input[0]);

        case "NORMSDIST": {
            return NormalDist(input[0]);
        }
    
        //#endregion

        //#region Function with Two inputs
        case "rand":
            return Math.random() * (input[1] - input[0]) + input[0];

        case "ATAN2":
            return Math.atan2(input[0], input[1]);

        case "POW":
            return Math.pow(input[0], input[1]);

        case "STEP":
            return input[1] >= input[0] ? 1 : 0;
        //#endregion

        //#region Function with THREE input
        case "CLAMP":
            return  Math.min(Math.max(input[1], input[0]), input[2])

        case "LERP":
            return input[0] + (input[2] * (input[1] - input[0]));

        case "SMOOTHSTEP":
            var x = Math.max(0, Math.min(1, (input[0]-input[1])/(input[2]-input[1])));
            return x*x*(3 - 2*x);

        case "If": {
            return (input[0] == 1 ? input[1] : input[2]);
        }
        break;
        //#endregion

//#region Function with FOUR input
        case "NORMDIST": {
            return CumulativeNormalDist(input[0], input[1], input[2], input[3]);
        }

//#endregion

        case "MIN":
            return Math.min(...input);

        case "MAX":
            return Math.max(...input);


        default:
            return 0;
    }
}