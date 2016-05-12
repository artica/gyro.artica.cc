// Size proportion between the node and the collapse button
var COLLAPSE_BUTTON_SIZE = 10;

// Possible error states for the nodes
var NODE_STATE_NO_ERROR = 0;
var NODE_STATE_WARNING = 1;
var NODE_STATE_ERROR = 2;


// Different animation types for the nodes
var ANIMATION_TYPE_NULL = 0;
var ANIMATION_TYPE_NODE_EXPANDING = 1;
var ANIMATION_TYPE_NODE_COLLAPSING = 2;
var ANIMATION_TYPE_NODE_ARRANGING = 3;
var ANIMATION_TYPE_SCREEN_FITTING = 4;

var NODE_STATE_FAILURE_COLOR = '#FF0000'; 
var NODE_STATE_RUNNING_COLOR = '#00BCFF';
var NODE_STATE_SUCCESS_COLOR = '#33FF00';
var NODE_STATE_INACTIVE_COLOR = '#333333';


// Color for the connections between the nodes
var NODE_CONNECTION_COLOR = '#635C9E';
var NODE_CONNECTION_SELECTED_COLOR = '#FF5533';


// Time (in millis) for each node to expand/collapse
var NODE_EXPAND_TIME = 200;

// Time (in millis) for each node to move to/from the auto-arrange position
var NODE_ARRANGE_TIME = 500;


var NODE_DESCRIPTION_TEXT_COLOR = '#DDDDDD';
var NODE_DESCRIPTION_BACKGROUND_COLOR = '#666666';

// Thickness for the different rings around the node
var NODE_MARGIN_RING_THICKNESS = 2;				// Border ring
var NODE_RUNNING_STATE_RING_THICKNESS = 4;		// Node state ring
var NODE_SELECTION_STATE_RING_THICKNESS = 4;	// Selection state ring

// Colors for the node selection rings
var NODE_SELECTED_RING_COLOR = '#FFFFFF';
//var NODE_FOCUSED_RING_COLOR = '#FF9742';

// Color to indicate the node can have more children
var NODE_VALID_PARENT_RING_COLOR = '#44FF22';

// Color to indicate the node is the selected parent for the dragged nodes to connect to
var NODE_SELECTED_PARENT_RING_COLOR = '#FF7722';

var NODE_DATA_MARGIN = 0.2;


// Size for the base size of the WARNING and ERROR node states
var NODE_WARNING_SIZE = 40;
var NODE_ERROR_SIZE = 40;


function Node(id, name, data)
{
	// Set the name and ID of the node
	this.id = id;
	this.name = name;

	// Create a new data field with the elements from this node type
	this.data = $.extend(false, {}, data);

	// If the node has a custom image, use it
	if (this.data.img_id) this.setImage(this.data.img_id);
	// Otherwise use the default image
	else this.setImage(this.type);

	// Parent of this node
	this.parent = null;
	// List of children of this node
	this.children = [];

	// Is this node a valid parent for other nodes?
	this.valid_parent = false;

	// Is the node seleced?
	this.selected = false;
	// Is the node included in the current selection box?
	this.included = false;

	// Is the node locked (meaning it cannot be edited)?
	this.locked = false;
	// Is the node expanded?
	this.expanded = true;

	// List of selected connections from this node to his children
	this.connections_selected = [];

	// Error state and message (for real-time validation of the tree)
	this.error_state = NODE_STATE_NO_ERROR;
	this.error_message = '';

	// Center position of the node in the working area
	// These positions are NOT mapped directlly to the screen pixels
	// They represent the working area to place the tree
	this.virtual_position = {x:-1, y:-1};

	// Anchor position for the node
	// This is used for when we need to move the node but want to have the 
	// possibility to return it to a previous (anchor) position (virtual coordinates)
	this.anchor_position = {x:-1, y:-1};

	// Center position of the node in the canvas (in pixels)
	// These are the coordinates actually used to draw the node on the canvas
	// They are calculated from the virtual coordinates, but having into account
	// modifiers like the pan offset and the screen zoom
	this.display_position = {x:-1, y:-1};


	// Reference coordinates for the movement when performing animations
	// These coordinates are used for movement animations of different elements
	// not just the base node position (like the textboxes and indicators around the nodes)
	this.animation_initial_position = {x:-1, y:-1};
	this.animation_final_position = {x:-1, y:-1};


	// Position for the node when it's expanded, defined by the user. 
	// This variable is necessary to remember  the original node position 
	// when we collapse a section of the tree and hide some nodes
	this.expanded_position = {x:-1, y:-1};

	// Position for the node calculated by the auto-arrange algorytm 
	this.arranged_position = {x:-1, y:-1};

	// Position for the node defined by the user (as opposed to the arranged_position)
	this.messy_position = {x:-1, y:-1};
	

	// Initialize the node with no animations running
	this.animation_type = ANIMATION_TYPE_NULL;


	// Base radius size for the node
	this.radius = 20;
	this.line_width = 3;

	// Default height for the node data height
	// The nodes with different data height can override this value
	this.node_data_height = 20;

	this.state = NODE_STATE_INACTIVE;		
	this.display = true;


    // If we have a data element associated, save the visibility data
    this.hidden_elements = {};

	// Initialize any special settings that might be necessary
	// The init() on the node class is empty, this is intended to be overwitten by the child classes
	this.init();

	return this;
}

