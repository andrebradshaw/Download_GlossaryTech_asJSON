function dl(filename, text) {
  var elmi = document.createElement('a');
  elmi.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  elmi.setAttribute('download', filename);

  elmi.style.display = 'none';
  document.body.appendChild(elmi);

  elmi.click();

  document.body.removeChild(elmi);
}

var itm = document.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
var outputContainArr = [];
for(i=1; i<itm.length; i++){
	var techItm = itm[i].getElementsByTagName("a")[0].innerText;
	
	var descript = itm[i].getElementsByTagName("td")[1].innerText;
	
	var relatedItms = itm[i].getElementsByClassName("hint");
	
	var relArr = [];
	
	for(h=0; h<relatedItms.length; h++){
		relArr.push(relatedItms[h].innerText);

    }
	var otherItms = relArr.toString().replace(/,/g, '","');

	outputContainArr.push('{"keyword":"'+techItm+'","otherkeys":["'+otherItms+'"],"description":"'+descript+'"}');
}

var urlPath = /(?<=terms\/).+/.exec(window.location.href).toString().replace(/\//g, '_');
var saveThis = '['+outputContainArr.toString().replace(/\n/g, '')+']';
dl(urlPath, saveThis);
