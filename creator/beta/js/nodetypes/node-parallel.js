
//
// Parallel Node
//

function NodeParallel(id, name, data) 
{
	// Categorize this node type
	this.type = 'node_parallel';
	this.unique = false;
	this.min_children = 2;
	this.max_children = 999;

	// Call the generic constructor to initialize default node data
	Node.call(this, id, name, data);
	return this;
}

// Inherit from the Node class
NodeParallel.inheritsFrom(Node);

// All the prototype definitions MUST be added after this point


// Default data to create new nodes of this type
NodeParallel.prototype.DEFAULT_NODE_DATA  = { success_policy: 1, failure_policy: 0 };


// Different completion policies for the parallel nodes
NodeParallel.prototype.policies = [{value:0, name:'parallel_require_one'},
								   {value:1, name:'parallel_require_all'} ];



// Get a string with an HTML block to configure this node type
NodeParallel.prototype.listProperties = function(data) 
{
	var output = '<table>'+
	
		// Completion policy selector
		"<tr><td>"+lang['success_policy']+"</td><td>"+
    	createHtmlSelectorTranslated('select_completion_policy', null, this.policies, data.success_policy)+
		"</td><td>"+lang['succeeds']+"</td></tr>"+

		// Failure policy selector
		"<tr><td>"+lang['failure_policy']+"</td><td>"+
    	createHtmlSelectorTranslated('select_failure_policy', null, this.policies, data.failure_policy)+
		"</td><td>"+lang['fails']+"</td></tr></table>";

	return output;
};


// Add listeners to validate the node data when any relevant field changes
NodeParallel.prototype.addListPropertiesListeners = function(data) 
{
	// Necessary variable to access the data from the callback functions
	var node_data = data;

	// Selectors to change the different override properties
	$('#select_completion_policy').on('change', function() { NodeParallel.prototype.validateNodeProperties(node_data) });
	$('#select_failure_policy').on('change', function() { NodeParallel.prototype.validateNodeProperties(node_data) });
};


// Validate if all the node properties are valid
NodeParallel.prototype.validateNodeProperties = function(data) 
{
	data.success_policy = parseInt($('#select_completion_policy').val(), 10);
	data.failure_policy = parseInt($('#select_failure_policy').val(), 10);
	_ui.draw();
}


// Export the data for the node (so sent to the Arduino)
NodeParallel.prototype.exportNodeToArduino = function() 
{		
	var policy = 2*this.data.failure_policy + this.data.success_policy;
	
	return Node.prototype.exportNodeToArduino.call(this) +
		padByte(NODE_PARALLEL) + padByte(this.children.length)+padByte(policy)+';';		
};


// Draw this node custom data over the default node data
NodeParallel.prototype.drawData = function(ctx) 
{
	var success_image = "node_parallel_rule_success_" + (this.data.success_policy === 0 ? 'one': 'all');
	drawSquareImage(ctx, images.getImage(success_image), this.border_position_right + this.display_data_height*0.7, this.display_position.y - this.display_data_height, this.display_data_height*1.3);

	var failure_image = "node_parallel_rule_failure_" + (this.data.failure_policy === 0 ? 'one': 'all');
	drawSquareImage(ctx, images.getImage(failure_image), this.border_position_right + this.display_data_height*0.7, this.display_position.y + this.display_data_height, this.display_data_height*1.3);
};


