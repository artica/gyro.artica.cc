
// Threshold to assume clicks on the connections between nodes
// The value represents how far away we can click from the line
// to still consider the click close enough to select it
var CONNECTION_CLICK_THRESHOLD = 12;

// Minimum and maximum allowed values for the screen zoom
var TREE_MIN_ZOOM = 0.1;
var TREE_MAX_ZOOM = 5;

// Opacity value to apply to the icons that are disabled
var DISABLED_BUTTON_OPACITY = 0.1;
// Time (in millis) for the buttons to fade between enabled and disabled
var DISABLED_BUTTON_FADE_TIME = 250;

// Time to wait to activate the help pop-up after stopping the mouse over something interesting
var TIMEOUT_POPUP_TRIGGER = 400;

var MAIN_CANVAS_COLOR = '#030f25';


var ARTICA_IMAGE_SCALE = 0.5;


function UserInterface() 
{
	_node_manager.resetTree();
	
	// Coordinates for the new temporary nodes
	this.tempx = 0;
	this.tempy = 0;
	
	// Are we panning the canvas?
	this.pan_canvas = false;

	// Are we passing the selected nodes?
	this.pan_nodes = false;

	// Are we panning pasted nodes?
	this.pan_pasted = false;
	this.box_select = false;

	// Initial coordinates for the drag action
	this.drag_start_x = 0;
	this.drag_start_y = 0;
	
	// Initial coordinates for the selection box
	this.box_start_x = 0;
	this.box_start_y = 0;
	
	this.delete_selection = false;

	// Corners of the virtual screen
	this.corner_x = 0;
	this.corner_y = 0;

	// Radius for the source nodes
	this.sources_radius = 15;

	// Screen positioning of the node source select menu
	// Distance between the new node selector tab and the top of the canvas
	this.node_select_start_top = 2;
	// Margin between the start of the new node selector and the first node
	this.top_margin = 20;
	// Vertical margin between nodes
	this.vertical_margin = 8;
	this.horizontal_margin = 8;



	this.node_width = this.sources_radius*2;
	this.node_height = this.sources_radius*2;


	// Zoom level of the view screen
	this.zoom = 1.0;

	// Is the grid visible?
	this.grid_enabled = true;

	// Are the variables/device values visible?
	this.variables_visible = true;

	// Are the elements supposed to snap to the grid?
	this.grid_snap = false;

	// Offset for the grid lines
	this.grid_size = 70;

	// Color for the grid lines without snap
	this.grid_color = '#333';

	// Color for the grid lines with snap
	this.grid_color_snap = '#448844';
		

	// Is the auto arrange feature enabled?
	this.auto_arrange_enabled = true;


	// Last node that was selected
	this.selected_node = null;
	

	// Are we dragging a parentless node and possibly trying to connect it?
	this.connecting_nodes = false;


	// Are we creating a new node right now?
	this.new_node = false;

	// Flag used when any element is moved. Setting this flag to true
	// makes the worker thread check if any repositioning is necessary
	this.tree_moved = false;
	
	// Does the tree need to be updated because of animations?
	this.update_animation = true;	

	// Keeps track of how many nodes are being animated
	this.animated_nodes_count = 0;

	// Is the user eding the properties of a node?
	this.editing_properties = false; 
	

	this.animation_type = ANIMATION_TYPE_NULL;

	// Type of trees being browsed (personal, shared or public)
	// This will depend on the last clicked <th> element to select tree types
	this.search_tree_group = "th_my_trees";	
}


