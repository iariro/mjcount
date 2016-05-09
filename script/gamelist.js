
var gameCenterList =
	[
		'綾瀬銀河',
		'稲毛ヤングボウル',
		'王子サンパレス',
		'錦糸町NEWウイング',
		'高円寺ゲームスタジオCUBE',
		'自宅',
		'十条モナコ',
		'小平ピア２１',
		'上野ダンディ',
		'上野北欧',
		'新橋ニュー新橋ビル',
		'赤羽ブロックルーム',
		'千葉ノーブル',
		'船橋グランドサウナ',
		'巣鴨サンフラワー',
		'大久保キョンタゴン',
		'大森みづほ',
		'大塚ハイテクランドアカデミー',
		'池袋プラザ',
		'竹ノ塚アドベンチャー',
		'天満オリンピア',
		'東武練馬プレイハウス',
		'梅ヶ丘アリア',
		'柏柏泉',
		'板橋ディンドン',
		'北千住オモロン'
	];

var gameKindList =
	[
		'CAFE PARADISE',
		'Double Bet麻雀',
		'Return of SEL雀II',
		'かぐや姫 其の二',
		'かぐや姫',
		'ジャンピューター96',
		'ジャンピューターDX',
		'ジャンピューターSP',
		'雀神PLUS',
		'麻雀 Cafe Break みこすり半',
		'麻雀 SUPER大中華圏',
		'麻雀 ゴージャスナイト',
		'麻雀 スウィートアカデミー',
		'麻雀 スウィートアカデミーSP',
		'麻雀 宇宙の神秘',
		'麻雀 黄金の牌',
		'麻雀 沖縄娘',
		'麻雀 海一発',
		'麻雀 黒龍',
		'麻雀 雀帝',
		'麻雀 世界の神秘',
		'麻雀 聖龍伝説',
		'麻雀 大三元',
		'麻雀 大車輪',
		'麻雀 大中華圏',
		'麻雀 大東洋圏',
		'麻雀 大明神DELUXE',
		'麻雀 大立直',
		'麻雀 天神牌',
		'麻雀 天鳳',
		'麻雀 東洋の神秘',
		'麻雀 東洋の神秘PART2',
		'麻雀 雷神牌DX',
		'麻雀 立直II',
		'麻雀 立直一発',
		'麻雀 連荘王'
	];

function initGameListPage()
{
	listGameListPage();

	var i;
	var gameCenterSelect = document.getElementById('gamecenter');

	for (i=0 ; i<gameCenterList.length ; i++)
	{
	    var option = document.createElement('option');

	    option.setAttribute('value', gameCenterList[i]);
	    option.innerHTML = gameCenterList[i];

	    gameCenterSelect.appendChild(option);
	}

	var gameKindSelect = document.getElementById('gamekind');

	for (i=0 ; i<gameKindList.length ; i++)
	{
	    var option = document.createElement('option');

	    option.setAttribute('value', gameKindList[i]);
	    option.innerHTML = gameKindList[i];

	    gameKindSelect.appendChild(option);
	}
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
	results['startdatetime'] = new Date().getTime();

	var json = obj2str(results);
	localStorage["results" + gamecount] = json;

	initGameListPage();
}

function resetGames()
{
	var i;
	var count = parseInt(localStorage["gamecount"]);

	for (i=0 ; i<count ; i++)
	{
		delete localStorage["results" + i];
	}

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
		table.rows[i + 1].cells[1].innerHTML = results != undefined ? results.gamecenter : '-';

		table.rows[i + 1].insertCell(-1);
		table.rows[i + 1].cells[2].innerHTML = results != undefined ? results.gamekind : '-';

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
