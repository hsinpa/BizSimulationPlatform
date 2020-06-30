import * as xlsx from 'xlsx';
import {Dictionary} from 'typescript-collections';
import {MathParserJS} from '../MathParserJS/MathParserJS'
import { Types, Token } from '../MathParserJS/Token/Token';
import {FunctionLookUpTable} from '../MathParserJS/Utility/StaticDataSet';
import {ArrayInsert, ArrayRemove} from '../Other/UtilityMethod';

interface ColumnInfo {
    t: string,
    v: any,
    f: string
}

interface ColumnInfoArray {
    columnArray : ColumnInfo[],
    directory : string,
    startCell : xlsx.CellAddress, 
    endCell : xlsx.CellAddress
}

interface DirectoryInfo {
    worksheet : xlsx.WorkSheet,
    directory : string,
    targetVariable : string
}

export class XLSXParser {
    public filePath: string;

    private workbook : xlsx.WorkBook;
    private NameRangeDict : Dictionary<string, string>;
    private mathParserJS : MathParserJS;

    public constructor() { 
        this.NameRangeDict = new Dictionary<string, string>();
        this.mathParserJS = new MathParserJS();
    }

    public Execute(filePath: string) {
        this.filePath = filePath; 
        this.workbook = xlsx.readFile(this.filePath);

        this.ParseNameRange(this.workbook.Workbook.Names);
    }

    /**
     * Save the Name Range into dictionary for fast lookup
     *
     * @private
     * @param {xlsx.DefinedName[]} nameRangeArray
     * @memberof XLSXParser
     */
    private ParseNameRange(nameRangeArray : xlsx.DefinedName[]) {
        let nameSize = nameRangeArray.length;

        for(let i = 0; i < nameSize; i++) {
            this.NameRangeDict.setValue(nameRangeArray[i].Name, nameRangeArray[i].Ref);
            console.log(nameRangeArray[i]);
        }
    }
    
    public FilterDirectoryInfo(target : string, directory:string) : DirectoryInfo {

        let nameRangeValue = this.SearchNameData(target);

        if (nameRangeValue != "")
            target = nameRangeValue;

        let targetPair = target.split("!");
        let workSheet : xlsx.WorkSheet;
        target = targetPair[0];

        if (targetPair.length > 1) {
            directory = targetPair[0];
            workSheet = this.workbook.Sheets[directory]
            target = targetPair[1];
        }

        if (workSheet == null && directory != null) {
            workSheet = this.workbook.Sheets[directory];
        }
    
        return {worksheet :workSheet, directory : directory, targetVariable : target};
    }

    public SearchColumnID(id : string, directory:string) : number {
        return this.SearchVariable(id, directory, id);
    }

    public SearchVariableArray(target : string, directory:string = null) : ColumnInfoArray { 
        try {
            let directoryInfo = this.FilterDirectoryInfo(target, directory);

            if (directoryInfo.targetVariable.indexOf(':') > 0) {
                let arrayPair = directoryInfo.targetVariable.split(":");

                return this.GetColumnArray(directoryInfo.worksheet, directoryInfo.directory, arrayPair[0], arrayPair[1]);
            }
        } catch {
            console.error(`SearchVariableArray Error, target ${target}, directory  ${directory}`);
        }

        return null;
    }

    private SearchVariable(target : string, directory:string, root_target :string) : number {
        
        // try {
            let directoryInfo = this.FilterDirectoryInfo(target, directory);

            console.log("directoryInfo.targetVariable " + directoryInfo.targetVariable);
            console.log("root_target " + root_target);

            if (directoryInfo.targetVariable.indexOf(':') > 0) {
                //root_target is required, for array variable
                if (root_target == null) return 0;

                let arrayPair = directoryInfo.targetVariable.split(":");

                let columnArray = this.GetColumnArray(directoryInfo.worksheet, directoryInfo.directory, arrayPair[0], arrayPair[1]);

                return this.FindArrayValueByColumn(columnArray, root_target);
            }

            let decodeVar = xlsx.utils.decode_cell(directoryInfo.targetVariable);
            
            let encodeVar = xlsx.utils.encode_cell(decodeVar);

            let columnInfo : ColumnInfo = this.ParseColumnInfo(directoryInfo.worksheet, encodeVar);

            return this.ParseVariableResult(columnInfo, directoryInfo.directory, encodeVar);
        // } catch{
        //     console.error(`SearchVariable Error, target ${target}, directory  ${directory}`);
        // }

        return 0;
    }
  