// Initializez the main UI of Visualino
UserInterface.prototype.init = function()
{
	this.scrollbar_width = getScrollbarWidth();

	var html = 
		// Main container for the whole page
		"<div id='div_main_ui'>"+
			// Header div in the top right corner
			"<div id='center_container'>"+
				"<div id='header_div'>"+
					"<table class='header_table'><tr>"+
				
						"<td><div class='image-upload'>"+
						    "<label for='button_load_local'><img  src='images/header/browse_trees.svg' class='control_button'/></label>"+
						    "<input id='button_load_local' type='file'/>"+
						"</div></td>"+

						"<td><img id='button_save_local' class='control_button' src='images/header/save_tree.svg'></img></td>"+

/*						"<td><img id='button_load_net' class='control_button' src='images/header/browse_trees.svg'></img></td>"+
						"<td><img id='button_save_net' class='control_button' src='images/header/save_tree.svg'></img></td>"+

*/						"<td><img id='button_com_connect' class='control_button' src='images/header/connection_disconnected.svg'></img></td>"+
						"<td><select id='select_com_port'></select></td>"+

						"<td>"+
							"<canvas id='canvas_free_ram' class='canvas_progress_bar'></canvas><br>"+
							"<canvas id='canvas_upload_progress' class='canvas_progress_bar'></canvas>"+
						"</td>"+
						"<td><img id='image_tree_state' class='control_button' src='images/header/tree_state_ok.svg'></img></td>"+

						"<td><img id='button_upload_arduino' class='control_button' src='images/header/arduino_upload_ram.svg'></img></td>"+
						"<td><img id='button_save_eeprom' class='control_button' src='images/header/arduino_upload_eeprom.svg'></img></td>"+
						"<td><img id='button_delete_eeprom' class='control_button' src='images/header/arduino_clear_eeprom.svg'></img></td>"+
						
						"<td><div class='header_separator'></div></td>"+

						"<td><img id='button_run_tree' class='control_button' src='images/header/tree_state_play.svg'></img></td>"+
						"<td><img id='button_stop_tree' class='control_button' src='images/header/tree_state_stop.svg'></img></td>"+
						"<td><img id='button_pause_tree' class='control_button' src='images/header/tree_state_pause.svg'></img></td>"+
						"<td><img id='button_step_tree' class='control_button' src='images/header/tree_state_step.svg'></img></td>"+

						"<td><img id='button_toggle_variables' class='control_button' src='images/header/toggle_variables_view.svg'></img></td>"+

						"<td><div class='header_separator'></div></td>"+

						//"<td><img id='button_cenas_1' class='control_button' src='images/header/toggle_labels_view.svg'></img></td>"+
						"<td><img id='button_grid' class='control_button' src='images/header/toggle_grid_view.svg'></img></td>"+
						"<td><select id='select_grid_size'>"+
							"<option value='40'>40</option>"+
							"<option value='50'>50</option>"+
							"<option value='60'>60</option>"+
							"<option value='70' selected='true'>70</option>"+
							"<option value='80'>80</option>"+
							"<option value='90'>90</option>"+
							"<option value='100'>100</option>"+
							"<option value='120'>120</option>"+
							"<option value='150'>150</option>"+
						"</select></td>"+
						"<td><img id='button_auto_arrange' class='control_button' src='images/header/auto_arrange.svg'></img></td>"+
						"<td><img id='button_fit_to_screen' class='control_button' src='images/header/fit_to_screen.svg'></img></td>"+

						"<td><div class='header_separator'></div></td>"+

						"<td><img id='button_help' class='control_button' src='images/header/toggle_help_view.svg'></img></td>"+
						"<td><img id='button_user' class='control_button' src='images/header/user_login.svg'></img></td>"+
						"<td><span id='span_user_id'>Guest</span></td>"+
					"</tr></table>"+
				"</div>"+
			"</div>"+

			// Canvas where the tree will be drawn
			"<canvas id='main_canvas'>"+lang['no_canvas']+"</canvas>"+

			//"<div id='div_progress_bar'></div>"+

			// DIV for the touchscreen specific control buttons
			"<div id='touchscreen_div'>"+
				"<table class='header_table'><tr>"+			
					"<td><img id='button_cut' class='control_button' src='images/header/cut.svg'></img></td>"+
					"<td><img id='button_copy' class='control_button' src='images/header/copy.svg'></img></td>"+
					"<td><img id='button_paste' class='control_button' src='images/header/paste.svg'></img></td>"+
					"<td><div class='header_separator'></div></td>"+
					"<td><img id='button_undo' class='control_button' src='images/header/undo.svg'></img></td>"+
					"<td><img id='button_redo' class='control_button' src='images/header/redo.svg'></img></td>"+
					"<td><div class='header_separator'></div></td>"+
					"<td><img id='button_delete' class='control_button' src='images/header/delete.svg'></img></td>"+
				"</tr></table>"+
			"</div>"+
			// DIV for the mouse tooltip that shows the description of the different UI elements
			"<div id='footer_div'>"+
				"<div id='footer_title' class='tooltip_message_content'></div>"+
				"<div id='footer_content' class='tooltip_message_content'></div>"+
			"</div>"+
			// Properties div in the top right corner
			"<div id='div_properties'>"+
				"<table><tr>"+
				"<td class='properties_td'><div id='variables_display_box'></div></td>"+
				"<td class='properties_td'><div id='properties_display_container'><div id='properties_display_box'></div></div></td>"+
				"</tr></table>"+
			"</div>"+

		"</div>"+
		// DIV for pop-up menus (like the tree selection window)
		"<div id='div_popup'></div>"+
		// DIV for a pop-up that displays generic messages in the center of the screen
		"<div id='popup_message_div'>"+
			"<div id='popup_message_content' class='popup_message_content'></div>"+
		"</div>"+
		"<div id='sharing_tooltip'></div>"+
		"<img id='img_popup_arrow' src='images/menus/node_arrow_top.svg'></img>";

	$('body').html(html);


	$('#button_load_local').on('change', _ui.loadFile);
	$('#button_save_local').click(_ui.exportToFile);


	$('#button_load_net').click( _ui.openBrowseTreesWindow);
	$("#button_save_net").click(fiwareSaveTree);


	$('#button_upload_arduino').click( function() { _version_manager.uploadToArduino(false); } );
	$('#button_save_eeprom').click( function() { _version_manager.uploadToArduino(true) ;} );
	$('#button_delete_eeprom').click( function() { sendData('D;'); } );

	$('#button_run_tree').click(function() { sendData('R;');} );
	$('#button_stop_tree').click(function() { sendData('S;');} );
	$('#button_pause_tree').click(function() { sendData('P;');} );
	$('#button_step_tree').click(function() { sendData('F;');} );

	$('#button_toggle_variables').click( _ui.toggleVariablesView );

	$('#button_grid').click( _ui.toggleGrid );

	$('#select_grid_size').click( _ui.selectGridSize );


	$('#button_auto_arrange').click( _ui.toggleAutoArrange );

	$('#button_fit_to_screen').click( _ui.fitTreeToScreen );


	$('#button_cut').click( function() { _version_manager.cut(); } );
	$('#button_copy').click( function() { _version_manager.copy(); } );
	$('#button_paste').click( function() { _version_manager.paste() } );

	$('#button_undo').click( function() { _version_manager.undo(); } );
	$('#button_redo').click( function() { _version_manager.redo(); } );

	$('#button_delete').click( function() { _node_manager.removeSelection(); } );


	$('#select_com_port').on('change', function() { selected_com_port = com_ports_list[ parseInt($('#select_com_port').val(), 10 )]; } );

	$('#button_com_connect').click( _ui.toggleComPortConnection );


	$('.control_button').on( 'mouseenter', _ui.hooverHeader );
	$('.canvas_progress_bar').on( 'mouseenter', _ui.hooverHeader );

	
	var header = $('#header_div')[0];

	//$('#div_progress_bar').css( {top:$(header).height()+5, left:$(header).offset().left, height:8} );

	// 	$('#div_progress_bar').css( {top:$(header).height()+5, left:$(header).left(), width:$(header).width(), height:8} );
	this.canvas = $('#main_canvas')[0];

	// init listeners for the base elements of the UI
	if (this.canvas) 
	{
		this.ctx = this.canvas.getContext('2d');
		
		//window.addEventListener("mousedown", mouseDown, false);
		
		$('#main_canvas').on('mousedown', mouseDown);
		$('#main_canvas').on('mouseup', mouseUp);
		$('#main_canvas').on('mousemove', mouseMove);

		$('#main_canvas').on('touchstart', touchStart);
		$('#main_canvas').on('touchend', touchEnd);
		$('#main_canvas').on('touchmove', touchMove);

	


/*
    // Set up an event listener for when the touch instrument is moved.
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        touchMoved(e);
    });		
/*
		$('#main_canvas').on('touchstart', mouseDown);
		$('#main_canvas').on('touchend', mouseUp);
		$('#main_canvas').on('touchmove', mouseMove);
*/

		$('#button_load_net, #button_save_net').css({opacity:DISABLED_BUTTON_OPACITY});


		$('#button_user').click( fiwareToggleLogin );

		$('#button_help').click( _ui.helpFunction );

		// Capture the mouse scrollwheel for a custom callback function
		$('#main_canvas').bind('mousewheel', mouseScroll);
	
		// Disable the popup menu triggered by the right-click
		$(document).bind("contextmenu", function(event){return false;});

		// Disable dragging the mouse to select an area
		$(document).on("dragstart", function(event){return false;});


		$(window).on('resize', _ui.resizeWindow);		

		this.resizeWindow();
		// Toggle the "editing_properties" flag when the mouse enters or leaves the properties div
		// This affects the behaviour os certain keys, like the delete or arrow keys
		$('#div_properties').mouseenter(function() {_ui.editing_properties = true; });
		//$('#div_properties').mouseleave(function() {_ui.editing_properties = false; console.log("Exiting!!!"); });

		// Prevent the backspace key from navigating back.
		$(document).unbind('keydown').bind('keydown', function (event) {
		    var doPrevent = false;
		    if (event.keyCode === 8) {
		        var d = event.srcElement || event.target;
		        if ((d.tagName.toUpperCase() === 'INPUT' && 
		             (
		                 d.type.toUpperCase() === 'TEXT' ||
		                 d.type.toUpperCase() === 'PASSWORD' || 
		                 d.type.toUpperCase() === 'FILE' || 
		                 d.type.toUpperCase() === 'SEARCH' || 
		                 d.type.toUpperCase() === 'EMAIL' || 
		                 d.type.toUpperCase() === 'NUMBER' || 
		                 d.type.toUpperCase() === 'DATE' )
		             ) || 
		             d.tagName.toUpperCase() === 'TEXTAREA') {
		            doPrevent = d.readOnly || d.disabled;
		        }
		        else {
		            doPrevent = true;
		        }
		    }

		    if (doPrevent) {
		        event.preventDefault();
		    }
		});

		_ui.showComPorts();
		_ui.showComPortState();
		_ui.startAnimation();
	}
	else
	{
		openPopUpMessage(lang['bad_canvas']);
	}

	// Save the current tree to the local storage before closing the page
	window.onbeforeunload = function() 
	{ 
		_version_manager.saveCurrentTree();
	};
	

	_version_manager.loadCurrentTree();

	//_ui.loadFromURL("json/farrusco_bump_back.json");

};


UserInterface.prototype.helpFunction = function() 
{
	console.log(_node_manager.nodes);
}


// Different completion policies for the parallel nodes
UserInterface.prototype.search_types = [{value:0, name:'title'},
									    {value:1, name:'author'},
									    {value:2, name:'email'},
									    {value:3, name:'tag'} ];



// Updates the table with all the device values
UserInterface.prototype.updateDeviceValues = function() 
{
	var devices = _device_manager.devices;
	var html = "<table>";
	for( var i=0; i<devices.length; i++ )
	{

		html += "<tr><td class='variable_value'>"+devices[i].value+"<td>"+
			"<td><image class='image_list' src='"+devices[i].getImage().src+"'></image></td></tr>"
	}

	html +=  "</table>";
	$('#variables_display_box').html(html);
}
   	

// Open the pop-up windows that allows to search for existing trees online
UserInterface.prototype.openBrowseTreesWindow = function() 
{
	// If the user is not logged in he cannot browse anything
	if (fiware_user_email==="") return;

	//console.log('openBrowseTreesWindow');
	var window_margin = 100;

	var browse_window_width = $(window).width() - window_margin*2;
	var browse_window_height = $(window).height() - window_margin*2;

	// Create an empty table that will me populated by fiwareGetTreeList()
	html =  "<table id='table_tree_type'><tr>"+
				"<th id='th_my_trees' class='th_tree_search_type'>My Trees</th>"+
				"<th id='th_shared_trees' class='th_tree_search_type'>Shared with me</th>"+
				"<th id='th_all_trees' class='th_tree_search_type'>All Trees</th>"+
		"</tr></table>"+					
		"<div id='div_search_select'>"+
				"<span>"+lang['search_by']+":</span>"+
				createHtmlSelectorTranslated('select_search_type', null, _ui.search_types, 0)+
				"<input type='text' id='text_search_data'></input>"+
				"<input type='button' id='button_search_trees' value='"+lang['search']+"'></input>"+
			"</div>"+
			"<table id='table_tree_list'><tr>"+
				"<th id='th_title'>Title</th>"+
				"<th id='th_stuff'>Actions</th>"+
				"<th id='th_author'>Author</th>"+
				"<th id='th_tags'>Tags</th>"+
				//"<th id='th_comments'>Comments</th>"+
				"<th>Status</th>"+
			"</tr>"+
			//"<tr><td> Farrusco mega tree</td><td>L S D</td><td>Tarquinio</td><td>robot farrusco caozinho</td><td>private</td></tr>"+
			"</table>"+
			"<image id='img_close_tree_list' class='img_close_button' src='images/menus/button_close_window.svg'></image>";

	// Create the div content and make it fade in
	$('#div_popup').html(html).
					css({opacity:0.0, display:'block', left:window_margin, top:window_margin,
						width:browse_window_width, height:browse_window_height}).
					stop().
					animate({opacity: 1.0}, ANIMATION_TIME_DIV_CHANGE );

	// At the same time the pop-up div fades in, the main UI fades out
	$('#div_main_ui').stop().
					animate({opacity: 0.1}, ANIMATION_TIME_DIV_CHANGE );

	$('#img_close_tree_list').click(_ui.closePopUpMessageDiv);

	$('#button_search_trees').click(_ui.searchTrees);

	$('#text_search_data').on("change", _ui.searchTrees);

	$('.th_tree_search_type').click(_ui.changeSearchParameters);

	$('#th_my_trees').click();

};


