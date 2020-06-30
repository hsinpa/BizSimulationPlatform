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
        //this.TestMultiVariableSheetName('DataSheet!D8');
        //this.TestMultiVariableSheetNameArray('zTurnFreeLancer');
        //this.TestNameRange("DataSheet!E7");
        this.TestSimpleFunction('DataSheet!G8');
    }

    public TestNameRange(NameRangeColumn : string) {
        let variableResult = this.XLSXParser.SearchColumnID(NameRangeColumn, null);        
        console.log("variableResult " + variableResult);
    }

    public TestMultiVariableSheetName(VariableName : string) {
        let variableResult = this.XLSXParser.SearchColumnID(VariableName, null);        
    }
    
    public TestMultiVariableSheetNameArray(VariableName : string) {
        let nameDataResult = this.XLSXParser.SearchNameData(VariableName);

        let variableResult = this.XLSXParser.SearchVariableArray(nameDataResult, 'DataSheet');                
    }

    public TestSimpleFunction(VariableName : string) {
        let variableResult = this.XLSXParser.SearchColumnID(VariableName, null);     
        
        console.log("TestSimpleFunction " + variableResult);

        //let variableResult = this.XLSXParser.SearchVariableArray(nameDataResult, 'DataSheet', "D8");
                
    }
} 