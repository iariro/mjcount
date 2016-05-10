
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
