var IMAGES_PER_LINE = 5;

var images = 
{
	list: [],
	open_selector: '',

	addImage: function(id, type, url)
	{
		if (this.list[id] !== undefined)
		{
			console.error('Duplicate image ID:'+id);
			return;
		}
		this.list[id] = new Image();
		this.list[id].src = url;
		this.list[id].img_id = id;
		this.list[id].type = type;
	},

	getImage: function(id)
	{
		var image = this.list[id];

		if (typeof image === 'undefined') console.error("ERROR: Image '"+id+"' not defined!"); 
		return image;
	},

	getImageUrl: function(id)
	{
		//console.log("getImageUrl:"+id);
		var image = this.list[id];
		return image.src;
	},

	createImageSelector: function(div, target, type)
	{
		if (images.open_selector !== '')
		{
			collapseDiv(div, 300);

			//$('#'+images.open_selector).html('');
			images.open_selector = '';
			return;			
		}

		images.open_selector = div;
		var html = "<table id='table_image_selectors'><tr>";
		var column = 0;
		for (image in images.list)
		{
			if (column === 0) html += "<tr>";
			//console.log(images.list[image]);
			if (images.list[image].type !== type) continue;
			html += "<td><image class='image_selector' img_id='"+image+"' img_target='"+target+"'' src='"+images.list[image].src+"'></image></td>";

			column++;
			if (column === IMAGES_PER_LINE) 
			{
				html += "</tr>";
				column = 0;
			}
		}
		html += "</tr></table>";

		//console.log(html);

		$('#'+div).html(html);

		expandDiv(div, 300);

		$('.image_selector').click(images.selectImage);

	},
	selectImage: function(event)
	{
		var img_id = $(event.target).attr('img_id');
		var img_target = $(event.target).attr('img_target');
		console.log('selectImage:' + img_id );
		console.log('img_target:' + img_target );
		console.log(images.list[img_id]);

		$('#'+img_target).attr('src', images.list[img_id].src).
						  attr('img_id', img_id);

		$('#'+images.open_selector).html('');
		images.open_selector = '';

	}
};

// Nodes
images.addImage('node_root', 'system', 'images/nodes/node_root.svg');
images.addImage('node_delay_time', 'system', 'images/nodes/node_delay.svg');
//images.addImage('import', 'system', 'images/nodes/node_import.svg');
images.addImage('node_test', 'system', 'images/nodes/node_test.svg');
	images.addImage('node_test_equal', 'system', 'images/nodes/node_test_equal.svg');
	images.addImage('node_test_different', 'system', 'images/nodes/node_test_different.svg');
	images.addImage('node_test_bigger', 'system', 'images/nodes/node_test_bigger.svg');
	images.addImage('node_test_smaller', 'system', 'images/nodes/node_test_smaller.svg');
	images.addImage('node_test_inside_range', 'system', 'images/nodes/node_test_inside_range.svg');
	images.addImage('node_test_outside_range', 'system', 'images/nodes/node_test_outside_range.svg');
	images.addImage('node_test_increase_value', 'system', 'images/nodes/node_test_increase_value.svg');
	images.addImage('node_test_decrease_value', 'system', 'images/nodes/node_test_decrease_value.svg');
	images.addImage('node_test_change_value', 'system', 'images/nodes/node_test_change_value.svg');


images.addImage('node_function', 'system', 'images/nodes/node_function.svg');
	images.addImage('node_function_copy', 'system', 'images/nodes/node_function_assign.svg');
	images.addImage('node_function_map', 'system', 'images/nodes/node_function_map.svg');
	images.addImage('node_function_random', 'system', 'images/nodes/node_function_random.svg');
	images.addImage('node_function_range', 'system', 'images/nodes/node_function_range.svg');


images.addImage('node_parallel', 'system', 'images/nodes/node_parallel.svg');
	images.addImage('node_parallel_rule_failure_one', 'system', 'images/nodes/node_parallel_rule_failure_one.svg');
	images.addImage('node_parallel_rule_failure_all', 'system', 'images/nodes/node_parallel_rule_failure_all.svg');
	images.addImage('node_parallel_rule_success_one', 'system', 'images/nodes/node_parallel_rule_success_one.svg');
	images.addImage('node_parallel_rule_success_all', 'system', 'images/nodes/node_parallel_rule_success_all.svg');


