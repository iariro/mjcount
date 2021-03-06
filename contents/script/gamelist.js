
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
		'新小岩レインボー'
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
	setSelectionControl('gamecenter', gameCenterList);
	setSelectionControl('gamekind', gameKindList);
	displayGamelist();
}

function setSelectionControl(controlName, values)
{
	var i;
	var selection = document.getElementById(controlName);

	for (i=0 ; i<values.length ; i++)
	{
		var option = document.createElement('option');

		option.setAttribute('value', values[i]);
		option.innerHTML = values[i];

		selection.appendChild(option);
	}
}

function displayGamelist()
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

	var index = 0;

	for (i=0 ; i<gamecount ; i++)
	{
		var json = localStorage["results" + i];

		if (json == undefined)
		{
			continue;
		}

		results = str2obj(json);

		var datetime = new Date();
		datetime.setTime(results.startdatetime);

		table.insertRow(1);

		table.rows[1].insertCell(-1);
		table.rows[1].cells[0].innerHTML =
			"<input type='button' value='入力' onclick='gotoInputPage(" + i + ")'>";

		table.rows[1].insertCell(-1);
		table.rows[1].cells[1].innerHTML = DateGetStringJp(datetime).substr(2, 8);

		table.rows[1].insertCell(-1);
		table.rows[1].cells[2].innerHTML = results != undefined ? results.gamecenter : '-';

		table.rows[1].insertCell(-1);
		table.rows[1].cells[3].innerHTML = results != undefined ? results.gamekind : '-';

		index++;
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
	results['gameResults'] = {};
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
	displayGamelist();
}

function gotoInputPage(index)
{
	localStorage["currentIndex"] = index;
	parent.document.getElementById("content_frame").src = 'input.html';
}
