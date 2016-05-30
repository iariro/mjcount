
function init()
{
	document.getElementById("content_frame").src = 'gamelist.html';
}

function obj2str(obj)
{
	if (typeof(obj)=="object")
	{
		var out = '';

		for ( var key in obj )
		{
			if ( out != '' ) out += ',';
			out += "'"+key+"'"+":"+obj2str(obj[key]);
		}

		return '{' + out + '}';
	}
	else if (typeof(obj) == "string")
	{
		return "'"+ obj.replace(/\n/ig,"\\n").replace(/\r/ig,"\\r" ).replace(/'/g, "\\\'").replace(/"/g, "\\\"") +"'";
	}
	else
	{
		return "'"+ obj +"'";
	}
}

function str2obj(str)
{
	eval("var obj = " + str);
	return obj;
}

function DateGetStringJp(date_obj)
{
	// 日付/時間を取得
	var year = date_obj.getFullYear();
	var month = date_obj.getMonth() + 1;
	var date = date_obj.getDate();
	var hours = date_obj.getHours();
	var minutes = date_obj.getMinutes();
	var seconds = date_obj.getSeconds();

	// 文字列として連結
	return year  + "/" +
		((month < 10) ? "0" : "") + month + "/" +
		((date	< 10) ? "0" : "") + date + " " +
		((hours   < 10) ? "0" : "") + hours   + ":" +
		((minutes < 10) ? "0" : "") + minutes + ":" +
		((seconds < 10) ? "0" : "") + seconds;
}

/// <summary>
/// 現状のクレジット数取得。
/// </summary>
/// <returns>クレジット数</returns>
function GetCurrentCredit(results)
{
	var i;
	var credit = 0;

	for (i=0 ; i<results['gameResults'].count ; i++)
	{
		var incredit = parseInt(results['gameResults'][i].in);
		var outcredit = parseInt(results['gameResults'][i].out);
		var bet;

		if (results['gameResults'][i].bet != undefined)
		{
			// ベット指定あり。

			bet = parseInt(results['gameResults'][i].bet);
		}
		else
		{
			// ベット指定なし。

			bet = 1;
		}

		credit += incredit + outcredit;

		if (results['gameResults'][i].result != 'ボーナス')
		{
			// ボーナスではない。

			credit -= bet;
		}
	}

	return credit;
}
