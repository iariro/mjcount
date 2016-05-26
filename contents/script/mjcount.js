
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
	// “ú•t/ŽžŠÔ‚ðŽæ“¾
	var year = date_obj.getFullYear();
	var month = date_obj.getMonth() + 1;
	var date = date_obj.getDate();
	var hours = date_obj.getHours();
	var minutes = date_obj.getMinutes();
	var seconds = date_obj.getSeconds();

	// •¶Žš—ñ‚Æ‚µ‚Ä˜AŒ‹
	return year  + "/" +
		((month < 10) ? "0" : "") + month + "/" +
		((date	< 10) ? "0" : "") + date + " " +
		((hours   < 10) ? "0" : "") + hours   + ":" +
		((minutes < 10) ? "0" : "") + minutes + ":" +
		((seconds < 10) ? "0" : "") + seconds;
}