// Initializations that might be necessary to perform after the Node constructor runs
// The idea is that nodes with special ocnfiguration will override this method
Node.prototype.init = function()
{
}

// Returns an exact copy of this node
Node.prototype.clone = function()
{
	// Create a new node with the same id, name and specific node data
	var new_node = new this.constructor(this.id, this.name, this.data)


	//console.log(this.animation_type);

	// If we're cloning a node that's being animated, assume the animation final position
	if ( this.animation_type !== ANIMATION_TYPE_NULL)
	{
		new_node.virtual_position = clonePosition(this.animation_final_position);
	}
	else
	{
		new_node.virtual_position = clonePosition(this.virtual_position);
	}

	new_node.anchor_position = clonePosition(this.anchor_position);
	new_node.messy_position = clonePosition(this.messy_position);


	new_node.expanded = this.expanded;
	new_node.display = this.display;


	new_node.selected = this.selected;
	// @todo copy the rest of the variables that might be necessary
	return new_node;
};


// Update any links this node might have (parent/child links and links to any devices or services)
// This is used to duplicate a tree, where the new nodes must have links between them, 
// matching the links of the tree
Node.prototype.updateLinks = function(old_node, new_nodes, new_devices)
{
	// Let's go through all the children of the old node, and create the equivalent 
	// connections on this node, with links for the "new_nodes" and "new_dvices"
	var children = old_node.children;
	for (var c=0; c<children.length; c++)
	{
		var child = Node.findNode(new_nodes, children[c].id)
		if (child) this.addChild(child);
		else console.error("Child node not found!");
	}
	//console.log("---eoc---");
};


// Finds and returns a node with a specific ID in in a node list
Node.findNode = function(nodes, id)
{
	var node = null;
	// We need to look for the node using the ID
	for (var n=0; n<nodes.length; n++)
	{
		if (nodes[n].id === id)
		{
			node = nodes[n];
			break;
		}
	}
	return node;
}


// Set a new image for this node
Node.prototype.setImage = function(img_id)
{
	// If the image is not the default one for this node type, save it
	this.img_id = img_id;

	// Save the image ID and create a direct link for the image for efficiency
	this.image = images.getImage(img_id);
};


// Get the image for this node
Node.prototype.getImage = function()
{
	return this.image;
};


// Returns a block of formatted HTML containing the description of a specific node
// Child node classed will override this method with propper node data
Node.prototype.getNodeDescription = function()
{
	// Add the general description for this node type, plus any errors/warning messages
	var html = lang[this.type+'_tooltip']+"<br>" + this.showErrors();
	
	//html = "ID:"+this.id;
	return html;
};


// Sets another node as the parent of this node
Node.prototype.addParent = function (parent) 
{
	this.parent = parent;
};


// Removes the node parent
Node.prototype.removeParent = function () 
{
	this.parent = null;
};


// Adds a new child to this node
Node.prototype.addChild = function (child)
{
	//console.log('add_child');
	// Check if the child already exists on this list
	//console.log(v);
	//console.log(this.children);

	// @todo será importante?
	//if (v in this.children) return null;

	//console.log('ta-daaaaa!')
	this.children.push(child);
	child.addParent(this);

};


// Remove a child from this node (and also remove the parent link on the child node)
Node.prototype.removeChild = function (child) 
{
	console.log('parent:'+this+'   remove_child:'+child);
	console.log(child);
	// If the desired child does not exist, nothing to do here...	
	var index = this.children.indexOf(child);
	console.log('index:'+this.children.indexOf(child));		
	if (index === -1) return;

	// Removes this node as the parent of the parameter node
	child.removeParent();
	
	this.children.splice(index, 1);
	console.log('REMOVED!');
};


// Sort the children of this node recursively, creating 
// new sequential ID's for the arduino 
Node.prototype.sortChildren = function (new_id, order_by_anchor) 
{
	// Set the new arduino node id (sequencial order)
	this.id = new_id;
	
	//console.log('this is:'+new_id);
	// Sort this node's children by the X coordinate
	if (order_by_anchor)
	{
		this.children.sort(function(node1, node2) 
			{
				return node1.anchor_position.x - node2.anchor_position.x;
			});		
	}
	else
	{
		this.children.sort(function(node1, node2) 
			{
				return node1.virtual_position.x - node2.virtual_position.x;
			});			
	}
		
	var current_id = new_id+1;
	// Sort all the children nodes recursively
	for (var j=0; j<this.children.length; j++)
	{	
		// The id of each children is the highest id of the previous
		// children branch plus 1
		current_id = this.children[j].sortChildren(current_id, order_by_anchor) + 1;
	}
	return current_id-1;
};


// Remove all connections between this node and the others
Node.prototype.disconnectAll = function ()
{
	// If the node has a parent, remove the link from the parent to this node
	if (this.parent) this.parent.removeChild(this);
	
	// If the node has children, remove the parent on all of then
	for (var i=0; i<this.children.length; i++)
	{
		this.children[i].parent = null;
	}
};


// Checks all the ancestors of each parent up to the root
// of the tree, looking for a specific node
Node.prototype.checkAncestors = function (node)
{
	//console.log('check_ancestors:' + node);
	// Reached the top of the tree, the node wasn't found
	if (this.parent === null) return false;
	else
	{
		// The node was found, so we return true
		if (this.parent === node) return true;
		
		// At this point the node wasn't found, so we go up on the tree
		return this.parent.checkAncestors(node);
	}
};