// Update the current state of the tree (NO_ERROR, WARNING, ERROR)
UserInterface.prototype.setTreeState = function (new_tree_state) 
{
	//console.log("setTreeState:"+new_tree_state);
	//console.log(new_tree_state);

	this.tree_state = new_tree_state;
	switch(new_tree_state)
	{
		case NODE_STATE_NO_ERROR:
			$('#image_tree_state').attr('src', 'images/header/tree_state_ok.svg');
		break;
		case NODE_STATE_WARNING:
			$('#image_tree_state').attr('src', 'images/header/tree_state_warning.svg');
		break;
		case NODE_STATE_ERROR:
			$('#image_tree_state').attr('src', 'images/header/tree_state_error.svg');
		break;
	}
	this.updateCommunicationButtonsState();
	this.draw();
}


// Update state of the communication buttons with the arduino
// The availability of these buttons depend on several factors (state of the tree, state of the conenction, etc)
UserInterface.prototype.updateCommunicationButtonsState = function () 
{
	// Check if the com port is connected
	if (connected_com_port !== '')
	{
		// Even of the port is connected, we need to validate is the tree is valid to allow uploading
		if (this.tree_state !== NODE_STATE_ERROR)
		{
			$('#button_upload_arduino').animate({opacity: 1.0}, DISABLED_BUTTON_FADE_TIME);
			$('#button_save_eeprom').animate({opacity: 1.0}, DISABLED_BUTTON_FADE_TIME);
		}
		// If the tree is not valid, we disable the upload buttons
		else
		{
			$('#button_upload_arduino').animate({opacity: DISABLED_BUTTON_OPACITY}, DISABLED_BUTTON_FADE_TIME);
			$('#button_save_eeprom').animate({opacity: DISABLED_BUTTON_OPACITY}, DISABLED_BUTTON_FADE_TIME);
		}
		// We can always delete the current tree in the arduino eeprom as long as we're connected
		$('#button_delete_eeprom').animate({opacity: 1.0}, DISABLED_BUTTON_FADE_TIME);

		$('#button_run_tree').animate({opacity: 1.0}, DISABLED_BUTTON_FADE_TIME);
		$('#button_stop_tree').animate({opacity: 1.0}, DISABLED_BUTTON_FADE_TIME);
		$('#button_pause_tree').animate({opacity: 1.0}, DISABLED_BUTTON_FADE_TIME);
		$('#button_step_tree').animate({opacity: 1.0}, DISABLED_BUTTON_FADE_TIME);

	}
	// If the com is not connected, nothing can be sent to the Arduino, so we disable all the buttons
	else
	{
		$('#button_upload_arduino').animate({opacity: DISABLED_BUTTON_OPACITY}, DISABLED_BUTTON_FADE_TIME);
		$('#button_save_eeprom').animate({opacity: DISABLED_BUTTON_OPACITY}, DISABLED_BUTTON_FADE_TIME);
		$('#button_delete_eeprom').animate({opacity: DISABLED_BUTTON_OPACITY}, DISABLED_BUTTON_FADE_TIME);

		$('#button_run_tree').animate({opacity: DISABLED_BUTTON_OPACITY}, DISABLED_BUTTON_FADE_TIME);
		$('#button_stop_tree').animate({opacity: DISABLED_BUTTON_OPACITY}, DISABLED_BUTTON_FADE_TIME);
		$('#button_pause_tree').animate({opacity: DISABLED_BUTTON_OPACITY}, DISABLED_BUTTON_FADE_TIME);
		$('#button_step_tree').animate({opacity: DISABLED_BUTTON_OPACITY}, DISABLED_BUTTON_FADE_TIME);
	}
}

// Callback for then the user clicks the a search selector type (My trees/Shared trees/All trees)
UserInterface.prototype.changeSearchParameters = function(event)
{
	// Get the button that was clicked
	var target = event.target;
	console.log("changeSearchParameters:"+target.id);
	// Animate the buttons so the one that was clicked fades in and all the other ones fade out
	$('.th_tree_search_type').animate({opacity: DISABLED_BUTTON_OPACITY}, DISABLED_BUTTON_FADE_TIME);	
	$(target).animate({opacity: 1.0}, DISABLED_BUTTON_FADE_TIME);

	// Save the type of trees to look for
	_ui.search_tree_group = target.id;

	fiwareGetTreeList();

}


// Callback for then the user clicks the search trees button
UserInterface.prototype.searchTrees = function(event)
{
	var email = "";
	var user_name = "";
	var tree_name = "";
	var tags = "";

	var search_type = parseInt($('#select_search_type').val(), 10);
	var value = $('#text_search_data').val();

	switch (search_type)
	{
		case 0: tree_name = value; break;
		case 1: user_name = value; break;
		case 2: email = value; break;
		case 3: tags = value; break;
	}

	console.log("tree_name:"+tree_name);
	console.log("user_name:"+user_name);
	console.log("email:"+email);
	console.log("tags:"+tags);

	fiwareGetTreeList(email, user_name, tree_name, tags );
};


// Callback for then the user clicks the share tree button
UserInterface.prototype.openShareTreeWindow = function(event)
{		
	console.log("openShareTreeWindow");
	// Get the button that was clicked
	var target = event.target;
	
	var left = $(target).offset().left; // + $(window).width()/2;
	var top = $(target).offset().top + $(target).height();

	$('#sharing_tooltip').css({display:'block', left:left, top:top, width:'auto', height:'auto'});

	console.log(target);
	var tree_id = $(target).attr('tree_id');
	console.log(tree_id);

	var html = "<table id='table_tree_share'>"+
			"<tr><th colspan='3'>"+lang['share_with']+"</th></tr>"+
			"<tr>"+
				"<td>"+lang['user']+"</td><td><input type='text' id='text_share_user'></input></td>"+
				"<td><input type='button' id='button_share_user' class='button_share' "+
				"value='"+lang['share']+"' tree_id='"+tree_id+"''></input></td>"+
			"</tr>"+
			"<tr>"+
				"<td>"+lang['email']+"</td><td><input type='text' id='text_share_email'></input></td>"+
				"<td><input type='button' id='button_share_email' class='button_share' "+
				"value='"+lang['share']+"' tree_id='"+tree_id+"''></input></td>"+
			"</tr>"+
			"<tr>"+
				"<td>"+lang['group']+"</td><td><input type='text' id='text_share_group'></input></td>"+
				"<td><input type='button' id='button_share_group' class='button_share' "+
				"value='"+lang['share']+"' tree_id='"+tree_id+"''></input></td>"+
			"</tr>"+
		"</table>"+

		"<table id='table_tree_share_list'><tr><th colspan='2'>"+lang['share_list']+"</th></tr>"+
		"<tr><th>"+lang['name']+"</th><th>"+lang['remove']+"</th></tr></table>"+
		"<input type='button' id='button_remove_all_shares' class='button_remove_share_tree' "+
		"tree_id='"+tree_id+"' user_id='0' value='"+lang['remove_all_shares']+"'></input>"+

		"<image id='img_close_share_window' class='img_close_button' src='images/menus/button_close_window.svg'></image>";

	
	$('#sharing_tooltip').html(html);

	$('#sharing_tooltip').stop().
		css({display:'block', opacity: 0.0, left:left-220, top:top, width:'30rem', height:'auto'}).
		animate({opacity: 1.0}, ANIMATION_TIME_DIV_CHANGE );

	$('.button_share').click(_ui.shareTree);

//	$('#img_close_share_window').click(_ui.closeShareDiv);

	$('#img_close_share_window').click(function() {fadeOutDiv('sharing_tooltip', ANIMATION_TIME_DIV_CHANGE)});

	fiwareGetSharesList(tree_id);

}



// Callback for then the window is resized
UserInterface.prototype.resizeWindow = function(event)
{
	//console.log('resizeWindow');
	//$('#div_main_ui').css('height', $(window).height());
	$('#div_main_ui').css('height', '100vh');

	//console.log("$(div_main_ui).width():"+$('#div_main_ui').width() +"  $(div_main_ui).height():"+$('#div_main_ui').height() );

	var canvas = $('#main_canvas')[0];
	_ui.cw = _ui.ctx.width = _ui.canvas.width = $(canvas).width();
	_ui.ch = _ui.ctx.height = _ui.canvas.height = $(canvas).height();

	//console.log("_ui.cw:"+_ui.cw +"  _ui.ch:"+_ui.ch );

	_ui.draw();
}


// Callback for then the user clicks one of the share tree buttons
UserInterface.prototype.shareTree = function(event)
{
	console.log("shareTree");
	var target = event.target;

	console.log(target);
	var tree_id = $(target).attr('tree_id');

	switch (target.id)
	{
		case 'button_share_user':
			fiwareShareTree( tree_id, "", $('#text_share_user').val() );
		break;
		case 'button_share_email':
			fiwareShareTree( tree_id, $('#text_share_email').val(), "" );
		break;		
	}
}