    private ParseVariableResult(columnInfo : ColumnInfo, directory:string, root_target :string) : number {
        if (columnInfo.t == "s") return 0;

        if (columnInfo.t == "n") {

            if (columnInfo.f) {

                //Its a function
                if (columnInfo.f.indexOf("(") >= 0) {
                    console.log("ParseVariableResult : This is function");
                    console.log(columnInfo);
                    console.log("root_target " + root_target);

                    let functionResult = this.ProcessFunctions(columnInfo.f, directory, root_target);

                    return functionResult;
                }
                return this.SearchVariable(columnInfo.f, directory, root_target);
            }

            return Number(columnInfo.v);
        }

        return 0;
    }

    public SearchNameData(name:string) : string {
        if (this.NameRangeDict.containsKey(name)) {

            return this.NameRangeDict.getValue(name)
        }

        return "";
    }

    private ParseColumnInfo(workSheet : xlsx.WorkSheet, encodeKey : string) : ColumnInfo {

        let columnInfo : ColumnInfo = {t:"", v:0, f:""};

        if (workSheet[encodeKey].hasOwnProperty('f'))
            columnInfo.f = workSheet[encodeKey]["f"];

        if (workSheet[encodeKey].hasOwnProperty('v'))
            columnInfo.v = workSheet[encodeKey]["v"];

        if (workSheet[encodeKey].hasOwnProperty('t'))
            columnInfo.t = workSheet[encodeKey]["t"];

        return columnInfo;
    }

    private GetColumnArray(workSheet : xlsx.WorkSheet, directory : string, start_variable : string, end_variable : string) : ColumnInfoArray {
        let columnInfoArray : ColumnInfoArray = {columnArray : [], directory : "", startCell :  {c:0 , r : 0}, endCell : {c:0 , r : 0} };

        let DecodeStart =  (xlsx.utils.decode_cell(start_variable));
        let DecodeEnd = (xlsx.utils.decode_cell(end_variable));

        for (let r = DecodeStart.r; r <= DecodeEnd.r; r++) {
            for (let c = DecodeStart.c; c <= DecodeEnd.c; c++) {
                let EncodeVar = xlsx.utils.encode_cell({c: c, r : r});
                columnInfoArray.columnArray.push( this.ParseColumnInfo(workSheet, EncodeVar) );
            }
        }

        columnInfoArray.startCell = DecodeStart;
        columnInfoArray.endCell = DecodeEnd;
        columnInfoArray.directory = directory;

        return columnInfoArray;
    }

    //Return Round to 2 decimal
    private FindArrayValueByColumn(columnIArray : ColumnInfoArray, RootColumnTarget : string) : number{
        if (columnIArray.columnArray == null || columnIArray.columnArray.length <= 0) return 0;

        let arrayLength = columnIArray.columnArray.length;

        let rootDecode = (xlsx.utils.decode_cell(RootColumnTarget));

        let indexOffSet = (columnIArray.endCell.c - rootDecode.c);

        if (indexOffSet < 0) return 0;

        return this.ParseVariableResult(columnIArray.columnArray[(arrayLength-1) - indexOffSet], columnIArray.directory, RootColumnTarget);
        //Two decimal
        //Math.round(((total / arrayLength) + Number.EPSILON) * 100) / 100
    }

    private FindAllArrayValue(columnIArray : ColumnInfoArray) : number[] {
        let answerArray : number[] = [];

        for (let i = 0; i < columnIArray.columnArray.length; i++) {
            answerArray.push( this.SearchVariable(columnIArray.columnArray[i].f, columnIArray.directory, columnIArray.columnArray[i].f) );
        }

        return answerArray;
    }

    private ProcessFunctions(p_function : string, p_root_directory : string, p_root_column : string) : number {
        console.log("Raw Function : " + p_function);
        let tokens = this.mathParserJS.GetTokens(p_function);
        let tokenLength = tokens.length;

        let isArrayParam = false;

        console.log("Pre ProcessFunctions");
        console.log(tokens);

        for (let i = tokenLength - 1; i >= 0; i--) {
            if (tokens[i]._type == Types.Function) {
                isArrayParam = FunctionLookUpTable[tokens[i]._value] == -1;
                continue;
            }

            if (tokens[i]._type == Types.Variable) {
                if (isArrayParam) {
                    let rawArrayValue = this.SearchVariableArray(p_function, p_root_directory);
                    let arrayValue = this.FindAllArrayValue(rawArrayValue);

                    let arrayLength = arrayValue.length;
                    tokens = ArrayRemove(tokens, i);

                    for (let x = arrayLength - 1; x >= 0; x--) {
                        tokens = ArrayInsert(tokens, i, new Token(arrayValue[i].toString(), Types.Number));
                    }
                } else {
                    tokens[i]._type = Types.Number;
                    tokens[i]._value = this.SearchVariable(tokens[i]._value, p_root_directory, tokens[i]._value).toString();
                }
            }
        }
        console.log("Post ProcessFunctions");
        console.log(tokens);

        return this.mathParserJS.CalculateWithToken(tokens);
    }

}