
//
// Gyro Rotate Left Node
//

function NodeGyroRotateLeft(id, name, data) 
{
	// Categorize this node type
	this.type = 'node_gyro_rotate_left';
	this.unique = false;
	this.min_children = 0;
	this.max_children = 0;

	// Call the generic constructor to initialize default node data
	Node.call(this, id, name, data);
	return this;
}

// Inherit from the Node class
NodeGyroRotateLeft.inheritsFrom(Node);

// All the prototype definitions MUST be added after this point


// Default data to create new nodes of this type
NodeGyroRotateLeft.prototype.DEFAULT_NODE_DATA  = 
	{ 
	    "source_1": 0,
        "value_1": 90
	};


// Returns a block of HTML with a table containing the necessary elements to configure this node type
NodeGyroRotateLeft.prototype.listProperties = function(data)
{
	return "<table>"+
			"<tr>"+
				"<td>"+lang['Angle']+"</td>"+
				"<td>"+createHtmlSelectorsDataSource('data_1', data.source_1, data.value_1)+"</td>"+
			"</tr>"+
		"</table>";
};


// Returns a block of formatted HTML containing the description of this node
NodeGyroRotateLeft.prototype.getNodeDescription = function()
{
	var html = getComposedString(lang['node_gyro_rotate_left'], 
			getDataString(this.data, 1, DATA_CONTEXT_INPUT) )+

		"<br>" + this.showErrors();
	
	return html;
};



// Return a string with hex encoded data representing this node
NodeGyroRotateLeft.prototype.exportNodeToArduino = function() 
{
	var data = Node.prototype.exportNodeToArduino.call(this) +
		padByte(NODE_SERVICE) + padByte(SERVICE_DELAY);

	// Start building a string with data for the specific function
	var function_data = packSourceDataHex(this.data, 1);
	// Add a byte containing the length of the data for the function
	// (in bytes, so it's half the size of the hex data string)
	data += padByte(function_data.length/2);
	data += function_data;

	console.log("rotate_left:"+function_data+"    length:"+ (function_data.length/2) );

	data += ";"
	return data;
};


// Draw this node custom data over the default node data
NodeGyroRotateLeft.prototype.drawData = function(ctx) 
{
 	drawDataSource(ctx, this.display_data_height, this.display_position.x, this.border_position_bottom, this.data.source_1, this.data.value_1, DATA_ALIGN_CENTER);
};
