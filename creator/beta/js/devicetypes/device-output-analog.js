
//
// Analog Output Device
//

// Constructor for the Analog Output Device
function DeviceOutputAnalog(data) 
{
	Device.call(this, data);

	// Create a new data field with the elements from this device type
	//this.config.pin = data.config.pin;
	//this.config.initial_value = data.config.initial_value;

	// Categorize this device
	this.type = 'device_output_analog';
	this.device_io_class = DEVICE_CLASS_OUTPUT;

	// Initialize the node (depending on the categorization)
	Device.prototype.init.call(this);

	return this;
}

// Inherit from the Device class
DeviceOutputAnalog.inheritsFrom(Device);

// All the prototype definitions MUST be added after this point



// Get a string with the configuration of the Device
DeviceOutputAnalog.prototype.toStringConfiguration = function()
{
	return "Pin:"+this.config.pin;
};


// Get a string with an HTML block to configure this device type
DeviceOutputAnalog.prototype.listProperties = function()
{
	html = "<table>"+
		"<tr>"+
			"<td>"+lang['pin']+"</td>"+
			"<td>"+createHtmlSelectorPins('select_output_pin_number_'+this.number, _hardware_manager.PINS_ANALOG_OUTPUT, this.config.pin)+"</td>"+
		"</tr>"+
		"<tr>"+
			"<td>"+lang['initial_state']+"</td>"+
			"<td><input type='number' id='select_output_initial_value_"+this.number+
				"' value='"+this.config.initial_value+"' min='0' max='255'></input></td>"+
		'</tr>'+
	'</table>';
	return html;
};


// Add listeners to react the the changes in the device configuration
DeviceOutputAnalog.prototype.addListPropertiesListeners = function()
{
	// @todo validate pins here
};


// Updates an existing device with data read from the UI
// Parameter "n" indicates the number reference of the html elements to be read
DeviceOutputAnalog.prototype.updateDevice = function(n)
{
	console.log("updateDevice: DeviceOutputAnalog:" + n);
	console.log('##################');
	console.log(this.config);
	console.log( $('#select_output_initial_value_'+n).val() );

	this.config = 
		{
			pin:parseInt($('#select_output_pin_number_'+n).val(), 10),
			initial_value:parseInt($('#select_output_initial_value_'+n).val(), 10)
		};
	console.log(this.config);
};


// Create a new default device of this device type
DeviceOutputAnalog.prototype.createDefaultDevice = function()
{
	var data = {
		id:	_device_manager.nextDeviceID(),
		name: lang['new_device'],
		config: { pin:3, initial_value:0 } // @todo change this to a dynamic pin
	}

	return new DeviceOutputAnalog( data );
};


// Return a string with hex encoded data representing this device
DeviceOutputAnalog.prototype.exportToArduino = function()
{
	return Device.prototype.exportToArduino.call(this) +
			padByte(DEVICE_OUTPUT_ANALOG_PIN) +
			padByte(this.config.pin) + padByte(this.config.initial_value)+';';
};