// Callback for then the user clicks the pop-up div close button
UserInterface.prototype.closePopUpMessageDiv = function() 
{
	$('#div_popup').stop().
					animate({opacity: 0.0}, ANIMATION_TIME_DIV_CHANGE, function()
					{
						$('#div_popup').css('display', 'none');
					} );

	$('#div_main_ui').stop().
					animate({opacity: 1.0}, ANIMATION_TIME_DIV_CHANGE );	
};

// Callback for then the user clicks the share div close button
UserInterface.prototype.closeShareDiv = function() 
{
	$('#sharing_tooltip').stop().
					animate({opacity: 0.0}, ANIMATION_TIME_DIV_CHANGE, function()
					{
						$('#sharing_tooltip').css('display', 'none');
					} );
};



UserInterface.prototype.startAnimation = function() 
{
	this.update_animation = true;
	this.runAnimation();
};


UserInterface.prototype.runAnimation = function()
{
	cancelAnimationFrame(animation_frame);
	_ui.draw();
	if (_ui.update_animation) animation_frame = requestAnimationFrame(_ui.runAnimation);
};


// Zoom in/out the current view
UserInterface.prototype.zoomTree = function (zoom_offset, position)
{
	// Calculate the current position of the cursor relative to the virtual screen
	var virtual_x = _ui.corner_x + position.x / _ui.zoom ;
	var virtual_y = _ui.corner_y + position.y / _ui.zoom ;
	//console.log("x:"+position.x+"   y:"+position.y+"   corner_x:"+_ui.corner_x+"   corner_y:"+_ui.corner_y+"   virtual_x:"+virtual_x+"   virtual_y:"+virtual_y);

	// Constrain the zoom to the minimum and maximum values
	_ui.zoom += zoom_offset;
	if (zoom_offset < 0 && _ui.zoom <= TREE_MIN_ZOOM) _ui.zoom = TREE_MIN_ZOOM;
	if (zoom_offset > 0 && _ui.zoom >= TREE_MAX_ZOOM) _ui.zoom = TREE_MAX_ZOOM;

	// Calculate the new corner positions so that the cursor remains on top of the 
	// same virtual position with the new zoom value
	_ui.corner_x = virtual_x - position.x / _ui.zoom;
	_ui.corner_y = virtual_y - position.y / _ui.zoom;

	_ui.startAnimation();    
};


// Toggles the usage of the grid in the canvas
UserInterface.prototype.toggleGrid = function ()
{
	console.log("toggleGrid");

	// This toggles between 3 different states:
	// no grid -> grid without snap -> grid with snap

	// If the grid is not enabled, enable it and disable the snap
	if (!_ui.grid_enabled) 
	{ 
		_ui.grid_enabled=true; 
		_ui.grid_snap=false;
		$('#button_grid').
			stop().
			animate( {opacity:1.0}, DISABLED_BUTTON_FADE_TIME );
	}
	// The grid is enabled
	else
	{
		// If the grid is enabled but snap is not active, make it active
		if (!_ui.grid_snap) 
		{ 
			$('#button_grid').attr("src", "images/header/toggle_grid_view_snap.svg");
			_ui.grid_snap=true;
		}
		// Otherwise both grid and snap were active, so we disable them both
		else 
		{ 
			_ui.grid_enabled=false; 
			_ui.grid_snap=false;
			$('#button_grid').attr("src", "images/header/toggle_grid_view.svg").
				stop().
				animate( {opacity:DISABLED_BUTTON_OPACITY}, DISABLED_BUTTON_FADE_TIME );

		};
	}
	_ui.draw();
}


// Toggles the view of the values for all the devices/variables
UserInterface.prototype.toggleVariablesView = function ()
{
	console.log("toggleVariablesView");

	// Toggle the state of the visibility
	_ui.variables_visible = !_ui.variables_visible;

	// If the grid is not enabled, enable it and disable the snap
	if (_ui.variables_visible) 
	{ 
		$('#variables_display_box').css( {display:'block'} );
		sendData('V1;');
	}
	// The grid is enabled
	else
	{
		$('#variables_display_box').css( {display:'none'} );
		sendData('V0;');
	}
	_ui.draw();
}


// Toggles the view of the values for all the devices/variables
UserInterface.prototype.updateVariableValues = function ()
{
}


// Select a new size for the canvas grid
UserInterface.prototype.selectGridSize = function ()
{
	console.log("selectGridSize");

	_ui.grid_size = parseInt($('#select_grid_size').val(), 10);

	_node_manager.autoArrangeTree();

	_ui.draw();
}

// Toggles the usage of the auto arrange feature of the tree 
UserInterface.prototype.toggleAutoArrange = function ()
{
	console.log("toggleAutoArrange");

	// Toggle the state of the auto-arrange feature
	_ui.auto_arrange_enabled = !_ui.auto_arrange_enabled; 

	if (_ui.auto_arrange_enabled) 
	{ 
		$('#button_auto_arrange').attr('src', 'images/header/auto_arrange.svg');

		_node_manager.autoArrangeTree();

	}
	// The grid is enabled
	else
	{
		$('#button_auto_arrange').attr('src', 'images/header/auto_disarrange.svg');

		_node_manager.root.autoDisarrange();

	}
	_ui.startAnimation();
}


// Pans the screens and adjust zoom so that all the visible tree nodes fit to the screen
UserInterface.prototype.fitTreeToScreen = function ()
{
	console.log("fitTreeToScreen");
	//_ui.zoom = 0.3;

	var nodes = _node_manager.nodes;

	// If there are no nodes, there's nothing to fit... :P
	if (nodes.length === 0) return;


	// First we need to calculate a bounding box for the desired nodes

	var box_x_min;
	var box_x_max;
	var box_y_min;
	var box_y_max;

	console.log("-----------------> ");
	console.log(_ui.selected_node);

	// If nothing is selected, we set the root node as the base point
	if (_ui.selected_node===null)
	{
		box_x_min = nodes[0].leftCorner();
		box_x_max = nodes[0].rightCorner();
		box_y_min = nodes[0].topCorner();
		box_y_max = nodes[0].bottomCorner();
	}
	// If at least a node is selected, set the last selected node as the base point
	else
	{
		box_x_min = _ui.selected_node.leftCorner();
		box_x_max = _ui.selected_node.rightCorner();
		box_y_min = _ui.selected_node.topCorner();
		box_y_max = _ui.selected_node.bottomCorner();
	}

	// And now we expand the box to fit all the nodes we want
	for (var i = 0; i < nodes.length; i++)
	{
		var node = nodes[i];
		// Only check the dimensions of visible nodes
		
		if (!node.display) continue;

		if (_ui.selected_node!==null && !node.selected)	continue;	


		var left_corner = node.leftCorner();
		var right_corner = node.rightCorner();
		var top_corner = node.topCorner();
		var bottom_corner = node.bottomCorner();

		if (left_corner < box_x_min) box_x_min = left_corner;
		if (right_corner > box_x_max) box_x_max = right_corner;
		if (top_corner < box_y_min) box_y_min = top_corner;
		if (bottom_corner > box_y_max) box_y_max = bottom_corner;
	}

	// Since the calculations were based on the center of the nodes, we expand the box a bit
	// more so that the totality of the nodes is visible, plus a small margin
	box_x_min -= 180;
	box_x_max += 100;
	box_y_min -= 50;
	box_y_max += 150;

	// Now we calculate the final dimensions of the box
	var box_width = box_x_max - box_x_min;
	var box_height = box_y_max - box_y_min;

	//console.log("box_width:"+box_width+"   box_height:"+box_height);

	//console.log("cw:"+_ui.cw+"   ch:"+_ui.ch);

	var width_ratio = _ui.cw / box_width;
	var height_ratio = _ui.ch / box_height;

	var screen_form_factor = _ui.cw / _ui.ch;
	var box_form_factor = width_ratio / height_ratio;

	//console.log("width_ratio:"+width_ratio);
	//console.log("height_ratio:"+height_ratio);


	// The ratio with the lowest dimension (width or height) is the one we need to mantain
	// The other value will be expanded/shrunk to match the fixed one
	var final_zoom;

	if (height_ratio < width_ratio)
	{
		final_zoom = height_ratio;

		var expanded_box_width = box_height*screen_form_factor;

		//console.log("expanded_box_width:"+expanded_box_width);

		_ui.animation_final_pan_x = box_x_min-(expanded_box_width-box_width)/2;
		_ui.animation_final_pan_y = box_y_min;
	}
	else
	{
		final_zoom = width_ratio;

		var expanded_box_height = box_width/screen_form_factor;

		_ui.animation_final_pan_x = box_x_min;
		_ui.animation_final_pan_y = box_y_min-(expanded_box_height-box_height)/2;

	}


	// The initial position of the pan animation coordinates is always the current position
	_ui.animation_initial_pan_x	= _ui.corner_x;
	_ui.animation_initial_pan_y	= _ui.corner_y;


	console.log("_ui.animation_initial_pan_x:"+_ui.animation_initial_pan_x+"    _ui.animation_initial_pan_y:"+_ui.animation_initial_pan_y);
	console.log("_ui.animation_final_pan_x:"+_ui.animation_final_pan_x+"    _ui.animation_final_pan_y:"+_ui.animation_final_pan_y);


	_ui.animation_type = ANIMATION_TYPE_SCREEN_FITTING;

	_ui.animation_start_time = millis();
	_ui.animation_duration = 2000;
	_ui.animation_initial_zoom = _ui.zoom;
	_ui.animation_final_zoom = final_zoom;

	_ui.startAnimation();

}

