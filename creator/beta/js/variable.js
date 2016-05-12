// All variable implementations are either inputs or outputs
var VARIABLE_TYPE_BOOL = 0;
var VARIABLE_TYPE_BYTE = 1;
var VARIABLE_TYPE_INT = 2;
var VARIABLE_TYPE_LONG = 3;

// Constructor for the abstract Variable class
function Variable(id, name) 
{
	this.id = id;
	this.name = name;
	//console.log(this);

	// Let's assume the variable is not visible
	this.visible = false;

	// Number for the variable (it's position in the list of devices)
	this.number = -1;

	// Create an empty data field (which will be filled with specicic variable data by the child classes)
	this.data = {};

	return this;
}


// Returns an exact copy of this variable
Variable.prototype.clone = function()
{
	var clone_variable = new this.constructor(this.id, this.name, this.data)
	clone_variable.number = this.number;
	return clone_variable;
};


// Initialize the variable based on specific data
Variable.prototype.init = function()
{
};


// Returns a new variable of the same type as this variable, initialized with default settings
Variable.prototype.createDefaultVariable  = function()
{
	return new this.constructor( _variable_manager.nextVariableID(), lang[this.type], this.DEFAULT_VARIABLE_DATA);
};


// Create a new variable of the same type as this variable, initialized with values read from an existing object
Variable.prototype.createCustomVariable = function(data, id)
{
	// If we pass a specific id, it will override the id in the data object 
	var new_id = id? id: data.id;
	//console.log("createCustomVariable");
	var new_variable = new this.constructor( new_id, data.name, data.data );
	//console.log(new_variable);

	return new_variable;
};


// Set the number for this variable (its position in the variable list)
Variable.prototype.setNumber = function(number)
{
	this.number = number;
};


// Get the number for this variable
Variable.prototype.getNumber = function(number)
{
	return this.number;
};


// Get a string with the name of the Variable
Variable.prototype.toString = function()
{
	return this.name;
};


// Get a string with the name of the Variable type
Variable.prototype.toStringType = function() 
{
	return lang[this.type];
};


// Get a string with the configuration of the Variable
Variable.prototype.toStringConfiguration = function()
{
	return this.data.initial_value;
};


// Updates an existing variable with data read from the UI
// Parameter "n" indicates the number reference of the html elements to be read
Variable.prototype.updateVariable = function(n)
{
	console.log("updateVariable");

	this.data =
		{
			initial_value: parseInt($('#text_variable_initial_value_'+n).val(), 10),
		};
};


// Return an object with all the data of this variable (to be saved in a file)
Variable.prototype.exportJson = function()
{
	//console.log("Exporting Variable!"); console.log(this);
	return	{
		id: this.id,
		name: this.name,
		type: this.type,
		data: this.data
	};
};


// Return a string with 'D' plus the number of the variable in HEX format
// This method will be called by the child classes when sending data to the Arduino
Variable.prototype.exportToArduino = function()
{
	return "V"+ padByte(this.number);
};
