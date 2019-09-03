var cheerio = require('cheerio');
var request = require('request');

var urlMap = new Map();
urlMap.set('https://www.flipkart.com',false);
processMap(urlMap);
function processMap(urlMap) {
    if(!Array.from(urlMap.values()).every((a)=>{return a;})){
        var urlToCall;
        for(var key of urlMap.keys()){
            if(!urlMap.get(key)){
                urlToCall = key;
                break;
            }
        }
        console.log('urlToCall: ',urlToCall);
        if(urlToCall){
            url = urlToCall;
            request(url, (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
                    $('a').each(function(i, elem) {
                        if(elem && elem.attribs && elem.attribs.href){
                            var flipartURL = new URL(elem.attribs.href,'https://www.flipkart.com');
                            var productId;
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
                        }
                    });
                    urlMap.set(url,true);
                    
                    console.log('urlMap: ',urlMap);
                    processMap(urlMap);
                    console.log('Function Called: ');
                }else{
                    urlMap.set(url,'Has Error');
                    console.log("error: ",error);
                    console.log("response: ",response);
                    console.log("html: ",html);response,html
                }
            });
              
            
        }
    }
    else{
        console.log('Done with Everything');
    }
}

    



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