// Update the tree canvas zoom and pan values
UserInterface.prototype.processAnimation = function (time)
{
	//console.log("processAnimation");
	// Calculate the normalized value for the animation progress
	var state = (time - this.animation_start_time) / this.animation_duration;

	//console.log("state:"+state);

	// Make sure the animation is within bounds
	if (state>1.0) state = 1.0;

	// Adjust the state value so it moves slower towards the end
	state = 1-Math.pow((1-state), 3);

	// Calculate the new position by interpolating the initial and final positions
	this.zoom = (1.0-state)*this.animation_initial_zoom + state*this.animation_final_zoom;

	this.corner_x = (1.0-state)*this.animation_initial_pan_x + state*this.animation_final_pan_x;

	this.corner_y = (1.0-state)*this.animation_initial_pan_y + state*this.animation_final_pan_y;

	//console.log("this.corner_x:"+this.corner_x+"    this.corner_y:"+this.corner_y);

	if (state >= 1.0)
	{
		this.animation_type = ANIMATION_TYPE_NULL;
		return false;
	}
	return true;
}

// Draw the whole interface
UserInterface.prototype.draw = function ()
{
	var ctx = this.ctx;
	//console.log("HUH?");
	var nodes = _node_manager.nodes;

	// Clear canvas
	ctx.clearRect(0,0, this.cw, this.ch);


	// If the grid is enabled we need to draw it before anything else
	if (this.grid_enabled)
	{
		ctx.lineWidth = 1;
		ctx.strokeStyle = (this.grid_snap? this.grid_color_snap: this.grid_color);
		var grid_size = this.grid_size*this.zoom;
		// Draw the vertical lines of the grid
		for ( xpos = -this.corner_x*this.zoom % grid_size ; xpos < this.cw; xpos += grid_size )
		{
			ctx.beginPath();
			ctx.moveTo(xpos, 0);
			ctx.lineTo(xpos, this.ch);
			ctx.stroke();			
		}
		// Draw the horizontal lines of the grid
		for ( ypos = -this.corner_y*this.zoom % grid_size ; ypos < this.ch; ypos += grid_size )
		{
			ctx.beginPath();
			ctx.moveTo(0, ypos);
			ctx.lineTo(this.cw, ypos);
			ctx.stroke();			
		}
	} 

	//ctx.fillStyle="C5C5C5";
	//ctx.fillRect(0, 0, this.cw, this.ch);
	//ctx.fillRect(0, 0, 300, 300);

	ctx.drawImage(images.getImage('powered_by_artica'), this.cw-650*ARTICA_IMAGE_SCALE, this.ch-100*ARTICA_IMAGE_SCALE - $('#footer_div').height()+40, 
		650*ARTICA_IMAGE_SCALE, 100*ARTICA_IMAGE_SCALE); 


    // ----------------------------  Tree nodes  ----------------------------
	// Animate the nodes (expanding/collapsing the tree)
	this.update_animation = false;
	// Use the same time for all the nodes so we are sure everything is in sync
	var time = millis();


	if (_ui.animation_type === ANIMATION_TYPE_SCREEN_FITTING)
	{
		this.update_animation = _ui.processAnimation(time);
	}

	//else
	{
		var null_counter = 0;

		// Process the animations in all the nodes
		for (var i = 0; i < nodes.length; i++)
		{
			// Keep track if any node animation has changed
			if (nodes[i].processAnimation(time)) this.update_animation = true;
		}

		// After ALL the animations have been processed, let's see if any node animation is still active
		for (var i = 0; i < nodes.length; i++)
		{
			// If any of the nodes is expanding or collapsing, we save that fact
			if (nodes[i].animation_type === ANIMATION_TYPE_NODE_COLLAPSING || nodes[i].animation_type === ANIMATION_TYPE_NODE_EXPANDING)
			{
				_ui.animation_type = ANIMATION_TYPE_NODE_EXPANDING;
			}
			// Count how many nodes are not being animated
			if (nodes[i].animation_type === ANIMATION_TYPE_NULL ) null_counter++;
		}

		// If no nodes are being animated but we had expanding/collapsing animations on the previous frame
		// we need to auto arrange the tree (assuming auto arrange is enabled)
		if (null_counter == nodes.length)
		{
			// If on the previous frame we were expanding/collapsing, we need to auto-arrange the tree
			if (_ui.animation_type === ANIMATION_TYPE_NODE_EXPANDING)
			{
				console.log("####### Finished ANIMATION_TYPE_NODE_EXPANDING   _ui.animated_nodes_count:"+_ui.animated_nodes_count);
				_ui.animation_type = ANIMATION_TYPE_NODE_ARRANGING;

				_node_manager.autoArrangeTree();
			}

			else
			{
				// Since none of the nodes are being animated, then the general animation state is NULL too
				if (_ui.animation_type !== ANIMATION_TYPE_SCREEN_FITTING)
				{
					_ui.animation_type = ANIMATION_TYPE_NULL;

				}
			}
		}

	}

	//console.log("this.animation_type:"+this.animation_type);
	
	// If no nodes are moving we don't need to keep redrawing everything
	if (!this.update_animation && _ui.animation_type === ANIMATION_TYPE_NULL)
	{
		//console.log("CANCELING ANIMATION FRAME!!!!!");
		cancelAnimationFrame(animation_frame);
	}

	// If we have a temporary and selected nodes set, we draw temporary connections between them
	if (this.temporary_parent && this.selected_node) 
		this.temporary_parent.drawTemporaryConnection(ctx, this.selected_node);
		
	// Draw connections between nodes
	for (i = 0; i < nodes.length; i++) 
	{
		nodes[i].drawConnections(ctx);
	}
	
	// Draw all the nodes in the tree
	for (i = nodes.length-1; i>=0; i--) 
	{
		nodes[i].draw(ctx);
	}	
	
	// Draw the select bounding box
	if (this.box_select)
	{			
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#4466FF';
		ctx.setLineDash([6, 2]);
		
		ctx.rect(_ui.box_start_x, _ui.box_start_y, _last_mouse_x-_ui.box_start_x, _last_mouse_y-_ui.box_start_y);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}


    // ----------------------------  Source nodes  ----------------------------

	// Draw the source nodes on the left side
	// Color of the node source bar
    ctx.fillStyle='#E8E8E8';

    var node_types = _node_manager.node_types;

    // Set the limit position of the node source bar
    var aux_x = this.horizontal_margin*2 + this.node_width;
    var aux_y = this.top_margin + node_types.length * ( this.node_height + this.vertical_margin );

	ctx.fillRect(0, this.node_select_start_top, aux_x, aux_y);

	//$('#header_div').css({left:aux_x+5, top:0});

	var CORNER_RADIUS = 20;

	// Draw the node source bar
    //ctx.beginPath();
    //ctx.moveTo(0, aux_y);
    //ctx.lineTo(aux_x - CORNER_RADIUS, aux_y);
    //ctx.quadraticCurveTo(aux_x, aux_y, aux_x,  aux_y - CORNER_RADIUS);
    //ctx.lineTo(aux_x, 0);
    //ctx.lineTo(0, 0);
    //ctx.closePath();
    //ctx.fill();

    // Draw all the source nodes
	var ypos = this.node_select_start_top + this.top_margin;
	for (n = 0; n < node_types.length; n++) 
	{
		var image = node_types[n].image;

		// The nodes that are not enables are faded out
		//if (!node_types[n].enabled) ctx.globalAlpha = 0.2;
		//else ctx.globalAlpha = 1.0;
    	if (image) ctx.drawImage(image, this.horizontal_margin, ypos, this.node_width, this.node_height);
		
		ypos += this.node_height + this.vertical_margin;
	}

};


// Set the anchor positions for all the nodes
UserInterface.prototype.setNodeAnchors = function ()
{
	//console.log('setNodeAnchors');
	var nodes = _node_manager.nodes;
	for (var i=0; i<nodes.length; i++)
	{
		nodes[i].setAnchor();
	}
};


// Restore the position that was set as the  the anchor positions for all the nodes
UserInterface.prototype.restoreNodeAnchors = function ()
{
	console.log('restoreNodeAnchors');
	var nodes = _node_manager.nodes;
	for (var i=0; i<nodes.length; i++)
	{
		nodes[i].restoreAnchor();
	}
};


// Returns the number of the node that is closest to the x,y position, 
// assuming that position is inside the node
// If we also pass a node as a third argument, that node will be ignored
UserInterface.prototype.touchingNode = function(x, y, ignore_node)
{
	var min_distance = null;
	var closest_node = null;
	var nodes = _node_manager.nodes;
	for (var i = 0; i < nodes.length; i++)
	{
		// Don't bother checking nodes that are not visible
		if (nodes[i].display === false ) continue;
		// Don't bother checking the ignore node either
		if (nodes[i] === ignore_node ) continue;

		// If the node is visible, calculate the distace to the point
		var distance = distanceBetweenPoints(x, y, nodes[i].display_position.x, nodes[i].display_position.y);
		// If the distance is shorter than the node radius, the click touched the node
		if ( distance < nodes[i].radius * 2 * _ui.zoom)
		{
			// Now we check if the click was closer to this node than all the other nodes
			if (min_distance === null || min_distance>distance)
			{
				distance = min_distance;
				closest_node = i;
			}
		}
	}
	return closest_node;
};


