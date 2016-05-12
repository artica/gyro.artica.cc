// Base node type identifiers (for arduino)
var NODE_SEQUENCE = 0x00;
var NODE_PARALLEL =	0x01;
var NODE_OVERRIDE = 0x02;
var NODE_SERVICE =  0x03;

// Service type codes (for arduino)
var SERVICE_DELAY = 	0x00;
var SERVICE_TEST = 		0x01;
var SERVICE_FUNCTION = 	0x02;

// Node state 
var NODE_STATE_FAILURE = 0; 
var NODE_STATE_RUNNING = 1;
var NODE_STATE_SUCCESS = 2;
var NODE_STATE_INACTIVE = 3;


function NodeManager() 
{
	// Existing nodes in the tree
	this.nodes = [];

	// Root node of the tree
	this.root = null;

	// Next unique ID the generator function will return
	this.next_node_id = 0;
}


// Initialize the variables that cannot be initialized in the constructor
NodeManager.prototype.init = function()
{
	this.node_types = 
	[	
		NodeRoot.prototype.createModelNode(),
		//NodeJsonImport.prototype.createModelNode(),
		NodeSequence.prototype.createModelNode(),
		NodeParallel.prototype.createModelNode(),
		NodeStatusOverride.prototype.createModelNode(),
		NodeTest.prototype.createModelNode(),
		NodeFunction.prototype.createModelNode(),
		NodeDelayTime.prototype.createModelNode()
	];
};


// Replace the current node list by a new one
NodeManager.prototype.setNodes = function(new_node_list)
{
	this.nodes = new_node_list;
	this.root = new_node_list[0];
}


// Add a current set of nodes to the current node list
NodeManager.prototype.addNodes = function(new_node_list)
{
	// Let's add on the nodes on the list to the current node list
	for (var i=0; i<new_node_list.length; i++)
	{
		var node = new_node_list[i];
		// Since the node may have the same id as another existing node, we need to
		// update the ID to a value we can be sure is unique
		node.id = this.nextNodeID();
		// Now we can add the node to the list
		this.nodes.push(node);
	}
}

// Return a string with a unique node ID
NodeManager.prototype.nextNodeID = function()
{
	// @todo make sure this is unique
    var new_id = this.next_node_id++;
    return new_id;
};


// set the next ID number for the node ID generator
NodeManager.prototype.setNextNodeID = function(string16)
{
    this.next_node_id = parseInt(string16, 16);
    console.log('last node ID is:'+ this.next_node_id);
};


// Resets the tree, deleting all the nodes
NodeManager.prototype.resetTree = function() 
{
	this.root = null;
	this.nodes = [];
	this.update_collision = true;
};


// Create a node of a specific type based on node data
NodeManager.prototype.createNode = function(data)
{
	//console.log("createNode");
	//console.log(data);
	for ( var n=0; n<this.node_types.length; n++)
	{
		//console.log(data);
		//console.log("testing:"+data.type+" == "+this.node_types[n].type);
		if (data.type === this.node_types[n].type) 
		{
			//console.log(data);
			return this.node_types[n].createCustomNode(data);
		}
	}
	return null;
};


// Adds a new node to the node list based on the node data
NodeManager.prototype.addNode = function(data)
{
	//console.log("NodeManager.prototype.addNode");
	//console.log(data);
	
	// Add a node created based on the node data
	var new_node = this.createNode(data);

	// If we're adding a root node, keep the pointer for it
	if (new_node.type === 'node_root') this.root = new_node;
	if (new_node !== null) this.nodes.push( new_node );
	if (new_node.id >= this.next_node_id) this.next_node_id = new_node.id+1;
	return new_node;
};


// Removes a node from the tree (based on the node position)
NodeManager.prototype.removeNode = function (n) 
{
	// Make sure it actually exists
	if (!(n in this.nodes)) return;

	// Disconnect all the connection this node may have
	this.nodes[n].disconnectAll();

	// All the links have been taken care of, so we can remove the node safely
	this.nodes.splice(n, 1);		
	
	// refresh properties display
	_ui.hidePropertiesBox();
};


// Add a new node of the same type of the argument node to the list
NodeManager.prototype.createNewNode = function (type)
{
	// Use the type node constructor to create a new node of the same class with default values
	var node = type.createDefaultNode();


	// If the new node is the root, save the pointer and add it to the node list as the first 
	if (node.type === 'node_root') 
	{
		this.root = node;
		this.nodes.unshift( node );
	}
	// Any other node types are added to the end of the node list
	else
	{
		this.nodes.push( node );
	}

	// Return the new node
	return node;
};


// Unselect all nodes and connections
NodeManager.prototype.unselectAll = function()
{
	for (var i = 0; i < this.nodes.length; i++) 
	{	
		this.nodes[i].setSelect(false);
		this.nodes[i].unselectConnections();				
	}		
};


// Removes all the selected nodes and connections
NodeManager.prototype.removeSelection = function() 
{
	var i;
	for (i = 0; i < this.nodes.length; i++) 
	{
		this.nodes[i].removeSelectedConnections();
	}

	for (i = this.nodes.length-1; i >= 0; i--) 
	{
		if(this.nodes[i].selected) 
		{
			this.removeNode(i);
		}
	}


	if (_ui.auto_arrange_enabled) _node_manager.root.autoArrange();


	_version_manager.addVersion('change_remove_selection');


	this.validateNodes();
	_ui.startAnimation();
};


