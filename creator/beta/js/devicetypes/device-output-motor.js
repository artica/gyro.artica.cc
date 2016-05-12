
//
// Differential Motor Device
//

function DeviceOutputMotor(data) 
{
	Device.call(this, data);
	// Create a new data field with the elements from this device type
	//this.config.pin_1 = data.config.pin_1;
	//this.config.pin_2 = data.config.pin_2;
	//this.config.initial_speed = data.config.initial_speed;

	// Categorize this device
	this.type = 'device_motor';
	this.device_io_class = DEVICE_CLASS_OUTPUT;
	
	// Initialize the node (depending on the categorization)
	Device.prototype.init.call(this);

	return this;
}

// Inherit from the Device class
DeviceOutputMotor.inheritsFrom(Device);

// All the prototype definitions MUST be added after this point


// Get a string with the configuration of the Device
DeviceOutputMotor.prototype.toStringConfiguration = function()
{
	return "Pins:"+this.config.pin_1 + ','+this.config.pin_2;
};


// Get a string with an html block to configure this device type
DeviceOutputMotor.prototype.listProperties = function()
{
	return 	"<table>"+
		"<tr>"+
			"<td>"+lang['pin']+" 1</td>"+
			"<td>"+createHtmlSelectorPins('select_motor_pin_1_'+this.number, _hardware_manager.PINS_DIGITAL_OUTPUT, this.config.pin_1)+"</td>"+
		"</tr>"+
		"<tr>"+
			"<td>"+lang['pin']+" 2</td>"+
			"<td>"+createHtmlSelectorPins('select_motor_pin_2_'+this.number, _hardware_manager.PINS_DIGITAL_OUTPUT, this.config.pin_2)+"</td>"+
		"</tr>"+

		"<tr>"+
			"<td>"+lang['initial_speed']+"</td>"+
			"<td><input type='number' id='text_initial_speed_"+this.number+"' min='-255' max='255' value="+this.config.initial_speed+"></input></td>"+
		"</tr>"+

		"</table>";
};


// Add listeners to react the the changes in the device configuration
DeviceOutputMotor.prototype.addListPropertiesListeners = function()
{
	// @todo validate pins here
};


// Updates an existing device with data read from the UI
// Parameter "n" indicates the number reference of the html elements to be read
DeviceOutputMotor.prototype.updateDevice = function(n)
{
	console.log("updateDevice: DeviceOutputMotor");

	this.config = 
		{
			pin_1:parseInt($('#select_motor_pin_1_'+n).val(), 10),
			pin_2:parseInt($('#select_motor_pin_2_'+n).val(), 10),
			initial_speed:parseInt($('#text_initial_speed_'+n).val(), 10),
		};
};


// Create a new default device of this device type
DeviceOutputMotor.prototype.createDefaultDevice = function()
{
	var data = {
		id:	_device_manager.nextDeviceID(),
		name: lang['new_device'],
		config: { pin_1:3, pin_2:5, initial_speed:0 } // @todo change this to a dynamic pin
	}

	return new DeviceOutputMotor( data );
};


// Return a string with hex encoded data representing this device
DeviceOutputMotor.prototype.exportToArduino = function()
{
	console.log('------------------------------------------'+this.config.initial_speed);
	return Device.prototype.exportToArduino.call(this) +
			padByte(DEVICE_OUTPUT_MOTOR) +
			padByte(this.config.pin_1) + padByte(this.config.pin_2) + 
			padInt(this.config.initial_speed) + ';';
};

