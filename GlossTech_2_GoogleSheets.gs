var yourID = 'YOUR_SHEET_ID_GOES_HERE';
var ss = SpreadsheetApp.openById(yourID);
var s1 = ss.getSheetByName("Sheet1");

function doGet(req) {
  var nextRow = s1.getLastRow()+1;
  var dat = JSON.parse(req.parameter.put);
  s1.getRange(nextRow, 1, dat.length, dat[0].length).setValues(dat);

}
