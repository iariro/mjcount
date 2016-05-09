
function initExportPage()
{
	var index = localStorage["currentIndex"];
	var json = localStorage["results" + index];

	document.getElementById("exportarea").innerHTML = json;
}

function copyToClipboard()
{
	var text = document.getElementById("exportarea").innerHTML;
	/*
	window.clipboardData.setData("text", text);
	var doc = document.body.createTextRange();
	doc.moveToElementText(text);
	doc.execCommand("copy");
	alert('copy done');
	*/
}

function gotoGameListPage()
{
	parent.document.getElementById("content_frame").src = 'gamelist.html';
}
