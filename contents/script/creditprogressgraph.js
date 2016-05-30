
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
var screenWidth = 800;

/**
 * 左上原点座標。
 */
var originPosition = { X:40, Y:15 };

/**
 * フォント名。
 */
var fontFamily = "MS-Mincho";

/**
 * 指定のゲーム内容からクレジット遷移グラフXMLを構築する。
 * @param gamecenter ゲームセンター名
 * @param comment コメント
 * @param list 戦績リスト
 * @param creditGraph true=過剰クレジット表示する／false=しない
 */
function drawCreditProgressGraph()
{
	var index = localStorage["currentIndex"];
	var json = localStorage["results" + index];
	var results = str2obj(json);
	var count = parseInt(results.count);

	var lastlast = results.gameResults[count - 1];

	var totalsecond = new DateTime(lastlast.time);

	var xscale;

	// 最大クレジットを決定。
	var maxCredit = GetCurrentCredit(results);
	var minCredit = 0;

	maxCredit = ((maxCredit + 4) / 5) * 5;
	minCredit = ((minCredit - 4) / 5) * 5;

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

	var Math.round(sizeHeight = 550 / creditHeight);

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

	drawText(
		originPosition.x,
		originPosition.y + sizeHeight * creditHeight + 30,
		"日時：" + results.starttime /* + " - " + endtime3) */;

	drawText(
		originPosition.x,
		originPosition.y + sizeHeight * creditHeight + 50,
		"場所：" + results.gamecenter);

	var gameKinds = "";

//////////////////////////////////////////////////////////////////////

	for (int i=0 ; i<list.length ; i++)
	{
		if (i > 0)
		{
			// ２個目以降。

			gameKinds += "／";
		}

		gameKinds += list[i].gameKind;
	}

	element = createElement("text");
	element.setAttribute(
		"x",
		String.valueOf(originPosition.x));
	element.setAttribute(
		"y",
		String.valueOf(originPosition.y + sizeHeight * creditHeight + 70));
	element.setAttribute("font-family", fontFamily);
	element.appendChild(createTextNode("機種：" + gameKinds));
	top.appendChild(element);

	if (comment != null && !comment.isEmpty())
	{
		// コメントあり。

		element = createElement("text");
		element.setAttribute(
			"x",
			String.valueOf(originPosition.x));
		element.setAttribute(
			"y",
			String.valueOf(originPosition.y + sizeHeight * creditHeight + 90));
		element.setAttribute("font-family", fontFamily);
		element.appendChild(createTextNode("コメント：" + comment));
		top.appendChild(element);
	}

	// 枠描画。
	element = createElement("rect");
	element.setAttribute(
		"x",
		String.valueOf(originPosition.x));
	element.setAttribute(
		"y",
		String.valueOf(originPosition.y));
	element.setAttribute(
		"width",
		Integer.toString((totalsecond + memoriInterval) / xscale));
	element.setAttribute(
		"height",
		Integer.toString(sizeHeight * creditHeight));
	element.setAttribute(
		"fill",
		"#eeeeee");
	element.setAttribute(
		"stroke",
		"gray");
	top.appendChild(element);

	// 横軸目盛り描画。
	for (int i=0 ; i<totalsecond + memoriInterval ; i+=memoriInterval)
	{
		int length;

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

		element = createElement("line");
		element.setAttribute(
			"x1",
			Integer.toString(originPosition.x + (i / xscale)));
		element.setAttribute(
			"y1",
			Integer.toString(originPosition.y + sizeHeight * creditHeight));
		element.setAttribute(
			"x2",
			Integer.toString(originPosition.x + (i / xscale)));
		element.setAttribute(
			"y2",
			Integer.toString
				(originPosition.y + sizeHeight * creditHeight + length));
		element.setAttribute("stroke", "black");
		top.appendChild(element);
	}

	// 縦軸目盛り描画。
	for (int i=5 ; i<creditHeight ; i+= 5)
	{
		element = createElement("line");
		element.setAttribute(
			"x1",
			Integer.toString(originPosition.x - 5));
		element.setAttribute(
			"y1",
			Integer.toString
				(originPosition.y + sizeHeight * (creditHeight - i)));
		element.setAttribute(
			"x2",
			Integer.toString(
				originPosition.x +
				((totalsecond + memoriInterval) / xscale) + 5));
		element.setAttribute(
			"y2",
			Integer.toString
				(originPosition.y + sizeHeight * (creditHeight - i)));
		element.setAttribute(
			"stroke",
			"black");
		element.setAttribute(
			"stroke-width",
			"0.5");

		if ((i + minCredit) % 10 == 5 || (i + minCredit) % 10 == -5)
		{
			// 5クレジット刻み。

			element.setAttribute("stroke-dasharray", "3,3");
		}

		top.appendChild(element);
	}

	int step;

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

	int startY = 0;

	if (minCredit % 10 == 5 || minCredit % 10 == -5)
	{
		// ５から始まる。

		startY = 5;
	}

	for (int i=startY ; i<=creditHeight ; i+= step)
	{
		element = createElement("text");
		element.setAttribute(
			"x",
			String.valueOf(originPosition.x - 8));
		element.setAttribute(
			"y",
			String.valueOf(
				originPosition.y +
				sizeHeight * (creditHeight - i) + 5));
		element.setAttribute("font-family", fontFamily);
		element.setAttribute("text-anchor", "end");
		element.appendChild
			(createTextNode(Integer.toString(i + minCredit)));
		top.appendChild(element);
	}

	// 折れ線文字列生成。
	for (int i=0 ; i<list.length ; i++)
	{
		int offset =
			list[i].starttime.diff(list[0].starttime).getTotalSecond();

		if (list.length > 1)
		{
			// 複数ゲームの場合。

			element = createElement("text");
			element.setAttribute(
				"x",
				String.valueOf(originPosition.x + offset / xscale));
			element.setAttribute(
				"y",
				String.valueOf(
					originPosition.y +
					sizeHeight * (creditHeight - (i % 2) * 10) / 2));
			element.setAttribute("font-family", fontFamily);
			element.appendChild(createTextNode(list[i].gameKind));
			top.appendChild(element);
		}

		String points =
			String.format(
				"%d %d",
				originPosition.x + offset / xscale,
				originPosition.y + sizeHeight * (creditHeight + minCredit));
		boolean onbreak = false;
		int previousSecond = offset;

		for (int j=0 ; j<list[i].size() + 1 ; j++)
		{
			if (j < list[i].size())
			{
				// 配列の範囲内。

				int second =
					offset +
					new TimeSpan(list[i].get(j).getProgress()).getTotalSecond();

				points += ", ";

				points +=
					String.format(
						"%d %d",
						originPosition.x + second / xscale,
						originPosition.y +
						sizeHeight * (creditHeight - list[i].get(j).getCredit() + minCredit));

				if (onbreak)
				{
					// 間が置かれた直後。

					// 終端。実線の折れ線描画。
					element = createElement("polyline");
					element.setAttribute("points", points);
					element.setAttribute("stroke", "black");
					element.setAttribute(
						"stroke-width",
						Integer.toString(lineWidth1));
					element.setAttribute("stroke-dasharray", "8,3");
					element.setAttribute("fill", "none");
					top.appendChild(element);

					onbreak = false;

					points =
						String.format(
							"%d %d",
							originPosition.x + second / xscale,
							originPosition.y +
							sizeHeight *
							(creditHeight - list[i].get(j).getCredit() + minCredit));
				}
				else
				{
					// 間が置かれた直後ではない。

					boolean draw = false;

					if (j < list[i].size() - 1)
					{
						// 終端ではない。

						String nextProgress = list[i].get(j + 1).getProgress();

						int nextSecond =
							new TimeSpan(nextProgress).getTotalSecond();

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
						element = createElement("polyline");
						element.setAttribute("points", points);
						element.setAttribute("stroke", "black");
						element.setAttribute(
							"stroke-width",
							Integer.toString(lineWidth1));
						element.setAttribute("fill", "none");
						top.appendChild(element);

						points =
							String.format(
								"%d %d",
								originPosition.x + second / xscale,
								originPosition.y +
								sizeHeight *
								(creditHeight - list[i].get(j).getCredit() + minCredit));
					}

					int pcredit = j > 0 ? list[i].get(j - 1).getCredit() : 0;

					if (list[i].get(j).getInCreditMinusBet() >= 1 &&
						creditGraph)
					{
						// 過剰クレジット。

						element = createElement("line");
						element.setAttribute(
							"x1",
							Integer.toString
								(originPosition.x + previousSecond / xscale));
						element.setAttribute(
							"y1",
							Integer.toString
								(originPosition.y +
								sizeHeight *
								(creditHeight - pcredit + minCredit)));
						element.setAttribute(
							"x2",
							Integer.toString
								(originPosition.x + (previousSecond + ((second - previousSecond) * list[i].get(j).getInCreditRatio()) / 100) / xscale));
						element.setAttribute(
							"y2",
							Integer.toString(
								originPosition.y +
								sizeHeight *
								(creditHeight - (pcredit + list[i].get(j).getInCreditMinusBet()) + minCredit)));
						element.setAttribute(
							"stroke",
							"pink");
						element.setAttribute(
							"stroke-width",
							Integer.toString(lineWidth2));
						top.appendChild(element);
					}
				}

				if (list[i].get(j).getResult().equals("ボーナス"))
				{
					// ボーナスである。

					// 実線描画。
					element = createElement("line");
					element.setAttribute(
						"x1",
						Integer.toString
							(originPosition.x + previousSecond / xscale));
					element.setAttribute(
						"y1",
						Integer.toString
							(originPosition.y +
							sizeHeight *
							(creditHeight - list[i].get(j - 1).getCredit() + minCredit)));
					element.setAttribute(
						"x2",
						Integer.toString
							(originPosition.x + second / xscale));
					element.setAttribute(
						"y2",
						Integer.toString(
							originPosition.y +
							sizeHeight *
							(creditHeight - list[i].get(j).getCredit() + minCredit)));
					element.setAttribute(
						"stroke",
						"blue");
					element.setAttribute(
						"stroke-width",
						Integer.toString(lineWidth2));
					top.appendChild(element);
				}

				previousSecond = second;
			}
			else if (list.length > 1)
			{
				// 末尾。

				// ペイアウトを表す点線を描画。
				element = createElement("line");
				element.setAttribute(
					"x1",
					Integer.toString
						(originPosition.x + previousSecond / xscale));
				element.setAttribute(
					"y1",
					Integer.toString(
						originPosition.y +
						sizeHeight *
						(creditHeight - list[i].get(j - 1).getCredit() + minCredit)));
				element.setAttribute(
					"x2",
					Integer.toString
						(originPosition.x + previousSecond / xscale));
				element.setAttribute(
					"y2",
					Integer.toString
						(originPosition.y + sizeHeight * (creditHeight + minCredit)));
				element.setAttribute(
					"stroke",
					"black");
				element.setAttribute(
					"stroke-dasharray",
					"8,3");
				element.setAttribute(
					"stroke-width",
					Integer.toString(lineWidth1));
				top.appendChild(element);
			}
		}
	}
}
