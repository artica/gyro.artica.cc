
//
// Sequence Node
//

function NodeSequence(id, name, data) 
{
	// Categorize this node type
	this.type = 'node_sequence';
	this.unique = false;
	this.min_children = 2;
	this.max_children = 999;

	// Call the generic constructor to initialize default node data
	Node.call(this, id, name, data);
	return this;
}

// Inherit from the Node class
NodeSequence.inheritsFrom(Node);

// All the prototype definitions MUST be added after this point

// Default data to create new nodes of this type

NodeSequence.prototype.DEFAULT_NODE_DATA  = { repeat_count: 1};

// Different completion policies for the sequence nodes
NodeSequence.prototype.policies = [{value:0, name:'sequence_run_forever'},
								   {value:1, name:'sequence_run_x_times'} ];


// Returns a block of HTML with a table with the necessary elements to configute this node type
NodeSequence.prototype.listProperties = function(data) 
{
	console.log("listProperties:"+data.run_count);

	var success_policy = (data.run_count > 0 ? 1: 0); 
	var output = '<table>'+
	
		// Completion policy selector
		"<tr>"+
		"<td>"+createHtmlSelectorTranslated('select_completion_policy', null, this.policies, success_policy)+"</td>";

	if (success_policy===1) output += "<td><input type='number' id='text_repeat_count' value='"+data.run_count+"' min='1' max='999999' class='small_number'></input></td>";

	output += '</tr></table>';

	return output;
};


// Add listeners to validate the node data when any relevant field changes
NodeSequence.prototype.addListPropertiesListeners = function(data) 
{
	// Necessary variable to access the data from the callback functions
	var node_data = data;

	// Selectors to change the different override properties
	$('#select_completion_policy').on('change', function() { NodeSequence.prototype.validateNodeProperties(node_data) });
	$('#text_repeat_count').on('change', function() { NodeSequence.prototype.validateNodeProperties(node_data) });
};


// Validate if all the node properties are valid
NodeSequence.prototype.validateNodeProperties = function(data) 
{
	var success_policy = parseInt($('#select_completion_policy').val(), 10);

	console.log(success_policy);

	if (success_policy === 0)
	{
		data.run_count = 0;
	}
	else
	{
		data.run_count = parseInt( $('#text_repeat_count').val(), 10);
		// If the number of repetitions is not defined set it to 1
		if (isNaN(data.run_count)) data.run_count = 1;
	}
	_ui.draw();
	_ui.displayNodeProperties();
}


// Return a string with hex encoded data representing this node
NodeSequence.prototype.exportNodeToArduino = function() 
{
		return Node.prototype.exportNodeToArduino.call(this) +
			padByte(NODE_SEQUENCE) + padByte(this.children.length) + padLong(this.data.run_count)+';';
};


// Draw this node custom data over the default node data
NodeSequence.prototype.drawData = function(ctx) 
{
	//drawTextBox( ctx, text, text_font_size, align, thisx, thisy, custom_font_color, custom_background_color ) 

	var text = (this.data.run_count > 0 ? this.data.run_count : "forever"); 
	drawTextBox(ctx, text, 14, DATA_ALIGN_RIGHT, this.border_position_right+this.display_data_height*NODE_DATA_MARGIN, this.display_position.y);


	//drawDataSource(ctx, this.display_data_height, this.border_position_bottom, this.data.source_1, this.data.value_1, DATA_ALIGN_LEFT);


};