// Returns the number of the node expand/collapse button that is closest to the x,y position, 
// assuming that position is inside the collapse button
UserInterface.prototype.clickedExpandButton = function(x, y)
{
	var min_distance = null;
	var closest_button = -1;
	var nodes = _node_manager.nodes;

	for (var i = 0; i < nodes.length; i++)
	{
		// Don't bother checking nodes that are not visible
		if (nodes[i].display === false) continue;

		var radius = nodes[i].radius * _ui.zoom;
		// If the node is visible, calculate the distace to the point
		var distance = distanceBetweenPoints(x, y, nodes[i].display_position.x,
			 nodes[i].display_position.y + radius * 1.5);
		// If the distance is shorter than the expand button radius, the click touched the button
		if ( distance < radius/2)
		{
			// Now we check if the click was closer to this node than all the other nodes
			if (min_distance === null || min_distance>distance)
			{
				distance = min_distance;
				closest_button = i;
			}
		}
	}
	return closest_button;
};


// Returns the number of the parent and child nodes that for the connection closest to 
// the x,y position, assuming the connection line is close enough to the click
UserInterface.prototype.clickedConnection = function(x, y)
{
	var nodes = _node_manager.nodes;

	// Go through all the nodes...
	for (var i = 0; i < nodes.length; i++)
	{
		// Check if the click landed on any of this node child connections
		var connection_clicked = nodes[i].childConnectionClicked(_ui.ctx, x, y)
		if ( connection_clicked !== -1)
		{
			return {parent:i, child: connection_clicked};
		} 
	}

	// Otherwise return a null object
	return null;
};


// Returns the number of the node selector under the specified coordinates
UserInterface.prototype.touchingNewNodeSelector = function(x, y)
{
	//var nodes = _node_manager.nodes;
	var nodes_types = _node_manager.node_types;

	// Base X position for the first node center
	var thisx = this.horizontal_margin + this.node_width/2;

	for (var n = 0; n < nodes_types.length; n++) 
	{
		var thisy = this.node_select_start_top + this.top_margin+this.node_height/2 +  n*(this.node_height+this.vertical_margin);
		//console.log( 'thisy:' + thisy);
		// We hit a new node selector, let's create a temp node
		if (distanceBetweenPoints(x, y, thisx, thisy) < this.sources_radius)
		{
			return n;
		}	
	}

	// Otherwise return a null object
	return null;
};


// Callback for when the left mouse button is pressed
UserInterface.prototype.mouseDownLeft = function (x,y) 
{
	//console.log("mouseDownLeft");
	var nodes = _node_manager.nodes;
	var nodes_types = _node_manager.node_types;
	// If we were panning a group of pasted noded, save the node positions
	if (this.pan_pasted)
	{
		this.pan_pasted = false;
		_version_manager.addVersion('change_paste');
		this.setNodeAnchors();
	}
	this.delete_selection = false;
	this.state_updated = false;
	this.pan_nodes = false;

	this.drag_start_x = x;
	this.drag_start_y = y;


	//console.log("---------------------------------------------------------");
	//console.log('mouseDownLeft: x:'+x+'  y:'+y+'  ctrlDown:'+ctrlDown+'  shiftDown:'+shiftDown);

	if (_ui.animation_type === ANIMATION_TYPE_NULL)
	{
		// Check if the click is hitting any node expand button
		var hit_node_button = this.clickedExpandButton(x, y);
		// A node button was clicked, let's do stuff!!!
		if (hit_node_button !== -1)
		{
			console.log("ZOMG hit_node_button:"+hit_node_button);
			// Check if the node is currently expanded or collapsed and toggles it
			nodes[hit_node_button].toggleExpansion(millis());

			_ui.startAnimation();
			return;
		}
	}


	// Check if the click is hitting any new node button
	var hit_new_node = this.touchingNewNodeSelector(x, y);

	// A new node selctor was clicked, let's do stuff!!!
	if (hit_new_node !== null)
	{
		// Unselect all other nodes and connections
		_node_manager.unselectAll();

		// Make sure this type of node can be instantiated
		if (nodes_types[hit_new_node].enabled === false)
		{
			openPopUpMessage(lang['error_cannot_instantiate_node']);
			return;
		}

		console.log('New node!');

		// Get a pointer for the oorrect node type
		var source_node = _node_manager.node_types[hit_new_node];
		
		var valid = true;

		// If the node is unique, check if it already exists ont he tree
		if (source_node.unique) 
		{
			for (var i = 0; i < nodes.length; i++) 
			{
				if ( nodes[i].type == source_node.type)
				{
					// A duplicate unique node was found, won't create this one
					openPopUpMessage(lang['error_duplicate_unique_node']);
					valid = false;
					return;
				}
			}
		}

		// Otherwise all is good, let's create the new node
		if (valid) 
		{			
			// Use the node manager to create a node of the same type as the source node
			var new_node = _node_manager.createNewNode(source_node);

			console.log('#######################################################');
			console.log(new_node);
			console.log(new_node.device);

			new_node.setPosition( this.corner_x + x/_ui.zoom, this.corner_y + y/_ui.zoom );

			new_node.setAnchorPosition(this.corner_x + (x+100)/_ui.zoom, this.corner_y + y/_ui.zoom);


			// The new node needs to be selected so it can be dragged
			new_node.selected = true;

			this.selected_node = new_node;			

			// Mark that we're creating a new node (so we know that on mouseUp)
			this.new_node = true;
		}

		_ui.startAnimation();
		return;
	}


	// Check if the click is hitting any node
	var hit_node = this.touchingNode(x, y);		
	// A node was clicked, let's do stuff!!!
	if (hit_node !== null)
	{
		console.log("hit_node x:"+nodes[hit_node].virtual_position.x +"  y:"+nodes[hit_node].virtual_position.y);
		//console.log(nodes[hit_node]);
		//console.log(nodes[hit_node].children);

		// Display the properties of the currently selected node
		this.displayNodeProperties(nodes[hit_node]);					
		if (nodes[hit_node].selected)
		{
			// Clicking on a selected node with the shift down toggles the whole sub-tree
			if (shiftDown) nodes[hit_node].selectTree(false);
		}
		else
		{
			// When the shift is not pressed, we remove the previous selection
			if (!shiftDown) _node_manager.unselectAll();
			// Clicking on a unselected node adds the whole sub-tree to the selection
			nodes[hit_node].selectTree(true);
		}
		_ui.startAnimation();
		return;
	}


	// Check if the click is hitting any connection between nodes
	var hit_connection = this.clickedConnection(x, y);
	// A connection was clicked, let's do stuff!!!
	if (hit_connection !== null)
	{
		console.log("ZOMG hit_connection:"+hit_connection.parent+'  '+hit_connection.child);

		// When the shift is not pressed, we remove the previous selection
		if (!shiftDown) _node_manager.unselectAll();

		nodes[hit_connection.parent].toggleConnection( nodes[hit_connection.parent].children[hit_connection.child] );

		_ui.startAnimation();
		return;
	}

	// At this point, nothing was clicked... Let's start drawing a bounding box
	this.box_select = true;
	this.box_start_x = x;
	this.box_start_y = y;

	//console.log("drag_start_x:"+this.drag_start_x+"   drag_start_y:"+this.drag_start_y);

	// Delete the previouslly selected elements if shift is not pressed
	if (!shiftDown) 
	{
		_node_manager.unselectAll();
		_ui.selected_node = null;
		_ui.temporary_parent = null;
	}

	// Show the default toolbox, since no element is currently selected
	this.hidePropertiesBox();
};


// Callback for when the right mouse button is pressed
UserInterface.prototype.mouseDownRight = function (x,y) 
{
	console.log("mouseDownRight");
	var nodes = _node_manager.nodes;
	this.pan_pasted = false;
	this.delete_selection = false;
	this.state_updated = false;
	this.pan_nodes = false;

	// Check if the click is hitting any node
	var hit_node = this.touchingNode(x, y);
	// A node was clicked, let's do stuff!!!
	if (hit_node != null)
	{
		// Display the properties of the currently selected node
		this.displayNodeProperties(nodes[hit_node]);					
		if (nodes[hit_node].selected)
		{
			// Clicking on a selected node with the shift down toggles the node selection
			if (shiftDown) nodes[hit_node].setSelect(false);
		}
		else
		{
			// When the shift is not pressed, we remove the previous selection
			if (!shiftDown) _node_manager.unselectAll();
			// Clicking on a unselected adds the node to the selection
			nodes[hit_node].setSelect(true);
		}
		_ui.startAnimation();
		return;
	}

	// At this point, nothing was clicked... Let's start panning the canvas
	this.drag_start_x = x;
	this.drag_start_y = y;
	console.log("drag_start_x:"+this.drag_start_x+"   drag_start_y:"+this.drag_start_y);

	this.pan_canvas = true;
	_ui.startAnimation();
};


