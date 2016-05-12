
function VersionManager()
{
	this.data = {};

	// List of different versions of the tree, so that we can revert to previous versions
	this.version_list = [];
	this.version_pos = -1;


	// Is the current version of the tree blocked?
	// We need to block it while doing copy/paste/undo/redo operations
	this.block_version = false;

	// Are there any changes in the tree that need to be saved?
	this.state_updated = false;

	// 16-bit hash value for the tree. Whenever the tree changes, this value changes randomly
	this.tree_id = 0x6699;

	// Auto-saves the current tree in local storage every minute
	this.autosave_task = setInterval( function(){_version_manager.saveCurrentTree();}, 1000*60 );
}


// Adds a new version of the tree to the undo buffer
VersionManager.prototype.addVersion = function(description)
{
	//return;
	//console.log("############## addVersion ##############");

	var new_devices = _device_manager.cloneDevices(_device_manager.devices);
	var new_nodes = _node_manager.cloneNodes(_node_manager.nodes, new_devices, false);

	var selected_node = (_ui.selected_node ? Node.findNode(new_nodes, _ui.selected_node.id) : null);

	//console.log(selected_node);

	// Remove all the configurations after the current state
	this.version_list.splice(this.version_pos+1, this.version_list.length-(this.version_pos+1));
	

	var new_version = {
		description:description,
		devices: new_devices,
		nodes: new_nodes,
		active_node: selected_node
	}
	this.version_list.push( new_version );
	this.version_pos++;


	//console.log(this.version_pos);
	//console.log(new_version);
	//console.log("############## NEW VERSION ADDED ##############");
};


// Restore the tree to a specific version of the undo buffer
VersionManager.prototype.restoreVersion = function(n)
{
	console.log("############## restoreVersion ##############");
	var version = this.version_list[n];

	var new_devices = _device_manager.cloneDevices(version.devices);
	var new_nodes = _node_manager.cloneNodes(version.nodes, version.devices, false);

	_device_manager.setDevices(new_devices);
	_node_manager.setNodes(new_nodes);

	console.log("-------------------->version.active_node:");
	console.log(version.active_node);

	var selected_node = (version.active_node ? Node.findNode(version.nodes, version.active_node.id) : null);

	console.log("-------------------->selected_node:");
	console.log(selected_node);


	if (version.active_node !== null) _ui.displayNodeProperties(selected_node)
	else $('#div_properties').css('display', 'none');


	console.log("############## OLD VERSION RESTORED ##############");
	console.log(this.version_list);
};


// Undo the last action executed
VersionManager.prototype.undo = function()
{
	console.log("ERROR! UNDO! UNDO! UNDO!");

	if (!this.block_version)
	{
		// Block the version untill we finish the undo (so we can't undo/redo untill this ends)
		this.block_version = true;
		//console.log("ERROR! UNDO! UNDO! UNDO!");

		console.log("this.version_pos:"+this.version_pos);
		// Make sure we're not in the first position already
		if (this.version_pos>0)
		{
			// Go back to the previous version number
			this.version_pos--;
			// Restore the correct version number
			this.restoreVersion(this.version_pos);

		}
		_ui.startAnimation();

		// Unlock the version so do can do more undo/redos
		this.block_version = false;

		_node_manager.validateNodes();

	}


};


// Redo the last action that was undone
VersionManager.prototype.redo = function()
{
	// Can't do anything if the version is blocked (another undo/redo already executing)
	if (!this.block_version)
	{
		//if (this.block_version) console.log("-------------------fail!!!!------------------");

		// Block the version untill we finish the undo (so re can't undo/redo untill this ends)
		this.block_version = true;
		//console.log("OOOOPS REDO! REDO! REDO!");

		if (this.version_pos<this.version_list.length-1)  
		{
			this.version_pos++;
			// Restore the correct version number
			this.restoreVersion(this.version_pos);

		}
		_ui.startAnimation();
		// Unlock the version so do can do more undo/redos
		this.block_version = false;

		_node_manager.validateNodes();
		
	}

	//console.log('redo 2: this.version_list.length:'+this.version_list.length+'   this.version_pos:'+this.version_pos );
};


// Adds a new version of the tree to the undo buffer
VersionManager.prototype.copy = function()
{
	// Clone only the currently selected nodes
	this.clipboard = _node_manager.cloneNodes(_node_manager.nodes, _device_manager.devices, true);

	console.log("############## COPY ##############");
	console.log(this.clipboard);
};


// Cut the current selection to a temporary buffer
VersionManager.prototype.cut = function()
{
	this.copy();
	_node_manager.removeSelection();
	this.validateNodes();

	console.log("############## CUT ##############");
	console.log(this.clipboard);

};


