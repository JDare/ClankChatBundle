(function($){
    $(function(){
        var network = Clank.connect("ws://clanktest.local:8080");

        network.on("socket/connect", function(session){
            $("#connected").html("Connected");
            bindUi(session);

        });

        network.on("socket/disconnect", function(session){
            $("#connected").html("Disconnected");

            unbindUi();
        });
    })
})(jQuery)

/**
 * Below is the Clank relevant functions, the rest of this file is UI Bindings etc.
 */

/**
 * This will do a RPC to change this connections nickname
 * @param session
 */
function changeNickname(session)
{
    session.call("chat/change_nickname", {nickname: $("#nickname > input").val()})
        .then(function(result){
            $("#nickname > a").html("Done");
            setTimeout(function(){
                $("#nickname > a").html("Change");
            }, 5000);
        }, function(error){
            $("#nickname > a").html("Failed");
            setTimeout(function(){
                $("#nickname > a").html("Change");
            }, 5000);
        });
}

function subscribeToRoom(session, room)
{
    session.subscribe(_room, function(uri, payload){
        appendChat(payload.from, payload.msg);
    });
}


function publishChat(session)
{
    if (!_room)
        return;

    var msg = $("#chat-input").val();
    $("#chat-input").val("");

    session.publish(_room, msg);
}

/**
 * This would be better off written with a proper javascript framework, like BackBone.js
 *
 *
 *
 */

var _room = null;

function joinChatRoom(session)
{
    if (_room)
    {
        session.unsubscribe(_room); //ensure they are only in 1 room at a time
    }

    var roomName = $("#chatroom").val();

    $("#chat-title").html(roomName);


    $("#chat-pane").find("ul").html("");

    _room = "chat/" + $("#chatroom").val(); //set the room URI

    subscribeToRoom(session, _room);
}


function appendChat(from, msg)
{
    $("#chat-pane").find("ul").append("<li>"+from+": " + msg + "</li>");
}


function bindUi(session)
{
    $("#join-chat").bind("click", function(e){
        e.preventDefault();
        joinChatRoom(session);
    });

    $("#chatroom").bind("keypress", function(e){
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13) { //Enter keycode
            joinChatRoom(session);
        }
    });

    $("#send-chat").bind("click", function(e){
        e.preventDefault();
        publishChat(session)
    });

    $("#chat-input").bind("keypress", function(e){
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13) { //Enter keycode
            publishChat(session);
        }
    });

    $("#nickname > input").bind("keypress", function(e){
        var code = (e.keyCode ? e.keyCode : e.which);
        if(code == 13) { //Enter keycode
            changeNickname(session);
        }
    });

    $("#nickname > a").bind("click", function(e){
        e.preventDefault();
        changeNickname(session);
    });
}

// attempt to clean up on disconnect.
function unbindUi()
{
    $("#join-chat").unbind();
    $("#chatroom").unbind();

    $("#send-chat").unbind();
    $("#chat-input").unbind();
}