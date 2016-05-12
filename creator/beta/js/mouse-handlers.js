		
var _left_mouse_down = false;
var _right_mouse_down = false;

var _last_mouse_x;
var _last_mouse_y;

// Used to keep track of active touches.
var _current_touches = {};

function getMousePosition(event)
{
    var x = new Number();
    var y = new Number();
    // Try to extract the (x, y) values from different browsers
    if (event.x != undefined && event.y != undefined)
    {
        x = event.x;
        y = event.y;
    }
    else if (event.pageX != undefined && event.pageY != undefined)
    {
        x = event.pageX;
        y = event.pageY;
    }
    else
    {
        x = event.clientX + document.body.scrollLeft +
        document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop +
        document.documentElement.scrollTop;
    }

    // Compensate the coordinates fot the beginning of the canvas
    x -= _ui.canvas.offsetLeft;
    y -= _ui.canvas.offsetTop;

    _last_mouse_x = x;
    _last_mouse_y = y;
    return {x:x, y:y};
}


// Callback for when a mouse button is clicked
function mouseDown(event)
{
    console.log("mouseDown");
    //console.log(event);

    _ui.editing_properties = false; 

    var button = event.which || event.button;
    //console.log('button:'+button);
    var pos = getMousePosition(event);

    console.log("mouse  X:"+pos.x+"  Y:"+pos.y);

    if (button === 1)
    {
        _ui.mouseDownLeft(pos.x, pos.y);
        _left_mouse_down = true;
    }
    else if (button === 3)
    {
        _ui.mouseDownRight(pos.x, pos.y);
        _right_mouse_down = true;
    }
}


// Callback for when a mouse button is released
function mouseUp(event)
{
    console.log("mouseUp");
    //console.log(event);
	var pos = getMousePosition(event);  	

    var button = event.which || event.button;
		  	  	
    if (button === 1)
    {
        _left_mouse_down = false;
    }
    else if (button === 3)
    {
        _right_mouse_down = false;
    }

  	_ui.mouseUp(pos.x, pos.y);
}



// Callback for when the mouse moves
function mouseMove(event)
{
    console.log("mouseMove");
    //console.log(event);
	var pos = getMousePosition(event);  			  	  	
  	if (_left_mouse_down || _right_mouse_down) 
  	{
  		_ui.mouseDrag(pos.x, pos.y);
  	} else 
  	{
  		_ui.mouseMove(pos.x, pos.y);
	}
}


// Callback for when a new touch point appears
function touchStart(event) 
{
    console.log("touchStart");

    // Prevent the default behaviours from happening (screen scholling, mouse emulation)
    event.preventDefault();

    // Get the list of new points
    var touches = event.originalEvent.changedTouches;

    // A new touch always (kindda) translates to a left mouse click
    _left_mouse_down = true;

    // Process all the new points (most times is only 1)
    for (var i=0; i < touches.length; i++) 
    {
        var touch = touches[i];

        var pos = getMousePosition(touch);

        //console.log("touchStart id:"+touch.identifier +"  X:"+pos.x+"  Y:"+pos.y);

        // Add the new point to the touches list
        _current_touches[touch.identifier] = {x:pos.x, y:pos.y};

        if (touch.identifier === 0) _ui.mouseDownLeft(pos.x, pos.y);        
    }
};


// Callback for when a touch point dissappears
function touchEnd(event) 
{
    //console.log("touchEnd");

    // Prevent the default behaviours from happening (screen scholling, mouse emulation)
    event.preventDefault();

    // Get the list of points to remove
    var touches = event.originalEvent.changedTouches;

    // A touch always (kindda) translates to a left mouse click
    _left_mouse_down = false;

    // Process all the points (most times is only 1)
    for (var i=0; i < touches.length; i++) 
    {
        var touch = touches[i];

        var pos = getMousePosition(touch);

        //console.log("touchEnd id:"+touch.identifier +"  X:"+pos.x+"  Y:"+pos.y);

        // Remove the point to the touches list
        delete _current_touches[touch.identifier];

        //console.log(_current_touches);

        _ui.mouseUp(pos.x, pos.y);
    }
};


// Callback for when a touch point moves
function touchMove(event) 
{
    //console.log("touchMoved");
    event.preventDefault();
    //console.log(event);

    // Get the list of points that have moved
    var touches = event.originalEvent.changedTouches;

    // Process all the points (most times is only 1)
    for (var i=0; i < touches.length; i++) 
    {
        var touch = touches[i];
        
        // If we were already touching two points, calculate the old distance between them
        var initial_distance = 0;
        if (_current_touches[0] && _current_touches[1])
        {
            initial_distance = distanceBetweenPoints(_current_touches[0].x, _current_touches[0].y, 
                        _current_touches[1].x, _current_touches[1].y);
        }

        // Now we get the coordinates for the updated points
        var pos = getMousePosition(touch);
        _current_touches[touch.identifier] = {x:pos.x, y:pos.y};

        //console.log("touchMove count:"+touches.length+"  id:"+touch.identifier+"  x:"+pos.x+"  y:"+pos.y);

        // Calculate the new distance between the points
        if (_current_touches[0] && _current_touches[1])
        {    
            var final_distance = distanceBetweenPoints(_current_touches[0].x, _current_touches[0].y, 
                        _current_touches[1].x, _current_touches[1].y);


            //console.log("final_distance:"+final_distance);

            // If the points are too close, we want to pan the screen
            if (final_distance<120 && touch.identifier === 0)
            {
                //console.log("PAN!!! x:"+_current_touches[0].x+"  y:"+ _current_touches[0].y);
                _ui.pan_canvas = true;
                _ui.box_select = false;
                _ui.mouseDrag(_current_touches[0].x, _current_touches[0].y);
            }

            // If they are too far, we want to zoom the screen
            else if (final_distance>=120)
            {
                _ui.box_select = false;
                // The zoom applies will ve in function of the variation of the 
                // distance between the two points between updated
                var zoom_variation = initial_distance /final_distance;

                //console.log("zoom_variation:"+zoom_variation);

                // The center for the zoom will be the middle point between the 2 touch points
                var pos = { x:(_current_touches[0].x + _current_touches[1].x) / 2,
                        y:(_current_touches[0].y + _current_touches[1].y) / 2}
                _ui.zoomTree(_ui.zoom*(1-zoom_variation), pos);

            }

        }
        else
        {
            if (_left_mouse_down) 
            {
                //console.log("I AM HERE!!!!!!");
                _ui.mouseDrag(pos.x, pos.y);
            } else 
            {
                _ui.mouseMove(pos.x, pos.y);
            }        

        }

    }
};



function mouseScroll(event)
{
    event.preventDefault();
	var pos = getMousePosition(event);	
    if(event.originalEvent.wheelDelta /120 > 0) 
    {
        //console.log('scrolling up !');
        _ui.zoomTree(_ui.zoom*0.05, pos);
    }
    else
    {
        //console.log('scrolling down !');
        _ui.zoomTree(-_ui.zoom*0.05, pos);
    }

    //console.log('zoom:'+_ui.zoom);
}