// Callback for when any of the mouse buttons are released
UserInterface.prototype.mouseUp = function (x,y) 
{
	//console.log("-------------------------------mouseUp");

	var nodes = _node_manager.nodes;
	_ui.startAnimation();

	// Are we supposed to unselect the current selection?
	if (this.delete_selection)
	{
		_node_manager.unselectAll();
		this.selected_node = null;
	}

	//console.log('this.selected_node:');	console.log(this.selected_node);

	// If we were dragging one or more nodes and we want to snap them to the grid
	// go through all the selected nodes and snap them
	if (this.grid_snap && this.selected_node !== null)
	{
		for (i = 0; i < nodes.length; i++)
		{		
			// Only snap the selected nodes
			if (nodes[i].selected) nodes[i].snapNode();
		}
	}

	// If we were dragging a node with no parent, 
	// let's see if it landed on top of another existing node
	if (this.selected_node !== null && this.selected_node.parent === null)
	{
		//console.log("BING: x:"+x+"  y:"+y);
		
		for (i = 0; i < nodes.length; i++)
		{		
			// Compare the node position with all the other nodes
			// Won't compare with itself, or with nodes that are not visible
			if (nodes[i] !==  this.selected_node && nodes[i].display &&
				distanceBetweenPoints(this.selected_node.virtual_position.x, this.selected_node.virtual_position.y, 
								nodes[i].virtual_position.x, nodes[i].virtual_position.y) < nodes[i].radius*2) 
			{
				console.log("LE DROP!!!");

				//_ui.connectSelectedNodes(nodes[i]);

				// No need to check any other nodes
				break;
			}
		}
	}
	// Seems we're not dragging a node on top of another, let's do this instead
	else 
	{
		if (this.selected_node !== null) 
		{
			_node_manager.autoArrangeTree();
		}
	}


	// If we are creating a new node, make sure it wil not stay behing the node selection tooltip
	// @todo this calculations are lame (replace the 100)
	if (this.new_node && x<100)
	{
		this.selected_node.restoreAnchor();
	}
	this.new_node = false;


	//if (this.temporary_parent && this.selected_node) 
	if (this.temporary_parent) 
	{
		_ui.connectSelectedNodes(this.temporary_parent);
		_node_manager.autoArrangeTree();
	}


	// If we're selecting nodes within a bounding box, let's check which ones 
	// are inside the box and mark those all as selected
	if (this.box_select)
	{
		if (!shiftDown) _node_manager.unselectAll();
		var x_start = Math.min(x, this.box_start_x);
		var x_end = Math.max(x, this.box_start_x);
		var y_start = Math.min(y, this.box_start_y);
		var y_end = Math.max(y, this.box_start_y);
		for (i = 0; i < nodes.length; i++)
		{
			nodes[i].included = false;

			if ( nodes[i].display_position.x > x_start && nodes[i].display_position.x < x_end &&
				 nodes[i].display_position.y > y_start && nodes[i].display_position.y < y_end)
			{
				nodes[i].selected = true;
			}
		}
	}

	this.pan_canvas = false;
	this.box_select = false;
	this.tree_moved = true;
	this.connecting_nodes = false;
	this.temporary_parent = null;

	_ui.startAnimation();


	if (this.pan_nodes)
	{
		this.setNodeAnchors();
	}

	if (this.state_updated)	_version_manager.addVersion('change_cenas');

	_node_manager.validateNodes();
};

var mouseover_timer = null;


// Callback for when the mouse moves (without any button pressed)
UserInterface.prototype.mouseMove = function (x,y) 
{
	//console.log("mouseMove");
	// Calculate the current position of the cursor relative to the virtual screen
	//var virtual_x = _ui.corner_x + x / _ui.zoom ;
	//var virtual_y = _ui.corner_y + y / _ui.zoom ;
	//console.log("x:"+x+"   y:"+y+"   corner_x:"+_ui.corner_x+"   corner_y:"+_ui.corner_y+"   virtual_x:"+virtual_x+"   virtual_y:"+virtual_y);

	var mouse_x = x, mouse_y = y;

	//console.log('mouseMove: x:'+x+'  y:'+y+ '  this.pan_pasted:'+this.pan_pasted);
	var nodes = _node_manager.nodes;

	// Get the offset of the draw since the last update
	var offset_x = this.drag_start_x - x;
	var offset_y = this.drag_start_y - y;
	// Set the current position as the last update		
	this.drag_start_x = x;
	this.drag_start_y = y;

	//console.log("drag_start_x:"+this.drag_start_x+"   drag_start_y:"+this.drag_start_y);

	// If we just pasted new nodes, let's move them as the mouse moves
	if (this.pan_pasted)
	{
		this.panSelectedNodes(offset_x, offset_y);
		_ui.startAnimation();
	}

	// Check if the mouse if hoovering a new node button
	var hit_node = this.touchingNewNodeSelector(x, y);
	
	if (hit_node !== null)
	{
		var node = _node_manager.node_types[hit_node];
		_ui.updateFooter(lang[node.type], lang[node.type+'_tooltip']);
	}


	// Check if the mouse if hoovering an existing node
	hit_node = this.touchingNode(x, y);
	
	if (hit_node !== null)
	{
		var node = _node_manager.nodes[hit_node];

		_ui.updateFooter(lang[node.type], node.getNodeDescription());
	}

};


// Callback for when the mouse stops over something (without any button pressed)
// This if triggerd automatically a certain amount of time after the mouse stops moving
UserInterface.prototype.mouseOver = function (x, y) 
{
	console.log("mouseOver");
	// Let's check if the mouse if hoovering something important!

	// Check if the mouse if hoovering a new node button
	var hit_new_node = this.touchingNewNodeSelector(x, y);
	
	if (hit_new_node !== null)
	{
		var node = _node_manager.node_types[hit_new_node].type;

		//openTooltip(lang[_node_manager.node_types[hit_new_node].type + '_tooltip'], x, y, ORIENTATION_RIGHT);
		
		//$('#footer_title').html(node.type);
	}
}


UserInterface.prototype.hooverHeader = function (event) 
{
	//console.log("hooverHeader");
	// Let's check if the mouse if hoovering something important!


	var id = event.target.id ;
	//console.log(text);

	_ui.updateFooter(lang[id], lang[id + '_tooltip']);
}


// Update the footer title and/or content, and updates any other elements
// that may need adjustments based on this new data (multitouch icons for instance)
UserInterface.prototype.updateFooter = function (title, content) 
{
	// Update the footer ocntents
	$('#footer_title').html(title);
	$('#footer_content').html(content);

	console.log(" $( '#div_properties' ).position().top:"+ $( '#footer_div' ).height());

	$('#touchscreen_div').css("bottom", $( '#footer_div' ).height());
}

// Callback for when the mouse moves (with a button pressed)
UserInterface.prototype.mouseDrag = function (x,y) 
{
	//console.log("mouseDrag");
	//console.log('mouseDrag: x:'+x+'  y:'+y);
	var nodes = _node_manager.nodes;

	// Get the offset of the draw since the last update
	var offset_x = this.drag_start_x - x;
	var offset_y = this.drag_start_y - y;
	// Set the current position as the last update		
	this.drag_start_x = x;
	this.drag_start_y = y;
	//console.log("drag_start_x:"+this.drag_start_x+"   drag_start_y:"+this.drag_start_y);

	// If we're not creating a selection box or panning the canvas, 
	// we're moving existing selected nodes
	if (!this.box_select && !this.pan_canvas) 
	{
		this.panSelectedNodes(offset_x, offset_y);
		this.pan_nodes = true;

		// If the focus node is set and not has a parent,
		if (this.selected_node !== null && this.selected_node.parent === null)
		{
			this.connecting_nodes = true;
			//console.log("connecting_nodes");
		}
	}


	// If we are trying to connect nodes, let's check if the mouse is
	// hoovering near a possible parent, and lock it if any is found
	if (this.connecting_nodes)
	{
		// Check if the mouse if hoovering an existing node
		var hit_node = this.touchingNode(x, y, this.selected_node );
		
		if (hit_node !== null)
		{
			var node = _node_manager.nodes[hit_node];

			// If the node can be a parent, mark it as the temporary parent
			if (node.valid_parent)
			{
				console.log("hoovering parent");
				this.temporary_parent = node;
			}
		}
	}


	// If we're panning the canvas we don't want to unselect all the nodes 
	if (this.pan_canvas) this.delete_selection = false;

	// If we're panning the canvas, we just need to move the corners of the view window
	if (this.pan_canvas) 
	{
		this.corner_x += offset_x/_ui.zoom;
		this.corner_y += offset_y/_ui.zoom;

		//console.log("this.corner_x:"+this.corner_x+"   this.corner_y:"+this.corner_y);
	}

	// If we are selecting an area for a bounding box, check which nodes are inside
	if (this.box_select)
	{
		var x_start = Math.min(x, this.box_start_x);
		var x_end = Math.max(x, this.box_start_x);
		var y_start = Math.min(y, this.box_start_y);
		var y_end = Math.max(y, this.box_start_y);
		for (var i = 0; i < nodes.length; i++)
		{
			// The nodes are considered "included" if they are within the square
			nodes[i].included = ( nodes[i].display_position.x > x_start && nodes[i].display_position.x < x_end &&
								  nodes[i].display_position.y > y_start && nodes[i].display_position.y < y_end);
		}
	}

	_ui.startAnimation();
};


