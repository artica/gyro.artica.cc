
//
// Test Node
//
//

function NodeTest(id, name, data) 
{
	// Categorize this node type
	this.type = 'node_test';
	this.unique = false;
	this.min_children = 0;
	this.max_children = 0;

	// Call the generic constructor to initialize default node data
	Node.call(this, id, name, data);
	return this;
}

// Inherit from the Node class
NodeTest.inheritsFrom(Node);

// All the prototype definitions MUST be added after this point


//// Codes for the different test types
var TEST_TYPE_EQUAL	=		0x00;
var TEST_TYPE_DIFFERENT	=	0x01;
var TEST_TYPE_BIGGER	=	0x02;
var TEST_TYPE_SMALLER	=	0x03;
var TEST_TYPE_INSIDE	=	0x04;
var TEST_TYPE_OUTSIDE	=	0x05;
var TEST_TYPE_INCREASE	=	0x06;
var TEST_TYPE_DECREASE	=	0x07;
var TEST_TYPE_CHANGE	=	0x08;


// Different completion policies for the parallel nodes
NodeTest.prototype.tests = [
	{value:TEST_TYPE_EQUAL, 	name:'test_equal', first_element:1, second_element:2},
	{value:TEST_TYPE_DIFFERENT, name:'test_different', first_element:1, second_element:2},
	{value:TEST_TYPE_BIGGER, 	name:'test_bigger', first_element:1, second_element:2},
	{value:TEST_TYPE_SMALLER, 	name:'test_smaller', first_element:1, second_element:2},
	{value:TEST_TYPE_INSIDE, 	name:'test_inside_range', first_element:1},
	{value:TEST_TYPE_OUTSIDE, 	name:'test_outside_range', first_element:1},
	{value:TEST_TYPE_INCREASE, 	name:'test_increase_value', first_element:1},
	{value:TEST_TYPE_DECREASE, 	name:'test_decrease_value', first_element:1},
	{value:TEST_TYPE_CHANGE, 	name:'test_change_value', first_element:1} 
	];


var TEST_OVERRIDE_ONCE = 0;
var TEST_OVERRIDE_UNTILL = 1;
var TEST_OVERRIDE_WHILE = 2;

// Different override options for the failure state
NodeTest.prototype.overrides = [  {value:TEST_OVERRIDE_ONCE, name:'test_override_once'},
								  {value:TEST_OVERRIDE_UNTILL, name:'test_override_untill'},
								  {value:TEST_OVERRIDE_WHILE, name:'test_override_while'}
								   ];


// Default data for a EQUAL test
NodeTest.prototype.DEFAULT_NODE_DATA_EQUAL  =
	{
		override: 0, 
		test: TEST_TYPE_EQUAL,
		// First value to compare
		source_1: 0,
		value_1: 0,

		// Second value to compare
		source_2: 0,
		value_2: 0,
	};

// Default data for a DIFFERENT test
NodeTest.prototype.DEFAULT_NODE_DATA_DIFFERENT  =
	{
		override: 0, 
		test: TEST_TYPE_DIFFERENT,
		// First value to compare
		source_1: 0,
		value_1: 0,

		// Second value to compare
		source_2: 0,
		value_2: 0,
	};

// Default data for a BIGGER test
NodeTest.prototype.DEFAULT_NODE_DATA_BIGGER  =
	{
		override: 0, 
		test: TEST_TYPE_BIGGER,
		// First value to compare
		source_1: 0,
		value_1: 0,

		// Second value to compare
		source_2: 0,
		value_2: 0,
	};

// Default data for a SMALLER test
NodeTest.prototype.DEFAULT_NODE_DATA_SMALLER  =
	{
		override: 0, 
		test: TEST_TYPE_SMALLER,
		// First value to compare
		source_1: 0,
		value_1: 0,

		// Second value to compare
		source_2: 0,
		value_2: 0,
	};

// Default data for a INSIDE test
NodeTest.prototype.DEFAULT_NODE_DATA_INSIDE  =
	{
		override: 0, 
		test: TEST_TYPE_INSIDE,
		// First value to compare
		source_1: 0,
		value_1: 0,

		// Smaller value of the range
		source_2: 0,
		value_2: 0,

		// Bigger value of the range
		source_3: 0,
		value_3: 0,
	};

// Default data for a OUTSIDE test
NodeTest.prototype.DEFAULT_NODE_DATA_OUTSIDE  =
	{
		override: 0, 
		test: TEST_TYPE_OUTSIDE,
		// First value to compare
		source_1: 0,
		value_1: 0,

		// Smaller value of the range
		source_2: 0,
		value_2: 0,

		// Bigger value of the range
		source_3: 0,
		value_3: 0,
	};