// Set a new running state for the node (INACTIVE/RUNNING/FAILURE)
Node.prototype.setState = function(state)
{
	this.state = state;
	
	// When a node is set as inactive or starts to run, all children nodes become inactive too
	if ( state === NODE_STATE_INACTIVE && this.children.length>0 )
	{
		for (var i=0; i<this.children.length; i++)
		{
			this.children[i].setState(NODE_STATE_INACTIVE);
		}
	}
};


// Returns a new node of the same type as this node, initialized with the model settings
// (these are the settings for the new nodes that appear on the new node selector)
Node.prototype.createModelNode  = function() 
{
	return new this.constructor(_node_manager.nextNodeID(), '', {});
};


// Returns a new node of the same type as this node, initialized with default settings
// (these are the default settings for the new nodes created by the user)
Node.prototype.createDefaultNode  = function() 
{
	return new this.constructor(_node_manager.nextNodeID(), '', this.DEFAULT_NODE_DATA);
};


// Create a new node of the same type as this node, initialized with values read from an existing object
Node.prototype.createCustomNode = function(data, id)
{
	// If we pass a specific id, it will override the id in the data object 
	var new_id = id? id: data.id;
	var new_node = new this.constructor( new_id, data.name, data.data );
	//console.log("createCustomNode");
	//console.log(new_node);

	// Set the node in the right position
	new_node.setPosition(data.x, data.y);

	// 
	if (data.img_id) new_node.setImage(data.img_id);

	return new_node;
};


// Check if the received (x,y) position is on top of any of the lines connecting this
// node and any of its child nodes
// Returns the number of the child if any positive result is found, and -1 otherwise 
Node.prototype.childConnectionClicked = function ( ctx, x, y)
{
	// If this node is not visible, bon't bother checking anything
	if (this.display === false) return -1;
	// For each node, check all the child connections
	for (var i = this.children.length-1; i >=0 ; i--)
	{
		var child = this.children[i]
		// If the child node is not visible, bon't bother checking it either
		if (child.display === false) continue;

		ctx.lineWidth = 10;
		//ctx.strokeStyle = '#FF0000';
		this.drawConnectionToChild(ctx, child);
		//ctx.stroke();

		if (ctx.isPointInStroke(x, y)) return i;

	}
	// If no hits were found, return -1
	return -1;
}


// Sets a new position for the node (on virtual screen coordinates)
Node.prototype.setPosition = function (x, y)
{
	//console.log('setting position to ' + x + ' ' + y);

	// @todo should we update something else here?
	// 
	this.virtual_position.x = x;
	this.virtual_position.y = y;

	this.messy_position.x = x;
	this.messy_position.y = y;

	//console.log("this.virtual_position.x:"+this.virtual_position.x+"   this.virtual_position.y:"+this.virtual_position.y);

	this.anchor_position.x = this.virtual_position.x;
	this.anchor_position.y = this.virtual_position.y;
};


// Moves the node by a specific offset (on screen coordinates)
Node.prototype.moveNode = function (x, y)
{
	//console.log('moving node from ' + this.virtual_position.x + ' ' + this.virtual_position.y + ' to ' + (this.virtual_position.y -x) + ' ' + (this.virtual_position.y -y) );
	this.virtual_position.x -= x;
	this.virtual_position.y -= y;

	this.expanded_position.x -= x;
	this.expanded_position.y -= y;

};


// Snaps the node to the closest grid position
Node.prototype.snapNode = function ()
{
	// Move the node to the grid position closest to the current position
	this.virtual_position = closestGridPosition(this.virtual_position.x, this.virtual_position.y, _ui.grid_size);

	this.anchor_position = clonePosition(this.virtual_position);
};


// Set the anchor position for the node (used to remember the initial position of a movement)
Node.prototype.setAnchor = function ()
{
	//console.log('moving node from ' + this.x + ' ' + this.y + ' to ' + (this.x -x) + ' ' + (this.y -y) );
	this.anchor_position.x = this.virtual_position.x;
	this.anchor_position.y = this.virtual_position.y;
};


// Set the anchor position to a specific position
Node.prototype.setAnchorPosition = function (x, y)
{
	//console.log('moving node from ' + this.x + ' ' + this.y + ' to ' + (this.x -x) + ' ' + (this.y -y) );
	this.anchor_position.x = x;
	this.anchor_position.y = y;
};


// Restore the node to the position defined as the anchor
Node.prototype.restoreAnchor = function ()
{
	//console.log('moving node from ' + this.x + ' ' + this.y + ' to ' + (this.x -x) + ' ' + (this.y -y) );
	// @todo animate this, instead of just retoring the values
	//
	this.virtual_position.x = this.anchor_position.x;
	this.virtual_position.y = this.anchor_position.y;
};


// Get the x coordinate for the node left corner (including text and other elements around it)
Node.prototype.leftCorner = function ()
{
	return this.virtual_position.x;
	return this.virtual_position.x - this.radius*_ui.zoom;
}

// Get the x coordinate for the node right corner (including text and other elements around it)
Node.prototype.rightCorner = function ()
{
	return this.virtual_position.x ;
	return this.virtual_position.x + this.radius*_ui.zoom;
}

// Get the y coordinate for the node top corner (including text and other elements around it)
Node.prototype.topCorner = function ()
{
	//return this.virtual_position.y;
	return this.virtual_position.y - this.radius*_ui.zoom;
}