// Validate all the existing nodes on the tree
// Invalid nodes will display error or warning errors
NodeManager.prototype.validateNodes = function() 
{
	//console.log("validateNodes");

	var tree_state = NODE_STATE_NO_ERROR;

	for (var i=0; i<this.nodes.length; i++)
	{
		var node_state = this.nodes[i].validate();
		if (node_state > tree_state) tree_state = node_state;
	}

	_ui.setTreeState(tree_state);
};


// Sets a new state for a specific node (updated by running the tree)
NodeManager.prototype.updateNodesState = function (nodes_data)
{
	//console.log('updateNodesState:'+nodes_data.length);
	//console.log(this.nodes[node]);
	for (var i=0; i<this.nodes.length; i++)
	{
		this.nodes[i].setState(parseInt(nodes_data.charAt(i)));
	}

};


// Re-order all nodes so the order matches the current visual appearance
NodeManager.prototype.sortNodes = function(order_by_anchor)
{
	// Sort the ids for all the nodes recursively, starting at the root
	//this.root.sortChildren(0, order_by_anchor);

	//console.log("NodeManager.prototype.sortNodes");
	//console.log(this.nodes);
	//console.log(this.root);

	var current_id = 0;

	// Sorts all tree branches recursivelly
	for (var i=0; i<this.nodes.length; i++)
	{
		// Only start sorting the nodes without parents because all child nodes
		// are sorted recursivelly from their parents
		if (this.nodes[i].parent === null)
		{
			//console.log(current_id);

			current_id = this.nodes[i].sortChildren(current_id, order_by_anchor) + 1;
		}
	}


	// Now we need to sort the node array, so the array positions match the ID's
	this.nodes.sort(function(node1, node2) 
	{
		return node1.id - node2.id;
	});
};


// Auto-arrange the positions for all the nodes of the tree (connected to the root)
// branches not connected to the tree are not arranged
// If order_by_anchor is true, the tree will be orderd by the anchor node positions,
// instead if the virtual positions (when dragging a node, the anchor position represents
// the position where the drag started)
NodeManager.prototype.autoArrangeTree = function(order_by_anchor)
{
	if (_ui.auto_arrange_enabled) 
	{
		this.sortNodes(order_by_anchor);

		for (var i=0; i<this.nodes.length; i++)
		{
			if (this.nodes[i].parent === null) this.nodes[i].autoArrange();
		}

		//this.root.autoArrange();
		_ui.animation_type = ANIMATION_TYPE_NODE_ARRANGING;
	}
}


// Export the current nodes on the system to a single variable
NodeManager.prototype.exportNodesObject = function() 
{
	var output = [];
	for (var i=0; i<this.nodes.length; i++) 
	{
		output.push( this.nodes[i].exportJson() );
	}
	return output;
};


// Export the current connections between nodes on the system to a single variable
NodeManager.prototype.exportConnectionsObject = function() 
{
	var output = [];
	// Go through all the nodes
	for (var i=0; i<this.nodes.length; i++) 
	{
		//console.log('node:'+i);
		//console.log(this.nodes[i]);
		// Export all the connection for this node
		for (var j=0; j<this.nodes[i].children.length; j++)
		{		
			//console.log('exporting:'+i+','+j);
			output.push( this.nodes[i].exportConnection(j) );
		}
	}
	return output;				
};


// Export the whole tree to a JSON format string
NodeManager.prototype.exportTreeJson = function() 
{
	// Sort the nodes prior to exporting
	this.sortNodes();
	// Create an object with data representing the whole tree
	this.exportjson = {
		"devices": _device_manager.exportDevicesObject(),
		"variables": _variable_manager.exportVariablesObject(),
		"nodes": this.exportNodesObject(),
		"connections": this.exportConnectionsObject()
	};
	
	// Stringify the tree object to a string
	this.jsonstring = JSON.stringify(this.exportjson, null, 2);
	
	return this.jsonstring;
};


// Clone the current list of nodes
// The nodes that use devices will need to have pointers to a new
// device list, not the one is use for the device_manager
// if "selected_only if true", only the selected nodes are cloned (however, in
// this mode, the root node is never cloned)
NodeManager.prototype.cloneNodes = function(old_nodes, new_devices, selected_only)
{
	var new_nodes = [];
	// Go through the node list, cloning each node
	// Cloning the nodes does NOT clone the pointers on each node
	// (pointer for the devices, or for child/parent relations)
	for (var n=0; n<old_nodes.length; n++)
	{
		// Clone the node either if we don't care about the selection, or if
		// we do care, but it's selected anyway 
		if (!selected_only || old_nodes[n].selected)
			new_nodes.push(old_nodes[n].clone());
	}

	//console.log(new_nodes);
	// Now that the new tree is created, we need to update all the pointers
	// so they reference the newly created nodes and devices
	for (n=0; n<new_nodes.length; n++)
	{
		//console.log("LINKING!!!");
		//console.log(new_nodes[n]);

		// Let's assume both node lists have the same elements
		var old_node = old_nodes[n];
		// If we are copying only the selected nodes, then the new list does NOT has the same nodes
		// So we need to look on the list for the old node that matches this new one (using the ID)
		if (selected_only)
		{
			old_node = Node.findNode(old_nodes,  new_nodes[n].id);
		}

		new_nodes[n].updateLinks(old_node, new_nodes, new_devices);
	}

	return new_nodes;
}


