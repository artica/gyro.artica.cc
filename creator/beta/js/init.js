
var	_hardware_manager;
var _device_manager;
var _variable_manager;
var _node_manager;
var _ui;
var _clipboard;

var url_parameters;

var animation_frame;


window.onload = function init() 
{
	_hardware_manager = new HardwareManager();
	//console.log(_hardware_manager);

	_device_manager = new DeviceManager();
	_device_manager.init();
	//_device_manager.reorderDevices();
	//console.log(_device_manager);

	_variable_manager = new VariableManager();
	_variable_manager.init();
	//_variable_manager.reorderVariables();
	//console.log(_variable_manager);

	_node_manager = new NodeManager();
	_node_manager.init();
	//console.log(_node_manager);

	_version_manager = new VersionManager();
	//console.log(_version_manager);


	_ui = new UserInterface();
	_ui.init();
	//console.log(_ui);

	//_version_manager = new VersionManager();
	//console.log(_version_manager);


	// To parse the URL parameters from the address
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    url_parameters = {};
    while (match = search.exec(query))
       url_parameters[decode(match[1])] = decode(match[2]);

   //console.log(url_parameters);


   if (url_parameters.state && url_parameters.code) fiwareLoginUser();

};

