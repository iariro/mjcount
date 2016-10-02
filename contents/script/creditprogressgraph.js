
/**
 * 休憩扱いする間隔（秒）。
 */
var breakTime = 60 * 4;

/**
 * 線幅 - 通常。
 */
var lineWidth1 = 3;

/**
 * 線幅 - 強調。
 */
var lineWidth2 = 8;

/**
 * グラフ全体横幅。
 */
var screenWidth = 310;
var screenHeight = 400;

/**
 * 左上原点座標。
 */
var originPosition = { x:10, y:10 };

function initCreditProgressGraphPage()
{
	drawCreditProgressGraph();
}

function gotoInputPage()
{
	parent.document.getElementById("content_frame").src = 'input.html';
}

/**
 * 指定のゲーム内容からクレジット遷移グラフXMLを構築する。
 * @param gamecenter ゲームセンター名
 * @param comment コメント
 * @param list 戦績リスト
 * @param creditGraph true=過剰クレジット表示する／false=しない
 */
function drawCreditProgressGraph()
{
	var i;
	var j;
	var index = localStorage["currentIndex"];
	var json = localStorage["results" + index];
	var results = str2obj(json);
	var count = parseInt(results.count);

	var lastlast = results.gameResults[count - 1];

	var totalsecond = Math.round(lastlast.time / 1000);

	var xscale;

	// 最大クレジットを決定。
	var maxCredit;
	var minCredit = 0;
	var credit = 0;

	for (j=0 ; j<results.count ; j++)
	{
		credit += parseInt(results.gameResults[j].out) + parseInt(results.gameResults[j].in);

		if (results.gameResults[j].result == "ボーナス")
		{
			credit -= parseInt(results.gameResults[j].bet);
		}

		if (maxCredit == undefined || maxCredit < credit)
		{
			maxCredit = credit;
		}

		if (minCredit == undefined || minCredit > credit)
		{
			minCredit = credit;
		}
	}

	maxCredit = Math.round((maxCredit + 4) / 5) * 5;
	minCredit = Math.round((minCredit - 4) / 5) * 5;

	var creditHeight = maxCredit - minCredit;

	if (creditHeight < 20)
	{
		// 20クレジット未満。

		creditHeight = 20;
	}
	else if (creditHeight == 20)
	{
		// 20クレジット。

		creditHeight = 25;
	}

	var sizeHeight = Math.round(screenHeight / creditHeight);

	if (totalsecond >= screenWidth)
	{
		// 時間数がグラフの幅を超える。

		xscale = totalsecond / screenWidth;
	}
	else
	{
		// 時間数がグラフの幅に収まる。

		xscale = 1;
	}

	if (totalsecond > screenWidth * xscale)
	{
		// 時間数がグラフの幅を超える。

		xscale++;
	}

	var memoriInterval;

	if (totalsecond < 3600 * 5)
	{
		// プレイ時間は５時間未満。

		memoriInterval = 60 * 5;
	}
	else
	{
		// プレイ時間は５時間以上。

		memoriInterval = 60 * 10;
	}

	// テキスト描画。
	/*
	DateTime starttime2 = result.starttime;
	TimeSpan lasttotaltime = new TimeSpan(lastlast.getProgress());
	DateTime endtime2 = starttime2.makeAdd(lasttotaltime);
	String endtime3 = endtime2.toString().substring(5);
	*/

	var title = results.gamecenter + results.gamekind;

	var datetime = new Date();
	datetime.setTime(results.startdatetime);

	drawText(
		originPosition.x,
		originPosition.y + sizeHeight * creditHeight + 30,
		"日時：" + DateGetStringJp(datetime),
		"black");

	drawText(
		originPosition.x,
		originPosition.y + sizeHeight * creditHeight + 50,
		"場所：" + results.gamecenter,
		"black");

	var gameKinds = "";

	gameKinds += results.gamekind;

	drawText(originPosition.x, originPosition.y + sizeHeight * creditHeight + 70, "機種：" + gameKinds, "black");

	// 枠描画。
	//	"fill",
	//	"#eeeeee");
	//	"stroke",
	//	"gray");
	fillRect(
		originPosition.x,
		originPosition.y,
		(totalsecond + memoriInterval) / xscale,
		sizeHeight * creditHeight,
		"#eeeeee");

	drawRect(
		originPosition.x,
		originPosition.y,
		(totalsecond + memoriInterval) / xscale,
		sizeHeight * creditHeight,
		"gray");

	// 横軸目盛り描画。
	for (i=0 ; i<totalsecond + memoriInterval ; i+=memoriInterval)
	{
		var length;

		if (i % 3600 == 0)
		{
			// １時間の目盛り。

			length = 12;
		}
		else
		{
			// 通常。

			length = 5;
		}

		//element.setAttribute("stroke", "black");
		drawLine(
			originPosition.x + (i / xscale),
			originPosition.y + sizeHeight * creditHeight,
			originPosition.x + (i / xscale),
			originPosition.y + sizeHeight * creditHeight + length,
			"black");
	}

	// 縦軸目盛り描画。
	for (i=5 ; i<creditHeight ; i+= 5)
	{
		//	"stroke",
		//	"black");
		//	"stroke-width",
		//	"0.5");

		if ((i + minCredit) % 10 == 5 || (i + minCredit) % 10 == -5)
		{
			// 5クレジット刻み。

			//element.setAttribute("stroke-dasharray", "3,3");
		}

		drawLine(
			originPosition.x - 5,
			originPosition.y + sizeHeight * (creditHeight - i),
			originPosition.x + ((totalsecond + memoriInterval) / xscale) + 5,
			originPosition.y + sizeHeight * (creditHeight - i),
			"black");
	}

	var step;

	if (creditHeight < 70)
	{
		// 最大70クレジット未満。

		step = 5;
	}
	else
	{
		// 最大70クレジット以上。

		step = 10;
	}

	var startY = 0;

	if (minCredit % 10 == 5 || minCredit % 10 == -5)
	{
		// ５から始まる。

		startY = 5;
	}

	for (i=startY ; i<=creditHeight ; i+= step)
	{
		//element.setAttribute("text-anchor", "end");
		drawText(
			originPosition.x - 8,
			originPosition.y + sizeHeight * (creditHeight - i) + 5,
			i + minCredit,
			"black");
	}

	// 折れ線文字列生成。
	for (i=0 ; i<1 ; i++)
	{
		var credit = 0;
		var offset = 0;
			//list[i].starttime.diff(list[0].starttime).getTotalSecond();

			/*
		if (list.length > 1)
		{
			// 複数ゲームの場合。

			drawText(
				originPosition.x + offset / xscale,
				originPosition.y + sizeHeight * (creditHeight - (i % 2) * 10) / 2,
				gameKind);
		}
		*/

		var points = new Array();
		points.push({
			x:originPosition.x + offset / xscale,
			y:originPosition.y + sizeHeight * (creditHeight + minCredit)});
		var onbreak = false;
		var previousSecond = offset;

		for (j=0 ; j<results.count + 1 ; j++)
		{
			if (j<results.count)
			{
				credit += parseInt(results.gameResults[j].out) + parseInt(results.gameResults[j].in);

				if (results.gameResults[j].result != "ボーナス")
				{
					if (results.gameResults[j].bet != undefined)
					{
						credit -= parseInt(results.gameResults[j].bet);
					}
					else
					{
						credit--;
					}
				}
			}

			if (j < results.count)
			{
				// 配列の範囲内。

				var second = offset + results.gameResults[j].time / 1000;

				points.push({
						x:originPosition.x + second / xscale,
						y:originPosition.y +
						sizeHeight * (creditHeight - credit + minCredit)});

				if (onbreak)
				{
					// 間が置かれた直後。

					// 終端。実線の折れ線描画。
					drawPolyline(points, 'black', lineWidth1);

					onbreak = false;

					points = new Array();
					points.push({
						x:originPosition.x + second / xscale,
						y:originPosition.y + sizeHeight * (creditHeight - credit + minCredit)});
				}
				else
				{
					// 間が置かれた直後ではない。

					var draw = false;

					if (j < parseInt(results.count) - 1)
					{
						// 終端ではない。

						var nextProgress = results.gameResults[j + 1].time;

						var nextSecond = parseInt(nextProgress) / 1000;

						if (nextSecond - second >= breakTime)
						{
							// 間が置かれる。

							draw = true;
							onbreak = true;
						}
					}
					else
					{
						// 終端。

						draw = true;
					}

					if (draw)
					{
						// 実線を描画するタイミングである。

						// 実線の折れ線描画。
						drawPolyline(points, 'black', lineWidth1);

						points = new Array();
						points.push({
							x:originPosition.x + second / xscale,
							y:originPosition.y + sizeHeight * (creditHeight - results.gameResults[j].credit + minCredit)});
					}

					var pcredit = j > 0 ? results.gameResults[j - 1].credit : 0;

					if (results.gameResults[j].inCreditMinusBet >= 1 && creditGraph)
					{
						// 過剰クレジット。

						// "stroke", "pink");
						// "stroke-width", lineWidth2));
						drawLine(
							originPosition.x + previousSecond / xscale,
							originPosition.y + sizeHeight * (creditHeight - pcredit + minCredit),
							originPosition.x + (previousSecond + ((second - previousSecond) * results.gameresults[j].inCreditRatio) / 100) / xscale,
							originPosition.y + sizeHeight * (creditHeight - (pcredit + results.gameresults[j].inCreditMinusBet) + minCredit),
							"pink");
					}
				}

				if (results.gameResults[j].result == "ボーナス")
				{
					// ボーナスである。

					// 実線描画。
					// "stroke", "blue");
					// "stroke-width", lineWidth2));
					drawLine(
						originPosition.x + previousSecond / xscale,
						originPosition.y + sizeHeight * (creditHeight - results.gameresults[j - 1].credit + minCredit),
						originPosition.x + second / xscale,
						originPosition.y + sizeHeight * (creditHeight - results.gameresults[j].credit + minCredit),
						"blue");
				}

				previousSecond = second;
			}
			/*
			else if (list.length > 1)
			{
				// 末尾。

				// ペイアウトを表す点線を描画。
				// "stroke", "black");
				// "stroke-dasharray", "8,3");
				// "stroke-width", lineWidth1));
				drawLine(
					originPosition.x + previousSecond / xscale,
					originPosition.y + sizeHeight * (creditHeight - results.gameresults[j - 1].credit + minCredit),
					originPosition.x + previousSecond / xscale,
					originPosition.y + sizeHeight * (creditHeight + minCredit),
					"black");
			}
			*/
		}
	}
}

