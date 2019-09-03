const puppeteer = require("puppeteer");
a();
async function a() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
        "https://developer.salesforce.com/docs/component-library/overview/components"
    );

    const textContent = await page.evaluate(() => {
        var arr = [];
        for (var a of document.querySelectorAll("a")) {
            if (a.href.includes("bundle")) arr.push(a.href);
        }
        return arr;
    });
    try {
        var mainObj = {};
        for (let iterator of textContent) {
            console.log(iterator + "/specification"); 
            await page.goto(
                iterator + "/specification"
            );
            await page.waitFor(() => !!document.querySelector('table'));            
            const textContent1 = await page.evaluate(() => {
                //var output='Starting: \n';
                var tableArray = [];
                document.querySelectorAll("table").forEach(function(table,tableIndex){
                    var tableHeaders= [];
                    //output+='*1st: ' + table.nodeName + ' : ' + table.nodeValue+'\n';
                    if(table.tHead && table.tHead.rows && table.tHead.rows.length && table.tHead.rows[0].cells && table.tHead.rows[0].cells.length){
                        for( var x of table.tHead.rows[0].cells){
                            tableHeaders.push(x.innerText);
                        }
                        for( var tbody of table.tBodies){
                            for( var row of tbody.rows){
                                let tempObj = {};
                                for(let i=0;i<row.cells.length;i++){
                                    tempObj[tableHeaders[i]] = row.cells[i].innerText
                                }
                                tableArray.push(tempObj);
                            }
                        }

                    }
                    /*table.childNodes.forEach(function(label,labelIndex){
                        output+='**2nd: ' + label.nodeName + ' : ' + label.nodeValue+'\n';
                        label.childNodes.forEach(function(row,rowIndex){
                            output+='***3rd: ' + row.nodeName + ' : ' + row.nodeValue+'\n';
                            row.childNodes.forEach(function(column,columnIndex){
                                output+='****4th: ' + column.nodeName + ' : ' + column.nodeValue+'\n';
                                column.childNodes.forEach(function(textVal,textValIndex){
                                    output+='*****5th: ' + textVal.nodeName + ' : ' + textVal.nodeValue+'\n';
                                    if(label.nodeName == 'THEAD'){
                                        tableColumn.push(textVal.nodeValue);
                                    }else if(label.nodeName == 'TBODY' && tableColumn.length){

                                    }
                                });
                            });
                            if(tempObj){
                                arr.push(tempObj)
                            }
                            
                        });
                    });
                    */
                   
                    
                });
                return tableArray;
            });
            // page.on('console', msg => {
            //     for (let i = 0; i < msg.args().length; ++i)
            //         console.log(`${i}: ${msg.args()[i]}`);
            // });
            
            mainObj[iterator + "/specification"] = textContent1;
        }
        console.log(mainObj);
        var fs = require('fs');
        fs.writeFile('myjsonfile.json', JSON.stringify(mainObj),function(err) {
            if (err) throw err;
            console.log('complete');
        });
    } catch (e) {
        console.log('error', e)
    }


    browser.close();
}
// request('https://developer.salesforce.com/docs/component-library/overview/components', (error, response, html) => {
//     if (!error && response.statusCode == 200) {
//         const $ = cheerio.load(html);
//         console.log($.parseHTML());
//         console.log($);
//         console.log($.html());
//         $('a').each(function(i, elem) {
//             if(elem && elem.attribs && elem.attribs.href){
//                 //var flipartURL = new URL(elem.attribs.href,'https://developer.salesforce.com');
//                 //console.log('flipartURL: ',elem.attribs.href);
//             }
//             else{
//                 //console.log('elem: ',elem);
//             }
//         });
//         console.log('Function Called: ');
//     }else{
//         console.log("error: ",error);
//         console.log("response: ",response);
//         console.log("html: ",html);response,html
//     }
// });

/*

    request('https://www.flipkart.com/boat-rockerz-400-super-extra-bass-bluetooth-headset-mic/p/itmf3vhg5m9smugx?pid=ACCEJZXYKSG2T9GS&', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        var urlMap = new Map();
        var productIdSet = new Set();
        const $ = cheerio.load(html);
        $('a').each(function(i, elem) {
            if(elem && elem.attribs && elem.attribs.href){
                var flipartURL = new URL(elem.attribs.href,'https://www.flipkart.com');
                var loggingString,productId;
                if(flipartURL.pathname.includes('/p/')){
                    if(flipartURL.pathname){
                        //console.log(flipartURL.pathname.toString().substring(flipartURL.pathname.toString().indexOf('/p/')).replace('/p/',''));
                        productId = flipartURL.pathname.toString().substring(flipartURL.pathname.toString().indexOf('/p/')).replace('/p/','');
                        loggingString = 'PathName: '+ productId;
                        if(!urlMap.has(flipartURL.origin+flipartURL.pathname)){
                            urlMap.set((flipartURL.origin+flipartURL.pathname),false);
                        }
                        
                    }
                    if(flipartURL.searchParams.has('lid')){
                        //console.log(flipartURL.searchParams.get('lid'));
                        loggingString += ' ,LID : '+flipartURL.searchParams.get('lid');
                    }
                    if(flipartURL.searchParams.has('pid')){
                        //console.log(flipartURL.searchParams.get('pid'));
                        loggingString += ' ,PID : '+flipartURL.searchParams.get('pid');
                    }   
                }
                if(loggingString && !productIdSet.has(productId)){
                    console.log(flipartURL.toString());
                    productIdSet.add(productId);
                }
                
            }
        });
        console.log(urlMap);
*/