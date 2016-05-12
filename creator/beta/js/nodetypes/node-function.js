
//
// Function Nodes
//
//

function NodeFunction(id, name, data) 
{
	// Categorize this node type
	this.type = 'node_function';
	this.unique = false;
	this.min_children = 0;
	this.max_children = 0;

	// Call the generic constructor to initialize default node data
	Node.call(this, id, name, data);
	return this;
}


// Inherit from the Node class
NodeFunction.inheritsFrom(Node);

// All the prototype definitions MUST be added after this point


//// Codes for the different test types
var FUNCTION_TYPE_COPY		=		0x00;
var FUNCTION_TYPE_MAP		=		0x01;
var FUNCTION_TYPE_RANDOM	=		0x02;
var FUNCTION_TYPE_RANGE		=		0x03;

// Associations fetween the function types and different function parameters
NodeFunction.prototype.functions = [{value:0, name:'function_copy', input:1, output:2},
									{value:1, name:'function_map', input:1, output:6},
									{value:2, name:'function_random', output:3},
									{value:3, name:'function_range', output:4} ];


// Default data for a COPY function
NodeFunction.prototype.DEFAULT_NODE_DATA_COPY  =
	{
		function_type: FUNCTION_TYPE_COPY,
		// Source of the input data
		source_1: 0,
		value_1: 0,
		// Target for the output data
		source_2: 0,
		value_2: 0
	};

// Default data for a MAP function
NodeFunction.prototype.DEFAULT_NODE_DATA_MAP  =
	{
		function_type: FUNCTION_TYPE_MAP,
		// Source of the input data
		source_1: 0,
		value_1: 0,

		// Range of the source value
		value_2: 0,
		value_3: 1023,
		// Range of the target value
		value_4: 0,
		value_5: 255,

		// Target for the output data
		source_6: 0,
		value_6: 0
	};


// Default data for a RANDOM function
NodeFunction.prototype.DEFAULT_NODE_DATA_RANDOM  =
	{
		function_type: FUNCTION_TYPE_RANDOM,
		// Minimum value 
		source_1: 0,
		value_1: 0,

		// Maximum value 
		source_2: 0,
		value_2: 100,

		// Target for the output data
		source_3: 0,
		value_3: 0
	};


// Default data for a RANGE function
NodeFunction.prototype.DEFAULT_NODE_DATA_RANGE  =
	{
		function_type: FUNCTION_TYPE_RANGE,
		// Minimum value 
		source_1: 0,
		value_1: 0,

		// Step value 
		source_2: 0,
		value_2: 1,

		// Maximum value 
		source_3: 0,
		value_3: 100,

		// Target for the output data
		source_4: 0,
		value_4: 0

	};


// Default data to create new nodes of this type
NodeFunction.prototype.DEFAULT_NODE_DATA  = NodeFunction.prototype.DEFAULT_NODE_DATA_COPY;


// Custom initialization settings for this node
NodeFunction.prototype.init = function()
{
	this.setFunctionImage();
};


// Set the image for the node depending on the selected function type
NodeFunction.prototype.setFunctionImage = function()
{
	//console.log(this.data.function_type);
	if (typeof this.data.function_type !== 'undefined') this.setImage( 'node_'+this.functions[this.data.function_type].name );
};


