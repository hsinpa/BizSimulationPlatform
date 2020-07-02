
import {erf} from "mathjs";

 /**
 *The NORMDIST function returns the value of the normal distribution function (or normal cumulative distribution function) for a specified value, mean and standard deviation.
 * https://support.google.com/docs/answer/3094021
 * @param {number} x The input to the normal distribution function
 * @param {number} mean The mean (mu) of the normal distribution function
 * @param {number} standard_deviation The standard deviation (sigma) of the normal distribution function
 * @param {number} cumulative Whether to use the normal cumulative distribution function rather than the distribution function
 */
export let CumulativeNormalDist = function(x : number, mean : number, standard_deviation : number, cumulative : number) {
    if (cumulative == 0)
        return NormalDist(x);

    return (1 - erf((mean - x ) / (Math.sqrt(2) * standard_deviation))) / 2
}

export let NormalDist = function(x : number) {
    return Math.pow(Math.E,-Math.pow(x,2)/2)/Math.sqrt(2*Math.PI);
}

