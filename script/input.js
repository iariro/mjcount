
var resultType =
	[
		'ツモ和',
		'ロン和',
		'ラス和',
		'聴ツモ',
		'聴ロン',
		'不ツモ',
		'不ロン',
		'聴荒牌',
		'不荒牌',
		'ボーナス'
	];

function initInputPage()
{
	var index = localStorage["currentIndex"];
	var json = localStorage["results" + index];
	var results = str2obj(json);
	var currentCredit = GetCurrentCredit(results);
	localStorage["currentCredit" + index] = currentCredit;

	printStat(results, currentCredit);
}

function gotoGameListPage()
{
	parent.document.getElementById("content_frame").src = 'gamelist.html';
}

function printStat(results, currentCredit)
{
	var statistics = GetGameDigestStatistics(results);

	document.getElementById("label1").innerHTML =
		"和率=" + AgariRatio(statistics) + " " +
		"聴率=" + TenpaiRatio(statistics) + " " +
		statistics.gameCount + "ゲーム";

	var i;

	for (i=0 ; i<10 ; i++)
	{
		document.getElementById("count" + i).innerHTML = GetResultCount(results, resultType[i]);
	}

	document.getElementById("label2").innerHTML = currentCredit + "credit";
}

function addResult(result)
{
	var index = localStorage["currentIndex"];
	var json = localStorage["results" + index];
	var results = str2obj(json);
	var count = results.count;

	var datetime = new Date();
	var diff = datetime.getTime() - parseInt(results.startdatetime);
	var adjust = datetime.getTimezoneOffset() * 60 * 1000;
	var timespan = new Date(diff + adjust);

	results[count] =
		{
			'count': count,
			'result': resultType[result],
			'time': timespan.toTimeString().substr(0, 8),
			'in': document.write.incredit.value,
			'out': document.write.outcredit.value
		};

	results['count'] = parseInt(count) + 1;

	var json = obj2str(results);

	count++;

	localStorage["results" + index] = json;

	var currentCredit = parseInt(localStorage["currentCredit" + index]);
	currentCredit += parseInt(document.write.incredit.value) + parseInt(document.write.outcredit.value);

	if (resultType[result] != 'ボーナス')
	{
		// ボーナス以外。

		currentCredit -= parseInt(document.write.betcredit.value);
	}

	if (currentCredit > 0)
	{
		// まだクレジットはある。

		document.write.incredit.value = '0';
	}

	document.write.outcredit.value = '0';

	if (resultType[result] == 'ツモ和' ||
		resultType[result] == 'ラス和' ||
		resultType[result] == 'ロン和' ||
		resultType[result] == 'ボーナス')
	{
		// 和がり。

		if (currentCredit > 0)
		{
			// クレジットは１はある。

			document.write.incredit.value = '0';
		}
	}

	localStorage["currentCredit" + index] = currentCredit;

	printStat(results, currentCredit);
}

function in_up()
{
	document.write.incredit.value = parseInt(document.write.incredit.value) + 1;
}

function in_down()
{
	document.write.incredit.value = parseInt(document.write.incredit.value) - 1;
}

function out_up()
{
	document.write.outcredit.value = parseInt(document.write.outcredit.value) + 1;
}

function out_down()
{
	document.write.outcredit.value = parseInt(document.write.outcredit.value) - 1;
}

function bet_up()
{
	document.write.betcredit.value = parseInt(document.write.betcredit.value) + 1;
}

function bet_down()
{
	document.write.betcredit.value = parseInt(document.write.betcredit.value) - 1;
}

function GetResultCount(results, result)
{
	var count = 0;

	for (var i=0 ; ; i++)
	{
		if (results[i] == undefined)
		{
			break;
		}

		var result2 = results[i].result;

		if (result2 == result)
		{
			count++;
		}
	}

	return count;
}

function GetGameDigestStatistics(results)
{
	var agariCount = 0;
	var tenpaiCount = 0;
	var gameCount = 0;

	for (var i=0 ; ; i++)
	{
		if (results[i] == undefined)
		{
			break;
		}

		var result = results[i].result;

		if (result != 'ボーナス')
		{
			// ボーナス以外＝１ゲーム。

			gameCount++;

			if (result == 'ツモ和' ||
				result == 'ロン和' ||
				result == 'ラス和')
			{
				// 和了。

				agariCount++;
			}

			if (result == 'ツモ和' ||
				result == 'ロン和' ||
				result == 'ラス和' ||
				result == '聴ツモ' ||
				result == '聴ロン' ||
				result == '聴荒牌')
			{
				// 聴牌。

				tenpaiCount++;
			}
		}
	}

	return {
			'gameCount' : gameCount,
			'agariCount' : agariCount,
			'noAgariCount' : gameCount - agariCount,
			'tenpaiCount' : tenpaiCount,
			'nootenCount' : gameCount - tenpaiCount
		};
}

/// <summary>
/// 和了率を取得。
/// </summary>
function AgariRatio(statistics)
{
	if ((statistics.agariCount + statistics.noAgariCount) > 0)
	{
		// １ゲームでもしている。

		var ratio =
			statistics.agariCount / (statistics.agariCount + statistics.noAgariCount);

		return (ratio * 100).toFixed(2) + "%";
	}
	else
	{
		// １ゲームでもしてない。

		return "---%";
	}
}

/// <summary>
/// 聴牌率を取得。
/// </summary>
function TenpaiRatio(statistics)
{
	if ((statistics.tenpaiCount + statistics.nootenCount) > 0)
	{
		// １ゲームでもしている。

		var ratio =
			statistics.tenpaiCount / (statistics.tenpaiCount + statistics.nootenCount);

		return (ratio * 100).toFixed(2) + "%";
	}
	else
	{
		// １ゲームでもしてない。

		return "---%";
	}
}

/// <summary>
/// 現状のクレジット数取得。
/// </summary>
/// <returns>クレジット数</returns>
function GetCurrentCredit(results)
{
	var i;
	var credit = 0;

	for (i=0 ; i<results.count ; i++)
	{
		var incredit = parseInt(results[i].in);
		var outcredit = parseInt(results[i].out);
		var bet;

		if (results[i].bet != undefined)
		{
			// ベット指定あり。

			bet = parseInt(results[i].bet);
		}
		else
		{
			// ベット指定なし。

			bet = 1;
		}

		credit += incredit + outcredit;

		if (results[i].result != 'ボーナス')
		{
			// ボーナスではない。

			credit -= bet;
		}
	}

	return credit;
}
