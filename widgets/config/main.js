// CREATE AND APPEND GEAR TO THE BODY

// Import css (Github icons pack)
var link = document.createElement("link");
link.setAttribute("rel", "stylesheet");
link.setAttribute("type", "text/css");
link.setAttribute("href", "//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css");
document.getElementsByTagName("head")[0].appendChild(link);

// Import css (css of the widget)
link = document.createElement("link");
link.setAttribute("rel", "stylesheet");
link.setAttribute("type", "text/css");
link.setAttribute("href", API.url(widgetID,'css.css'));
document.getElementsByTagName("head")[0].appendChild(link);

// Make the div container for the gear button
var gearDiv = document.createElement('div');
gearDiv.className = 'config_buttongear';
gearDiv.innerHTML = '<i class="fa fa-cog"></i>';

// Append the gear to the body
document.body.appendChild(gearDiv);





// CREATE AND APPEND CONTENT CONFIGURATION DIV

// Make the div container for the config window
var contentDiv = document.createElement('div');
contentDiv.className = 'config_contentdiv';

// Append the config window to the body
document.body.appendChild(contentDiv);

// Make the div container for the widgets in the config window and append the container for the widgets in the config window
var contentwidgetsDiv = document.createElement('div');
contentwidgetsDiv.className = 'contentwidgets';
contentDiv.appendChild(contentwidgetsDiv);

// Make the div container for the result of the configuration function of each widget (share the div) and append the container for the widgets in the config window
var configwidgetDiv = document.createElement('div');
configwidgetDiv.className = 'configwidget';
configwidgetDiv.style.display = 'none';
contentDiv.appendChild(configwidgetDiv);

// Placeholder for the back button variable
var backbutton;

// Create the close button for the config window
var closebutton = document.createElement('i');
closebutton.className = 'fa fa-times closebutton';
contentDiv.appendChild(closebutton);
closebutton.onclick = function(){
	// Reset content
	contentwidgetsDiv.innerHTML = '';
	configwidgetDiv.innerHTML = '';
	configwidgetDiv.style.display = 'none';
	if(backbutton){
		backbutton.remove();
	}
	// Hide window
	contentDiv.className = contentDiv.className.split('visible').join('').trim();
};



// Function that cleans the config window and shows redimensionable and movible rectangle.
// Calls callback with the position and size of the rectangle once the user is done or false if the user canceled the operation.
// Used by the widgets that can and wants to change their position and size.
function generate_position_rect(callback){
	// CREATE AND APPEND CONTENT CONFIGURATION DIV

	// Make the div container for the rect
	var contentDivRect = document.createElement('div');
	contentDivRect.className = 'config_contentDivRect';
	contentDivRect.style.backgroundImage = 'url(' + API.url(widgetID,'grid.png') + ')';
	document.body.appendChild(contentDivRect);
	
	// Hide contentDiv
	contentDiv.style.display = 'none';
	
	// Make the movible rect
	var rectPosition = document.createElement('div');
	rectPosition.className = 'config_rectPosition';
	contentDivRect.appendChild(rectPosition);
	
	// Make the resizers divs
	var resizers = ["center_top", "center_bottom", "left_center", "right_center"];
	var resizers_divs = {};
	for(var i in resizers){
		resizers_divs[resizers[i]] = document.createElement('div');
		resizers_divs[resizers[i]].className = resizers[i];
		rectPosition.appendChild(resizers_divs[resizers[i]]);
	}
	
	/* DELETE*/
	A = rectPosition;
	rectPosition.style.width = '200px';
	rectPosition.style.height = '200px';
	/* STOP DELETING */
	
	// Allow the movement through rectPosition.
	rectPosition.onmousedown = function(e){
		if(e.target === rectPosition){
			var extra_position = [
				e.clientX -rectPosition.offsetLeft,
				e.clientY -rectPosition.offsetTop
			];
			contentDivRect.onmousemove = function(e){
				rectPosition.style.left = (-extra_position[0] +e.clientX) +'px';
				rectPosition.style.top  = (-extra_position[1] +e.clientY) +'px';
			}
			contentDivRect.onmouseup = function(){
				contentDivRect.onmousemove = null;
			}
		}
	};
	
	// Allow reescale through resizers_divs.
	for(var i in resizers_divs){
		(function(resizers_divs, i){
			resizers_divs[i].onmousedown = function(e){
				if(e.target === resizers_divs[i]){
					var extra_position = [
						e.clientX,
						e.clientY,
						rectPosition.offsetLeft,
						rectPosition.offsetTop,
						parseInt(rectPosition.style.width),
						parseInt(rectPosition.style.height)
					];
					switch(i){
						case "center_top":
							contentDivRect.onmousemove = function(e){
								rectPosition.style.top    = (extra_position[3] -extra_position[1] +e.clientY) +'px';
								rectPosition.style.height = (extra_position[5] +extra_position[1] -e.clientY) +'px';
							};
						break;
						case "center_bottom":
							contentDivRect.onmousemove = function(e){
								rectPosition.style.height = (extra_position[5] -extra_position[1] +e.clientY) +'px';
							};
						break;
						case "left_center":
							contentDivRect.onmousemove = function(e){
								rectPosition.style.left   = (extra_position[2] -extra_position[0] +e.clientX) +'px';
								rectPosition.style.width  = (extra_position[4] +extra_position[0] -e.clientX) +'px';
							};
						break;
						case "right_center":
							contentDivRect.onmousemove = function(e){
								rectPosition.style.width  = (extra_position[4] -extra_position[0] +e.clientX) +'px';
							};
						break;
					}
					contentDivRect.onmouseup = function(){
						contentDivRect.onmousemove = null;
					}
				}
			};
		})(resizers_divs, i);
	}
	
	
}

generate_position_rect();


// SET GEAR BUTTON ACTION

gearDiv.onclick = function(){
	contentDiv.className += ' visible';
	contentwidgetsDiv.style.display = '';
	
	// Fill the config window
	
	// Go over the array CONFIG
	for(widget in CONFIG){
		var buttonWidget = document.createElement('div');
		buttonWidget.innerHTML += CONFIG[widget]['name'].toUpperCase();
		contentwidgetsDiv.appendChild(buttonWidget);
		
		// set the onclick for the button. executes the widget function and appends the result to the 
		buttonWidget.onclick = (function(widget){
			return function(){
				contentwidgetsDiv.style.display = 'none';
				configwidgetDiv.style.display = 'inherit';
				configwidgetDiv.innerHTML = '<div class="widgetnamebig">' + CONFIG[widget]['name'].toUpperCase() + ' WIDGET</div>'
				// Execute the function and append the result to the corresponding div container
				var divContainerConfigWidget = document.createElement('div');
				divContainerConfigWidget.className = 'widgetcontentconfig';
				divContainerConfigWidget.appendChild(CONFIG[widget]['function']({
					'positioning':generate_position_rect
				}));
				configwidgetDiv.appendChild(divContainerConfigWidget);
				
				// Create the back button for the widget config window
				backbutton = document.createElement('i');
				backbutton.className = 'fa fa-reply backbutton';
				contentDiv.appendChild(backbutton);
				backbutton.onclick = function(){
					// Reset content
					configwidgetDiv.innerHTML = '';
					contentwidgetsDiv.style.display = '';
					configwidgetDiv.style.display = 'none';
					backbutton.remove();
				};
			};
		})(widget);
	}
	
	
};





// Function for the config widgetID. It returns the html object to append on the config window.
// In this case we only want to allow the user to change the position of the widget.
var CONFIG_function = function(){
	var div = document.createElement('div');
	return div;
}
