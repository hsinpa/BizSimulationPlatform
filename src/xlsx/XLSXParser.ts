import * as xlsx from 'xlsx';

export class XLSXParser {
    public filePath: string;

    public constructor(filePath: string) { 
        this.filePath = filePath; 
    }

    public Execute() {
        let workbook = xlsx.readFile(this.filePath);

        console.log(workbook.Workbook.Names);
        console.log(workbook.Sheets);

    }
}