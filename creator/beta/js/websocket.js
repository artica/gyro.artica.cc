var socket = new ReconnectingWebSocket("ws://localhost:13478/");        
//var socket = new WebSocket("ws://127.0.0.1:3000/");        

// Maximum number of times the program will try to re-send the same data
var MAX_RETRY_COUNT = 10;

// Timeout between data retransmissions
var RETRY_TIMEOUT = 500;

// List of sctive com ports received from the server
var com_ports_list = [];


var selected_com_port = '';
var connected_com_port = '';

// Variables for the data send buffer
var send_buffer = [];
var send_position;
var send_count;

// Debug variable
//var simulate_error = 10;

// Timer to re-transmit failed transmissions
var send_block_timeout;


// Timer to wait for the Arduino PINGs
var ping_timeout;


// Number of times the program already tried to transmit the current block of data
var retry_counter = 0;


function connectComPort()
{
	sendData('#CONNECT,'+selected_com_port+',;'); 
}


function disconnectComPort()
{
	sendData('#DISCONNECT,;');
	clearTimeout(ping_timeout);	
}

			
function showPortsState()
{
	// @todo fix this.... _ui may not exist when this runs
	if (_ui)
	{
		_ui.showComPorts();
		_ui.showComPortState();				
	}
}


function setPingTimeout()
{
	clearTimeout(ping_timeout);
	ping_timeout = setTimeout( function()
	{
		console.log("BAM");
		//disconnectComPort();
	}, 3000);	
}


// Callback function when the websocket connects
socket.onopen = function() 
{
	console.log("Websocket connection established");
	setTimeout(function(){sendData('#PORTS_LIST,;');}, 100);
};


// Callback function to handle the incoming websocket messages
socket.onmessage = function(message) 
{
	console.log('<--'+message.data);
	var tokens = message.data.split(',');

	var command = ( tokens[0].indexOf(';') > -1 ? tokens[0].substring(0, tokens[0].indexOf(';')) : tokens[0] );
	//var command = tokens[0].substring(0, tokens[0].indexOf(';'));
	//console.log(command);

	switch(command)
	{
		// PING - Ping message
		// This message is used to make sure sure the arduino is still connected even when nothing changes
		case 'PING':
			setPingTimeout();
		break;

		// TS - Tree State message
		// This message contains the tree state (ram usage and state of all the nodes)
		case 'TS':
			//_ui.updateRamUsage(tokens[1]);

			// The first token of the message should contain the tree ID
			var tree_id = parseInt(tokens[1], 16);

			// The second token should contain an estimate of the available RAM on the Arduino
			var free_ram = parseInt(tokens[2], 10);

			// Update the meter in the UI showing the RAM usage
			fillLinearMeter( 'canvas_free_ram', (_hardware_manager.TOTAL_RAM-free_ram)/_hardware_manager.TOTAL_RAM, '#FF5544');			

			// Check if the tree version in the arduino id different from the UI
			if (tree_id !== _version_manager.tree_id)
			{
				// @todo open this pop-up, but only once
				//openPopUpMessage(lang['warning_different_version']);
				return;
			}

			// If we get a third token, it's the node state report
			if (tokens[3]) _node_manager.updateNodesState(tokens[3]);

			// Redraw the UI with all the updated data
			_ui.draw();
		break;

		// VS - Variable State message
		// This message contains the values for all the existing variables in the system
		case 'VS':

			// The first token of the message should contain the tree ID
			var tree_id = parseInt(tokens[1], 16);

			// Check if the tree version in the arduino id different from the UI
			if (tree_id !== _version_manager.tree_id)
			{
				// @todo open this pop-up, but only once
				//openPopUpMessage(lang['warning_different_version']);
				return;
			}

			// If we get a third token, it's the node state report
			if (tokens[2]) _device_manager.updateDeviceValues(tokens[2]);

			// Redraw the UI with all the updated data
			//_ui.draw();
			_ui.updateDeviceValues();
		break;


		// This message should be received when the websockets connects, 
		// and contains a list of the available COM ports
		case 'PORTS':
			// Set the currently selected com port as the currently open port. 
			// If no port is open on the server, select the first port
			connected_com_port = tokens[1];

			selected_com_port = ( connected_com_port === ''? (tokens.length>=2? tokens[2]: ''): connected_com_port );

			console.log('connected_com_port:'+connected_com_port);
			console.log('selected_com_port:'+selected_com_port);

			// The rest of the tokens should be all the available com ports
			com_ports_list = [];
			for (i=2; i<tokens.length; i++)
			{
				console.log("porta:"+tokens[i]);
				com_ports_list.push(tokens[i]);
			}
			showPortsState();
		break;
		// This message is received when the com port in the node.js server connects, with the name of the connected port
		case 'CONNECT':
			// Set the currently selected com port. If no port is open on the server, select the first port
			connected_com_port = tokens[1];
			setPingTimeout();
			showPortsState();
		break;

		// @todo THIS WHOLE PART SHOULD BE MADE INTO A SEPARATE FILE/LIBRARY
		// ALSO CONSIDER IS THIS SHOULD BE DONE HERE OR AT THE SERVER LEVEL

		// This message is a confirmation of a message received from the arduino
		case 'RX1':
		case 'RX2':
			clearTimeout(send_block_timeout);

			if (send_buffer.length === 0) return;
			
			var echo = tokens[1].substring(0, tokens[1].indexOf(';'));

			//console.log('hashCode(send_buffer[0]):' + hashCode(send_buffer[0]) );
			//console.log('echo:' + echo );
			// The message confirmation was received and it matches WHOHOOO
			if ( echo == hashCode(send_buffer[0]) )
			{
				// Advance the progress bar meter
				send_position++;
				retry_counter = 0;
				fillLinearMeter( 'canvas_upload_progress', (send_position/send_count));

				// Remove the confirmed message from the list buffer
				send_buffer.splice(0, 1);
				sendNextBlock();
				break;
			}
			// If the hash was not correct, re-transmit the message after a short delay
			console.log("Invalid RX hash received!");
			send_block_timeout = setTimeout(sendNextBlock, RETRY_TIMEOUT);

		break;
		// This message is a warning that the previous message had some error
		case 'FAIL':
			// Since the message failed, try sending it again after a short delay
			console.log("Message failure warning received!");
			send_block_timeout = setTimeout(sendNextBlock, RETRY_TIMEOUT);
		break;
		// This message is a warning that the previous message had an error (even though the hash matched)
		case 'ERROR':
			// Since the message is wrong already, don't bother sending the rest
			send_buffer = [];
			openPopUpMessage(lang['Communication Problem']);
		break;
	}
};