// Get the y coordinate for the node bottom corner (including text and other elements around it)
Node.prototype.bottomCorner = function ()
{
	return this.virtual_position.y;
	return this.virtual_position.y - (this.radius*2)*_ui.zoom;
}


// Auto arrange the the braches of the tree below this node
Node.prototype.autoArrange = function (time) 
{
	console.log("autoArrange");
//	this.snapNode();

	// Bebore arranging the branch we need to measure its width (recursively)
	this.measureBranch();

	// The first node of the branch to be arranged will be moved to the closest grid position
	var initial_position = closestGridPosition(this.virtual_position.x, this.virtual_position.y, _ui.grid_size);
	this.arrangeBranch(initial_position, 0, 0);
}



// Calculate the arranged node positions for a branch of the tree
Node.prototype.arrangeBranch = function (base_position, starting_offset_x, starting_offset_y) 
{
	// Set the coordinates for the arranged position
	this.arranged_position.x = base_position.x + _ui.grid_size * starting_offset_x;
	this.arranged_position.y = base_position.y + _ui.grid_size * starting_offset_y;

	//console.log("arrangeBranch:"+this.id+"  starting_offset_x:"+starting_offset_x+"  starting_offset_y:"+starting_offset_y);

	// @todo This should be a parameter
	var time = millis();

	// Configure the animation settings
	this.startAnimation (ANIMATION_TYPE_NODE_ARRANGING, time, NODE_ARRANGE_TIME, 
						clonePosition(this.virtual_position), this.arranged_position);

	// Remember the position of the node before it was arranged
	this.messy_position = clonePosition(this.virtual_position);	

	// If the node has children, we need to arrange them all too
	if (this.children.length > 0)
	{
		// Now we need to calculate the offsets for all the children nodes
		var grid_offset_x = starting_offset_x - Math.trunc(this.branch_width/2);
		var grid_offset_y = starting_offset_y + (this.children.length>1 ? 3 : 2);

		for (var i=0; i<this.children.length; i++)
		{
			var child = this.children[i];

			child.arrangeBranch(base_position, grid_offset_x+Math.trunc(child.branch_width/2), grid_offset_y);

			grid_offset_x += child.branch_width + 1;
		}
	}
}


// Measure the width of a branch of the tree
// The width is measured in grid spaces
Node.prototype.measureBranch = function () 
{
	//console.log("this.children.length:"+this.children.length);
	// If the node is a leaf or is not expanded, it uses only 1 space
	if (this.children.length === 0 || this.expanded === false)
	{
		this.branch_width = 1;
		//console.log("PIMBA!");
	}
	// Otherwise it's an internal node, so the width will be the sum of all
	// child node widths, plus 1 for each space between two children (childs-1)
	else
	{
		// So we start by adding the spaces between nodes
		this.branch_width = this.children.length - 1;

		// Now we add the branch widths of all the children
		for (var j=0; j<this.children.length; j++)
		{
			this.branch_width += this.children[j].measureBranch();
		}
		//console.log("YOINK!");
	}

	//console.log("node id:"+this.id+"   width:"+this.branch_width);
	return this.branch_width;
}


// Return all the nodes to the defined user positions before the auto arrange was used
Node.prototype.autoDisarrange = function (time) 
{
	console.log("autoDisarrange");
	this.disarrangeBranch(clonePosition(this.virtual_position), 0, 0);
}


// Calculate the arranged node positions for a branch of the tree
Node.prototype.disarrangeBranch = function () 
{
	//console.log("disarrangeBranch:"+this.id);

	// @todo This should be a parameter
	var time = millis();

	// Configure the animation settings
	this.startAnimation (ANIMATION_TYPE_NODE_ARRANGING, time, NODE_ARRANGE_TIME, 
						clonePosition(this.virtual_position), this.messy_position);


	// If the node has children, we need to disarrange them all too
	for (var i=0; i<this.children.length; i++)
	{
		var child = this.children[i];

		child.disarrangeBranch();
	}
}


// Recursivelly collapse all the children of this node
Node.prototype.collapseChildren = function (time) 
{
	//console.log("collapseChildren:"+this.id);
	// Let's check each node for its children recursively
	for (var j=0; j<this.children.length; j++)
	{
		var child = this.children[j];

		// If the current child is not expanded or is a leaf, start the collapsing animation
		if (child.expanded === false || child.children.length === 0 )
		{
			child.startCollapsing(time);
		}
		// Otherwise it's a middle node with children, let's collapse all the children... ALL!!! 
		// COLLAPSE EVERYTHING!!!!!!  THE END IS NIGH! MUHAHAHAHA!
		else
		{
			child.collapseChildren(time);
		}
	}
};

	
// Expand all the children of this node
Node.prototype.expandChildren = function (time) 
{
	// Let's check each node for its children
	for (var j=0; j<this.children.length; j++)
	{
		var child = this.children[j];
		// If the current child is not expanded or is a leaf, start the collapsing animation
		if (this.expanded === true)
		{
			child.startExpanding(time);
		}
	}	
};


