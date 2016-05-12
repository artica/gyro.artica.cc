var shiftDown = false;
var ctrlDown = false;


window.onkeydown = function(e)
{
	console.log(e.keyCode);
	//alert("CENAS");
	switch(e.keyCode) 
	{
		/*
		case 8: // backspace key
		 	e.preventDefault();
		break;
		*/
		case 46: // delete
		case 8:  // backspace
			if (! _ui.editing_properties) _node_manager.removeSelection();
		break;
		case 16: // shift key
			shiftDown = true;
		break;
		case 17: // control key
			ctrlDown = true;
		break;
		
		case 67: // C key
			// CTRL-C combo
			if (ctrlDown)
			{
				_version_manager.copy();
			}
		break;


		case 68: // D key
			console.log(_device_manager.devices);
		break;

		case 70: // C key
			// CTRL-C combo
			if (_ui.editing_properties === false)
			{
				_ui.fitTreeToScreen();
			}
		break;


		case 88: // X key
			// CTRL-X combo
			if (ctrlDown)
			{
				_version_manager.cut();
			}
		break;
		case 86: // V key
			// CTRL-V combo
			if (ctrlDown)
			{
				_version_manager.paste();	
			}
		break;
		case 90: // Z key
			// CTRL-Z combo
			if (ctrlDown)
			{
				_version_manager.undo();
			}
			else
			{
				_ui.corner_x = 0;
				_ui.corner_y = 0;
				_ui.startAnimation();				
			}
		break;
		case 89: // Y key
			// CTRL-Y combo
			if (ctrlDown)
			{
				_version_manager.redo();
			}
		break;
	}
};


window.onkeyup = function(e)
{
	switch(e.keyCode) 
	{
		case 16: // shift key
			shiftDown = false;
    		//g.clean_temporary_connection(); 
		break;
		case 17: // control key
			ctrlDown = false;
		break;
	}
};

