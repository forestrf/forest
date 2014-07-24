/*
Consult pattern:

var consult = {
	'action'    : 'get',
	'widget'    : widgetID | -1,
	'variables' : 'variable1'
}

var consult = {
	'action'    : 'get',
	'widget'    : widgetID | -1,
	'variables' : ['variable1', ...]
}

var consult = {
	'action'    : 'set',
	'widget'    : widgetID | -1,
	'variables' : {'variable1':'value1', ...}
}
*/

// 0 = get
// 1 = set
// 2 = delete
var API_F = (function(){
	var max_wait = 100; //ms
	var timeouts = [];
	var callbacks = [];
	var execute_modes = [];
	var requests = [];
	
	function widget_add_secret(widgetID, secret){
		return widgetID + '-' + secret;
	}
	
	var precall = function(mode, widgetID, secret, key, value, callback){
		if(callback === undefined){
			callback = function(){};
		}
		if(secret){
			widgetID = widget_add_secret(widgetID, secret);
		}
		
		if(requests[mode] === undefined){
			requests[mode] = {};
			execute_modes[mode] = function(){execute(mode, callbacks[mode]);}
			callbacks[mode] = [];
		}
		
		if(requests[mode][widgetID] === undefined){
			requests[mode][widgetID] = {};
		}
		
		requests[mode][widgetID][key] = value;
		
		callbacks[mode].push({"callback":callback,"widgetID":widgetID,"key":key});
		clearTimeout(timeouts[mode]);
		timeouts[mode] = setTimeout(execute_modes[mode], max_wait);
	}
	
	// Execute and clean cache
	var execute = function(mode, cb){
		var req = new XMLHttpRequest();
		req.open('POST', 'api.php', true);
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.onreadystatechange = function(aEvt){
			if(req.readyState == 4){
				if(req.status == 200){
					//console.log(req.responseText);
					var response = JSON.parse(req.responseText);
					
					// Go over the cb and generate a response
					if(response['response']==='OK'){
						for(var i in cb){
							
							var widgetID = cb[i]['widgetID'];
							var key      = cb[i]['key'];
							
							// If received
							if(typeof response['content'][widgetID] !== 'undefined'){
								// If key requested
								if(typeof response['content'][widgetID][key] !== 'undefined'){
									cb[i]['callback'](JSON.parse(response['content'][widgetID][key]));
									continue;
								}
							}
							cb[i]['callback'](null);
						}
						return;
					}
				}
				for(var i in cb){
					cb[i]['callback'](null);
				}
			}
		};
		var data = 'action='+['get', 'set', 'del'][mode]+'&data='+encodeURIComponent(JSON.stringify(requests[mode]));
		req.send(data);
	
		requests[mode] = {};
		callbacks[mode] = [];
	}
	
	
	
	
	// Return an url to get a file of the widget
	var getUrl = function(widgetID, filename){
		return 'widgetfile.php?widgetID='+widgetID+'&api=1&name='+escape(filename);
	}
	
	
	
	
	
	
	function Document(){
		return {
			"createElement": function(tagName){
				var elem = document.createElement(tagName);
				div_base(elem);
				return elem;
			}
		};
	}
	
	function div_base(div){
	
		function cRound(number, roundedTo){
			return roundedTo === undefined ? number : (- -number).toFixed(roundedTo);
		}
	
		div["div"] = div;
		div["hide"] = function(){
			div.style.display = 'none';
			return div;
		};
		div["unHide"] = function(){
			div.style.display = '';
			return div;
		};
			
		div["setPosition"] = function(left, top){
			div.style.left = left + "%";
			div.style.top = top + "%";
			return div;
		};
		div.setPosition["left"] = function(left){div.style.left = left + "%"; return div;};
		div.setPosition["top"] = function(top){div.style.top = top + "%"; return div;};
		
		div["getPosition"] = function(roundedTo){
			return {
				"left": cRound(div.style.left.split("%")[0], roundedTo),
				"top":  cRound(div.style.top.split("%")[0], roundedTo)
			};
		};
		div.getPosition["left"] = function(roundedTo){return cRound(div.style.left.split("%")[0], roundedTo)};
		div.getPosition["top"] = function(roundedTo){return cRound(div.style.top.split("%")[0], roundedTo)};
		
		div["setSize"] = function(width, height){
			div.style.width = width + "%";
			div.style.height = height + "%";
			return div;
		};
		div.setSize["width"] = function(width){div.style.width = width + "%"; return div;};
		div.setSize["height"] = function(height){div.style.height = height + "%"; return div;};
		
		div["getSize"] = function(roundedTo){
			return {
				"width":  cRound(div.style.width.split("%")[0], roundedTo),
				"height": cRound(div.style.height.split("%")[0], roundedTo)
			};
		};
		div.getSize["width"] = function(roundedTo){return cRound(div.style.width.split("%")[0], roundedTo)};
		div.getSize["height"] = function(roundedTo){return cRound(div.style.height.split("%")[0], roundedTo)};
		
		div["setPositionSize"] = function(left, top, width, height){
			return div.setPosition(left, top).setSize(width, height);
		};
		div.setPositionSize["left"]   = div.setPosition["left"];
		div.setPositionSize["top"]    = div.setPosition["top"];
		div.setPositionSize["width"]  = div.setSize["width"];
		div.setPositionSize["height"] = div.setSize["height"];
		
		div["getPositionSize"] = function(roundedTo){
			var p = div.getPosition(roundedTo);
			var s = div.getSize(roundedTo);
			return {
				"left":   p.left,     
				"top":    p.top,
				"width":  s.width,
				"height": s.height
			}
		};
		div.setPositionSize["left"]   = div.setPosition["left"];
		div.setPositionSize["top"]    = div.setPosition["top"];
		div.setPositionSize["width"]  = div.setSize["width"];
		div.setPositionSize["height"] = div.setSize["height"];
		
		div["addClass"] = function(className){
			div.className += " "+className;
			return div;
		};
		div["removeClass"] = function(className){
			div.className = div.className.split(className).join("").trim();
			return div;
		};
		div["setPriority"] = function(zIndex){
			div.style.zIndex = zIndex;
			return div;
		};
		div["getPriority"] = function(zIndex){
			return div.style.zIndex;
		}
	}
	
	
	
	
	
	
	
	
	
	
	function Storage(widgetID, secret){
		return {
			"localStorage": {
				/*"set"(key, value, callback) -> Storage.localStorage
				"get"(key, callback) -> value
				"delete"(key, callback) -> Storage.localStorage
				"deleteAll"(callback) -> Storage.localStorage
				"exists"(key, callback) -> bool*/
			},
			"remoteStorage": {
				"set":function(key, value, callback){
					API_F.call(1, widgetID, secret, key, value, callback);
					return this; //API.Storage.remoteStorage;
				},
				"get":function(key, callback){
					API_F.call(0, widgetID, secret, key, null, callback);
					return this; //API.Storage.remoteStorage;
				}/*,
				"delete"(key, callback) -> Storage.remoteStorage
				"deleteAll"(callback) -> Storage.remoteStorage
				"exists"(key, callback) -> bool*/
			},
			"sharedStorage": {
				"set":function(key, value, callback){
					API_F.call(1, -1, null, key, value, callback);
					return this; //API.Storage.sharedStorage;
				},
				"get":function(key, callback){
					API_F.call(0, -1, null, key, null, callback);
					return this; //API.Storage.sharedStorage;
				}
				/*
				"delete"(key, callback) -> Storage.sharedStorage
				"exists"(key, callback) -> bool*/
			}
		}
	}
	
	
	
	
	
	
	
	function create_link_css(href){
		var link = document.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");
		link.setAttribute("href", href);
		document.getElementsByTagName("head")[0].appendChild(link);
	}
	
	function Widget(widgetID, secret){
		return {
			"create": function(){
				var div = document.createElement("div");
				div.style.display = "block";
				div.style.position = "fixed";
				document.body.appendChild(div);
				API_F.div_base(div);
				return div;
			},
			"linkMyCSS": function(name){
				create_link_css(API_F.url(widgetID, name));
				return this; //API.Widget
			},
			"linkExternalCSS": function(href){
				create_link_css(href);
				return this; //API.Widget
			}
		}
	}
	
	
	
	
	
	
	
	
	
	return {
		"call": precall,
		"url": getUrl,
		"div_base": div_base,
		"Storage": Storage,
		"Widget": Widget,
		"document": Document
	};
})();








/*
Net;

Widget = (function(){
	function create(){
		
	}
	
	function includeCssFile(filename){
		var link = document.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");
		link.setAttribute("href", API.url(widgetID, filename));
		document.getElementsByTagName("head")[0].appendChild(link);
	}
	
	return {
		"create":create,
		"includeCssFile":null
	}
})();
*/