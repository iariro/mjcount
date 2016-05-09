
function initExportPage()
{
	var index = localStorage["currentIndex"];
	var json = localStorage["results" + index];

	document.getElementById("exportarea").innerHTML = json;
}

function copyToClipboard()
{
	var obj = document.form1.exportarea.createTextRange();
	obj.execCommand("Copy");
	alert('done');
}

function gotoGameListPage()
{
	parent.document.getElementById("content_frame").src = 'gamelist.html';
}
