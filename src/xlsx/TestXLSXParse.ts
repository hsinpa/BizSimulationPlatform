import * as xlsx from 'xlsx';
import {Dictionary} from 'typescript-collections';
import {XLSXParser} from './XLSXParser';

export class TestXLSXParser {

    XLSXParser : XLSXParser;

    public constructor(fileName : string) { 
        this.XLSXParser = new XLSXParser();
        this.XLSXParser.Execute(fileName);
    }

    public ExecuteAllTestCase() {
        this.TestMultiVariableSheetName('zTurnFreeLancer');
        this.TestMultiVariableSheetNameArray('zTurnFreeLancer');

    }

    public TestMultiVariableSheetName(VariableName : string) {
        let nameDataResult = this.XLSXParser.SearchNameData(VariableName);

        let variableResult = this.XLSXParser.SearchVariable(nameDataResult, 'DataSheet', "D8");
        
        console.log("nameDataResult " + nameDataResult);
        
        console.log("variableResult " + variableResult);
    }
    
    public TestMultiVariableSheetNameArray(VariableName : string) {
        let nameDataResult = this.XLSXParser.SearchNameData(VariableName);

        let variableResult = this.XLSXParser.SearchVariableArray(nameDataResult, 'DataSheet', "D8");
                
        console.log(variableResult);
    }
} 