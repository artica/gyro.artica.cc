// All device implementations are either inputs or outputs
var DEVICE_CLASS_INPUT = 1;
var DEVICE_CLASS_OUTPUT = 2;

// Constructor for the abstract Device class
function Device(data) 
{
	this.id = data.id;
	this.name = data.name;
	this.img_id = data.img_id;

	this.value = 0;


	//console.log(data);
	//console.log(data.config);

	// Create a new data field with the elements from this node type
	this.config = $.extend(false, {}, data.config);

	//console.log(this);


	// Let's assume the device is not visible
	this.visible = false;

	// Number for the device (it's position in the list of devices)
	this.number = -1;

	// Create an empty data field (which will be filled with specicic device data by the child classes)
	//this.config = {};

	return this;
}


// Returns an exact copy of this device
Device.prototype.clone = function()
{
	var clone_device = new this.constructor( {id:this.id, name:this.name, img_id:this.img_id, config:this.config} );
	clone_device.number = this.number;
	return clone_device;
};


// Initialize the device based on specific data
Device.prototype.init = function()
{
	// If the device has a custom image, use it
	if (this.img_id) this.setImage(this.img_id);
	// Otherwise use the default image
	else this.setImage(this.type);
};


// Returns a new device of the same type as this device, initialized with default settings
Device.prototype.createDefaultDevice  = function() 
{
	return new this.constructor( _device_manager.nextDeviceID(), lang[this.type], this.DEFAULT_DEVICE_DATA);
};


// Create a new device of the same type as this device, initialized with values read from an existing object
Device.prototype.createCustomDevice = function(data, id)
{
	// If we pass a specific id, it will override the id in the data object 
	if (id) data.id = id;
	//console.log("createCustomDevice");
	var new_device = new this.constructor( data );
	//console.log(new_device);

	return new_device;
};


// Set the number for this device (its position in the device list)
Device.prototype.setNumber = function(number)
{
	this.number = number;
};


// Set a new image for this device
Device.prototype.setImage = function(img_id)
{
	// Save the image ID and create a direct link for the image for efficiency
	this.img_id = img_id;
	this.image = images.getImage(img_id);
};


// Get the image for this device
Device.prototype.getImage = function()
{
	//console.log("getImage");
	//console.log(this.image);
	return this.image;
};


// Get a string with the name of the Device
Device.prototype.toString = function()
{
	return this.name;
};


// Get a string with the name of the Device type
Device.prototype.toStringType = function() 
{
	return lang[this.type];
};


// Return an object with all the data of this device (to be saved in a file)
Device.prototype.exportJson = function()
{
	//console.log("Exporting!"); console.log(this);
	return	{
		id: this.id,
		name: this.name,
		type: this.type,
		img_id: this.img_id,
		config: this.config
	};
};


// Return a string with 'D' plus the number of the device in HEX format
// This method will be called by the child classes when sending data to the Arduino
Device.prototype.exportToArduino = function()
{
	return "D"+ padByte(this.number);
};