// Default data for a INCREASE test
NodeTest.prototype.DEFAULT_NODE_DATA_INCREASE  =
	{
		override: 1, 
		test: TEST_TYPE_INCREASE,
		// Value to test
		source_1: 0,
		value_1: 0,

		// Threshhold for the increase
		source_2: 0,
		value_2: 1
	};

// Default data for a DECREASE test
NodeTest.prototype.DEFAULT_NODE_DATA_DECREASE  =
	{
		override: 1, 
		test: TEST_TYPE_DECREASE,
		// Value to test
		source_1: 0,
		value_1: 0,

		// Threshhold for the decrease
		source_2: 0,
		value_2: 1
	};

// Default data for a CHANGE test
NodeTest.prototype.DEFAULT_NODE_DATA_CHANGE  =
	{
		override: 1, 
		test: TEST_TYPE_CHANGE,
		// Value to test
		source_1: 0,
		value_1: 0,

		// Threshhold for the change
		source_2: 0,
		value_2: 1
	};


// Default data to create new nodes of this type
NodeTest.prototype.DEFAULT_NODE_DATA  = NodeTest.prototype.DEFAULT_NODE_DATA_EQUAL;


// Custom initialization settings for this node
NodeTest.prototype.init = function()
{
	this.setTestImage();
};


// Set the image for the node depending on the selected test type
NodeTest.prototype.setTestImage = function()
{
	//console.log(this.data.function_type);
	if (typeof this.data.test !== 'undefined') this.setImage( 'node_'+this.tests[this.data.test].name );
};


// Get a string with an HTML block to configure this node type
NodeTest.prototype.listProperties = function(data) 
{

	console.log("NodeTest.prototype.listProperties:");
	console.log(data);

	var output = "<table>"+

//function createHtmlSelectorTranslated(id, class_id, options, current)

		"<tr>"+
			//"<td>"+lang['test_fail']+"</td>"
			"<td>"+createHtmlSelectorTranslated('select_override', 'select_override', this.overrides, data.override)+"</td>"+
		"</tr>"+

		// Create a selector to choose which test to use
		"<tr><td colspan='2'>"+lang['test']+"</td></tr>"+
		"<tr><td colspan='2'>"+createHtmlSelectorTranslated('test_type', null, this.tests, data.test)+"</td></tr>"+
		"</table>"+
		"<hr>"+

		"<table><tr>";

	switch (data.test)
	{
		case TEST_TYPE_EQUAL: 
			output += "<td>"+ createHtmlSelectorsDataSource('data_1', data.source_1, data.value_1)+"</td>"+
					"<td><span class='test_symbol'> == </span></td>"+
					"<td>"+ createHtmlSelectorsDataSource('data_2', data.source_2, data.value_2)+"</td>";
		break;
		case TEST_TYPE_DIFFERENT: 
			output += "<td>"+ createHtmlSelectorsDataSource('data_1', data.source_1, data.value_1)+"</td>"+
					"<td><span class='test_symbol'> != </span></td>"+
					"<td>"+ createHtmlSelectorsDataSource('data_2', data.source_2, data.value_2)+"</td>";
		break;
		case TEST_TYPE_BIGGER: 
			output += "<td>"+ createHtmlSelectorsDataSource('data_1', data.source_1, data.value_1)+"</td>"+
					"<td><span class='test_symbol'> > </span></td>"+
					"<td>"+ createHtmlSelectorsDataSource('data_2', data.source_2, data.value_2)+"</td>";
		break;
		case TEST_TYPE_SMALLER: 
			output += "<td>"+ createHtmlSelectorsDataSource('data_1', data.source_1, data.value_1)+"</td>"+
					"<td><span class='test_symbol'> < </span></td>"+
					"<td>"+ createHtmlSelectorsDataSource('data_2', data.source_2, data.value_2)+"</td>";
		break;
		case TEST_TYPE_INSIDE: 
			output += "<td></td><td>"+lang['minimum']+"</td><td>"+lang['Value']+"</td><td>"+lang['maximum']+"</td><td></td></tr><tr>"+ 
					"<td><span class='test_symbol'> [ </span></td>"+
					"<td>"+ createHtmlSelectorsDataSource('data_2', data.source_2, data.value_2)+"</td>"+
					"<td>"+ createHtmlSelectorsDataSource('data_1', data.source_1, data.value_1)+"</td>"+
					"<td>"+ createHtmlSelectorsDataSource('data_3', data.source_3, data.value_3)+"</td>"+
					"<td><span class='test_symbol'> ] </span></td>";
		break;
		case TEST_TYPE_OUTSIDE: 
			output += "<td>"+lang['Value']+"</td><td></td><td>"+lang['minimum']+"</td><td>"+lang['maximum']+"</td><td></td></tr><tr>"+ 
					"<td>"+ createHtmlSelectorsDataSource('data_1', data.source_1, data.value_1)+"</td>"+
					"<td><span class='test_symbol'> [ </span></td>"+
					"<td>"+ createHtmlSelectorsDataSource('data_2', data.source_2, data.value_2)+"</td>"+
					"<td>"+ createHtmlSelectorsDataSource('data_3', data.source_3, data.value_3)+"</td>"+
					"<td><span class='test_symbol'> ] </span></td>";
		break;
		case TEST_TYPE_INCREASE:
			output += "<td>"+lang['Value']+"</td><td>"+lang['Threshold']+"</td></tr>"+
					"<tr>"+ 
					"<td>"+ createHtmlSelectorsDataSource('data_1', data.source_1, data.value_1)+"</td>"+
					"<td>"+ createHtmlSelectorsDataSource('data_2', data.source_2, data.value_2)+"</td>";
		break;
		case TEST_TYPE_DECREASE:
			output += "<td>"+lang['Value']+"</td><td>"+lang['Threshold']+"</td></tr>"+
					"<tr>"+ 
					"<td>"+ createHtmlSelectorsDataSource('data_1', data.source_1, data.value_1)+"</td>"+
					"<td>"+ createHtmlSelectorsDataSource('data_2', data.source_2, data.value_2)+"</td>";
		break;
		case TEST_TYPE_CHANGE:
			output += "<td>"+lang['Value']+"</td><td>"+lang['Threshold']+"</td></tr>"+
					"<tr>"+ 
					"<td>"+ createHtmlSelectorsDataSource('data_1', data.source_1, data.value_1)+"</td>"+
					"<td>"+ createHtmlSelectorsDataSource('data_2', data.source_2, data.value_2)+"</td>";
		break;
	}

	output += "</tr></table>";

	console.log(data.test);

	return output;
};


