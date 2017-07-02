
function initStatisticsPage()
{
	var stat = GetGameStatistics();

	document.getElementById("startTime").innerHTML = stat.startTime;
	document.getElementById("playTime").innerHTML = stat.playTime;
	document.getElementById("gameCenter").innerHTML = stat.gameCenter;
	document.getElementById("gameKind").innerHTML = stat.gameKind;
	document.getElementById("gameCount").innerHTML = stat.gameCount;
	document.getElementById("maxAgarinashiCount").innerHTML = stat.maxAgarinashiCount;
	document.getElementById("inCredit").innerHTML = stat.inCredit;
	document.getElementById("outCredit").innerHTML = stat.outCredit;
	document.getElementById("maxCredit").innerHTML = stat.maxCredit;
	document.getElementById("AgariRatio").innerHTML = stat.AgariRatio;
	document.getElementById("TenpaiRatio").innerHTML = stat.TenpaiRatio;
	document.getElementById("LastChance").innerHTML = stat.LastChance;
	document.getElementById("OutRatio").innerHTML = stat.OutRatio;
	document.getElementById("HeikinKakutokuCredit").innerHTML = stat.HeikinKakutokuCredit;
}

function gotoInputPage()
{
	parent.document.getElementById("content_frame").src = 'input.html';
}

/// <summary>
/// ゲーム情報集計を行う。
/// </summary>
/// <returns>ゲーム情報集計</returns>
function GetGameStatistics()
{
	var index = localStorage["currentIndex"];
	var json = localStorage["results" + index];
	var results = str2obj(json);
	var count = parseInt(results.count);

	var gameCount = 0;
	var credit = 0;
	var maxCredit = 0;
	var agariCount = 0;
	var tenpaiCount = 0;
	var agarinashiCount = 0;
	var maxAgarinashiCount = 0;
	var inCreditSum = 0;
	var outCreditSum = 0;
	var lastChanceCount = 0;
	var lastChanceAgariCount = 0;

	for (i=0 ; i<count ; i++)
	{
		var result = results['gameResults'][i].result;

		var inCredit = parseInt(results['gameResults'][i].in);
		var outCredit = parseInt(results['gameResults'][i].out);
		var bet = 1;

		inCreditSum += inCredit;
		outCreditSum += outCredit;

		var betAttribute = results['gameResults'][i].bet;

		if (betAttribute != undefined)
		{
			// bet属性あり。

			bet = parseInt(betAttribute);
		}

		if (result == 'ボーナス')
		{
			// ボーナス。

			credit += outCredit + inCredit;
		}
		else
		{
			// ボーナス以外。

			gameCount++;
			credit += outCredit + inCredit - bet;

			if (result == 'ツモ和' || result == 'ロン和' || result == 'ラス和')
			{
				// 和がり。

				agariCount++;
				agarinashiCount = 0;
			}
			else
			{
				// 和がっていない。

				agarinashiCount++;
			}

			if (result == 'ツモ和' ||
				result == 'ロン和' ||
				result == 'ラス和' ||
				result == '聴ツモ' ||
				result == '聴ロン' ||
				result == '聴荒牌')
			{
				// 聴牌した。

				tenpaiCount++;
			}

			if (result == 'ラス和' || result == '聴荒牌')
			{
				// ラストチャンスに挑んだ。

				lastChanceCount++;
			}

			if (result == 'ラス和')
			{
				// ラストチャンスで和がった。

				lastChanceAgariCount++;
			}
		}

		if (credit > maxCredit)
		{
			// 現在の最大クレジットを越えた。

			maxCredit = credit;
		}

		if (agarinashiCount > maxAgarinashiCount)
		{
			// 連続和がりなし最高記録。

			maxAgarinashiCount = agarinashiCount;
		}
	}

	var datetime = new Date();
	datetime.setTime(results.startdatetime);

	return {
			'gameCenter' : results.gamecenter,
			'gameKind' : results.gamekind,
			'startTime' : DateGetStringJp(datetime),
			'playTime' : GetPlayTime(results),
			'gameCount' : gameCount,
			'inCredit' : inCreditSum,
			'outCredit' : outCreditSum,
			'lastCredit' : credit,
			'maxCredit' : maxCredit,
			'agariCount' : agariCount,
			'noAgariCount' : gameCount - agariCount,
			'maxAgarinashiCount' : maxAgarinashiCount,
			'tenpaiCount' : tenpaiCount,
			'nootenCount' : gameCount - tenpaiCount,
			'lastChanceCount' : lastChanceCount,
			'lastChanceAgariCount' : lastChanceAgariCount,
			'AgariRatio' : AgariRatio(agariCount, gameCount),
			'TenpaiRatio' : TenpaiRatio(tenpaiCount, gameCount - tenpaiCount),
			'LastChance' : LastChance(lastChanceAgariCount, lastChanceCount),
			'OutRatio' : OutRatio(gameCount, credit, inCreditSum),
			'HeikinKakutokuCredit' : HeikinKakutokuCredit(agariCount, outCreditSum)
		};
}

