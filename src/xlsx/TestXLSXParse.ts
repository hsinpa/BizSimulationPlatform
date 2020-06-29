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
        this.TestSimpleFunction('DataSheet!G8');
    }

    public TestMultiVariableSheetName(VariableName : string) {
        let nameDataResult = this.XLSXParser.SearchNameData(VariableName);

        let variableResult = this.XLSXParser.SearchVariable(nameDataResult, 'DataSheet', "D8");        
    }
    
    public TestMultiVariableSheetNameArray(VariableName : string) {
        let nameDataResult = this.XLSXParser.SearchNameData(VariableName);

        let variableResult = this.XLSXParser.SearchVariableArray(nameDataResult, 'DataSheet', "D8");                
    }

    public TestSimpleFunction(VariableName : string) {
        console.log(VariableName);

        let variableResult = this.XLSXParser.SearchVariable(VariableName, null, "G8");        

        //let variableResult = this.XLSXParser.SearchVariableArray(nameDataResult, 'DataSheet', "D8");
                
    }
} 