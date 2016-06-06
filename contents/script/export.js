
function initExportPage()
{
	var index = localStorage["currentIndex"];
	var json = localStorage["results" + index];

	var results = str2obj(json);

	var xmlDocument = document.implementation.createDocument("","",null);
	var xmlDecl = xmlDocument.createProcessingInstruction("xml","version='1.0' encoding='UTF-8'");
	xmlDocument.appendChild(xmlDecl);

	var rootNode = xmlDocument.createElement("MjCount");
	xmlDocument.appendChild(rootNode);
	var gamesNode = xmlDocument.createElement("games");
	rootNode.appendChild(gamesNode);

	var attribute = xmlDocument.createAttribute("gc");
	attribute.nodeValue = results['gamecenter'];
	gamesNode.setAttributeNode(attribute);

	var attribute = xmlDocument.createAttribute("gk");
	attribute.nodeValue = results['gamekind'];
	gamesNode.setAttributeNode(attribute);

	var datetime = new Date();
	datetime.setTime(results['startdatetime']);
	var attribute = xmlDocument.createAttribute("st");
	attribute.nodeValue = DateGetStringJp(datetime);
	gamesNode.setAttributeNode(attribute);

	for (var key in results['gameResults'])
	{
		var playNode = xmlDocument.createElement("g");
		gamesNode.appendChild(playNode);

		var attribute = xmlDocument.createAttribute("result");
		attribute.nodeValue = results['gameResults'][key].result;
		playNode.setAttributeNode(attribute);

		var attribute = xmlDocument.createAttribute("dt");
		var datetime = new Date();
		var diff = /*parseInt(results.startdatetime) +*/ parseInt(results['gameResults'][key].time);
		var adjust = datetime.getTimezoneOffset() * 60 * 1000;
		var timespan = new Date(diff + adjust);
		attribute.nodeValue = timespan.toTimeString().substr(0, 8);
		playNode.setAttributeNode(attribute);

		var attribute = xmlDocument.createAttribute("in");
		attribute.nodeValue = results['gameResults'][key].in;
		playNode.setAttributeNode(attribute);

		var attribute = xmlDocument.createAttribute("out");
		attribute.nodeValue = results['gameResults'][key].out;
		playNode.setAttributeNode(attribute);
	}

	var xml = (new XMLSerializer()).serializeToString(xmlDocument.documentElement);

	var results2 = {};
	results2['gameResults'] = new Array();

	json = JSON.stringify(results2);

	document.getElementById("exportarea").innerHTML = xml;
}

function copyToClipboard()
{
	var obj = document.form1.exportarea.createTextRange();
	obj.execCommand("Copy");
	alert('done');
}

function gotoInputPage()
{
	parent.document.getElementById("content_frame").src = 'input.html';
}
