
function initGameListPage()
{
	listGameListPage();
}

function addGame()
{
	var gamecount = localStorage["gamecount"];
	if (gamecount == undefined || gamecount.startsWith('NaN'))
	{
		gamecount = 0;
	}

	localStorage["gamecount"] = parseInt(gamecount) + 1;

	var results = {};
	results['count'] = 0;
	results['gamecenter'] = document.write.gamecenter.value;
	results['gamekind'] = document.write.gamekind.value;

	var json = obj2str(results);
	localStorage["results" + gamecount] = json;

	initGameListPage();
}

function resetGames()
{
	localStorage["gamecount"] = 0;
	listGameListPage();
}

function listGameListPage()
{
	var gamecount = localStorage["gamecount"];
	if (gamecount == undefined)
	{
		gamecount = 0;
	}

	var i;
	var table = document.getElementById('gamelist');

	while (table.rows.length > 1)
	{
		table.deleteRow(1);
	}

	for (i=0 ; i<gamecount ; i++)
	{
		var json = localStorage["results" + i];
		results = str2obj(json);

		table.insertRow(-1);

		table.rows[i + 1].insertCell(-1);
		table.rows[i + 1].cells[0].innerHTML = i;

		table.rows[i + 1].insertCell(-1);
		table.rows[i + 1].cells[1].innerHTML = results.gamecenter;

		table.rows[i + 1].insertCell(-1);
		table.rows[i + 1].cells[2].innerHTML = results.gamekind;

		table.rows[i + 1].insertCell(-1);
		table.rows[i + 1].cells[3].innerHTML =
			"<input type='button' value='入力' onclick='gotoInputPage(" + i + ")'>" +
			"<input type='button' value='エクスポート' onclick='gotoExportPage(" + i + ")'>";
	}
}

function gotoInputPage(index)
{
	localStorage["currentIndex"] = index;
	parent.document.getElementById("content_frame").src = 'input.html';
}

function gotoExportPage(index)
{
	localStorage["currentIndex"] = index;
	parent.document.getElementById("content_frame").src = 'export.html';
}
