const fs = require('fs');
const db = require('../db')

function onMessage(data, socket, {sockets, users})
{
    
    let stringData, message
    stringData = data.toString('utf8')
    
    try 
    {
        message = JSON.parse(data)
        if (message.image) {
            message.image = JSON.parse(message.image)
        }
    }

    catch (err)
    {
 
        socket.send('pong')
        return
    }

    for (let key in handlers)
    {
        handlers[key](message, {socket, sockets, users})
    }
}
module.exports.onMessage = onMessage
const handlers = 
{
    async chatMessage({content, key, image, messageKey}, {users, sockets, socket})
    {
        if (!(key in users)) return
        const nickname = users[key]

        const user = (await db.getByNick(nickname)).rows[0]
        if (content !== "")
            db.insertMessage(content, user.id, Date.now().toString())

        for (let skt of sockets)
        {
            if (skt === socket) 
            {
                skt.send(JSON.stringify({author : nickname, content, createDate : Date.now(), image, client : true, messageKey}))
                continue
            }

            skt.send(
                JSON.stringify({author : nickname, content, createDate : Date.now(), image}))
        }
    }
}