// Get a string with an HTML block to configure this node type
NodeFunction.prototype.listProperties = function(data) 
{

	//console.log("NodeFunction.prototype.listProperties:");
	//console.log(data);

	var output = "<table><tr><td>"+lang['function']+"</td><td>"+

		// Create a selector to choose which function to use
		createHtmlSelectorTranslated('function_type', null, this.functions, data.function_type)+

		"</td></tr></table>";

	switch (data.function_type)
	{
		case FUNCTION_TYPE_COPY:

			output += "<table class='table_node_data'><tr><td style='width:30%;'>"+
				"Input<br>"+
				createHtmlSelectorsDataSource('data_1', data.source_1, data.value_1)+
				"</td>"+
 			
				"<td style='width:40%;'> --> </td>"+
				"<td style='width:30%;'>"+

					"Output<br>"+
					createHtmlSelectorsDataSource('data_2', data.source_2, data.value_2)+
				"</td></tr>"+
				
				"</table>";
		break;

		case FUNCTION_TYPE_MAP:
			output += "<table class='table_node_data'><tr><td style='width:30%;'>"+
				"Input<br>"+
				createHtmlSelectorsDataSource('data_1', data.source_1, data.value_1)+
				"</td>"+

				"<td style='width:40%;'>"+

	 				"<table>"+
		 				"<tr><td>MIN</td><td>MIN</td></tr>"+
		 				"<tr>"+
		 					"<td>"+createHtmlInputNumber("data_2_value", data.value_2)+"</td>"+
		 					"<td>"+createHtmlInputNumber("data_4_value", data.value_4)+"</td>"+
		 				"</tr>"+

		 				"<tr><td>MAX</td><td>MAX</td></tr>"+
		 				"<tr>"+
		 					"<td>"+createHtmlInputNumber("data_3_value", data.value_3)+"</td>"+
		 					"<td>"+createHtmlInputNumber("data_5_value", data.value_5)+"</td>"+
		 				"</tr>"+
	 				"</table>"+
				"</td>"+

				"<td style='width:30%;'>"+

					"Output<br>"+
					createHtmlSelectorsDataSource('data_6', data.source_6, data.value_6)+
				"</td></tr>"+
				
				"</table>";

		break;

		case FUNCTION_TYPE_RANDOM:
			output += "<table class='table_node_data'><tr>"+
				"<td style='width:40%;'>"+
	 				"<table>"+
		 				"<tr>"+
		 					"<td>MIN</td>"+
		 					"<td>"+createHtmlSelectorsDataSource("data_1", data.source_1, data.value_1)+"</td>"+
		 				"</tr>"+
		 				"<tr>"+
		 					"<td>MAX</td>"+
		 					"<td>"+createHtmlSelectorsDataSource("data_2", data.source_2, data.value_2)+"</td>"+
		 				"</tr>"+
	 				"</table>"+
				"</td>"+

				"<td style='width:40%;'>"+
					"Output<br>"+
					createHtmlSelectorsDataSource('data_3', data.source_3, data.value_3)+
				"</td></tr>"+
				"</table>";
		break;

		case FUNCTION_TYPE_RANGE:
			output += "<table class='table_node_data'><tr>"+
				"<td style='width:40%;'>"+
	 				"<table>"+
		 				"<tr>"+
		 					"<td>MIN</td>"+
		 					"<td>"+createHtmlSelectorsDataSource("data_1", data.source_1, data.value_1)+"</td>"+
		 				"</tr>"+
		 				"<tr>"+
		 					"<td>MAX</td>"+
		 					"<td>"+createHtmlSelectorsDataSource("data_3", data.source_3, data.value_3)+"</td>"+
		 				"</tr>"+
		 				"<tr>"+
		 					"<td>STEP</td>"+
		 					"<td>"+createHtmlSelectorsDataSource("data_2", data.source_2, data.value_2)+"</td>"+
		 				"</tr>"+
	 				"</table>"+
				"</td>"+

				"<td style='width:40%;'>"+
					"Output<br>"+
					createHtmlSelectorsDataSource('data_4', data.source_4, data.value_4)+
				"</td></tr>"+
				"</table>";
		break;

	}

	//console.log(data.function_type);

	return output;
};



