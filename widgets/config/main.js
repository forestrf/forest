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
				divContainerConfigWidget.appendChild(CONFIG[widget]['function']());
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