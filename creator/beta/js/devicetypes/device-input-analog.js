
//
// Digital Input Device
//

// Constructor for the Digital Input Device
function DeviceInputAnalog(data)
{
	Device.call(this, data);
	// Create a new data field with the elements from this device type
	//this.config.pin = data.config.pin;

	// Categorize this device
	this.type = 'device_input_analog';
	this.device_io_class = DEVICE_CLASS_INPUT;

	// Initialize the node (depending on the categorization)
	Device.prototype.init.call(this);

	return this;
}

// Inherit from the Device class
DeviceInputAnalog.inheritsFrom(Device);

// All the prototype definitions MUST be added after this point



// Get a string with the configuration of the Device
DeviceInputAnalog.prototype.toStringConfiguration = function()
{
	return "Pin:"+this.config.pin;
};


// Get a string with an html block to configure this device type
DeviceInputAnalog.prototype.listProperties = function()
{
	html = "<table>"+
		"<tr>"+
			"<td>"+lang['pin']+"</td>"+
			"<td>"+createHtmlSelectorPins('select_input_pin_number_'+this.number, _hardware_manager.PINS_ANALOG_INPUT, this.config.pin)+"</td>"+
		"</tr>"+
	'</table>';
	return html;
};


// Add listeners to react the the changes in the device configuration
DeviceInputAnalog.prototype.addListPropertiesListeners = function()
{
	// @todo validate pins here
	console.log("-----------------------Badabim!!!------------------------");
};


// Updates an existing device with data read from the UI
// Parameter "n" indicates the number reference of the html elements to be read
DeviceInputAnalog.prototype.updateDevice = function(n)
{
	console.log("updateDevice: DeviceInputAnalog");

	this.config =
		{
			pin:parseInt($('#select_input_pin_number_'+n).val(), 10)
		};
};


// Create a new default device of this device type
DeviceInputAnalog.prototype.createDefaultDevice = function()
{
	var data = {
		id:	_device_manager.nextDeviceID(),
		name: lang['new_device'],
		config: { pin:3 } // @todo change this to a dynamic pin
		}

	return new DeviceInputAnalog( data );
};


// Return a string with hex encoded data representing this device
DeviceInputAnalog.prototype.exportToArduino = function()
{
	return Device.prototype.exportToArduino.call(this) +
			padByte(DEVICE_INPUT_ANALOG_PIN) +
			padByte(this.config.pin) + ';';
};