// Try to create a connection between two nodes
// All the necessary tests to check if the connection is valid are performed here
UserInterface.prototype.connectSelectedNodes = function(parent)
{
	var nodes = _node_manager.nodes;
	// Adds all the selected nodes that have no parent as children of the base node
	for (var n=0; n<nodes.length; n++ )
	{
		var node = nodes[n];
		if (node.selected && node.parent === null)
		{

			// Don't allow to add more nodes to leaf nodes 
			if (parent.type.max_children === 0) 
			{
				openPopUpMessage(lang['error_leaf']);
				break;
			}
			
			// Don't allow a node to be a child of a descendant
			// (this would create a closed infinite loop)
			if (parent.checkAncestors(node)) 
			{
				openPopUpMessage(lang['error_loop']);
				this.temporary_parent = null;
				break;
			}

			// Make sure not to add more than one node to a parent node that can only have one child
			if (parent.children.length >= parent.max_children)
			{
				openPopUpMessage(lang['error_too_many_children']);

				console.log("nodes[i] "+nodes[i].display_position.x+"  "+nodes[i].display_position.x);
				console.log(this.selected_node);
				break;
			}

			// All the conditions were met, so we can add this node as a child of the parent node
			parent.addChild( nodes[n] );
		}
	}

	// If we have auto arrange enabled, we need need to update the nodes
	_node_manager.autoArrangeTree(true);

	// @todo chech this out...
	this.restoreNodeAnchors();
}

// Pan all the selected nodes in the tree by a specific offset
UserInterface.prototype.panSelectedNodes = function(x, y)
{
	var nodes = _node_manager.nodes;
	var zoom_x = x/this.zoom;
	var zoom_y = y/this.zoom;
	for (var i = 0; i < nodes.length; i++) 
	{
		if ( nodes[i].selected ) 
		{				
			nodes[i].moveNode(zoom_x, zoom_y);
		}
	}
	this.state_updated = true;
};


// Update the position of the temporary node (used when creating new nodes)
UserInterface.prototype.updateTempNodePosition = function (x,y) 
{
	this.tempx = x;
	this.tempy = y;
};


// Display the properties of a specific node in the properties div
UserInterface.prototype.displayNodeProperties = function(new_node) 
{
	//console.log("displayNodeProperties");
	//console.log(new_node);
	var ui = this;

	var pos;
	// If a new node is specified, we set the focus on that node
	if (new_node)
	{
		//console.log("NOT UNDEFINED");
		this.selected_node = new_node;
	}

	//console.log(pos);
	//console.log(_node_manager.nodes);
	var node = this.selected_node;

	//console.log(node);

	$('#properties_display_box').css('display', 'block');

	// properties table
	var html = 
		"<div class='div_header'>"+lang['node_properties']+"</div>"+

		"<table>"+
		/*
			// add name, editable textbox
			"<tr>"+
				"<td><img class='node_properies_image' src='"+images.getImageUrl(node.img_id)+"'></img></td>"+
				"<td>"+lang[node.type]+"</td>"+
			"</tr><tr>"+
				"<td>"+lang['name']+"</td>"+
				"<td><input id='text_node_name' value='"+ node.name+ "'/></td>"+
			"</tr>"+
		*/	
			// add name, editable textbox
			"<tr>"+
				"<td><img class='node_properies_image' src='"+images.getImageUrl(node.img_id)+"'></img></td>"+
				"<td><input id='text_node_name' value='"+ node.name+ "'/></td>"+
			"</tr>"+
		"</table>"+

		// node-specific properties
		node.listProperties(this.selected_node.data)+

		"</div>";
	
	// Possible error or warning messages the node might have
	//html += node.showErrors();

	$('#properties_display_box').html(html);

	console.log( "BANANAS:"+$('#properties_display_box').outerHeight() );

/*
	var div= document.getElementById('properties_display_box'); // need real DOM Node, not jQuery wrapper
	//var hasVerticalScrollbar= div.scrollHeight>div.clientHeight;
	console.log( "div.scrollHeight:"+div.scrollHeight );
	console.log( "div.clientHeight:"+div.clientHeight );
	
	console.log( "hasVerticalScrollbar:"+hasVerticalScrollbar );
*/


	this.adjustPropertiesWidth();

	// Add listener for the name update
	$('#text_node_name').on( 'input', function()
	{
		ui.selected_node.name = $('#text_node_name').val();
		ui.draw();
	});

	// Add the listeners for the specific node properties
	//console.log("############################");
	//console.log(ui.selected_node.data);

	node.addListPropertiesListeners(ui.selected_node.data);

	// Add listener for the save properties button
	$('.img_toggle_section').click( this.toggleNodePropertiesView );

	this.draw();
};


// Update the properties_display_box width depending on the scrollbar
UserInterface.prototype.adjustPropertiesWidth = function() 
{
	//console.log ( $( window ).height() );
	//console.log ( $( '#properties_display_box' ).height() );
	//console.log ( $( '#div_properties' ).position().top );

	var padding = ( $( window ).height() < $( '#properties_display_box' ).height() + $( '#div_properties' ).position().top) ? this.scrollbar_width : 0;

	//console.log("padding:"+padding);

	$('#properties_display_box').css('padding-right', padding+'px');
};


// Toggles the visibility of a specific section of a node's properties
UserInterface.prototype.toggleNodePropertiesView = function(e) 
{
	toggleSectionVisibility(e, _ui.selected_node);
};	


// ------------------------------------------------------------------------------------
// 								CONNECTION METHODS
// ------------------------------------------------------------------------------------

// Update the com port selector with the avalilable connections
UserInterface.prototype.showComPorts = function() 
{
	var selector = $('#select_com_port');

	var html = '';
	for (var i=0; i<com_ports_list.length; i++)
	{
		html += "<option value='"+i+"'' class='com_option'>"+com_ports_list[i]+"</option>";
	}
	if (com_ports_list.length === 0)  html += "<option value='-1' class='com_option'>No ports available</option>";
	$(selector).html(html);
};


// Show the state of tue currently connected com port (connected/disconnected)
UserInterface.prototype.showComPortState = function()
{
	var file = "connection_" + (connected_com_port === '' ? 'disconnected' : 'connected');

	$('#button_com_connect').attr('src', 'images/header/'+file+'.svg');

	this.updateCommunicationButtonsState();	
};


// Toggles the connection state of the active COM port
UserInterface.prototype.toggleComPortConnection = function()
{
	if (connected_com_port === '') 
	{
		connectComPort();
	}
	else 
	{ 
		disconnectComPort();
	}
};


// Hide the node properties box
UserInterface.prototype.hidePropertiesBox = function() 
{
	$('#properties_display_box').css('display', 'none');
	_ui.editing_properties = false; 
};


// Instantiates a new tree from data read from a file
UserInterface.prototype.createTree = function(data)
{

	_node_manager.resetTree();
	_version_manager.importJson(data, true);

	_ui.startAnimation();
};


// Loads a new tree from a file URL parameter
UserInterface.prototype.loadFromURL = function(file_url)
{
	console.log("############ loadFromFile"+file_url);
	// ajax call to load the game JSON file
	$.ajax({
	    url: file_url,
	    dataType: 'text',
	    success: this.createTree,
	    error: function( data ) { openPopUpMessage( "ERROR LOADING FILE: " + file_url ); }
	});
};


// Callback for when we open the load file window
UserInterface.prototype.loadFile = function()
{
	// @todo confirm with the user here?
	//var r = window.confirm(lang['confirm_load']);
	var r = true;
	if (r===true)
	{
		_node_manager.resetTree()
	  	var fileToLoad = document.getElementById("button_load_local").files[0];
		var fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent)
		{
			var textFromFileLoaded = fileLoadedEvent.target.result;
			//g.import_json(textFromFileLoaded);
			_version_manager.importJson(textFromFileLoaded, true);
		};
		fileReader.readAsText(fileToLoad, "UTF-8");
		_ui.startAnimation();
	}
};


// Opens a new tree from a file
UserInterface.prototype.openTree = function()
{
  	var fileToLoad = document.getElementById("button_load_local").files[0];

  	console.log(fileToLoad);

	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) 
	{
		_ui.createTree(fileLoadedEvent.target.result);
	};
	fileReader.readAsText(fileToLoad, "UTF-8");
};



UserInterface.prototype.exportToFile = function() 
{
	var textToWrite = _node_manager.exportTreeJson();
	console.log(textToWrite);
	
	var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
	var fileNameToSaveAs = 'export.json';

	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (window.URL != null)
	{
		// Chrome allows the link to be clicked
		// without actually adding it to the DOM.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
	}
	else
	{
		// Firefox requires the link to be added to the DOM
		// before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = function(event) {
				document.body.removeChild(event.target);
			};
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();
};