// Toggle the expanded state of this node
Node.prototype.toggleExpansion = function (time) 
{
	if (this.expanded)
	{
		// When collapsing a branch, only the initial node gets marked as "expanded = false"
		// All the child nodes remain their "expanded" parameter unnafected 
		this.expanded = false;
		this.collapseChildren(time);	
	}
	else 
	{
		// When expanding a branch, only the initial node gets marked as "expanded = true"
		// All the child nodes remain their "expanded" parameter unnafected
		this.expanded = true;
		this.expandChildren(time);
	}
};


// Update the animation position of this node ()
Node.prototype.processAnimation = function (time)
{
	//console.log(this.animation_type);
	var result = false;
	// We only need to do calculations if the animation is not null
	if (this.animation_type !== ANIMATION_TYPE_NULL)
	{
		// Calculate the normalized value for the animation progress
		var state = (time - this.animation_start_time) / this.animation_duration;

		// Make sure the animation is within bounds
		if (state>1.0) state = 1.0;

		// Adjust the state value so it moves slower towards the end
		state = 1-Math.pow((1-state), 2);

		// Calculate the new position by interpolating the initial and final positions
		var new_position = movePosition(this.animation_initial_position, this.animation_final_position, state);

		//console.log(new_position);

		// Depending on the animation type, we apply the new coordinated to different elements
		switch (this.animation_type)
		{
			case ANIMATION_TYPE_NODE_EXPANDING:
				// Did we reach the end of the animation?
				if (state>=1.0)
				{
					this.animation_type = ANIMATION_TYPE_NULL;
					_ui.animated_nodes_count--;

					//console.log("ANIMATION_TYPE_NODE_EXPANDING animated_nodes_count:"+_ui.animated_nodes_count);

					if (this.expanded) this.expandChildren(time);
				}
				// Move the node to the correct place
				this.virtual_position = new_position;
			break;

			case ANIMATION_TYPE_NODE_COLLAPSING:
			{
				// Did we reach the end of the animation?
				if (state>=1.0)
				{
					this.animation_type = ANIMATION_TYPE_NULL;
					_ui.animated_nodes_count--;
					this.display = false;

					//console.log("ANIMATION_TYPE_NODE_COLLAPSING animated_nodes_count:"+_ui.animated_nodes_count);

					if (this.parent && this.parent.expanded && this.parent.allChildrenCollapsed()) this.parent.startCollapsing(time);

				}
				// Move the node to the correct place
				this.virtual_position = new_position;
			}	
			break;

			case ANIMATION_TYPE_NODE_ARRANGING:
				// Did we reach the end of the animation?
				if (state>=1.0)
				{
					this.animation_type = ANIMATION_TYPE_NULL;
					_ui.animated_nodes_count--;
					//console.log("ANIMATION_TYPE_NODE_ARRANGING animated_nodes_count:"+_ui.animated_nodes_count);
				}

				// Move the node to the correct place
				this.virtual_position = new_position;
			break;

			case NODE_TEXT_MOVING:
			break;

		}
		result = true;
	}

	// Calculate the display position, based on the screen pan and zoom values
	this.display_position.x = (this.virtual_position.x - _ui.corner_x) * _ui.zoom;
	this.display_position.y = (this.virtual_position.y - _ui.corner_y) * _ui.zoom;

	if (state>=1.0)
	{
		this.setAnchor();
	}

	return result;
}


// Check if all the children of this node are collapsed
Node.prototype.allChildrenCollapsed = function()
{
	for (var j=0; j<this.children.length; j++)
	{
		var child = this.children[j];
		if (child.display) return false;
	}
	return true;
}


Node.prototype.startAnimation = function(type, time, duration, start_pos, end_pos)
{
	// Won't start the animation if another animation is already active
	if (this.animation_type !== ANIMATION_TYPE_NULL)
	{
		console.log("Animate fail!!!");
		return;
	}

	// Keep track of how many nodes are being animated
	_ui.animated_nodes_count++;

	//console.log("startAnimation:"+type+"   _ui.animated_nodes_count:"+_ui.animated_nodes_count);

	this.animation_type = type;

	this.animation_start_time = time;
	this.animation_duration = duration;
	this.animation_initial_position = start_pos;
	this.animation_final_position = end_pos;
}


// Start the collapsing animation on this node
Node.prototype.startCollapsing = function(time)
{
	//console.log("startCollapsing:"+this.id);
	// Configure the animation settings
	this.startAnimation (ANIMATION_TYPE_NODE_COLLAPSING, time, NODE_EXPAND_TIME, 
						clonePosition(this.virtual_position), this.parent.virtual_position);

	// Remember the position of the node before it was collapsed
	this.expanded_position = clonePosition(this.virtual_position);	
}


// Start the expanding animation on this node
Node.prototype.startExpanding = function(time)
{
	//console.log("startExpanding:"+this.id);

	// Configure the animation settings
	this.startAnimation (ANIMATION_TYPE_NODE_EXPANDING, time, NODE_EXPAND_TIME, 
						this.parent.virtual_position, this.expanded_position);

	this.display = true;
}

