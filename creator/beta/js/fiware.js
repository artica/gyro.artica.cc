
var PROXY_PORT = 8080;

//var fiware_user_name = "Tarquinio";
//var fiware_user_email = "tarquinio@gmail.com";

var fiware_user_name = "";
var fiware_user_email = "";
var visualino_user_id = 0;

function fiwareToggleLogin()
{
	console.log("fiwareToggleLogin");
	console.log("fiware_user_name:"+fiware_user_name);
	if (fiware_user_name === "") fiwareRedirectLogin();
	else fiwareLogoutUser();
}

// Callback for when the user clicks on the login button
// This opens the "/auth" page on the proxy, which redirects 
// to the Fiware IDM server
function fiwareRedirectLogin()
{
	var customURL = "http://localhost:8080/auth";
	window.location.href = customURL;
	window.location.assign(customURL);
}


function fiwareLoginUser()
{
	console.log("fiwareLoginUser");
	console.log("window.location.href:"+window.location.href);

	var tokens = window.location.href.split('?');

	if (!tokens[1]) return;

	var url = "http://localhost:8080/login/?"+tokens[1];

	console.log("GET:"+url);
	
	$.ajax
    ({
        type: "GET",
        url: url,
        dataType: 'text',	// Data type we are expecting to receive back
        success: function (data, status)
        {
			console.log( status );
			console.log( data );

			fiwareGetUserData();
        }
    })
}


function fiwareLogoutUser()
{
	console.log("fiwareLogoutUser");

	var url = "http://localhost:8080/logout/";

	console.log("GET:"+url);

	deleteAllCookies();
	fiware_user_name = "";
	fiware_user_email = "";
	$('#span_user_id').html("Guest");
	$('#button_user').attr('src', 'images/header/user_login.svg');

	$.ajax
    ({
        type: "GET",
        url: url,
        dataType: 'text',	// Data type we are expecting to receive back
        success: function (data, status)
        {
			console.log( status );
			console.log( data );
			deleteAllCookies();
			fiware_user_name = "";
			$('#button_load_net, #button_save_net').animate({opacity:0.1}, 200);
        }
    })

}


function fiwareGetUserData()
{
	console.log("fiwareGetUserData");

	var url = "http://localhost:8080/user_info";

	console.log("GET:"+url);
	
	$.ajax
    ({
        type: "GET",
        //the url where you want to sent the userName and password to
        url: url,

        dataType: 'text',	// Data type we are expecting to receive back
        //async: true,
        //
        //data: { username:"tarquinio", password: "bananas" },
        success: function (data, status)
        {
			console.log( status );
			console.log( data );

			if (data != "")
			{
				var json = JSON.parse(data);
				console.log(json);
				//alert("Olá "+json.displayName);

				fiware_user_name = json.displayName;
				fiware_user_email = json.email;
				visualino_user_id = json.user_id;
				$('#span_user_id').html(fiware_user_name);
				$('#button_user').attr('src', 'images/header/user_logout.svg');

				$('#button_load_net, #button_save_net').animate({opacity:1.0}, 200);
			}

			console.log("TA-DAAAAAA!!!");
        }
    })

}

var tree_list = null;

// Get a list of trees based on keyword searched passed by parameter:
// email: fragment of the email of the creator of the tree
// user_name: fragment of the user name of the creator of the tree
// tree_name: fragment of the name of the tree
// tags: fragment of one (or more) of the tree tags