// Add the listeners for changes in the configuration
NodeFunction.prototype.addListPropertiesListeners = function(data) 
{
	// Necessary variable to access the node from the callback functions
	var node = this;

	// Selector to change the type of the new device to be created
	$('#function_type').on('change', function() 
		{
			// First we get the input and output data for each specific funcion
			var old_input = null;
			var old_output = null; 

			// Get the function data configuration for the old function type
			var function_data = node.functions[node.data.function_type];
			// The the function has any input/outpus configuration, extract them
			if ( function_data.input ) old_input = getDataSource(node.data, function_data.input);
			if ( function_data.output ) old_output = getDataSource(node.data, function_data.output);


			// Check the new node function type and adjust update the variable and the image accordingly
			node.data.function_type = parseInt($('#function_type').val(), 10);
			node.setFunctionImage();

			switch (node.data.function_type)
			{
				case FUNCTION_TYPE_COPY:
					node.data = $.extend(false, {}, NodeFunction.prototype.DEFAULT_NODE_DATA_COPY);
				break;
				case FUNCTION_TYPE_MAP:
					node.data = $.extend(false, {}, NodeFunction.prototype.DEFAULT_NODE_DATA_MAP);
				break;
				case FUNCTION_TYPE_RANDOM:
					node.data = $.extend(false, {}, NodeFunction.prototype.DEFAULT_NODE_DATA_RANDOM);
				break;
				case FUNCTION_TYPE_RANGE:
					node.data = $.extend(false, {}, NodeFunction.prototype.DEFAULT_NODE_DATA_RANGE);
				break;
			}

			// Get the function data configuration for the new function type
			function_data = node.functions[node.data.function_type];

			// The the function has any input/outpus configuration, set them equal to the ones
			// from the previous function type, assunimg that function type has the same valid parameters
			if ( function_data.input ) setDataSource(node.data, function_data.input, old_input);
			if ( function_data.output ) setDataSource(node.data, function_data.output, old_output);

			_ui.displayNodeProperties();
		});

	Node.prototype.addListPropertiesListeners(data);
};


// Return a string with hex encoded data representing this node
NodeFunction.prototype.exportNodeToArduino = function() 
{
	console.log('##### export_FUNCTION:'+this);
	console.log(this);
	var data = Node.prototype.exportNodeToArduino.call(this) +
		padByte(NODE_SERVICE) +	padByte(SERVICE_FUNCTION);	
	
	// Start building a string with data for the selected function
	var function_data = padByte(this.data.function_type);
	switch(this.data.function_type)
	{
		case FUNCTION_TYPE_COPY:
			function_data += packSourceDataHex(this.data, 1);
			function_data += packSourceDataHex(this.data, 2);
		break;
		case FUNCTION_TYPE_MAP:
			function_data += packSourceDataHex(this.data, 1);
			function_data += packConstDataHex(this.data.value_2);
			function_data += packConstDataHex(this.data.value_3);
			function_data += packConstDataHex(this.data.value_4);
			function_data += packConstDataHex(this.data.value_5);
			function_data += packSourceDataHex(this.data, 6);
		break;
		case FUNCTION_TYPE_RANDOM:
			function_data += packSourceDataHex(this.data, 1);
			function_data += packSourceDataHex(this.data, 2);
			function_data += packSourceDataHex(this.data, 3);
		break;
		case FUNCTION_TYPE_RANGE:
			function_data += packSourceDataHex(this.data, 1);
			function_data += packSourceDataHex(this.data, 2);
			function_data += packSourceDataHex(this.data, 3);
			function_data += packSourceDataHex(this.data, 4);
		break;
	};
	// Add a byte containing the length of the data for the function
	// (in bytes, so it's half the size of the hex data string)
	data += padByte(function_data.length/2);
	data += function_data;

	console.log("function_data:"+function_data+"    length:"+ (function_data.length/2) );

	data += ";"
	return data;
};


