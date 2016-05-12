
// Text strings for the English language

var lang = [];


// *************************************************************************************************
// **************************************** HEADER BUTTONS *****************************************
// *************************************************************************************************

lang['button_load_local'] = "Local file Load";
lang['button_load_local_tooltip'] = "Save the tree in a local file.";

lang['button_save_local'] = "Local file Save";
lang['button_save_local_tooltip'] = "Save the tree in a local file.";

lang['button_save_local'] = "Local Save";
lang['button_save_local_tooltip'] = "Save the tree in a local file.";

lang['button_load_net'] = "Online Browse";
lang['button_load_net_tooltip'] = "Browse the trees on the server.";

lang['button_save_net'] = "Online Save";
lang['button_save_net_tooltip'] = "Save the tree on my Visualino account.";

lang['button_com_connect'] = "Connect/disconnect COM port";
lang['button_com_connect_tooltip'] = "Connect/disconnect the interface to the selected port.";

lang['select_com_port'] = "COM Port Select";
lang['select_com_port_tooltip'] = "Select the COM port that will be used to connect to the Arduino.";

lang['canvas_free_ram'] = "Used RAM.";
lang['canvas_free_ram_tooltip'] = "Displays the amount of used RAM on the Arduino.";

lang['canvas_upload_progress'] = "Upload Progress";
lang['canvas_upload_progress_tooltip'] = "Displays the status of the last upload to the arduino";

lang['image_tree_state'] = "Tree State";
lang['image_tree_state_tooltip'] = 	"This image represents the state of the current tree.<br>"+
									"<b>Green</b> means the tree is ok and can be uploaded.<br>"+
									"<b>Yellow</b> means the tree can me uploaded, but some parts can be improved.<br>"+
									"<b>Red</b> means there is an error, the tree is invalid and needs to be fixed.";

lang['button_upload_arduino'] = "Upload to RAM";
lang['button_upload_arduino_tooltip'] = "Upload the current tree to the connected Arduino. The tree will only be saved in the RAM, meaning that if the Arduino resets the tree will be erased.";

lang['button_save_eeprom'] = "Upload to EEprom";
lang['button_save_eeprom_tooltip'] = "Upload the current tree to the connected Arduino. The tree will be saved in the RAM and EEprom, meaning that if the Arduino resets the tree will start running again.";

lang['button_delete_eeprom'] = "Delete EEprom";
lang['button_delete_eeprom_tooltip'] = "Delete any tree that is stored in the Arduino EEprom.";

lang['button_run_tree'] = "Run Tree";
lang['button_run_tree_tooltip'] = "Start executing the tree currently on the Arduino.";

lang['button_stop_tree'] = "Stop Tree";
lang['button_stop_tree_tooltip'] = "Stop executing the tree currently on the Arduino.";

lang['button_pause_tree'] = "Pause Tree";
lang['button_pause_tree_tooltip'] = "Pause the execution of the tree currently on the Arduino. The the execution can be resumed from the point where it was paused.";

lang['button_step_tree'] = "Step Tree";
lang['button_step_tree_tooltip'] = "Advance a single step in the execution of the tree (either from stopped or paused states) .";


lang['button_auto_arrange'] = "Auto-arrange";
lang['button_auto_arrange_tooltip'] = "Enable/disable the auto-arrange feature. When auto-arrange is enabled, whenever any node moves the whole tree is arranged propperly.";

lang['button_fit_to_screen'] = "Fit to Screen";
lang['button_fit_to_screen_tooltip'] = "Fits the selected nodes to the screen. If no nodes are selected, fits the whole tree.";


/*
	"<td><div class="image-upload">"+
	    "<label for="button_load_local"><img src="images/header/browse_trees.svg" class="control_button"/></label>"+
	    "<input id="button_load_local" type="file"/>"+
	"</div></td>"+

	"<td><img id="button_cenas_1" class="control_button" src="images/header/toggle_labels_view.svg"></img></td>"+
	"<td><img id="button_grid" class="control_button" src="images/header/toggle_grid_view.svg"></img></td>"+
	"<td><select id="select_grid_size">"+

	"</select></td>"+
	"<td><img id="" class="control_button" src="images/header/auto_disarrange.svg"></img></td>"+
	"<td><img id="" class="control_button" src="images/header/fit_to_screen.svg"></img></td>"+
	"<td><img id="button_cenas_3" class="control_button" src="images/header/toggle_help_view.svg"></img></td>"+
	"<td><img id="button_user" class="control_button" src="images/header/user_login.svg"></img></td>"+
	"<td><span id="span_user_id">Guest</span></td>"+
*/

// *************************************************************************************************
// ******************************************* VARIABLES *******************************************
// *************************************************************************************************

lang['constant'] = "Constant";
lang['variable'] = "Variable";
lang['device'] = "Device";