// paste the current clipboard into the current tree
VersionManager.prototype.paste = function()
{
	//_node_manager.removeSelection();
	console.log("############## PASTE ##############");
	console.log(this.clipboard);

	// Start by un-selecting everything
	_node_manager.unselectAll();

	// Create a new copy of the pasted nodes
	var new_nodes = _node_manager.cloneNodes(this.clipboard, _device_manager.devices, true);
	console.log(new_nodes);
	// Add the newly created nodes to the current node list
	_node_manager.addNodes(new_nodes);

	// Now we want to calculate the central position of all the pasted nodes
	// Let's start the calculating bounding box with the coordinates of the first node
	var min_x = new_nodes[0].virtual_position.x; 
	var max_x = min_x;
	var min_y = new_nodes[0].virtual_position.y; 
	var max_y = min_y;

	console.log('------------------------------------------');
	console.log('min_x:'+min_x+'  max_x:'+max_x+'  min_y:'+min_y+'  max_y:'+max_y);

	// Go through all the nodes and expand the bounding box whenever necessary
	for (i=1; i<new_nodes.length; i++)
	{
		//console.log(this.nodes[i]);
		// Increase the bounding box for all the nodes if necessary
		if (new_nodes[i].virtual_position.x < min_x) min_x = new_nodes[i].virtual_position.x;
		if (new_nodes[i].virtual_position.x > max_x) max_x = new_nodes[i].virtual_position.x;
		if (new_nodes[i].virtual_position.y < min_y) min_y = new_nodes[i].virtual_position.y;
		if (new_nodes[i].virtual_position.y > max_y) max_y = new_nodes[i].virtual_position.y;
	}

	// Middle point of the pasted content
	var paste_center_x = min_x + (max_x - min_x) / 2;
	var paste_center_y = min_y + (max_y - min_y) / 2;
	console.log('min_x:'+min_x+'  max_x:'+max_x+'  min_y:'+min_y+'  max_y:'+max_y);
	console.log('last_mouse_x:'+_last_mouse_x+'  last_mouse_y:'+_last_mouse_y);
	console.log('paste_center_y:'+paste_center_y+'  paste_center_y:'+paste_center_y);

	// Now we pan the new nodes so that their center will appear
	// centered with the mouse last known position
	//_ui.panSelectedNodes(paste_center_x - last_mouse_x - _ui.corner_x, paste_center_y - last_mouse_y - _ui.corner_y);



	// Calculate the current position of the cursor relative to the virtual screen
	var virtual_x = _ui.corner_x + _last_mouse_x / _ui.zoom ;
	var virtual_y = _ui.corner_y + _last_mouse_y / _ui.zoom ;


	console.log("last_mouse_x:"+_last_mouse_x+"   last_mouse_y:"+_last_mouse_y);

	for (var i = 0; i < new_nodes.length; i++) 
	{
		if ( new_nodes[i].selected ) 
		{				
			new_nodes[i].moveNode(paste_center_x-virtual_x, paste_center_y-virtual_y);
		}
	}

	// Start panning the new nodes
	_ui.pan_pasted = true;

	_ui.startAnimation();
};


// Saves the tree currently open on the browser local storage
VersionManager.prototype.saveCurrentTree = function ()
{
	//return;

	if (typeof(Storage) !== "undefined") 
	{
	    localStorage.setItem("current_tree", _node_manager.exportTreeJson() );
	    console.log("Saving current tree");
	}
}


// Loads the last tree auto-saved by the browser
VersionManager.prototype.loadCurrentTree = function ()
{
	//return;
	if (typeof(Storage) !== "undefined") 
	{
		var data = localStorage.getItem("current_tree");
		this.importJson(data, true);
	}
}