// Draw this node custom data over the default node data
NodeFunction.prototype.drawData = function(ctx) 
{
	switch(this.data.function_type)
	{
		case FUNCTION_TYPE_COPY:
			drawDataSource(ctx, this.display_data_height, this.display_position.x, this.border_position_bottom, this.data.source_1, this.data.value_1, DATA_ALIGN_CENTER);
			this.border_position_bottom += this.display_data_height * 1.5;
			drawSquareImage(ctx, images.getImage('arrow_down'), this.display_position.x, this.border_position_bottom, this.display_data_height);
			this.border_position_bottom += this.display_data_height * 1.5;
			drawDataSource(ctx, this.display_data_height, this.display_position.x, this.border_position_bottom, this.data.source_2, this.data.value_2, DATA_ALIGN_CENTER);
		break;

		case FUNCTION_TYPE_MAP:
			drawDataSource(ctx, this.display_data_height, this.display_position.x, this.border_position_bottom, this.data.source_1, this.data.value_1, DATA_ALIGN_CENTER);
			this.border_position_bottom += this.display_data_height * 1.5;

			drawDataSource(ctx, this.display_data_height, this.display_position.x-this.display_data_height*0.2, this.border_position_bottom, this.data.source_2, this.data.value_2, DATA_ALIGN_LEFT);
			drawDataSource(ctx, this.display_data_height, this.display_position.x+this.display_data_height*0.2, this.border_position_bottom, this.data.source_3, this.data.value_3, DATA_ALIGN_RIGHT);

			this.border_position_bottom += this.display_data_height * 1.5;

			drawSquareImage(ctx, images.getImage('arrow_down'), this.display_position.x, this.border_position_bottom, this.display_data_height);

			this.border_position_bottom += this.display_data_height * 1.5;

			drawDataSource(ctx, this.display_data_height, this.display_position.x-this.display_data_height*0.2, this.border_position_bottom, this.data.source_4, this.data.value_4, DATA_ALIGN_LEFT);
			drawDataSource(ctx, this.display_data_height, this.display_position.x+this.display_data_height*0.2, this.border_position_bottom, this.data.source_5, this.data.value_5, DATA_ALIGN_RIGHT);

			this.border_position_bottom += this.display_data_height * 1.5;

			drawDataSource(ctx, this.display_data_height, this.display_position.x, this.border_position_bottom, this.data.source_6, this.data.value_6, DATA_ALIGN_CENTER);
		break;

		case FUNCTION_TYPE_RANDOM:
			drawDataSource(ctx, this.display_data_height, this.display_position.x-this.display_data_height*0.2, this.border_position_bottom, this.data.source_1, this.data.value_1, DATA_ALIGN_LEFT);
			drawDataSource(ctx, this.display_data_height, this.display_position.x+this.display_data_height*0.2, this.border_position_bottom, this.data.source_2, this.data.value_2, DATA_ALIGN_RIGHT);
			this.border_position_bottom += this.display_data_height * 1.5;
			drawSquareImage(ctx, images.getImage('arrow_down'), this.display_position.x, this.border_position_bottom, this.display_data_height);
			this.border_position_bottom += this.display_data_height * 1.5;
			drawDataSource(ctx, this.display_data_height, this.display_position.x, this.border_position_bottom, this.data.source_3, this.data.value_3, DATA_ALIGN_CENTER);

		break;

		case FUNCTION_TYPE_RANGE:
			drawDataSource(ctx, this.display_data_height, this.display_position.x-this.display_data_height*0.2, this.border_position_bottom, this.data.source_1, this.data.value_1, DATA_ALIGN_LEFT);
			drawDataSource(ctx, this.display_data_height, this.display_position.x+this.display_data_height*0.2, this.border_position_bottom, this.data.source_3, this.data.value_3, DATA_ALIGN_RIGHT);
			this.border_position_bottom += this.display_data_height * 1.5;
			drawDataSource(ctx, this.display_data_height, this.display_position.x, this.border_position_bottom, this.data.source_2, this.data.value_2, DATA_ALIGN_CENTER);
			this.border_position_bottom += this.display_data_height * 1.5;
			drawSquareImage(ctx, images.getImage('arrow_down'), this.display_position.x, this.border_position_bottom, this.display_data_height);
			this.border_position_bottom += this.display_data_height * 1.5;
			drawDataSource(ctx, this.display_data_height, this.display_position.x, this.border_position_bottom, this.data.source_4, this.data.value_4, DATA_ALIGN_CENTER);

		break;
	};
};


