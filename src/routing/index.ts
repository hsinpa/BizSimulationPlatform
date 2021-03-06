import {XLSXParser} from '../xlsx/XLSXParser';
import {TestXLSXParser} from '../xlsx/TestXLSXParse';
import {MathParserJS} from '../MathParserJS/MathParserJS';

const path = require('path')
const mathParser = new MathParserJS();

module.exports =  (router:any, rootPath:string) => {
  router.get('/', async function (ctx:any, next:any) {
    ctx.state = {
      title: 'HSINPA'
    };

    await ctx.render('index', {title: "HSINPA"});
  });

  router.get('/excel', async function (ctx:any, next:any) {
    let excelFilePath : string = path.join(rootPath, 'public', 'assets','excel', 'MostSimpleDatasheet.xlsx');
    console.log(excelFilePath);

    let xlsx = new XLSXParser();

    xlsx.Execute(excelFilePath);

    ctx.body = rootPath;

    return ctx;
  });

  router.get('/test_excel', async function (ctx:any, next:any) {
    let excelFilePath : string = path.join(rootPath, 'public', 'assets','excel', 'MostSimpleDatasheet.xlsx');

    let xlsx = new TestXLSXParser(excelFilePath);
    xlsx.ExecuteAllTestCase();

    ctx.body = rootPath;

    return ctx;
  });

  router.get('/mathparser/:formula', async function (ctx:any, next:any) {
    console.time();
    let answer = mathParser.Calculate(ctx.params.formula);
    console.timeEnd();
    
    ctx.body = (`Answer ${answer}`);

    return ctx;
  });
}
