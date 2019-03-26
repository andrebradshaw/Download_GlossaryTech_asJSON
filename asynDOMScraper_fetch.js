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

var commonWordChop = (s) => s.replace(new RegExp(common, 'gi'), ' ').replace(new RegExp(common, 'gi'), ' ').replace(new RegExp(common, 'gi'), ' ').replace(new RegExp(common, 'gi'), ' ').replace(new RegExp(common, 'gi'), ' ').replace(new RegExp(common, 'gi'), ' ').replace(new RegExp(common, 'gi'), ' ').replace(new RegExp(common, 'gi'), ' ').replace(new RegExp(common, 'gi'), ' ').replace(new RegExp(common, 'gi'), ' ').replace(new RegExp(common, 'gi'), ' ').replace(/\s+/g, ' ').trim();

var common = '\\bthe\\s+|\\ban\\s+|\\ba\\s+|\\s+a\\s+|\\s+able\\s+|\\s+act\\s+|\\s+add\\s+|\\s+age\\s+|\\s+ago\\s+|\\s+air\\s+|\\s+all\\s+|\\s+also\\s+|\\s+and\\s+|\\s+any\\s+|\\s+as\\s+|\\s+at\\s+|\\s+be\\s+|\\s+both\\s+|\\s+but\\s+|\\s+by\\s+|\\s+can\\s+|\\s+come\\s+|\\s+do\\s+|\\s+each\\s+|\\s+else\\s+|\\s+everw\\s+|\\s+for\\s+|\\s+free\\s+|\\s+from\\s+|\\s+full\\s+|\\s+get\\s+|\\s+give\\s+|\\s+go\\s+|\\s+good\\s+|\\s+have\\s+|\\s+he\\s+|\\s+here\\s+|\\s+how\\s+|\\s+I\\s+|\\s+if\\s+|\\s+in\\s+|\\s+into\\s+|\\s+it\\s+|\\s+its\\s+|\\s+just\\s+|\\s+know\\s+|\\s+last\\s+|\\s+let\\s+|\\s+lie\\s+|\\s+like\\s+|\\s+lot\\s+|\\s+make\\s+|\\s+many\\s+|\\s+may\\s+|\\s+me\\s+|\\s+more\\s+|\\s+most\\s+|\\s+much\\s+|\\s+must\\s+|\\s+my\\s+|\\s+near\\s+|\\s+next\\s+|\\s+none\\s+|\\s+nor\\s+|\\s+not\\s+|\\s+now\\s+|\\s+of\\s+|\\s+off\\s+|\\s+oh\\s+|\\s+ok\\s+|\\s+on\\s+|\\s+one\\s+|\\s+only\\s+|\\s+onto\\s+|\\s+or\\s+|\\s+our\\s+|\\s+out\\s+|\\s+over\\s+|\\s+own\\s+|\\s+per\\s+|\\s+pull\\s+|\\s+push\\s+|\\s+put\\s+|\\s+say\\s+|\\s+see\\s+|\\s+seek\\s+|\\s+seem\\s+|\\s+she\\s+|\\s+so\\s+|\\s+some\\s+|\\s+soon\\s+|\\s+such\\s+|\\s+sure\\s+|\\s+than\\s+|\\s+that\\s+|\\s+the\\s+|\\s+them\\s+|\\s+then\\s+|\\s+they\\s+|\\s+this\\s+|\\s+thus\\s+|\\s+to\\s+|\\s+too\\s+|\\s+upon\\s+|\\s+us\\s+|\\s+use\\s+|\\s+very\\s+|\\s+way\\s+|\\s+we\\s+|\\s+well\\s+|\\s+what\\s+|\\s+when\\s+|\\s+who\\s+|\\s+whom\\s+|\\s+why\\s+|\\s+will\\s+|\\s+with\\s+|\\s+yes\\s+|\\s+yet\\s+|\\s+you\\s+|\\s+your\\s+|\\s+are\\s+|\\s+is\\s+|\\s+be\\s+|\\s+which\\s+|\\s+makes\\s+|\\s+use\\s+|\\s+usable\\s+|\\s+new\\s+|\\s+can\\s+|\\s+added\\s+|\\s+add\\s+|\\s+make\\s+';

async function getTermsByPageAndPath(path,page){
  var res = await fetch("https://glossarytech.com/terms/"+path+'/page'+page);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');

  var resList = Array.from(tn(cn(doc,'content_wrapper')[1], 'tr'))
  resList.shift();
  var termsList = resList.map(itm=> {
    var td = tn(itm, 'td');
    var term = tn(td[0], 'a')[0].innerText;
    var termAlt = /(?<=[a-z]\B)(?=[A-Z])|\W/.test(term) ? [term, term.replace(/(?<=[a-z]\B)(?=[A-Z])|\W/g, ' ')] : [term];
    var related = tn(tn(td[1], 'p')[0], 'a') ? unq(Array.from(tn(tn(td[1], 'p')[0], 'a')).map(a=> a.innerText)) : [];
    var body = commonWordChop(tn(td[1], 'p')[0].innerText); 
    return [termAlt, related, body];
  });

  console.log(termsList);
  return termsList;

}
// getTerms()

async function getCategories(){
  var res = await fetch("https://glossarytech.com/");
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var cats = unq(Array.from(tn(cn(cn(doc,'categories')[0], 'accordion accordion_list js_accordion')[0], 'li')).map(li=> reg(/(?<=https:\/\/glossarytech\.com\/terms\/)\w.+/.exec(tn(li,'a')[0].href),0)));
  cats.shift();
  console.log(cats)
  return cats;
}
// getCategories()

async function getPagesFromPath(path){
  var res = await fetch("https://glossarytech.com/terms/"+path);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var pages = cn(doc, 'pages')[0] ? Array.from(tn(cn(doc, 'pages')[0], 'li')).map(itm=> itm.innerText) : [];
  var totalPages = pages.length > 0 ? parseInt(pages[pages.length-1]) : 0;
  return totalPages;

}

async function looper(){
  var temp = [];
  var path = 'front_end-technologies';
  var pages = await getPagesFromPath(path)
  for(var i=1; i<=5; i++){
     var data = await getTermsByPageAndPath(path, i);
     data.forEach(itm=> temp.push(itm));
  }
  console.log(temp);
}
looper()