function fiwareGetTreeList( email, user_name, tree_name, tags )
{
	console.log("fiwareGetTreeList");

	var url = "http://localhost:8080/list_trees";

	console.log("GET:"+url);

	// If the user is looking for shared trees, we set the shared tag to true	
	var shared = (_ui.search_tree_group === "th_shared_trees" ? true : false);

	// If we user is looking for his own trees, set the email to his own
	var search_email = (_ui.search_tree_group === "th_my_trees" ? fiware_user_email : email);

	$.ajax
    ({
        type: "GET",
        //the url where you want to sent the userName and password to
        url: url,

        dataType: 'text',	// Data type we are expecting to receive back
        //async: true,
        //
        data: { request_user_email:fiware_user_email, email:search_email, user_name:user_name, tree_name:tree_name, tags:tags, shared:shared },
        success: function (data, status)
        {
			console.log( status );
			console.log( data );

			// Remove the results from the previous search
			$('#table_tree_list tr').has('td').remove();
			
			if (data != "")
			{
				tree_list = JSON.parse(data);
				console.log(tree_list);

				for (var key in tree_list) 
				{
					var tree = tree_list[key];
					console.log(key, tree);
					$('#table_tree_list > tbody:last').append(
						"<tr>"+
							"<td>"+tree.name+"</td>"+
							"<td>"+
								"<img id='button_load_tree' class='button_tree_action button_load_tree' "+
									"object_id='"+tree.object_id+"' src='images/header/browse_trees.svg'></img>"+
								(_ui.search_tree_group === "th_my_trees" ?
									"<img class='button_tree_action button_delete_tree' "+
										"tree_id='"+tree.tree_id+"' src='images/header/delete_tree.svg'></img>"+
									"<img class='button_tree_action button_share_tree' "+
										"tree_id='"+tree.tree_id+"' src='images/header/tree_share_"+
											(tree.shares >0 ?"active_shares": "no_shares")+".svg'></img>" : "") +

							"</td>"+
							"<td>"+tree.owner+"</td>"+
							"<td>"+tree.tags+"</td>"+
							"<td>"+(tree.permissions=='0'? "private": "public")+"</td></tr>");
				}
			}

			$(".button_load_tree").click(fiwareLoadTree);
			$(".button_delete_tree").click(fiwareDeleteTree);
			$(".button_share_tree").click(_ui.openShareTreeWindow);

			console.log("TA-DAAAAAA!!!");
        }
    })
}




// Get a list of shares for a specific tree

function fiwareGetSharesList( tree_id )
{
	console.log("fiwareGetSharesList");

	var url = "http://localhost:8080/list_shares";

	console.log("GET:"+url);

	var share_tree_id = tree_id;
	$.ajax
    ({
        type: "GET",
        //the url where you want to sent the userName and password to
        url: url,

        dataType: 'text',	// Data type we are expecting to receive back

        data: { request_user_email:fiware_user_email, tree_id:tree_id },
        success: function (data, status)
        {
			console.log( status );
			console.log( data );
			
			// Remove the results from the previous search
			$('#table_tree_share_list tr').has('td').remove();

			if (data != "")
			{
				share_list = JSON.parse(data);
				console.log(share_list);

				for (var s=0; s<share_list.shares.length; s++) 
				{
					var share = share_list.shares[s];
					$('#table_tree_share_list > tbody:last').append(
						"<tr>"+
							"<td class='td_full_size'>"+share.user_name+"</td>"+
							"<td>"+
								"<img class='button_remove_share_tree' src='images/header/tree_remove_share.svg' "+
									"tree_id='"+share_tree_id+"' user_id='"+share.user_id+"'></img>"+
							"</td></tr>");
				}
			}

			$(".button_remove_share_tree").click(fiwareRemoveTreeShare);

			console.log("TA-DAAAAAA!!!");
        }
    })
}

// Share a tree with a specific user (by name or email)
function fiwareShareTree( tree_id, email, user_name )
{
	console.log("fiwareShareTree:"+tree_id+", "+email+", "+user_name);

	var url = "http://localhost:8080/share_tree";

	console.log("GET:"+url);

	$.ajax
    ({
        type: "GET",
        //the url where you want to sent the userName and password to
        url: url,

        dataType: 'text',	// Data type we are expecting to receive back
        //async: true,
        //
        data: { request_user_email:fiware_user_email, tree_id:tree_id, 
        		target_user_email:email, target_user_name:user_name },
        success: function (data, status)
        {
			console.log( status );
			console.log( data );

			var json = JSON.parse(data);

			switch(json.error)
			{						
				case 'ERROR_SHARE_USER_NOT_FOUND': openPopUpMessage(lang['share_error_user_not_found']); break;
				case 'ERROR_NONE': 
					openPopUpMessage(lang['share_successeful']); 
					fiwareGetTreeList();
					fiwareGetSharesList(tree_id);							
				break;
			}
        }
    });
}


