
//
// Digital Input Device
//

// Constructor for the Digital Input Device
function DeviceInputDigital(data)
{
	Device.call(this, data);

	//console.log("DeviceInputDigital");
	//console.log(data);
	
	// Create a new data field with the elements from this device type
	//this.config.pin = data.config.pin;
	//this.config.active_type = data.config.active_type;

	// Categorize this device
	this.type = 'device_input_digital';
	this.device_io_class = DEVICE_CLASS_INPUT;

	// Initialize the node (depending on the categorization)
	Device.prototype.init.call(this);

	return this;
}

// Inherit from the Device class
DeviceInputDigital.inheritsFrom(Device);

// All the prototype definitions MUST be added after this point



// Get a string with the configuration of the Device
DeviceInputDigital.prototype.toStringConfiguration = function()
{
	return "Pin:"+this.config.pin;
};


// Get a string with an html block to configure this device type
DeviceInputDigital.prototype.listProperties = function()
{
	html = "<table>"+
		"<tr>"+
			"<td>"+lang['pin']+"</td>"+
			"<td>"+createHtmlSelectorPins('select_input_pin_number_'+this.number, _hardware_manager.PINS_DIGITAL_INPUT, this.config.pin)+"</td>"+
		"</tr>"+
		"<tr>"+
			"<td>"+lang['active']+"</td>"+
			"<td>"+createHtmlSelectorHighLow('select_input_active_state_'+this.number, this.config.active_type)+"</td>"+
		'</tr>'+
	'</table>';
	return html;
};


// Add listeners to react the the changes in the device configuration
DeviceInputDigital.prototype.addListPropertiesListeners = function()
{
	// @todo validate pins here
	console.log("-----------------------Badabim!!!------------------------");
};


// Updates an existing device with data read from the UI
// Parameter "n" indicates the number reference of the html elements to be read
DeviceInputDigital.prototype.updateDevice = function(n)
{
	console.log("updateDevice: DeviceInputDigital");

	this.config = 
		{
			pin:parseInt($('#select_input_pin_number_'+n).val(), 10),
			active_type:parseInt($('#select_input_active_state_'+n).val(), 10)
		};
};


// Create a new default device of this device type
DeviceInputDigital.prototype.createDefaultDevice = function()
{
	var data = {
		id:	_device_manager.nextDeviceID(),
		name: lang['new_device'],
		config: { pin:3, active_type:0 } // @todo change this to a dynamic pin
		}

	return new DeviceInputDigital( data );
};


// Return a string with hex encoded data representing this device
DeviceInputDigital.prototype.exportToArduino = function()
{
	return Device.prototype.exportToArduino.call(this) +
			padByte(DEVICE_INPUT_DIGITAL_PIN) +
			padByte(this.config.pin) + padByte(this.config.active_type)+';';
};

