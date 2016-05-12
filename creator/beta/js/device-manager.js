// Base device type identifiers (for arduino)
var DEVICE_OUTPUT_DIGITAL_PIN 				= 0x10;
var DEVICE_OUTPUT_ANALOG_PIN 				= 0x11;
var DEVICE_OUTPUT_MOTOR 					= 0x12;

var DEVICE_INPUT_DIGITAL_PIN 				= 0x20;
var DEVICE_INPUT_ANALOG_PIN 				= 0x21;

var DEVICE_GYRO_OUTPUT_MOTOR				= 0x30;

var DEVICE_GYRO_INPUT_DISTANCE_SENSOR		= 0x40;
var DEVICE_GYRO_INPUT_LIGHT_SENSOR			= 0x41;


function DeviceManager()
{
	// Existing devices in the system
	this.devices = [];

	// Current new device type to create
	this.new_device_type = 0;

}


// Initialize the variables that cannot be initialized in the constructor
DeviceManager.prototype.init = function()
{
	// Possible device types for the system
	this.device_types =
	[
		DeviceOutputDigital.prototype.createDefaultDevice(),
		DeviceOutputAnalog.prototype.createDefaultDevice(),
		DeviceOutputMotor.prototype.createDefaultDevice(),
		DeviceInputDigital.prototype.createDefaultDevice(),
		DeviceInputAnalog.prototype.createDefaultDevice(),
		DeviceGyroOutputMotor.prototype.createDefaultDevice(),
		DeviceGyroInputDistanceSensor.prototype.createDefaultDevice(),
		DeviceGyroInputLightSensor.prototype.createDefaultDevice()
	];
};



// Initialize the variables that cannot be initialized in the constructor
DeviceManager.prototype.setDevices = function(new_device_list)
{
	this.devices = new_device_list;
}


// Return a string with a unique node ID
DeviceManager.prototype.nextDeviceID = function()
{
    var new_uid = createId();		// @todo make sure this is unique
    return new_uid;
};


// Create a device of a specific type based on device data
DeviceManager.prototype.createDevice = function(data)
{
	for ( var d=0; d<this.device_types.length; d++)
	{
		//console.log(data);
		//console.log("testing:"+data.type+" === "+this.device_types[d].type);
		if (data.type === this.device_types[d].type) 
		{
			return this.device_types[d].createCustomDevice(data);
		}
	}
	return null;
};


// Adds a new device to the device list based on the device data
DeviceManager.prototype.addDevice = function(data)
{
	// Add a device created based on the device data
	var new_device = this.createDevice(data);
	this.devices.push( new_device );
	return new_device;
};


// Set the order numbers for all the devices
DeviceManager.prototype.reorderDevices = function()
{
	//console.log("------------------------------------->reorderDevices");
	//console.log(this.devices);
	for ( var d=0; d<this.devices.length; d++)
	{
		this.devices[d].setNumber(d);
	}
};


// Returns the number of a device from its ID value
DeviceManager.prototype.getDeviceNumberById = function(id)
{
	for (var i=0; i<this.devices.length; i++)
	{
		if (this.devices[i].id === id ) return i;
	}
	return -1;
};


// Returns the number of a device from its ID value
DeviceManager.prototype.getDeviceImage = function(id)
{
	for (var i=0; i<this.devices.length; i++)
	{
		if (this.devices[i].id === id ) return this.devices[i].getImage();
	}
	return null;
};


// Return the HTML for a selector of a certain device class
DeviceManager.prototype.getDeviceSelector = function(selector_id, device_type, selected_id, class_type)
{
	var output = "<select id='"+selector_id+"'";

	if (class_type) output += " class='"+class_type+"'";
	output += ">";

	for (var i=0; i < this.devices.length; i++) 
	{
		// If a "device_type" was specified, only show devices of that type
		if (!device_type || this.devices[i].device_io_class === device_type)
		{
			// Mark the device in use by the node as selected
			var selected = '';
			if (selected_id === this.devices[i].id) selected = 'selected="true"';
			output += '<option id="select_device" value="'+this.devices[i].id+
				'" '+selected+'>' + this.devices[i].name + '</option>';

			//console.log(this.devices[i].id);		
		}
	}
	output += '</select>';
	return output;
};


// Get the default device of a specific class
DeviceManager.prototype.getDefaultDeviceID = function(type)
{
	for (var i=0; i < this.devices.length; i++) 
	{
		if (this.devices[i].device_io_class === type)
		{
			return this.devices[i].id;
		}
	}
	return -1;
};


// Resets the device maganer, deleting all the devices
DeviceManager.prototype.resetDevices = function() 
{
	this.devices = [];
};


// Export the current devices on the system to a single variable
DeviceManager.prototype.exportDevicesObject = function() 
{
	var output = [];
	for (var i=0; i<this.devices.length; i++) 
	{
		output.push( this.devices[i].exportJson() );
	}
	return output;
};


// Clones a list of devices from a source list
DeviceManager.prototype.cloneDevices = function(device_list)
{
	var new_devices = [];
	// Go through the device list, cloning each device
	for (var d=0; d<device_list.length; d++)
	{
		new_devices.push(device_list[d].clone());
	}
	return new_devices;
}



// Updates the values for all the devices
DeviceManager.prototype.updateDeviceValues = function (devices_data)
{
	console.log('updateDeviceValues:'+devices_data);
	var tokens = devices_data.split(';');
	for (var i=0; i<tokens.length-1; i++)
	{
		this.devices[i].value = tokens[i];
	}

};

