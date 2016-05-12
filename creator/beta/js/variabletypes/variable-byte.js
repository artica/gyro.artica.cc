
//
// Variable byte
//

// Constructor for the Digital Input Variable
function VariableByte(id, name, data)
{
	Variable.call(this, id, name);
	// Create a new data field with the elements from this variable type
	this.data.initial_value = data.initial_value;

	// Categorize this variable
	this.type = 'variable_byte';

	// Initialize the node (depending on the categorization)
	Variable.prototype.init.call(this);

	return this;
}

// Inherit from the Variable class
VariableByte.inheritsFrom(Variable);

// All the prototype definitions MUST be added after this point



// Get a string with an html block to configure this variable type
VariableByte.prototype.listProperties = function()
{
	html = "<table>"+
		"<tr>"+
			"<td>"+lang['initial_value']+"</td>"+
			"<td><input type='number' id='text_variable_initial_value_"+this.number+"'' min='0' max='255' value='"+this.data.initial_value+"'></input></td>"+
		"</tr>"+
	'</table>';
	return html;
};


// Create a new default variable of this type
VariableByte.prototype.createDefaultVariable = function()
{
	return new VariableByte( _variable_manager.nextVariableID(), lang['new_variable'], 
		{
			initial_value:0
		}
	);
};


// Return a string with hex encoded data representing this variable
VariableByte.prototype.exportToArduino = function()
{
	return Variable.prototype.exportToArduino.call(this) +
			padByte(VARIABLE_TYPE_BYTE) +
			padByte(this.data.initial_value)+';';
};


