import * as xlsx from 'xlsx';
import {Dictionary} from 'typescript-collections';

export class XLSXParser {
    public filePath: string;

    private NameRangeDict : Dictionary<string, string>;

    public constructor() { 
        this.NameRangeDict = new Dictionary<string, string>();
    }

    public Execute(filePath: string) {
        this.filePath = filePath; 
        let workbook = xlsx.readFile(this.filePath);

        this.ParseNameRange(workbook.Workbook.Names);

        // let findColumn = workbook.Workbook.Views.find(x=> {
        //     return x. == "DataSheet!B4"
        // });

        console.log(xlsx.utils.decode_range("$B$5"));

        var range = { s: { c: "A", r: 0 }, e: { c: 0, r: 4 } };//A1:A5
        //console.log(workbook.Sheets);
    }

    private ParseNameRange(nameRangeArray : xlsx.DefinedName[]) {
        let nameSize = nameRangeArray.length;

        for(let i = 0; i < nameSize; i++) {
            console.log(nameRangeArray[i]);
        }

    }

    public ParseColumn(columnVal : string) {

    }

    public SearchVariable(target : string) {

    }

    public SearchNameData(name:string) {

    }

    public SearchColumnID(name:string){
        //Is Single

        //Array
    }


}