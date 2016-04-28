
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

	printStat(results);
}

function gotoGameListPage()
{
	parent.document.getElementById("content_frame").src = 'gamelist.html';
}

function printStat(results)
{
	var statistics = GetGameDigestStatistics(results);

	document.getElementById("label1").innerHTML =
		"和率=" + AgariRatio(statistics) + " " +
		"聴率=" + TenpaiRatio(statistics) + " " +
		statistics.gameCount;

	var i;

	for (i=0 ; i<10 ; i++)
	{
		document.getElementById("count" + i).innerHTML = GetResultCount(results, resultType[i]);
	}
}

function addResult(result)
{
	var index = localStorage["currentIndex"];
	var json = localStorage["results" + index];
	var results = str2obj(json);
	var count = results.count;

	var datetime = new Date();

	results[count] =
		{
			'count': count,
			'result': resultType[result],
			'datetime': (datetime.getYear() + 1900) + "/" + (datetime.getMonth() + 1) + "/" + datetime.getDate() + " " + datetime.getHours() + ":" + datetime.getMinutes() + ":" + datetime.getSeconds(),
			'in': document.write.incredit.value,
			'out': document.write.outcredit.value
		};

	results['count'] = parseInt(count) + 1;

	var json = obj2str(results);

	count++;

	localStorage["results" + index] = json;

	printStat(results);
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
