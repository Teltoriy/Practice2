function onMessage(data, socket, {sockets, users}) 
{
    
    let stringData, message
    stringData = data.toString('utf8')
    
    try 
    {
        message = JSON.parse(data)
        if (message.image)
            message.image = JSON.parse(message.image)
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
    chatMessage({content, key, image, messageKey}, {users, sockets, socket})
    {
        if (!(key in users)) return
        const nickname = users[key]
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