lang['initial_value'] = "Initial value";

lang['variable_bool'] = "Bool";
lang['variable_byte'] = "Byte";
lang['variable_int'] = "Int";
lang['variable_long'] = "Long";


lang['new_variable'] = "New Variable";
lang['initial_value'] = "Initial value";

lang['devices'] = "Devices";
lang['variables'] = "Variables";


lang['image'] = "Image";
lang['name'] = "Name";
lang['type'] = "Type";
lang['data_type'] = "Data type";
lang['configuration'] = "Configuration";

lang['variable_description_input'] = "the value read from the device ";
lang['variable_description_output'] = "the new value for device ";



// *************************************************************************************************
// ******************************************** DEVICES ********************************************
// *************************************************************************************************

lang['device_input_digital'] = "Digital Input";
lang['device_input_analog'] = "Analog Input";
lang['device_output_digital'] = "Digital Output";
lang['device_output_analog'] = "Analog Output";
lang['device_analog_input'] = "Analog Input";
lang['device_motor'] = "Motor";
lang['new_device'] = "New Device";


// Gyro specific Devices
lang['device_gyro_motor'] = "Gyro Motor";

lang['device_gyro_distance_sensor'] = "Gyro Distance Sensor";
lang['device_gyro_light_sensor'] = "Gyro Light Sensor";


// Generic strings related to devices
lang['pin'] = "Pin";
lang['initial_speed'] = "Initial Speed";
lang['initial_state'] = "Initial State";


// Variables used to construct the string in the custom node descriptions
// These strings are combined with the node strings to create a sentence describing 
// what that specific node is doing.
// Ex: "Sets the value read from the device Distance Sensor as the new value for the device Left Motor" 

// This is a string that describes the value of the device to be used as an input
lang['device_description_input'] = "the value read from the device ";
// And this onde describes the value of the device do be used as an output
lang['device_description_output'] = "the new value for the device ";


// *************************************************************************************************
// ********************************************* NODES *********************************************
// *************************************************************************************************

// Messages for the Root node 
lang['node_root'] = "Root Node";
lang['node_root_tooltip'] = "This is a Root node. It\'s used to configure the hardware setup, and is also the starting point for the program.";


// Messages for the Delay node 
lang['node_delay_time'] = "Delay Node";
lang['node_delay_time_tooltip'] = "This is a Delay node. It always terminates with success after a configurable amount of time.";
lang['node_delay_time_description'] = "This node terminates with success after a delay (in milliseconds) equal to $.";

// Messages for the Paralell node
lang['node_parallel'] = "Parallel Node";
lang['node_parallel_tooltip'] = "This is a Parallel node. It runs all the children at the same time.";

lang['success_policy'] = "The node succeeds when";
lang['failure_policy'] = "The node fails when";

lang['parallel_require_one'] = "one of the children";
lang['parallel_require_all'] = "every child";

lang['succeeds'] = "succeeds";
lang['fails'] = "fails";


// Messages for the Sequence node
lang['node_sequence'] = "Sequence Node";
lang['node_sequence_tooltip'] = "This is a Sequence node. It runs all the children in sequence, from left to right.";

lang['sequence_run_x_times'] = "Run N times";
lang['sequence_run_forever'] = "Run forever";


// Messages for the Status Override node
lang['node_status_override'] = "Status Override Node";
lang['node_status_override_tooltip'] = "This is a Status Override node. It masks the result of his child node.";
lang['status_fail'] = "mask it as failed";
lang['status_run'] = "continue running";
lang['status_success'] = "mask it as succeeded";
lang['override_fail'] = "When the child node fails,";
lang['override_run'] = "When the child node is running,";
lang['override_success'] = "When the child node succeeds,";



// Messages for the Test node
lang['node_test'] = "Test Node";
lang['node_test_tooltip'] = "This is a Test node. It can perform different comparisons between system components.";

lang['node_test_equal_description'] = "This is a Test node. It can perform different comparisons between system components.";

lang['test'] = "Test";
lang['test_equal'] = "Equal";
lang['test_different'] = "Different";
lang['test_bigger'] = "Bigger";
lang['test_smaller'] = "Smaller";
lang['test_inside_range'] = "Inside Range";
lang['test_outside_range'] = "Outside Range";
lang['test_increase_value'] = "Value Increase";
lang['test_decrease_value'] = "Value Decrease";
lang['test_change_value'] = "Value Change";


//lang['test_fail'] = "When the test fails,";
//lang['test_success'] = "When the test succeeds,";

lang['test_override_once'] = "Test only once";
lang['test_override_untill'] = "Test untill condition happens";
lang['test_override_while'] = "Test while condition happens";


// Messages for the Function node
lang['node_function'] = "Function Node";
lang['node_function_tooltip'] = "This is a Function node. It changes the state of system components.";


