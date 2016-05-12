
//
// Gyro Motor Device
//


var GYRO_MOTOR_POSITION_LEFT = 1;
var GYRO_MOTOR_POSITION_RIGHT = 2;


function DeviceGyroOutputMotor(data) 
{
	Device.call(this, data);
	// Create a new data field with the elements from this device type
	//this.config.motor_position = data.config.motor_position;
	//this.config.initial_speed = data.config.initial_speed;

	// Categorize this device
	this.type = 'device_gyro_motor';
	this.device_io_class = DEVICE_CLASS_OUTPUT;
	
	// Initialize the node (depending on the categorization)
	Device.prototype.init.call(this);

	return this;
}

// Inherit from the Device class
DeviceGyroOutputMotor.inheritsFrom(Device);

// All the prototype definitions MUST be added after this point

// Associations fetween the function types and different function parameters
DeviceGyroOutputMotor.prototype.types = [{value:GYRO_MOTOR_POSITION_LEFT, name:'left'},
										{value:GYRO_MOTOR_POSITION_RIGHT, name:'right'}]


// Get a string with the configuration of the Device
DeviceGyroOutputMotor.prototype.toStringConfiguration = function()
{
	if ( this.config.motor_position === GYRO_MOTOR_POSITION_LEFT) return lang['left'];
	if ( this.config.motor_position === GYRO_MOTOR_POSITION_RIGHT) return lang['right'];
	return "error!";
};


// Get a string with an html block to configure this device type
DeviceGyroOutputMotor.prototype.listProperties = function()
{
	return 	"<table>"+
		"<tr><td>"+lang['position']+"</td><td>"+

		// Create a selector to choose which function to use
		createHtmlSelectorTranslated('motor_type_'+this.number, null, this.types, this.config.motor_position)+

		"</td></tr>"+

		"<tr>"+
			"<td>"+lang['initial_speed']+"</td>"+
			"<td><input type='number' id='text_initial_speed_"+this.number+"' min='-255' max='255' value="+this.config.initial_speed+"></input></td>"+
		"</tr>"+

		"</table>";
};


// Add listeners to react the the changes in the device configuration
DeviceGyroOutputMotor.prototype.addListPropertiesListeners = function()
{
	for( var x=1; x<10; x++ )
	{
		console.log(i);
	}
};


// Updates an existing device with data read from the UI
// Parameter "n" indicates the number reference of the html elements to be read
DeviceGyroOutputMotor.prototype.updateDevice = function(n)
{
	console.log("updateDevice: DeviceGyroOutputMotor");

	this.config = 
		{
			initial_speed:parseInt($('#text_initial_speed_'+n).val(), 10),
			motor_position:parseInt($('#motor_type_'+n).val(), 10),
		};
};


// Create a new default device of this device type
DeviceGyroOutputMotor.prototype.createDefaultDevice = function()
{
	var data = {
		id:	_device_manager.nextDeviceID(),
		name: lang['new_device'],
		config: { motor_position:GYRO_MOTOR_POSITION_LEFT, initial_speed:0 }
	}
	return new DeviceGyroOutputMotor( data );
};


// Return a string with hex encoded data representing this device
DeviceGyroOutputMotor.prototype.exportToArduino = function()
{
	console.log('----------------- DeviceGyroOutputMotor:'+this.config.motor_position+':'+this.config.initial_speed);

	return Device.prototype.exportToArduino.call(this) +
			padByte(DEVICE_GYRO_OUTPUT_MOTOR) +
			padByte(this.config.motor_position) + padInt(this.config.initial_speed) + ';';
};

