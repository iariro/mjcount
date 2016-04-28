
function initExportPage()
{
	var index = localStorage["currentIndex"];
	var json = localStorage["results" + index];

	document.getElementById("exportarea").innerHTML = json;
}

function gotoGameListPage()
{
	parent.document.getElementById("content_frame").src = 'gamelist.html';
}