lang['function'] = 'Function';

lang['function_copy'] = "Copy";
lang['function_map'] = "Map";
lang['function_random'] = "Random";
lang['function_range'] = "Range";


// Messages for the Gyro nodes
lang['node_gyro_rotate_left'] = "This node rotates the gyro robot to the left.";


lang['node_properties'] = "Node Properties";


// *************************************************************************************************
// **************************************** GENERIC STRINGS ****************************************
// *************************************************************************************************

lang['Low'] = "Low";
lang['High'] = "High";

lang['Value'] = "Value";
lang['Add'] = "Add";
lang['State'] = "State";
lang['active'] = "Active";

lang['minimum'] = "Minimum";
lang['maximum'] = "Maximum";
lang['Increment'] = "Increment";
lang['threshold'] = "Threshold";


lang['position'] = "Position";
lang['left'] = "Left";
lang['right'] = "Right";
lang['below'] = "Below";


lang['type'] = "Type";


lang['warning'] = "WARNING";
lang['error'] = "ERROR";

lang['analog'] = "Analog";
lang['digital'] = "Digital";

lang['description'] = "Description";


// graph-graph.js
lang['id'] = "ID";
lang['name'] = "Name";
lang['tags'] = "Tags";
lang['description'] = "Description";
lang['Node Type'] = "Node Type";
lang['unknown_type'] = "Trying to import a node of type unknown to current version of visualino.";
lang['connections_error'] = "Trying to import a connection to non existing nodes.";
lang['del'] = "To delete a node just press the delete key when the node is selected.";
lang['delete_node'] = "Delete node";
lang['Export .json'] = "Export .json";
lang['0root'] = "Warning: You should have at least 1 root node to export correctly.";
lang['manyroot'] = "Warning: You should have only 1 root node to export correctly.";
lang['error_duplicate_unique_node'] = "It is not allowed to add duplicates of unique nodes.";
lang['error_cannot_instantiate_node'] = "It is not possible to create that type of node.";
lang['error_leaf'] = "It is not allowed to add more nodes to leaf nodes.";
lang['error_loop'] = "A node cannot be a child of one of its descendants.";
lang['error_too_many_children'] = "This node cannot have more children.";
//lang['error_missing_parent'] = "This node needs to be connected to the tree.";
lang['error_missing_single_child'] = "This node needs to have exactlly one child.";
lang['error_missing_children'] = "This node needs to have more children.";

lang['warning_missing_children'] = "This node should have mode children.";
lang['warning_disconnected_node'] = "This node is not connected to the tree, so it will not be executed";

lang['error_upload_invalid_tree'] = "The tree is invalid. Please fix the problematic nodes before uploading again.";



lang['warning_different_version'] = "The tree version currently running on the Arduino is different from the UI";
lang['confirm_load'] = "Are you sure you want to import a JSON file? Unsaved changes to the current tree will be lost.";
lang['COM Port'] = "COM Port:";
lang['Connect'] = "Connect";
lang['Disconnect'] = "Disconnect";
lang['error_no_connection'] = "The interface needs to be connected to a port before sending data!";
lang['Communication Problem'] = "Problems in data transmission to the Arduino!";
lang['Communication Fail'] = "Problem starting communication... Is the Arduino connected?";
lang['No Websocket'] = "The websocket is not connected to the serial gateway server!";
lang['error_tree_upload'] = "Error uploading the tree to the Arduino!";





// *************************************************************************************************
// ******************************************** FIWARE *********************************************
// *************************************************************************************************

lang['title'] = "Title";
lang['author'] = "Author";
lang['email'] = "E-mail";
lang['tag'] = "Tag";
lang['search'] = "Search";
lang['search_by'] = "Search by";


lang['share_with'] = "Share with";
lang['share_list'] = "Share list";
lang['user'] = "User";
lang['share'] = "Share";
lang['group'] = "Group";

lang['share_error_user_not_found'] = "The desired user was not found in the Visualino database!<br>Make sure the Fiware name/email is correct, and the user has logged in into Visualino at least once.";
lang['share_successeful'] = "The tree was successefully shared.";

lang['save_tree_created'] = "A new tree was created.";
lang['save_tree_updated'] = "The existing tree was updated.";

lang['delete_tree_deleted'] = "The tree was deleted.";
lang['delete_tree_shared'] = "The tree cannot be deleted since it\'s being shared. Please delete all the shares before deleting a tree.";

lang['shared_with'] = "Shared with";
lang['remove_all_shares'] = "Remove all shares";
lang['share_remove_successeful'] = "The share was successefully removed.";
lang['remove'] = "Remove";

// index.html
lang['bad_canvas'] = "Couldn\'t access main_canvas";
lang['no_canvas'] = "Your browser has no canvas support! That\'s bad.";