// Add the listeners for changes in the configuration
NodeTest.prototype.addListPropertiesListeners = function(data) 
{
	var node = this;

	// Selectors to change the different override properties
	$('.select_override').on('change', function() { NodeTest.prototype.validateNodeProperties(node.data); });

	// Selector to change the type of the new device to be created
	$('#test_type').on('change', function() 
		{
			// First we get the input and output data for each specific funcion
			var old_first_element = null;
			var old_second_element = null; 
			var old_failure_override = null; 

			// Get the test data configuration for the old test type
			var test_data = node.tests[node.data.test];
			// The the test has any input/outpus configuration, extract them
			if ( test_data.first_element ) old_first_element = getDataSource(node.data, test_data.first_element);
			if ( test_data.second_element ) old_second_element = getDataSource(node.data, test_data.second_element);

			if ( node.data.override ) old_failure_override = node.data.override;

			// Check the new node test type and adjust update the variable and the image accordingly			
			node.data.test = parseInt($('#test_type').val(), 10);
			node.setTestImage();

			switch (node.data.test)
			{
				case TEST_TYPE_EQUAL:
					node.data = $.extend(false, {}, NodeTest.prototype.DEFAULT_NODE_DATA_EQUAL);
				break;
				case TEST_TYPE_DIFFERENT:
					node.data = $.extend(false, {}, NodeTest.prototype.DEFAULT_NODE_DATA_DIFFERENT);
				break;
				case TEST_TYPE_BIGGER:
					node.data = $.extend(false, {}, NodeTest.prototype.DEFAULT_NODE_DATA_BIGGER);
				break;
				case TEST_TYPE_SMALLER:
					node.data = $.extend(false, {}, NodeTest.prototype.DEFAULT_NODE_DATA_SMALLER);
				break;
				case TEST_TYPE_INSIDE:
					node.data = $.extend(false, {}, NodeTest.prototype.DEFAULT_NODE_DATA_INSIDE);
				break;
				case TEST_TYPE_OUTSIDE:
					node.data = $.extend(false, {}, NodeTest.prototype.DEFAULT_NODE_DATA_OUTSIDE);
				break;
				case TEST_TYPE_INCREASE:
					node.data = $.extend(false, {}, NodeTest.prototype.DEFAULT_NODE_DATA_INCREASE);
				break;
				case TEST_TYPE_DECREASE:
					node.data = $.extend(false, {}, NodeTest.prototype.DEFAULT_NODE_DATA_DECREASE);
				break;
				case TEST_TYPE_CHANGE:
					node.data = $.extend(false, {}, NodeTest.prototype.DEFAULT_NODE_DATA_CHANGE);
				break;
			}

			// Get the test data configuration for the new test type
			test_data = node.tests[node.data.test];

			// The the test has any input/outpus configuration, set them equal to the ones
			// from the previous test type, assunimg that test type has the same valid parameters
			if ( test_data.first_element ) setDataSource(node.data, test_data.first_element, old_first_element);
			if ( test_data.second_element ) setDataSource(node.data, test_data.second_element, old_second_element);

			if ( old_failure_override ) node.data.override = old_failure_override;


			_ui.displayNodeProperties();
		});

	Node.prototype.addListPropertiesListeners(data);
};