/// <summary>
/// ゲーム開始日時
/// </summary>
function StartTime()
{
	return startTime.Substring(5, 11);
}

/// <summary>
/// プレイ時間取得。
/// </summary>
/// <returns>プレイ時間</returns>
function GetPlayTime(results)
{
	if (results.count > 0)
	{
		var datetime = new Date();
		var adjust = datetime.getTimezoneOffset() * 60 * 1000;
		var timespan = new Date(parseInt(results['gameResults'][results.count - 1].time) + adjust);
		return timespan.toTimeString().substr(0, 8);
	}
	else
	{
		return '-';
	}
}

/// <summary>
/// 和了率文字列を取得。
/// </summary>
function AgariRatio(agariCount, gameCount)
{
	if (gameCount > 0)
	{
		var ratio = (agariCount * 10000 / gameCount);

			//"{0:f2}%={1}/{2}",
		return (Math.round(ratio) / 100) + "%=" + agariCount + "/" + gameCount;
	}
	else
	{
		return '-';
	}
}

/// <summary>
/// 聴牌率文字列を取得。
/// </summary>
function TenpaiRatio(tenpaiCount, nootenCount)
{
	if (tenpaiCount + nootenCount > 0)
	{
		var ratio = (tenpaiCount * 10000 / (tenpaiCount + nootenCount));

			//"{0:f2}%={1}/{2}",
		return (Math.round(ratio) / 100) + "%=" + tenpaiCount + "/" + (tenpaiCount + nootenCount);
	}
	else
	{
		return '-';
	}
}

/// <summary>
/// ラストチャンス文字列を取得。
/// </summary>
function LastChance(lastChanceAgariCount, lastChanceCount)
{
	if (lastChanceCount > 0)
	{
		var ratio = (lastChanceAgariCount * 10000 / lastChanceCount);

				//"{0:f2}%={1}/{2}",
		return (Math.round(ratio) / 100) + "%=" + lastChanceAgariCount + "/" + lastChanceCount;
	}
	else
	{
		return '-';
	}
}

/// <summary>
/// 出率文字列を取得。
/// </summary>
function OutRatio(gameCount, lastCredit, inCredit)
{
	var deritsu1 = "-";

	if (inCredit > 0)
	{
		// クレジット投入有り。

				//"{0:f0}%",
		deritsu1 = ((gameCount + lastCredit) * 10000 / inCredit);
		deritsu1 = (Math.round(deritsu1) / 100) + "%";
	}

			//"({0}+{1})/{2}",
	var deritsu2 = "(" + gameCount + "+" + lastCredit + ")/" + inCredit;

	return deritsu1 + "=" + deritsu2;
}

/// <summary>
/// 平均獲得クレジット数文字列を取得。
/// </summary>
function HeikinKakutokuCredit(agariCount, outCredit)
{
	var heikinKakutokuCredit1 = "-";

	if (agariCount > 0)
	{
		// 和了あり。

		heikinKakutokuCredit1 = Math.floor(outCredit * 100 / agariCount) / 100;
			//string.Format("{0:f2}",
	}

			//"{0}={1}/{2}",
	return heikinKakutokuCredit1 + "=" +
			outCredit + "/" +
			agariCount;
}
