import React, { useState, useEffect } from 'react';
import openSocket from 'socket.io-client';
import './ChatApp.css';

const socket = openSocket('http://localhost:7001');
function ChatApp(props) {

    const [ localUser, setLocalUser ] = useState('')
    const [ remoteUser, setRemoteUser ] = useState('')
    const [ message, setMessage ] = useState('')
    const [ messages, setMessages ] = useState([])

    socket.on('assign-socket', function(id) {
        console.log(id)
        setLocalUser(id)
    })

    socket.on('assign-remote', function(id) {
        setRemoteUser(id)
        console.log('remote set')
    })

    useEffect(() => {
        socket.on('send-chat-to-client', function(data){
            // setMessages(messages.concat(data))
            setMessages(messages => [...messages, data])
        })
    }, [])

    function sendChat() {
        socket.emit('send-chat-to-server', { message: message, remoteUser: remoteUser, localUser: localUser })
        setMessage('')
    }

    function handleChange(event) {
        setMessage(event.target.value)
    }

    return (
        <div className="chat-main">
            {/* <FriendList /> */}
            <h3>Chat between {localUser} and {remoteUser}</h3>
            <ul>
                {messages.map(item => <li>{item}</li>)}
            </ul>
            <input value={message} name='message' placeholder='Chat' onChange={handleChange}/>
            <button onClick={() => sendChat()}>Send</button>
        </div>
    );
}

export default ChatApp;