// Removes a share from a tree with a specific user (user_id)
function fiwareRemoveTreeShare( event)
{
	tree_id = getHtmlAttr(event, 'tree_id')
	user_id = getHtmlAttr(event, 'user_id')
	console.log("fiwareRemoveTreeShare:"+tree_id+", "+user_id);

	var url = "http://localhost:8080/remove_share_tree";

	console.log("GET:"+url);

	$.ajax
    ({
        type: "GET",
        //the url where you want to sent the userName and password to
        url: url,

        dataType: 'text',	// Data type we are expecting to receive back
        //async: true,
        //
        data: { request_user_email:fiware_user_email, tree_id:tree_id, user_id:user_id },
        success: function (data, status)
        {
			console.log( status );
			console.log( data );

			var json = JSON.parse(data);

			switch(json.error)
			{						
				case 'ERROR_SHARE_USER_NOT_FOUND': openPopUpMessage(lang['share_error_user_not_found']); break;
				case 'ERROR_NONE': 
					openPopUpMessage(lang['share_remove_successeful']);
					fiwareGetTreeList();				
					fiwareGetSharesList(tree_id);							
				break;
			}
        }
    });

}



function fiwareLoadTree(event)
{
	console.log("fiwareLoadTree");

	object_id = getHtmlAttr(event, 'object_id')
	console.log("object_id:"+object_id);

	$.ajax
    ({
        type: "GET",
        //the url where you want to sent the userName and password to
        url: "http://localhost:"+PROXY_PORT+"/get_tree",

        dataType: 'text',	// Data type we are expecting to receive back
        //async: true,
        //
        //json object to send to desired tree id
        data: { tree_id:object_id },

        success: function (data, status)
        {
			console.log( status );
			console.log( data );

			_node_manager.resetTree();
			_version_manager.importJson(data, true);
			_ui.closePopUpMessageDiv();

        },
        error: function (error)
        {
			console.log( error );
			_ui.closePopUpMessageDiv();
        }

    })
}


function fiwareDeleteTree(event)
{
	console.log("fiwareDeleteTree");

	tree_id = getHtmlAttr(event, 'tree_id')
	console.log("tree_id:"+tree_id);

	$.ajax
    ({
        type: "GET",
        url: "http://localhost:"+PROXY_PORT+"/delete_tree",
        dataType: 'text',	// Data type we are expecting to receive back
        data: { tree_id:tree_id },

        success: function (data, status)
        {
			console.log( status );
			console.log( data );

			var json = JSON.parse(data);

			switch(json.status)
			{
				case 'ERROR_TREE_SHARED': openPopUpMessage(lang['delete_tree_shared']); break;

				case 'TREE_DELETED': 
					openPopUpMessage(lang['delete_tree_deleted']); 
					fiwareGetTreeList();				
				break;
			}

        },
        error: function (error)
        {
			console.log( error );
        }

    })
}


function fiwareSaveTree()
{
	// If the user is not logged in he cannot browse anything
	if (fiware_user_email==="") return;

	console.log("fiwareSaveTree");

	var url = "http://localhost:"+PROXY_PORT+"/post_tree";
	console.log("POST:"+url);

	var tree = _node_manager.exportTreeJson();

	$.ajax
    ({
        type: "POST",
        //the url where you want to sent the userName and password to
        url: url,

        dataType: 'text',	// Data type we are expecting to receive back

        //json object to send to desired tree id
        data: { request_user_email:fiware_user_email, tree:tree, name:_node_manager.root.name, tags: _node_manager.root.data.tags},

        success: function (data, status)
        {
			console.log( status );
			console.log( data );

			var json = JSON.parse(data);

			switch(json.status)
			{						
				case 'TREE_CREATED': openPopUpMessage(lang['save_tree_created']); break;
				case 'TREE_UPDATED': openPopUpMessage(lang['save_tree_updated']); break;
			}

        },
        error: function (error)
        {
			console.log( error );
        }

    })

}


function deleteAllCookies() 
{
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) 
    {
    	var cookie = cookies[i];
    	var eqPos = cookie.indexOf("=");
    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    	document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

