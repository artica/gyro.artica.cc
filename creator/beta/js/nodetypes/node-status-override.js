
//
// Status Override Node
//

// These are the offsets for the bits of data representing the different policies when exporting
// to the Arduino. Only 2 bits are used for each policy, so the whole settings are saved in 1 byte

var NODE_OVERRIDE_POLICY_FAILURE_OFFSET = 0;
var NODE_OVERRIDE_POLICY_RUNNING_OFFSET = 2;
var NODE_OVERRIDE_POLICY_SUCCESS_OFFSET = 4;

var OVERRIDE_STATE_FAILURE = 0;
var OVERRIDE_STATE_RUNNING = 1;
var OVERRIDE_STATE_SUCCESS = 2;

function NodeStatusOverride(id, name, data) 
{
	// Categorize this node type
	this.type = 'node_status_override';
	this.unique = false;
	this.min_children = 1;
	this.max_children = 1;

	// Call the generic constructor to initialize default node data
	Node.call(this, id, name, data);
	return this;
}

// Inherit from the Node class
NodeStatusOverride.inheritsFrom(Node);

// All the prototype definitions MUST be added after this point

// Default data to create new nodes of this type
NodeStatusOverride.prototype.DEFAULT_NODE_DATA  = { failure_override: 0, running_override: 1, success_override: 2 };


// Different override options
NodeStatusOverride.prototype.overrides = [{value:OVERRIDE_STATE_FAILURE, name:'status_fail'},
									    {value:OVERRIDE_STATE_RUNNING, name:'status_run'},
									    {value:OVERRIDE_STATE_SUCCESS, name:'status_success'} ];


// Get a string with an HTML block to configure this node type
NodeStatusOverride.prototype.listProperties = function(data) 
{
	var output = '<table>' +

		// failure override
		"<tr><td>"+lang['override_fail']+"</td><td>"+
	   	createHtmlSelectorTranslated('select_failure_override', 'select_override', this.overrides, data.failure_override)+
	   	"</td></tr>"+

		// running override
		"<tr><td>"+lang['override_run']+"</td><td>"+
	   	createHtmlSelectorTranslated('select_running_override', 'select_override', this.overrides, data.running_override)+
	   	"</td></tr>"+

		// success override
		"<tr><td>"+lang['override_success']+"</td><td>"+
	   	createHtmlSelectorTranslated('select_success_override', 'select_override', this.overrides, data.success_override)+
	   	"</td></tr>"+

		"</td></tr></table>";
	
	return output;
};


// Save the properties of the current node based on data read from the configuration interface
NodeStatusOverride.prototype.addListPropertiesListeners = function(data) 
{
	var node_data = data;

	// Selectors to change the different override properties
	$('.select_override').on('change', function() { NodeStatusOverride.prototype.validateNodeProperties(node_data); });
};


// Validate if all the node properties are valid
NodeStatusOverride.prototype.validateNodeProperties = function(data) 
{
	data.failure_override = parseInt($('#select_failure_override').val(), 10);
	data.running_override = parseInt($('#select_running_override').val(), 10);
	data.success_override = parseInt($('#select_success_override').val(), 10);
	_ui.draw();
}

// Export the data for the node (so sent to the Arduino)
NodeStatusOverride.prototype.exportNodeToArduino = function() 
{
	//console.log('##### export_output:'+node);
	//console.log(node);

	//console.log('this.failure_override:'+this.failure_override);
	//console.log('this.running_override:'+this.running_override);
	//console.log('this.success_override:'+this.success_override);
	
	var policy = 
		(this.data.failure_override << NODE_OVERRIDE_POLICY_FAILURE_OFFSET) |
		(this.data.running_override << NODE_OVERRIDE_POLICY_RUNNING_OFFSET) |
		(this.data.success_override << NODE_OVERRIDE_POLICY_SUCCESS_OFFSET);

	console.log('policy:'+policy);
		
	return Node.prototype.exportNodeToArduino.call(this) +
		padByte(NODE_OVERRIDE) + padByte(policy)+';';
};


// Draw this node custom data over the default node data
NodeStatusOverride.prototype.drawData = function(ctx) 
{
	var radius = this.radius * _ui.zoom;

	// Colors for the different override status
	var status_colors = [NODE_STATE_FAILURE_COLOR, NODE_STATE_RUNNING_COLOR, NODE_STATE_SUCCESS_COLOR];


	for (var i=0; i<=2; i++)
	{
		var mycolor = NODE_DESCRIPTION_BACKGROUND_COLOR;
		if (i === this.data.failure_override) mycolor = status_colors[this.data.failure_override];
		drawBall( ctx,
				this.border_position_right+radius*0.55*(i+0.8),
				this.display_position.y-radius*0.55,
				radius*0.2,
				mycolor );
	}
	
	for (i=0; i<=2; i++) 
	{
		mycolor = NODE_DESCRIPTION_BACKGROUND_COLOR;
		if (i === this.data.running_override) mycolor = status_colors[this.data.running_override];
		drawBall( ctx,
				this.border_position_right+radius*0.55*(i+0.8),
				this.display_position.y,
				radius*0.2,
				mycolor );
	}
	
	for (i=0; i<=2; i++) 
	{
		mycolor = NODE_DESCRIPTION_BACKGROUND_COLOR;
		if (i === this.data.success_override) mycolor = status_colors[this.data.success_override];
		drawBall( ctx,
				this.border_position_right+radius*0.55*(i+0.8),
				this.display_position.y+radius*0.55,
				radius*0.2,
				mycolor );
	}

	//drawCross(ctx, this.display_position.x, this.border_position_bottom, 20, "#0000ff");
	//drawCross(ctx, this.border_position_right, this.display_position.y,	20, "#0000ff");
	//drawCross(ctx, this.border_position_left, this.display_position.y,	20, "#0000ff");

};