// Validate if all the node properties are valid
NodeTest.prototype.validateNodeProperties = function(data) 
{
	data.override = parseInt($('#select_override').val(), 10);
	_ui.draw();
}


// Return a string with hex encoded data representing this node
NodeTest.prototype.exportNodeToArduino = function() 
{
	console.log('##### export_test:'+this);
	console.log(this);

	
	// Now we set the override policies depending on the overside selection for the test
	var failure_override = 0;
	var running_override = 1;
	var success_override = 2;

	switch (this.data.override)
	{
		// Nothing to do in this case, this just uses the default values
		case TEST_OVERRIDE_ONCE:
		break;

		// Here we want to override FAILURE to RUN
		case TEST_OVERRIDE_UNTILL:
			failure_override = OVERRIDE_STATE_RUNNING;
		break;

		// And here we want to overide a success to run
		case TEST_OVERRIDE_WHILE:
			success_override = OVERRIDE_STATE_RUNNING;
		break;
	}

	// Create a byte mask with all the policies
	var policy = 
		(failure_override << NODE_OVERRIDE_POLICY_FAILURE_OFFSET) |
		(running_override << NODE_OVERRIDE_POLICY_RUNNING_OFFSET) |
		(success_override << NODE_OVERRIDE_POLICY_SUCCESS_OFFSET);

	console.log("--------------------------------");
	console.log(policy.toString(2));


	var data = Node.prototype.exportNodeToArduino.call(this) +
		padByte(NODE_SERVICE) +	padByte(SERVICE_TEST);

	// Start strating a string with data for the specific function
	var test_data = padByte(policy) + padByte(this.data.test);

	switch(this.data.test)
	{
		case TEST_TYPE_EQUAL:
		case TEST_TYPE_DIFFERENT:
		case TEST_TYPE_BIGGER:
		case TEST_TYPE_SMALLER:
			test_data += packSourceDataHex(this.data, 1);
			test_data += packSourceDataHex(this.data, 2);
		break;
		case TEST_TYPE_INSIDE:
		case TEST_TYPE_OUTSIDE:
			test_data += packSourceDataHex(this.data, 1);
			test_data += packSourceDataHex(this.data, 2);
			test_data += packSourceDataHex(this.data, 3);
		break;
		case TEST_TYPE_INCREASE:
		case TEST_TYPE_DECREASE:
		case TEST_TYPE_CHANGE:
			test_data += packSourceDataHex(this.data, 1);
			test_data += packSourceDataHex(this.data, 2);
		break;
	};
	// Add a byte containing the length of the data for the function
	// (in bytes, so it's half the size of the hex data string)
	data += padByte(test_data.length/2);
	data += test_data;

	console.log("test_data:"+test_data+"    length:"+ (test_data.length/2) );

	data += ";"
	return data;
};


// Draw this node custom data over the default node data
NodeTest.prototype.drawData = function(ctx) 
{
	// Choose a string to represent the desired test
	var test_str;
	switch(this.data.test)
	{
		case TEST_TYPE_EQUAL: test_str = "=="; break;
		case TEST_TYPE_DIFFERENT: test_str = "!="; break; 
		case TEST_TYPE_BIGGER: test_str = ">"; break;
		case TEST_TYPE_SMALLER: test_str = "<"; break;

		case TEST_TYPE_INSIDE: test_str = "IN"; break;
		case TEST_TYPE_OUTSIDE: test_str = "OUT"; break;

		case TEST_TYPE_INCREASE: test_str = "INC"; break;
		case TEST_TYPE_DECREASE: test_str = "DEC"; break;
		case TEST_TYPE_CHANGE: test_str = "CHG"; break;
	};	

	// Draw the test string and get the get its width
	var test_width = drawTextBox( ctx, test_str, 14, DATA_ALIGN_CENTER, this.display_position.x, this.border_position_bottom);


	// Draw both data sources on both sides of the test string
	drawDataSource(ctx, this.display_data_height, this.display_position.x-this.display_data_height*NODE_DATA_MARGIN-test_width/2, this.border_position_bottom, this.data.source_1, this.data.value_1, DATA_ALIGN_LEFT);
	drawDataSource(ctx, this.display_data_height, this.display_position.x+this.display_data_height*NODE_DATA_MARGIN+test_width/2, this.border_position_bottom, this.data.source_2, this.data.value_2, DATA_ALIGN_RIGHT);

};