function drawLine(x1, y1, x2, y2, color)
{
	var canvas = document.getElementById("graphcanvas");
	var context = canvas.getContext("2d");

	if (color != undefined)
	{
		context.strokeStyle = color;
	}

	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.closePath();
	context.stroke();
}

function fillRect(x1, y1, x2, y2, color)
{
	var canvas = document.getElementById("graphcanvas");
	var context = canvas.getContext("2d");

	if (color != undefined)
	{
		context.fillStyle = color;
	}

	context.fillRect(x1, y1, x2, y2);
}

function drawRect(x1, y1, x2, y2, color)
{
	var canvas = document.getElementById("graphcanvas");
	var context = canvas.getContext("2d");

	if (color != undefined)
	{
		context.strokeStyle = color;
	}

	context.strokeRect(x1, y1, x2, y2);
}

function drawText(x, y, text, color)
{
	var canvas = document.getElementById("graphcanvas");
	var context = canvas.getContext("2d");

	if (color != undefined)
	{
		context.strokeStyle = color;
	}

	context.strokeText(text, x, y);
}

function drawPolyline(points, color, lineWidth)
{
	var i;

	var canvas = document.getElementById("graphcanvas");
	var context = canvas.getContext("2d");

	/*
		element.setAttribute("points", points);
		element.setAttribute("stroke", "black");
		element.setAttribute(
			"stroke-width",
			Integer.toString(lineWidth1));
		element.setAttribute("stroke-dasharray", "8,3");
	*/

	if (color != undefined)
	{
		context.strokeStyle = color;
	}

	if (lineWidth != undefined)
	{
		context.lineWidth = lineWidth;
	}

	for (i=0 ; i<points.length - 1 ; i++)
	{
		drawLine(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, "black");
	}
}
