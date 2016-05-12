
//
// Digital Output Device
//

// Constructor for the Digital Output Device
function DeviceOutputDigital(data) 
{
	//console.log("DeviceOutputDigital");
	//console.log(data);

	Device.call(this, data);

	//console.log("DeviceOutputDigital");
	//console.log(data);
	// Create a new data field with the elements from this device type
	//this.config.pin = data.config.pin;
	//this.config.initial_state = data.config.initial_state;

	// Categorize this device
	this.type = 'device_output_digital';
	this.device_io_class = DEVICE_CLASS_OUTPUT;

	// Initialize the node (depending on the categorization)
	Device.prototype.init.call(this);

	return this;
}

// Inherit from the Device class
DeviceOutputDigital.inheritsFrom(Device);

// All the prototype definitions MUST be added after this point



// Get a string with the configuration of the Device
DeviceOutputDigital.prototype.toStringConfiguration = function()
{
	return "Pin:"+this.config.pin;
};


// Get a string with an HTML block to configure this device type
DeviceOutputDigital.prototype.listProperties = function()
{
	//console.log('*****************************');
	//console.log(this);
	html = "<table>"+
		"<tr>"+
			"<td>"+lang['pin']+"</td>"+
			"<td>"+createHtmlSelectorPins('select_output_pin_number_'+this.number, _hardware_manager.PINS_DIGITAL_OUTPUT, this.config.pin)+"</td>"+
		"</tr>"+
		"<tr>"+
			"<td>"+lang['initial_state']+"</td>"+
			"<td>"+createHtmlSelectorHighLow('select_output_initial_state_'+this.number, this.config.initial_state)+"</td>"+
		'</tr>'+
	'</table>';
	return html;
};


// Add listeners to react the the changes in the device configuration
DeviceOutputDigital.prototype.addListPropertiesListeners = function()
{
	// @todo validate pins here
};


// Updates an existing device with data read from the UI
// Parameter "n" indicates the number reference of the html elements to be read
DeviceOutputDigital.prototype.updateDevice = function(n)
{
	console.log("updateDevice: DeviceOutputDigital:" + n);
	console.log('##################');
	console.log(this.config);

	this.config = 
		{
			pin:parseInt($('#select_output_pin_number_'+n).val(), 10),
			initial_state:parseInt($('#select_output_initial_state_'+n).val(), 10)
		};
	console.log(this.config);
};


// Create a new default device of this device type
DeviceOutputDigital.prototype.createDefaultDevice = function()
{
	var data = {
		id:	_device_manager.nextDeviceID(),
		name: lang['new_device'],
		config: { pin:3, initial_state:0 } // @todo change this to a dynamic pin
	}

	return new DeviceOutputDigital( data );
};


// Return a string with hex encoded data representing this device
DeviceOutputDigital.prototype.exportToArduino = function()
{
	return Device.prototype.exportToArduino.call(this) +
			padByte(DEVICE_OUTPUT_DIGITAL_PIN) +
			padByte(this.config.pin) + padByte(this.config.initial_state)+';';
};