images.addImage('node_sequence', 'system', 'images/nodes/node_sequence.svg');
images.addImage('node_status_override', 'system', 'images/nodes/node_override.svg');

images.addImage('plus', 'system', 'images/nodes/node_expand_plus.svg');
images.addImage('minus', 'system', 'images/nodes/node_expand_minus.svg');
images.addImage('arrow_right', 'system', 'images/nodes/node_arrow_right.svg');
images.addImage('arrow_down', 'system', 'images/nodes/node_arrow_down.svg');
images.addImage('node_running_gear', 'system', 'images/nodes/node_running_gear.svg');

images.addImage('node_error', 'system', 'images/nodes/node_error.svg');
images.addImage('node_warning', 'system', 'images/nodes/node_warning.svg');


// Devices
// Generic devices
images.addImage('device_motor', 'output', 'images/devices/device_differential_motor.svg');
images.addImage('device_output_digital', 'output', 'images/devices/device_digital_output.svg');
images.addImage('device_input_digital', 'output', 'images/devices/device_digital_input.svg');
images.addImage('device_input_analog', 'output', 'images/devices/device_analog_input.svg');
images.addImage('device_output_analog', 'output', 'images/devices/device_analog_output.svg');

// Gyro specific devices
images.addImage('device_gyro_motor', 'output', 'images/devices/device_differential_motor.svg');
images.addImage('device_gyro_distance_sensor', 'output', 'images/devices/device_analog_input.svg');
images.addImage('device_gyro_light_sensor', 'output', 'images/devices/device_analog_input.svg');

//Specific devices
images.addImage('device_led_red', 'output', 'images/devices/device_led_red.svg');
images.addImage('device_led_blue', 'output', 'images/devices/device_led_blue.svg');
images.addImage('device_led_green', 'output', 'images/devices/device_led_green.svg');

images.addImage('device_knob', 'output', 'images/devices/device_knob.svg');

images.addImage('device_bot_bumper_left', 'output', 'images/devices/device_bot_bumper_left.svg');
images.addImage('device_bot_bumper_right', 'output', 'images/devices/device_bot_bumper_right.svg');
images.addImage('device_bot_motor_left', 'output', 'images/devices/device_bot_motor_left.svg');
images.addImage('device_bot_motor_right', 'output', 'images/devices/device_bot_motor_right.svg');


images.addImage('powered_by_artica', 'misc', 'images/header/logo_poweredbyartica.png');



/*
HEADER:
	connection_connected.svg
	connection_disconnected.svg
	browse_trees.svg
	save_tree.svg
	arduino_upload_ram.svg
	arduino_upload_eeprom.svg
	arduino_clear_eeprom.svg

	tree_state_play.svg
	tree_state_stop.svg
	tree_state_pause.svg
	tree_state_step.svg

	toggle_labels_view.svg
	toggle_grid_view.svg
	toggle_help_view.svg

	tree_share.svg

	user_login.svg
	user_logout.svg


DEVICES:
	// Generic devices
	device_differential_motor.svg
	device_digital_output.svg
	device_digital_input.svg
	device_analog_input.svg
	
	device_analog_output.svg

	//Specific devices
	device_led_red.svg
	device_led_yellow.svg
	device_led_green.svg

	device_knob.svg

	device_bot_bumper_left.svg
	device_bot_bumper_right.svg
	device_bot_motor_left.svg
	device_bot_motor_right.svg


NODES:
	node_root.svg
	node_delay.svg
	node_import.svg
	node_test.svg
	node_function.svg
	node_sequence.svg
	node_parallel.svg
	node_override.svg
	node_expand_plus.svg
	node_expand_minus.svg
	node_arrow_right.svg
	

MENUS:
	button_close_window.svg
	button_add_element.svg
	button_section_expand.svg
	button_section_collapse.svg
	button_element_expand.svg
	button_element_collapse.svg
	button_element_delete.svg
	button_element_update.svg

 */




