
var yourWebAppUrl = 'REPLACE_THIS_WITH_YOUR_WEB_APP_URL';
var itm = document.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
var outputContainArr = [];
for(i=1; i<itm.length; i++){
	var techItm = itm[i].getElementsByTagName("a")[0].innerText;
	
	var descript = itm[i].getElementsByTagName("td")[1].innerText.replace(/^\s*|\n/g, '');
	
	var relatedItms = itm[i].getElementsByClassName("hint");
	
	var relArr = [];
	
	for(h=0; h<relatedItms.length; h++){
		relArr.push(relatedItms[h].innerText);

    }
	var otherItms = '"'+relArr.toString().replace(/,/g, '; ')+'"';
  	
	outputContainArr.push('["'+techItm+'",'+otherItms+',"'+descript+'"]');
}
var sendThis = '['+outputContainArr.toString()+']';

window.open(yourWebAppUrl+'?put='+sendThis)
