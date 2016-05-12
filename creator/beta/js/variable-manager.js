// Base device type identifiers (for arduino)
var VARIABLE_TYPE_BOOL = 0x00;
var VARIABLE_TYPE_BYTE = 0x01;
var VARIABLE_TYPE_INT =	 0x02;
var VARIABLE_TYPE_LONG = 0x03;


var DATA_SOURCE_TYPE_CONSTANT = 0x00;
var DATA_SOURCE_TYPE_VARIABLE = 0x01;
var DATA_SOURCE_TYPE_DEVICE	= 	0x02;

function VariableManager()
{
	// Existing devices in the system
	this.variables = [];

	// Currently selected variable
	//this.device_selected = -1;

	// Current new variable type to create
	this.new_variable_type = 0;

	// Next unique ID the generator function will return
	this.next_variable_uid = 0;
}


// Initialize the variables that cannot be initialized in the constructor
VariableManager.prototype.init = function()
{
	// Possible device types for the system
	this.variable_types =
	[
		VariableBool.prototype.createDefaultVariable(),
		VariableByte.prototype.createDefaultVariable(),
		VariableInt.prototype.createDefaultVariable(),
		VariableLong.prototype.createDefaultVariable()
	];
};


// Initialize the variables that cannot be initialized in the constructor
VariableManager.prototype.setVariables = function(new_variable_list)
{
	this.variables = new_variable_list;
}


// Return a string with a unique node ID
VariableManager.prototype.nextVariableID = function()
{
    var new_uid = createId();		// @todo make sure this is unique
    return new_uid;
};


VariableManager.prototype.unselectDevice = function(index) 
{
	this.device_selected = -1;
}


// Create a variable of a specific type based on device data
VariableManager.prototype.createVariable = function(data)
{
	for ( var d=0; d<this.variable_types.length; d++)
	{
		//console.log(data);
		//console.log("testing:"+data.type+" === "+this.variable_types[d].type);
		if (data.type === this.variable_types[d].type) 
		{
			return this.variable_types[d].createCustomVariable(data);
		}
	}
	return null;
};


// Adds a new variable to the variable list based on the variable data
VariableManager.prototype.addVariable = function(data)
{
	// Add a variable created based on the variable data
	var new_variable = this.createVariable(data);
	this.variables.push( new_variable );
	return new_variable;
};


// Set the order numbers for all the variables
VariableManager.prototype.reorderVariables = function()
{
	//console.log("------------------------------------->reorderVariables");
	//console.log(this.variables);
	var initial = _device_manager.devices.length;

	for ( var v=0; v<this.variables.length; v++)
	{
		this.variables[v].setNumber(initial+v);
	}
};


// Returns the number of a variable from its ID value
VariableManager.prototype.getVariableNumberById = function(id)
{
	for (var i=0; i<this.variables.length; i++)
	{
		if (this.variables[i].id === id ) return this.variables[i].getNumber();
	}
	return -1;
};


// Returns the name of a variable from its ID value
VariableManager.prototype.getVariableNameById = function(id)
{
	for (var i=0; i<this.variables.length; i++)
	{
		if (this.variables[i].id === id ) return this.variables[i].name;
	}
	return -1;
};


/*
// Return the HTML for a selector of a certain variable class
VariableManager.prototype.getVariableSelector = function(type, variable)
{
	var output = '<select id="select_variable">';
	for (var i=0; i < this.variables.length; i++) 
	{
		// If a "type" was specified, only show variables of that type
		if (!type || this.variables[i].variable_class === type)
		{
			// Mark the variable in use by the node as selected
			var selected = '';
			if (variable === this.variables[i]) selected = 'selected="true"';
			output += '<option value="'+i+'" '+selected+'>' + this.variables[i].name + '</option>';				
		}
	}
	output += '</select>';
	return output;
};
*/


// Return the HTML for a selector of a certain variable class
VariableManager.prototype.getVariableSelector = function(selector_id, variable_type, selected_id, class_type)
{
	var output = "<select id='"+selector_id+"'";

	if (class_type) output += " class='"+class_type+"'";
	output += ">";

	for (var i=0; i < this.variables.length; i++) 
	{
		// If a "variable_type" was specified, only show variables of that type
		if (!variable_type || this.variables[i].variable_class === variable_type)
		{
			// Mark the variable in use by the node as selected
			var selected = '';
			if (selected_id === this.variables[i].id) selected = 'selected="true"';
			output += '<option id="select_variable" value="'+this.variables[i].id+
				'" '+selected+'>' + this.variables[i].name + '</option>';				
		}
	}
	output += '</select>';

	console.log(this.variables);

	return output;
};



// Get the default variable of a specific class
VariableManager.prototype.getDefaultVariableID = function(type)
{
	for (var i=0; i < this.variables.length; i++) 
	{
		if (this.variables[i].device_io_class === type)
		{
			return this.variables[i].id;
		}
	}
	return -1;
};


// Resets the variable maganer, deleting all the variables
VariableManager.prototype.resetVariables = function() 
{
	this.variables = [];
};


// Export the current variables on the system to a single variable
VariableManager.prototype.exportVariablesObject = function() 
{
	var output = [];
	for (var i=0; i<this.variables.length; i++) 
	{
		output.push( this.variables[i].exportJson() );
	}
	return output;
};


// Clones a list of variables from a source list
VariableManager.prototype.cloneVariables = function(variable_list)
{
	var new_devices = [];
	// Go through the variable list, cloning each variable
	for (var v=0; v<variable_list.length; v++)
	{
		new_devices.push(variable_list[v].clone());
	}
	return new_devices;
}