socket.onclose = function()
{
	console.log("Websocket closed!");
};

socket.onerror = function()
{
	console.log("Error with the websocket connection!");
};


function hashCode(str) 
{
	var hash = 0, i, chr, len;
	if (str.length === 0) return hash;
	for (i = 0, len = str.length; i < len; i++) 
	{
		chr = str.charCodeAt(i);
		var mask = chr << ((chr*7+i)%8);
		//console.log('le chr:'+chr);
		//console.log('le mask:'+mask);
		hash  = hash ^ mask;
	}
	return hash;
}


function sendBlockTimeout()
{
	console.log("sendBlockTimeout!");
	sendNextBlock();
}

function sendNextBlock()
{
	retry_counter++;
	if(retry_counter>1) console.log('sendNextBlock:'+retry_counter);

	clearTimeout(send_block_timeout);

	if (retry_counter == MAX_RETRY_COUNT )
	{
		if (send_position > 0) 
		{
			openPopUpMessage(lang['Communication Problem']);
			send_buffer = [];
			fillLinearMeter( 'canvas_upload_progress', (send_position/send_count), '#FF5544');			
		}
		else
		{
			openPopUpMessage(lang['Communication Problem']);
			send_buffer = [];
		}

		return;
	}
	//console.log('send_buffer.length:'+send_buffer.length);

	if (send_buffer.length > 0)
	{
		var message = send_buffer[0];

		// If the message if destined to the server, we don't need to wait for a confirmation
		if (send_buffer[0][0] === '#') 
		{
			send_buffer.splice(0, 1);
			retry_counter = 0;
			send_block_timeout = setTimeout(sendNextBlock, 100);
		}
		// If the message is destined to the arduino, we need to add an hash value to the end
		else
		{
			message += '|'+hashCode(send_buffer[0]);
			/*
			if (send_position == 8 && simulate_error > 0)
			{
				message += 8;
				simulate_error --;
			}
			*/
			// Since this message will need a reply, let's set a timeout for that reply
			send_block_timeout = setTimeout(sendBlockTimeout, RETRY_TIMEOUT);

		}
		message += ';';

		//console.log(socket);

		if (socket.readyState != 1)	openPopUpMessage(lang['No Websocket']);


		socket.send( message );
		console.log('-->' + message);

		//if (send_buffer[0][0] === '#') send_buffer.splice(0, 1);
	}
}

function sendData(text, show_progress)
{
	console.log('sendData:'+text);

	// If the message is destined to the arduino, only send it if the serial port is open
	if (connected_com_port === '' && text[0] !== '#')
	{
		openPopUpMessage(lang['error_no_connection']);
		openPopUpArrow('button_com_connect', 0);
		return;
	} 

	console.log('Is this real life');

	retry_counter = 0;
	var tokens = text.split(';'); 
	for (var i=0; i<tokens.length-1; i++)
	{
		console.log('tokens[i]:'+tokens[i]);
		send_buffer.push(tokens[i]);
	}
	if (show_progress)
	{
		send_position = 0;
		send_count = tokens.length-1;
		//$('#div_progress_bar').css('display', 'block');
	}

	sendNextBlock();
}