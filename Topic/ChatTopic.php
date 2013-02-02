<?php

namespace JDare\ClankChatBundle\Topic;

use Ratchet\ConnectionInterface as Conn;

use JDare\ClankBundle\Server\App\Handler\TopicHandlerInterface;

class ChatTopic implements TopicHandlerInterface
{
    /**
     * Announce to this topic that someone else has joined the chat room
     *
     * Also, set their nickname to Guest if it doesnt exist.
     *
     * @param \Ratchet\ConnectionInterface $conn
     * @param $topic
     */
    public function onSubscribe(Conn $conn, $topic)
    {
        if (!isset($conn->ChatNickname))
        {
            $conn->ChatNickname = "Guest";
        }

        $msg = $conn->ChatNickname . " joined the chat room.";

        $topic->broadcast(array("msg" => $msg, "from" => "System"));
    }

    /**
     * Announce person left chat room
     *
     * @param \Ratchet\ConnectionInterface $conn
     * @param $topic
     */
    public function onUnSubscribe(Conn $conn, $topic)
    {
        $msg = $conn->ChatNickname . " left the chat room.";

        $topic->broadcast(array("msg" => $msg, "from" => "System"));
    }

    /**
     * Do some nice things like strip html/xss etc. then pass along the message
     *
     * @param \Ratchet\ConnectionInterface $conn
     * @param $topic
     * @param $event
     * @param array $exclude
     * @param array $eligible
     */
    public function onPublish(Conn $conn, $topic, $event, array $exclude, array $eligible)
    {
        $event = htmlentities($event); // removing html/js

        $topic->broadcast(array("msg" => $event, "from" => $conn->ChatNickname));
    }
}