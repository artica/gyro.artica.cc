
//
// Root Node
//


function NodeRoot(id, name, data) 
{
	// Categorize this node type
	this.type = 'node_root';
	this.unique = true;
	this.min_children = 1;
	this.max_children = 1;

	this.view_properties = true;
	this.view_devices = true;
	this.view_variables = true;

	// Call the generic constructor to initialize default node data
	Node.call(this, id, name, data);
	return this;
}

// Inherit from the Node class
NodeRoot.inheritsFrom(Node);

// All the prototype definitions MUST be added after this point


// Default data to create new nodes of this type
NodeRoot.prototype.DEFAULT_NODE_DATA  = {tags: "", description:""};


// Returns the html for the beginning of a collaplsable section
function createCollapsableSection(name, id, hidden_sections)
{
	// Let's see if this section is supposed to be visible or not
	var hidden = hidden_sections['div_data_'+id];

	var button = "images/menus/button_section_"+(hidden?'expand':'collapse')+".svg"
	return "<div id='div_header_"+id+"' class='div_header'>"+
		"<span class='span_header_name'>"+name+"</span>"+
		"<img id='img_toggle_"+id+"' class='img_toggle_section' src='"+button+"'></img>"+
		"</div>"+
		"<div id='div_data_"+id+"' class='div_data' style='display:"+(hidden?'none':'block')+"'>";
}