// Imports a tree from a json string
// if a parent is specified, the first node of the imported tree
// (which should be its root) is added as a child of the parent node
VersionManager.prototype.importJson = function(jsonstring, import_root, parent) 
{
	//console.log('importJson:'+jsonstring);
	//console.log('parent:');
	//console.log(parent);


	// Parse the JSON string from a file into a Javascript variable
	var temp = JSON.parse(jsonstring);

	// if we are importing the root, we also need to import all the devices
	if (import_root) 
	{
		// Delete all the old devices
		_device_manager.resetDevices();
		// Initialize all the devices
		for (var i=0; i<temp['devices'].length; i++) 
		{
			_device_manager.addDevice(temp['devices'][i]);
		}

		// Delete all the old variables
		_variable_manager.resetVariables();
		// Initialize all the variables
		for (var i=0; i<temp['variables'].length; i++) 
		{
			_variable_manager.addVariable(temp['variables'][i]);
		}

		// Re-number all the devices and variables
		// ( in the arduino they all have the same base class, and share the 
		// same id's, so the number need to be unique between both lists
		_version_manager.reorderAllVarTypes();
	}

	//console.log('---------------------------------');
	//console.log(_device_manager.devices);
	//console.log('---------------------------------');

	// Offset to apply to all of the loaded nodes (when a parent exists)
	// The offset is calculated so that the loaded tree stays below the parent node
	var x_offset = 0;
	var y_offset = 0;
	
	// variable with associations between the old and new ids for the new nodes
	// (they have specific id's in the json string, but will get new ones now)
	var node_convert = {};
	
	var root_node = true;
	// Import all the nodes. The root should be the node 0
	// If we don't want to import the root, start on node 1
	var first_node = import_root ? 0 : 1;

	for (i=first_node; i<temp['nodes'].length; i++) 
	{
		// Try to create the node from the data in the Json file
		var new_node = _node_manager.addNode(temp['nodes'][i]);

		//console.log(temp['nodes'][i]);
		//console.log(new_node);

		// Let's check if the node was created successfully
		if ( new_node !== null )
		{
			// Create the association between the old and the new ID
			node_convert[temp['nodes'][i]['id']] = new_node.id;
				

			// If a parent node was specified, the new tree is a branch
			// of the main tree, so there is extra stuff to do here
			if (parent)
			{			
				//Check if we're processing the root node from the new tree
				if (root_node)
				{
					// Let's make it a child of the specified parent node
					parent.addChild( new_node );

					// Now we calculate the position offset, so that the new
					// tree will appear below the specified parent node
					x_offset = parent.virtual_position.x-new_node.virtual_position.x;
					y_offset = parent.virtual_position.y-new_node.virtual_position.y + 80;
					
					console.log('x_offset:'+x_offset+'  y_offset:'+y_offset);
					root_node = false;						
				}
				
				// @todo check this math....
				// Move the new nodes to the desired position below the parent
				new_node.virtual_position.x = new_node.virtual_position.x + x_offset;
				new_node.virtual_position.y = new_node.virtual_position.y + y_offset;

				// Lock all the new nodes
				new_node.locked = true;					
			}		
		}
		// The node was't created successfully... Invalid Json file?
		else 
		{
			openPopUpMessage(lang['unknown_type']);
			// @todo need to reset something here

			return;
		}
	}

	var nodes = _node_manager.nodes;

	//console.log(nodes);
			
	// Import all the connectins between nodes
	for (i=0; i<temp['connections'].length; i++) 
	{
		var cname = temp['connections'][i];
		var res = cname.split(':');
		var node1 = null;
		var node2 = null;

		//console.log('connect: ' + res[0] + ' ' +res[1]);
		
		// Look for the nodes on this specific connection
		for (var j=0; j<nodes.length; j++) 
		{
			//console.log('connect: ' + res[0] + ' ' +res[1]);

			// node_convert is used to convert the old node ids into the new ones
			if (node_convert[res[0]] == nodes[j].toString()) node1 = nodes[j];
			if (node_convert[res[1]] == nodes[j].toString()) node2 = nodes[j];
			// If both nodes were found, don't need to look any more
			if (node1 !== null && node2 !== null) break;
		}
		
		//console.log('outofloop: ' + node1.toString() + ' ' + node2.toString());
		if ((node1 !== null) && (node2 !== null)) 
		{
			node1.addChild( node2);
		}
	}

	this.jsonstring = '';
	if (import_root) this.addVersion('change_load_tree');
	else this.addVersion('change_import_tree');


	_ui.draw();

	//console.log(_device_manager.devices);
	//console.log(_variable_manager.variables);

};


// Callback for the upload to arduino functions
// The parameter "save" indicates if the tree should be stored in the 
// Arduino EEprom or just be kept in RAM (untill the arduino resets)
VersionManager.prototype.uploadToArduino = function(save) 
{
	console.log("uploadToArduino");
	//console.log(_device_manager.devices);
	var textToWrite = (save? 'E;': 'L;') + _version_manager.exportTreeToArduino();
	sendData(textToWrite, true);
};


VersionManager.prototype.reorderAllVarTypes = function() 
{
	_device_manager.reorderDevices();
	_variable_manager.reorderVariables();
}


// Export the whole tree in a string in Arduino format
VersionManager.prototype.exportTreeToArduino = function() 
{
	var nodes = _node_manager.nodes;
	// Sort the nodes prior to exporting
	_node_manager.sortNodes();
	
	// Add the header, with the total number of devices and nodes
	var output = 'T'+padByte( _device_manager.devices.length + _variable_manager.variables.length)+
			padByte(nodes.length)+padInt(this.tree_id)+';';

	// Add all the devices
	for (var d=0; d<_device_manager.devices.length; d++)
	{
		output += _device_manager.devices[d].exportToArduino(d);
	}
			
	// Add all the variables
	
	for (var v=0; v<_variable_manager.variables.length; v++)
	{
		output += _variable_manager.variables[v].exportToArduino(v);
	}
			
	// Add all the nodes
	var i;
	for (i=0; i<nodes.length; i++) 
	{
		output += nodes[i].exportNodeToArduino();
	}

	// Add all the connections between nodes
	for (i=0; i<nodes.length; i++) 
	{
		output += nodes[i].exportConnectionsToArduino();
	}

	// Add the terminator symbol, and we're good to go!
	output += 'F;';

//		D000103;D010105;D020106;D030308;';
//		D000105;D010106;D020107;D04030801;D05030901;D06030a01;N000002;N0103100001;N0203100001;C0001;C0002;F;
	
	return output;
};



