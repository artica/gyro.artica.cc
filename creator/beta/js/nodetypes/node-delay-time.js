
//
// Delay Time Node
//

function NodeDelayTime(id, name, data) 
{
	// Categorize this node type
	this.type = 'node_delay_time';
	this.unique = false;
	this.min_children = 0;
	this.max_children = 0;

	// Call the generic constructor to initialize default node data
	Node.call(this, id, name, data);
	return this;
}

// Inherit from the Node class
NodeDelayTime.inheritsFrom(Node);

// All the prototype definitions MUST be added after this point


// Default data to create new nodes of this type
NodeDelayTime.prototype.DEFAULT_NODE_DATA  = 
	{ 
	    "source_1": 0,
        "value_1": 1000
	};


// Returns a block of HTML with a table with the necessary elements to configute this node type
NodeDelayTime.prototype.listProperties = function(data)
{
	return "<table>"+
			"<tr>"+
				"<td>"+lang['Value']+"</td>"+
				"<td>"+createHtmlSelectorsDataSource('data_1', data.source_1, data.value_1)+"</td>"+
			"</tr>"+
		"</table>";
};


// Returns a block of formatted HTML containing the description of this node
NodeDelayTime.prototype.getNodeDescription = function()
{
	var html = getComposedString(lang['node_delay_time_description'], 
			getDataString(this.data, 1, DATA_CONTEXT_INPUT) )+

		"<br>" + this.showErrors();
	
	return html;
};



// Return a string with hex encoded data representing this node
NodeDelayTime.prototype.exportNodeToArduino = function() 
{
	var data = Node.prototype.exportNodeToArduino.call(this) +
		padByte(NODE_SERVICE) + padByte(SERVICE_DELAY);

	// Start building a string with data for the specific function
	var function_data = packSourceDataHex(this.data, 1);
	// Add a byte containing the length of the data for the function
	// (in bytes, so it's half the size of the hex data string)
	data += padByte(function_data.length/2);
	data += function_data;

	console.log("delay_data:"+function_data+"    length:"+ (function_data.length/2) );

	data += ";"
	return data;
};


// Draw this node custom data over the default node data
NodeDelayTime.prototype.drawData = function(ctx) 
{
 	drawDataSource(ctx, this.display_data_height, this.display_position.x, this.border_position_bottom, this.data.source_1, this.data.value_1, DATA_ALIGN_CENTER);
};