// Draw the node in the canvas
Node.prototype.draw = function (ctx) 
{
	// Check is this node is visible or not
	if (this.display === false) return false; 

	ctx.lineWidth = this.line_width;

	// Default colors
	var stroke_style = "transparent";
	var fill_style = "transparent";


	// The radius of the node is calculated depending on the zoom level
	// All the circles around the nodes are calculaded with this radius as a base value
	//var radius = this.radius * (_ui.zoom/2+0.5);
	var radius = this.radius * _ui.zoom;

	// Distance from the center of the node to the forder of the last ring that was drawn
	var border = radius;

	// Draw a black circle around the node

	var margin_thickness = NODE_MARGIN_RING_THICKNESS * _ui.zoom;
	var margin_radius = border + margin_thickness / 2;

	drawCircle( ctx, this.display_position.x, this.display_position.y, margin_radius, '#000000', margin_thickness );

	// Advance the forder to the outer edge of this circle
	border += margin_thickness;


	// Now we draw a circle with a color representing the node state
	// Choose the color for the current node state
	switch (this.state)
	{
		case NODE_STATE_FAILURE: stroke_style = NODE_STATE_FAILURE_COLOR; break;
		case NODE_STATE_RUNNING: stroke_style = NODE_STATE_RUNNING_COLOR; break;
		case NODE_STATE_SUCCESS: stroke_style = NODE_STATE_SUCCESS_COLOR; break;
		case NODE_STATE_INACTIVE: stroke_style = NODE_STATE_INACTIVE_COLOR; break;
	}

	//drawCircle(ctx, thisx, thisy, radius, stroke_style, line_width) 
	//if (this.state !== NODE_STATE_INACTIVE) 
	{
		//stroke_style = '#00BCFF';
		var state_thickness = NODE_RUNNING_STATE_RING_THICKNESS * _ui.zoom;
		var state_radius = border + state_thickness / 2;
		drawCircle( ctx, this.display_position.x, this.display_position.y, state_radius, stroke_style, state_thickness );
		border += state_thickness;
	}

	// function drawRotatedImage(ctx, image, x, y, width, height, degrees)
	//drawRotatedImage(ctx, images.getImage('node_running_gear'), 
	//	this.display_position.x-radius*1.5, this.display_position.y-radius*1.5, radius*3.0, radius*3.0, millis()/200);

	// Add a second external circle if the node is being included in a selection box or is already selected
	if (this.included || this.selected)
	{
		// Set the default color for selected/included nodes
		stroke_style = NODE_SELECTED_RING_COLOR;

		var selection_thickness = NODE_SELECTION_STATE_RING_THICKNESS * _ui.zoom;
		var selection_radius = (this.radius + NODE_MARGIN_RING_THICKNESS + NODE_RUNNING_STATE_RING_THICKNESS) * _ui.zoom +
				selection_thickness;

		ctx.save();

		if (this.included)
		{
			ctx.setLineDash([8 * _ui.zoom, 9 * _ui.zoom]);
		}
		else if (_ui.selected_node !== this)
		{
			ctx.setLineDash([8 * _ui.zoom, 3.5 * _ui.zoom]);
		}

		drawCircle( ctx, this.display_position.x, this.display_position.y, selection_radius, stroke_style, selection_thickness );
		border = selection_radius + selection_thickness/2;
		ctx.restore();
	}
	else
	// The same (second external circle) is also used to indicate if the node can be a valid parent for any
	// nodes that are currently being dragged. We mark this node only if it can have more children
	if (_ui.connecting_nodes && this.valid_parent)
	{
		// Sets a different color depending if the node is a potential parent or the selected parent
		stroke_style = _ui.temporary_parent === this ? NODE_SELECTED_PARENT_RING_COLOR : NODE_VALID_PARENT_RING_COLOR;

		var selection_thickness = NODE_SELECTION_STATE_RING_THICKNESS * _ui.zoom;
		var selection_radius = (this.radius + NODE_MARGIN_RING_THICKNESS + NODE_RUNNING_STATE_RING_THICKNESS) * _ui.zoom +
				selection_thickness;

		drawCircle( ctx, this.display_position.x, this.display_position.y, selection_radius, stroke_style, selection_thickness );
		border = selection_radius + selection_thickness/2;

	}

	// Draw the image assigned to this node
    ctx.drawImage(this.image, this.display_position.x-radius , this.display_position.y-radius, radius*2, radius*2);


    // If the node has children, we need to draw the expand/collapse button below the node
	if (this.children.length > 0)
	{
		// In this case we also need to draw the expand/collapse images below the node
		if (this.expanded === false)
		{
		    ctx.drawImage(images.getImage('plus'), this.display_position.x-(radius/2) , this.display_position.y+radius, radius, radius);
		}
		else
		{
		    ctx.drawImage(images.getImage('minus'), this.display_position.x-(radius/2) , this.display_position.y+radius, radius, radius);
		}
	}

	// Position and alignment for the text labels near the node
	// This position will depend if the node has children or not
	var label_xpos;
	var label_ypos;
	var label_align;

	// The base margin for the node is 1.0 (it's a factor of the node radius)
	//var offset = 1.0;
	// Add a bit more space if the node is selected
	//if (this.included || this.selected || this.error_state !== NODE_STATE_NO_ERROR) offset += 0.3;
	// And bit more space if the node is the one in focus
	//if (_ui.selected_node === this) offset += 0.15;

	// Calculate the height (in pixels) of the data we want to display
	this.display_data_height = this.node_data_height * _ui.zoom;

	// Calculates the area for the node (in pixels) that already includes all the
	// possible different circle indicators around the node
	//this.border_area_radius = radius*2*offset;

	// Based on the node area radius, we calculate picel positions for specific borders
	this.border_position_left = this.display_position.x - border;
	this.border_position_right = this.display_position.x + border;
	this.border_position_top = this.display_position.y - border;
	this.border_position_bottom = this.display_position.y + border;


	// If the node has an error or a warning, add the image to indicate each case
	if (this.error_state !== NODE_STATE_NO_ERROR)
	{
		var image = null;
		if (this.error_state === NODE_STATE_WARNING)
		{
			image = images.getImage('node_warning');
			size = NODE_ERROR_SIZE * _ui.zoom;
		}
		else if (this.error_state === NODE_STATE_ERROR)
		{
			image = images.getImage('node_error');
			size = NODE_WARNING_SIZE * _ui.zoom;
		}
		ctx.drawImage(image, this.display_position.x+border*0.7071, 
							 this.display_position.y-border*0.7071 - size, size, size);
	}

	// If the node has custom node data to display, show that before the node name
	if (this.drawData) 
	{
		this.border_position_bottom += this.display_data_height;
		this.drawData(ctx);
	}

	//drawCross(ctx,  this.display_position.x+border, this.display_position.y,	20, "#FF0000");
	//drawCross(ctx,  this.display_position.x, this.display_position.y+border,	20, "#FF0000");

	// If the node is a leaf or the children are not visible, we place any existing labels below the node
	if (this.children.length === 0 || this.expanded === false)
	{
		label_xpos = this.display_position.x;
		label_ypos = this.border_position_bottom + this.display_data_height*1.8;
		label_align = DATA_ALIGN_CENTER;
	}
	// If the node is not a leaf, we place any existing labels left of the node
	else
	{
		//this.node_margin = this.radius * 1.4 * _ui.zoom * offset;;

		label_xpos = this.border_position_left - this.display_data_height*NODE_DATA_MARGIN;
		label_ypos = this.display_position.y;
		label_align = DATA_ALIGN_LEFT;
	}

	// If the name is not empty, draw it next to the node
	if (this.name !== '')
	{
		drawTextBox ( ctx, this.name, 14, label_align, label_xpos, label_ypos,
			NODE_DESCRIPTION_TEXT_COLOR, NODE_DESCRIPTION_BACKGROUND_COLOR );
	}

    //ctx.fillStyle = 'transparent';

    return true;
};


