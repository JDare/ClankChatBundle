<?php

namespace JDare\ClankChatBundle\RPC;

use Ratchet\ConnectionInterface as Conn;

class ChatService
{
    public function changeNickname(Conn $conn, $params)
    {
        if (!isset($params['nickname']))
        {
            return false;
        }

        //We can assign any key => value pair to this connection due to the magic getters & setters
        // see more at http://socketo.me/api/class-Ratchet.AbstractConnectionDecorator.html

        $conn->ChatNickname = htmlentities($params['nickname']);
        return true; //this sends a positive result back to the client
    }
}