// Get a string with an HTML block to configure this node type
NodeRoot.prototype.listProperties = function(data) 
{
	//console.log("ROOT listProperties");
	//console.log(_device_manager.devices);

	var output = createCollapsableSection(lang['description'], 'properties', this.hidden_elements) +
		"<table>"+
			"<tr><td>"+lang['tags']+"</td><td><input type='text' id='text_tree_tags' value='"+ data.tags+ "'/></td></tr>"+
			"<tr><td>"+lang['description']+"</td><td><textarea id='textarea_tree_description'>"+ data.description+ "</textarea></td></tr>"+	
		"</table>";
	output += "</div>";

	output += createCollapsableSection(lang['devices'], 'devices', this.hidden_elements) +
		"<table class='table_object_list'>"+
		"<tr><th class='td_device_image'>"+lang['image']+"</th>"+
		"<th class='td_device_name'>"+lang['name']+"</th>"+
		"<th class='td_device_type'>"+lang['type']+"</th>"+
		"<th class='td_device_configuration'>"+lang['configuration']+"</th></tr></table>";

	// List the hardware device configuration
	for (var i=0; i<_device_manager.devices.length; i++) 
	{
		var device = _device_manager.devices[i];
		// Create the lines of the table with the basic device information (always visible)
		output += "<table><tr class='tr_device_select "+
			(i%2===0? "even_row": "odd_row")+
			"' device_number='"+i+"'>"+
			"<td style='width:10%'><image class='image_list' src='"+device.getImage().src+"'></image></td>"+
			"<td style='width:30%'>"+device.toString()+"</td>"+
			"<td style='width:30%'>"+device.toStringType()+"</td>"+
			"<td style='width:30%'>"+device.toStringConfiguration()+"</td></tr></table>";

		// Create the lines of the table with the buttons to update/delete/hide the devices
		output += "<div id='div_device_properties_"+i+"' style='display:"+
			( device.visible? 'block': 'none') + "'><table><tr>"+
			"<td><img class='button_update_device' device_number='"+i+"' src='images/menus/button_element_update.svg'></img></td>"+
			"<td><img class='button_delete_device' device_number='"+i+"' src='images/menus/button_element_delete.svg'></img></td>"+
			//"<td><img class='button_collapse_device' device_number='"+i+"' src='images/menus/button_section_collapse.svg'></img></td>"+
			"</tr></table><table>";

		// Get the image used for the device
		var image = device.getImage();

		// Create the expandable areas with device information
		output += "<tr><td>"+lang['name']+"</td><td><input type='text' id='name_device_"+i+"'"+
			" value='"+device.name+"'></input></td></tr>"+
			"<tr><td>"+lang['image']+"</td><td><img id='image_device_"+i+"' class='image_device' "+
			"img_id='"+image.img_id+"' device_number='"+i+"' src='"+image.src+"'/></td></tr>"+
			"</table>"+
			"<div id='images_selector_"+i+"'></div>";

		// Now we add the configuration properties for the selected device type
		output += device.listProperties() +
			"</div>";
				
	}

	// Adds a line with an option to add a new device
	output += "<table><tr>"+
				"<td>"+lang['Add']+"</td>"+		
				"<td><select id='select_new_device'>";

	// List all the existing device types, selecting the last selected type as the default
	for (d = 0; d < _device_manager.device_types.length; d++) 
	{
		output += "<option id='select_device'"+(_device_manager.new_device_type===d? " selected='true'": "")+
			" value='"+d+"'>" + _device_manager.device_types[d].toStringType() + "</option>";
		//console.log(_device_manager.device_types[d].toStringType());
	}

	output += "</select></td>"+
			"<td><img id='img_new_device' src='images/menus/button_add_element.svg'></img></td>"+
			"</tr></table>";

	output += "</div>";


	// Variable stuff
	output += createCollapsableSection(lang['variables'], 'variables', this.hidden_elements) +
		"<table class='table_object_list'>"+
		"<th class='td_variable_name'>"+lang['name']+"</th>"+
		"<th class='td_variable_type'>"+lang['type']+"</th>"+
		"<th class='td_variable_configuration'>"+lang['initial_value']+"</th></tr></table>";

	console.log(_variable_manager.variables);

	// List the variables configutarion
	for (var i=0; i<_variable_manager.variables.length; i++) 
	{
		var variable = _variable_manager.variables[i];
		// Create the lines of the table with the basic variable information (always visible)
		output += "<table><tr class='tr_variable_select "+
			(i%2===0? "even_row": "odd_row")+			
			"' variable_number='"+i+"'>"+
			"<td style='width:30%'>"+variable.toString()+"</td>"+
			"<td style='width:35%'>"+variable.toStringType()+"</td>"+
			"<td style='width:35%'>"+variable.toStringConfiguration()+"</td></tr></table>";

		// Create the lines of the table with the buttons to update/delete/hide the variables
		output += "<div id='div_variable_properties_"+i+"' style='display:"+
			( variable.visible? 'block': 'none') + "'><table><tr>"+
			"<td><img class='button_update_variable' variable_number='"+i+"' src='images/menus/button_element_update.svg'></img></td>"+
			"<td><img class='button_delete_variable' variable_number='"+i+"' src='images/menus/button_element_delete.svg'></img></td>"+
			"<td><img class='button_collapse_variable' variable_number='"+i+"' src='images/menus/button_section_collapse.svg'></img></td>"+
			"</tr></table><table>"+
			"<tr><td>"+lang['type']+"</td><td>"+
			variable.toStringType();

		// Create the expandable areas with variable information
		output += "</td></tr>"+
			"<tr><td>"+lang['name']+"</td><td><input type='text' id='name_variable_"+i+"'"+
			" value='"+variable.name+"'></input></td></tr>"+

			"</table>";

		// Now we add the configuration properties for the selected variable type
		output += variable.listProperties() +
			"</div>";
				
	}

	// Adds a line with an option to add a new variable
	output += "<table><tr>"+
				"<td>"+lang['Add']+"</td>"+		
				"<td><select id='select_new_variable'>";

	// List all the existing variable types, selecting the last selected type as the default
	for (d = 0; d < _variable_manager.variable_types.length; d++) 
	{
		output += "<option id='select_variable'"+(_variable_manager.new_variable_type===d? " selected='true'": "")+
			" value='"+d+"'>" + _variable_manager.variable_types[d].toStringType() + "</option>";
		//console.log(_variable_manager.variable_types[d].toStringType());
	}

	output += "</select></td>"+
			"<td><img id='img_new_variable' src='images/menus/button_add_element.svg'></img></td>"+
			"</tr></table>"+
			"</div>";

	return output;
};


