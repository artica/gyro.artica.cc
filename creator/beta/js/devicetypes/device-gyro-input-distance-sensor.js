
//
// Gyro Distance Sensor
//

// Possible positions for the distance sensors
var GYRO_DISTANCE_SENSOR_POSITION_LEFT = 1;
var GYRO_DISTANCE_SENSOR_POSITION_RIGHT = 2;
var GYRO_DISTANCE_SENSOR_POSITION_BELOW = 3;

// Working mode for the distance sensor
// In analog mode it outputs the raw data read from the sensor
var GYRO_DISTANCE_SENSOR_DATA_MODE_ANALOG = 1;
// In digital mode it outputs zero or one, by comparing the 
// value read with a configurable threshold
var GYRO_DISTANCE_SENSOR_DATA_MODE_DIGITAL = 2;
// Default threshold when using digital mode
var GYRO_DISTANCE_SENSOR_DEFAULT_THRESHOLD = 512;


function DeviceGyroInputDistanceSensor(data) 
{
	Device.call(this, data);
	// Create a new data field with the elements from this device type
	//this.config.motor_position = data.config.motor_position;
	//this.config.initial_speed = data.config.initial_speed;

	// Categorize this device
	this.type = 'device_gyro_distance_sensor';
	this.device_io_class = DEVICE_CLASS_INPUT;
	
	// Initialize the node (depending on the categorization)
	Device.prototype.init.call(this);

	return this;
}

// Inherit from the Device class
DeviceGyroInputDistanceSensor.inheritsFrom(Device);

// All the prototype definitions MUST be added after this point

// Different types of sensors (relating to the positions)
DeviceGyroInputDistanceSensor.prototype.types = [{value:GYRO_DISTANCE_SENSOR_POSITION_LEFT, name:'left'},
										{value:GYRO_DISTANCE_SENSOR_POSITION_RIGHT, name:'right'},
										{value:GYRO_DISTANCE_SENSOR_POSITION_BELOW, name:'below'}]

// Different types of data handling for the sensors
DeviceGyroInputDistanceSensor.prototype.modes = [{value:GYRO_DISTANCE_SENSOR_DATA_MODE_ANALOG, name:'analog'},
										{value:GYRO_DISTANCE_SENSOR_DATA_MODE_DIGITAL, name:'digital'}]


// Get a string with the configuration of the Device
DeviceGyroInputDistanceSensor.prototype.toStringConfiguration = function()
{
	switch ( this.config.position)
	{
		case GYRO_DISTANCE_SENSOR_POSITION_LEFT: return lang['left']; break;
		case GYRO_DISTANCE_SENSOR_POSITION_RIGHT: return lang['right']; break;
		case GYRO_DISTANCE_SENSOR_POSITION_BELOW: return lang['below']; break;
	}
	// We shouldn't reach this point
	return "error!";
};


// Get a string with an html block to configure this device type
DeviceGyroInputDistanceSensor.prototype.listProperties = function()
{
	console.log("---------------------------------");
	console.log(this);
	var html = "<table>"+
		"<tr><td>"+lang['position']+"</td><td>"+

		// Create a selector to choose the sensor position
		createHtmlSelectorTranslated('select_position_'+this.number, null, this.types, this.config.position, this.number)+

		"</td></tr>"+

		"<tr><td>"+lang['data_type']+"</td><td>"+

		// Create a selector to choose the sensor data mode (analog/digital)
		createHtmlSelectorTranslated('select_mode_'+this.number, null, this.modes, this.config.data_mode, this.number)+

		"</td></tr>";


	if (this.config.data_mode === GYRO_DISTANCE_SENSOR_DATA_MODE_DIGITAL)
	{
		html += "<tr>"+
			"<td>"+lang['threshold']+"</td>"+
			"<td><input type='number' id='text_threshold_"+this.number+"' number='"+this.number+"' min='1' max='1200' value="+this.config.threshold+"></input></td>"+
		"</tr>";
	}

	html += "</table>";

	return html;
};


// Add listeners to react the the changes in the device configuration
DeviceGyroInputDistanceSensor.prototype.addListPropertiesListeners = function(data)
{
	// @todo validate pins here

	console.log("############## CENAS ############");
	// Necessary variable to access the data from the callback functions
	var device_data = data;
	console.log(data);

	// Selectors to change the different override properties
	$('#select_mode_').on('change', function() { DeviceGyroInputDistanceSensor.prototype.validateDeviceProperties(device_data) });
	//$('#select_failure_policy').on('change', function() { DeviceGyroInputDistanceSensor.prototype.validateDeviceProperties(device_data) });

};


// Validate if all the node properties are valid
DeviceGyroInputDistanceSensor.prototype.validateDeviceProperties = function(data) 
{
	console.log(data);
	_ui.displayNodeProperties();
}

// Updates an existing device with data read from the UI
// Parameter "n" indicates the number reference of the html elements to be read
DeviceGyroInputDistanceSensor.prototype.updateDevice = function(n)
{
	//console.log("updateDevice: DeviceGyroInputDistanceSensor");

	this.config = 
		{
			data_mode: parseInt($('#select_mode_'+n).val(), 10),
			position: parseInt($('#select_position_'+n).val(), 10),
			threshold: parseInt($('#text_threshold_'+n).val(), 10),
		};
	if (isNaN(this.config.threshold)) this.config.threshold = 0;
};


// Create a new default device of this device type
DeviceGyroInputDistanceSensor.prototype.createDefaultDevice = function()
{
	var data = {
		id:	_device_manager.nextDeviceID(),
		name: lang['new_device'],
		config: { position: GYRO_DISTANCE_SENSOR_POSITION_LEFT, data_mode:GYRO_DISTANCE_SENSOR_DATA_MODE_ANALOG, threshold:GYRO_DISTANCE_SENSOR_DEFAULT_THRESHOLD }
	}
	return new DeviceGyroInputDistanceSensor( data );
};


// Return a string with hex encoded data representing this device
DeviceGyroInputDistanceSensor.prototype.exportToArduino = function()
{
	console.log('----------------- DeviceGyroInputDistanceSensor:'+this.config.position+':'+this.config.threshold);

	return Device.prototype.exportToArduino.call(this) + padByte(DEVICE_GYRO_INPUT_DISTANCE_SENSOR) +
			padByte(this.config.position) + padByte(this.config.data_mode) + padInt(this.config.threshold) + ';';
};