// Draws the connection between this node and its children
Node.prototype.drawConnections = function (ctx) 
{
	// Check if this node is visible or not
	if (!this.display) return; 

	ctx.save();
	//addCanvasShadow(ctx, 'black', 5*_ui.zoom, 2*_ui.zoom, 2*_ui.zoom);
	
	// Let's check each node for its children
	for (var j=0; j<this.children.length; j++)
	{
		var child = this.children[j];
		if (!child) return;

		// Check if the child node is visible or not
		if (!child.display) continue; 
		var color = NODE_CONNECTION_COLOR;
		
		// Check if the connection is on the selected list
		if (this.connections_selected.indexOf(child) > -1)
		//if (child in this.connections_selected)
		{
			color = NODE_CONNECTION_SELECTED_COLOR;
			//console.log('SELECTED!!!')
		}

		//ctx.lineWidth = this.line_width * _ui.zoom;
		ctx.lineWidth = this.line_width * _ui.zoom;

		//console.log(ctx.lineWidth);

		ctx.strokeStyle = color;

		//ctx.strokeStyle = "rgb(0, 0, 0)";

		this.drawConnectionToChild(ctx, child);

		//ctx.closePath();
		//ctx.strokeStyle = "rgb(0, 0, 255)";
		ctx.stroke();

	}

	ctx.restore();
};


// Draws a temporary connection between this node and the node specified by the function argument
Node.prototype.drawTemporaryConnection = function (ctx, child) 
{
	// Check if this node is visible or not
	if (!this.display) return; 

	ctx.save();
	
	//ctx.lineWidth = this.line_width * _ui.zoom;
	ctx.lineWidth = this.line_width * _ui.zoom;
	ctx.setLineDash([8 * _ui.zoom, 8 * _ui.zoom]);
	ctx.strokeStyle = NODE_CONNECTION_COLOR;


	this.drawConnectionToChild(ctx, child);

	ctx.stroke();

	ctx.restore();

};


// Toggle the selection state 
Node.prototype.drawConnectionToChild = function (ctx, child) 
{
	var radius = this.radius * _ui.zoom;

	// Variable used to define the bezier curve guide points
	var y_distance = (child.display_position.y - this.display_position.y - 2*radius) * 0.7;

	ctx.beginPath();
	ctx.moveTo(this.display_position.x, this.display_position.y + 2 * radius);
	
	ctx.bezierCurveTo( this.display_position.x, this.display_position.y+y_distance, child.display_position.x, 
					child.display_position.y-y_distance, child.display_position.x, child.display_position.y);

}

// Toggle the selection state 
Node.prototype.toggleConnection = function (c) 
{
	console.log('toggleConnection:'+c);
	// Check if the child already exists on this list
	pos = this.connections_selected.indexOf(c);
	// If the child existed, remove it from the list
	if ( pos > -1) this.connections_selected.splice(pos, 1);
	// If it didn't exist, let's add it
	else this.connections_selected.push(c);
};


// Unselect all the connections starting from this node
Node.prototype.unselectConnections = function () 
{
	this.connections_selected = [];
};


// Removes all selected connections from this node
Node.prototype.removeSelectedConnections = function () 
{
	//console.log('removeSelectedConnections:'+this.connections_selected.length)
	for (var i=0; i<this.connections_selected.length; i++)
	{
		this.removeChild(this.connections_selected[i]);
	}
	this.connections_selected = [];
};


