/*
Run this anywhere on GlossaryTech.com and it will download the data as a multi-dimensional array (.json file).
sample output. 
[
  [
    [targetWord, andAltTarget],[highlighted_related_words],"trimmed down description of target words"],
  ]
];

*/

var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var noHTML = (s) => s.replace(/<.+?>/g, '').replace(/\s+/g, ' ').replace(/&.+?;/g, '');
var delay = (ms) => new Promise(res => setTimeout(res, ms));

var fixCase = (s) => s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
var timer = new Date().getTime().toString().replace(/\d{4}$/, '0000');
var rando = (n) => Math.round(Math.random() * n);

var getAverage = (arr) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b) / arr.length) : 0;
var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);

var bool2Arr = (s) => s.replace(/-\w+/g, '').replace(/\)\s+\(/g, ' AND ').replace(/\(/g, '').replace(/\)/g, '').replace(/ or /ig, ' AND ').replace(/"/g, '').trim().split(" AND ");

var common = ["aim","a","able","act","add","age","ago","air","all","also","and","any","as","at","be","both","but","by","can","come","do","each","else","everw","for","free","from","full","get","give","go","good","have","he","here","how","I","if","in","into","it","its","just","know","last","let","lie","like","lot","make","many","may","me","more","most","much","must","my","near","next","none","nor","not","now","of","off","oh","ok","on","one","only","onto","or","our","out","over","own","per","pull","push","put","say","see","seek","seem","she","so","some","soon","such","sure","than","that","the","them","then","they","this","thus","to","too","upon","us","use","very","way","we","well","what","when","who","whom","why","will","with","yes","yet","you","your","are","is","which","makes","usable","new","added","down","helps","fast","faster","major","page","level","used","run","while","easy","easier","other","two","three","four","five","six","seven","eight","nine","ten","ever","never","another","simple","anything","amount","reduce","unique","feel","look","ease","item","once","reuse","up","small","these","them","an"];

var commonWordChop = (targ) => targ.filter(a=> common.some(b=> a==b) === false).toString().replace(/,/g,' ');


function downloadr(arr2D, filename) {
  if (/\.csv$/.test(filename) === true) {
	var data = '';
	arr2D.forEach(row => {
		var arrRow = '';
		row.forEach(col => {
			col ? arrRow = arrRow + col.toString().replace(/,/g, ' ') + ',' : arrRow = arrRow + ' ,';
        });
		data = data + arrRow + '\r'; 
	});
  }

  if (/\.json$|.js$/.test(filename) === true) {
    var data = JSON.stringify(arr2D);
    var type = 'data:application/json;charset=utf-8,';
  } else {
	var type = 'data:text/plain;charset=utf-8,';
  }
  var file = new Blob([data], {
    type: type
  });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, filename);
  } else {
    var a = document.createElement('a'),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 10);
  }
}

async function getTermsByPageAndPath(path,page){
  var res = await fetch("https://glossarytech.com/terms/"+path+'/page'+page);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var resList = Array.from(tn(cn(doc,'content_wrapper')[1], 'tr'))
  resList.shift();
  var termsList = resList.map(itm=> {
    var td = tn(itm, 'td');
    var term = tn(td[0], 'a')[0].innerText;
    var termAlt = /(?<=[a-z]\B)(?=[A-Z])|-|\./.test(term) ? [term.trim(), term.replace(/(?<=[a-z]\B)(?=[A-Z])|-|\./g, ' ').trim()] : [term.trim()];
    var related = tn(tn(td[1], 'p')[0], 'a') ? unq(Array.from(tn(tn(td[1], 'p')[0], 'a')).map(a=> a.innerText.trim())) : [];
    var body = commonWordChop(tn(td[1], 'p')[0].innerText.toLowerCase().split(/\s+/)); 
    return [termAlt, related, body];
  });
  return termsList;

}

async function getCategories(){
  var res = await fetch("https://glossarytech.com/");
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var cats = unq(Array.from(tn(cn(cn(doc,'categories')[0], 'accordion accordion_list js_accordion')[0], 'li')).map(li=> reg(/(?<=https:\/\/glossarytech\.com\/terms\/)\w.+/.exec(tn(li,'a')[0].href),0)));
  cats.shift();
console.log(cats)
  return cats.filter(t=> t != '');
}


async function getPagesFromPath(path){
  var res = await fetch("https://glossarytech.com/terms/"+path);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var pages = cn(doc, 'pages')[0] ? Array.from(tn(cn(doc, 'pages')[0], 'li')).map(itm=> itm.innerText) : [];
  var totalPages = pages.length > 0 ? parseInt(pages[pages.length-1]) : 0;
  return totalPages;

}

async function pageLooper(path){
  var temp = [];
  var pages = await getPagesFromPath(path);
  for(var i=1; i<=pages; i++){
     var data = await getTermsByPageAndPath(path, i);
     data.forEach(itm=> temp.push(itm));
  }
  return temp;
}

async function loopThroughCats(){
  var temp = [];
  var arr = await getCategories();
  for(var i=0; i<arr.length; i++){
    var cats = await pageLooper(arr[i]);
    cats.forEach(el=> temp.push(el));
  }
downloadr(temp, 'glossaryTech.json');
}

loopThroughCats()