// Add the listeners for changes in the configuration
NodeRoot.prototype.addListPropertiesListeners = function(data) 
{
	// Necessary variable to access the data from the callback functions
	var node_data = data;

	//$('#div_header_properties').css('display', (this.view_properties ? 'block' : 'none'));

	// Callback to save the new temporary value for the tree tags
	$('#text_tree_tags').on('change', function() 
		{
			node_data.tags = $('#text_tree_tags').val();
			_ui.displayNodeProperties();
		});


	// Callback to save the new temporary value to the tree description
	$('#textarea_tree_description').on('change', function() 
		{
			node_data.description = $('#textarea_tree_description').val();
			_ui.displayNodeProperties();
		});

	// Selector to change the type of the new device to be created
	$('#select_new_device').on('change', function() 
		{
			_device_manager.new_device_type = parseInt($('#select_new_device').val(), 10);
		});

	// Button to add a new device to the device list with default values
	$('#img_new_device').on('click', function() 
		{
			// Create a new device based to the 'select_new_device' selector value
			var new_device = _device_manager.device_types[_device_manager.new_device_type].createDefaultDevice();
			_device_manager.devices.push(new_device);

			console.log("##########################################################################");
			console.log(new_device);

			// Reorder the existing devices and variables after creating a new device
			_version_manager.reorderAllVarTypes();
			console.log(new_device);

			// Now we refresh the properties window with the new data
			_ui.displayNodeProperties();

			// Save the new version of the tree with the new device
			_version_manager.addVersion('change_add_device');
		});

	// Button to update the settings of an existing device
	$('.button_update_device').on('click', function() 
		{
			// Try to update the device settings
			console.log("Updating...");

			// Get the device number and new device name from the forms
	        var device_number = parseInt(getHtmlAttr(event, 'device_number'), 10);
			var name = $('#name_device_'+device_number).val();

			// Get the a pointer to the old device to be updated
			var device = _device_manager.devices[device_number];

			// Update the device with the new settings from the UI
			device.updateDevice(device_number);

			console.log(device);

			console.log('-------> #image_device_'+device_number);

			// Now we set the (possibly) new name and image for the device
			device.name = name;
			device.setImage( $('#image_device_'+device_number).attr('img_id') );

			//console.log( 'zomg:' + $('#img_selected').attr('img_id') );

			// Now we refresh the properties window with the new data
			_ui.displayNodeProperties();

			// Save the new version of the tree with the updated device
			_version_manager.addVersion('change_update_device');
			
		});

	// Button to delete an existing device
	$('.button_delete_device').on('click', function() 
		{
			// Try to update the device settings
			console.log("Deleting...");
	        var device_number = parseInt(getHtmlAttr(event, 'device_number'), 10);

	        // Remove the desired position from the device list
			_device_manager.devices.splice(device_number, 1);

			// Reorder the existing devices and variables after deleting a new device
			_version_manager.reorderAllVarTypes();

			// Now we refresh the properties window with the new device list
			_ui.displayNodeProperties();

			// Save the new version of the tree without the removed device
			_version_manager.addVersion('change_remove_device');

		});


	$('.button_collapse_device').on('click', function(event) 
		{
	        var device_number = parseInt(getHtmlAttr(event, 'device_number'), 10);
			collapseDiv('div_device_properties_'+device_number, 300);				
			_device_manager.devices[device_number].visible = false;
		});

	$('.tr_device_select').click( function(event) 
	{
        var device_number = parseInt(getHtmlAttr(event, 'device_number'), 10);

		_device_manager.devices[device_number].visible = !_device_manager.devices[device_number].visible;
		// Now we refresh the properties window with the new data

		//_ui.displayNodeProperties();

		if (_device_manager.devices[device_number].visible)
			expandDiv('div_device_properties_'+device_number, 300);
		else 
			collapseDiv('div_device_properties_'+device_number, 300);				

	});

	$('.image_device').click( function(event) 
		{ 
			console.log("MEH!");
	        var device_number = parseInt(getHtmlAttr(event, 'device_number'), 10);

	        // @todo 'output' num pode ser carago... mudar isto

			images.createImageSelector('images_selector_'+device_number, 'image_device_'+device_number, 'output'); 
		} );


	// Selector to change the type of the new device to be created
	$('#select_new_variable').on('change', function() 
		{
			_variable_manager.new_variable_type = parseInt($('#select_new_variable').val(), 10);
		});

	// Button to add a new device to the device list with default values
	$('#img_new_variable').on('click', function() 
		{
			// Create a new device based to the 'select_new_device' selector value
			var new_variable = _variable_manager.variable_types[_variable_manager.new_variable_type].createDefaultVariable();
			_variable_manager.variables.push(new_variable);

			console.log("##########################################################################");
			console.log(new_variable);

			// Reorder the existing devices and variables after creating a new variable
			_version_manager.reorderAllVarTypes();

			// Now we refresh the properties window with the new data
			_ui.displayNodeProperties();

			// Save the new version of the tree with the new device
			_version_manager.addVersion('change_add_variable');
		});

	// Button to update the settings of an existing device
	$('.button_update_variable').on('click', function() 
		{
			// Try to update the device settings
			console.log("Updating variable...");

			// Get the device number and new device name from the forms
	        var variable_number = parseInt(getHtmlAttr(event, 'variable_number'), 10);
			var name = $('#name_variable_'+variable_number).val();

			// Get the a pointer to the old device to be updated
			var variable = _variable_manager.variables[variable_number];

			console.log(variable);

			console.log('-------> #image_variable_'+variable_number);

			// Now we set the (possibly) new name and image for the variable
			variable.name = name;

			// Now we refresh the properties window with the new data
			_ui.displayNodeProperties();

			// Save the new version of the tree with the updated device
			_version_manager.addVersion('change_update_variable');
			
		});

	// Button to delete an existing variable
	$('.button_delete_variable').on('click', function() 
		{
			// Try to update the variable settings
			console.log("Deleting variable...");
	        var variable_number = parseInt(getHtmlAttr(event, 'variable_number'), 10);

	        // Remove the desired position from the device list
			_variable_manager.variables.splice(variable_number, 1);

			// Reorder the existing devices and variables after deleting a new variable
			_version_manager.reorderAllVarTypes();

			// Now we refresh the properties window with the new device list
			_ui.displayNodeProperties();

			// Save the new version of the tree without the removed device
			_version_manager.addVersion('change_remove_variable');
		});


	$('.button_collapse_variable').on('click', function(event) 
		{
	        var variable_number = parseInt(getHtmlAttr(event, 'variable_number'), 10);
			collapseDiv('div_variable_properties_'+variable_number, 300);				
			_variable_manager.variables[variable_number].visible = false;
		});

	$('.tr_variable_select').click( function(event) 
	{
        var variable_number = parseInt(getHtmlAttr(event, 'variable_number'), 10);

		_variable_manager.variables[variable_number].visible = !_variable_manager.variables[variable_number].visible;


		if (_variable_manager.variables[variable_number].visible)
			expandDiv('div_variable_properties_'+variable_number, 300);
		else 
			collapseDiv('div_variable_properties_'+variable_number, 300);				

	});

};


// Return a string with hex encoded data representing this node
NodeRoot.prototype.exportNodeToArduino = function(node) 
{
	return Node.prototype.exportNodeToArduino.call(this) +
		padByte(NODE_SEQUENCE) + padByte(this.children.length) + padLong(0) + ';';
};


/*
// Check if the node is valid
NodeRoot.prototype.validate = function()
{
	// The root needs to have exactlly 1 child
	if ( this.children.length !== 1)
	{
		this.error_state = NODE_STATE_ERROR;
		this.error_message = 'error_missing_single_child';
		return;
	}

	// If no errors were found, let's assume the node is fine
	this.error_state = NODE_STATE_NO_ERROR;
	this.error_message = '';		
};
*/