// Set the new selection state for this node (selected/unselected)
Node.prototype.setSelect = function (state) 
{
	this.selected = state;
};


// Set the new selection state for this node and all its descendants (selected/unselected)
Node.prototype.selectTree = function (state) 
{
	this.selected = state;
	for (var i=0; i<this.children.length; i++)
	{
		this.children[i].selectTree(state);
	}
};


Node.prototype.toString = function() 
{
	return this.id;
};
	

//
// export / import functions
//	

// Export the JSON data relative to this node
Node.prototype.exportJson = function()
{
	var output = 
	{
		name: this.name,
		type: this.type,
		id: this.id,
		x: this.virtual_position.x,
		y: this.virtual_position.y,
		data: this.data
	};

	//console.log(this);
	//console.log(this);
	//console.log(this.img_id);
	// If the image is not the default one for this node type, save it
	if (this.img_id) output['img_id'] = this.img_id;

	return output;
};


// Return a string with all the node child connections
Node.prototype.exportConnection = function (child)
{
	return this.id+':'+this.children[child].id;
};


// Return a string with the base node data to the Arduino
Node.prototype.exportNodeToArduino = function() 
{
	return 'N' + padByte(this.id);
};

	
// Return a string with all the node child connections
Node.prototype.exportConnectionsToArduino = function ()
{
	var connections = '';
	for (var j=0; j<this.children.length; j++)
	{	
		connections += 'C'+padByte(this.id)+
			padByte(this.children[j].id) + ';';
	}
	return connections;
};


// Let's see if there are any errors associated with this node, and return
// a block of HTML with the error if there is one
Node.prototype.showErrors = function()
{
	// Nothing to do here...
	if (this.error_state === NODE_STATE_NO_ERROR) return '';

	if (this.error_state === NODE_STATE_WARNING)
	{
		return "<span class='warning_span'>"+lang['warning']+":"+lang[this.error_message]+"</p>";
	}
	if  (this.error_state === NODE_STATE_ERROR)
	{
		return "<span class='error_span'>"+lang['error']+":"+lang[this.error_message]+"</p>";
	}
};


// Check if the node is valid, updating a internal variable with the result
// This validates only general node conditions
// Specific nodes should also validate their own specific conditions
Node.prototype.validate = function()
{

	// Checks if the node is a valid parent for other nodes
	// The node can be a parent if it can have more children
	this.valid_parent = this.max_children > this.children.length;


	// Make sure the node has children, if they are required
	if (this.min_children > 1 && this.children.length === 0)
	{
		this.error_message = 'error_missing_children';
		return this.error_state = NODE_STATE_ERROR;
	}

	// If the node needs exactlly 1 child, let's enforce that
	if (this.min_children == 1 && this.max_children == 1 && this.children.length !== 1)
	{
		this.error_message = 'error_missing_single_child';
		return this.error_state = NODE_STATE_ERROR;
	}
	

	// Make sure the node is connected ot the tree (= has a parent)
	if (this.parent === null && this.type !== 'node_root')
	{
		this.error_message = 'warning_disconnected_node';
		return this.error_state = NODE_STATE_WARNING;
	}

	// Make sure the node has children, if they are required
	if (this.min_children > 1 && this.children.length < this.min_children)
	{
		this.error_message = 'warning_missing_children';
		return this.error_state = NODE_STATE_WARNING;
	}

	// If no errors were found, let's assume the node is fine
	this.error_message = '';
	return this.error_state = NODE_STATE_NO_ERROR;
};


// Add listeners to validate the node data when any relevant field changes
Node.prototype.addListPropertiesListeners = function(data) 
{
	// Necessary variable to access the data from the callback functions
	var node_data = data;

	// Selectors to change the different override properties
	$('.selector_data_source').off('change').on('change', function() { Node.prototype.updateNodeProperties(node_data) });
	$('.selector_data_value').off('input').on('input', function() { Node.prototype.updateNodeProperties(node_data) });
};


// Validate if all the node properties are consistent
Node.prototype.updateNodeProperties = function(data) 
{
	// Parse the data from the UI and put the values on the 'data' field of the node
	parseInputValues(data);

	// Since the UI may have changed because the user changed some settings, we need
	// to make sure that there are listeners for all the elements
	this.addListPropertiesListeners(data);

	// Redraw the tree with the new values
	_ui.draw();
}


/*
// Shows or hides a section (div) of the node properties when a toggle button 
// is clicked, and also changes the toggle button image accordingly
// The ids between the headers and divs must be consistent:
// ex: img_toggle_properties -> div_data_properties
// in this example img_header_XXXXX is linked to div_data_XXXXX
Node.prototype.toggleSectionVisibility = function(event)
{
    // Calculate the id of the div from the id of the header
    var id = event.target.id;
    var name = "div_data_" + id.replace("img_toggle_", "");

    console.log(this.name);

    // If the matching div is currently visible, hide it
    if ($('#'+name).is(":visible"))
    {
        $('#'+id).attr("src", "images/menus/button_section_expand.svg");
        collapseDiv(name, 500);
    }
    // ... otherwise it's not visible, so let's show it
    else
    {
        $('#'+id).attr("src", "images/menus/button_section_collapse.svg");
        expandDiv(name, 500);
    }
}
*/