wsHandlers = 
{
    ping({socket, data})
    {
        if (data == 'ping') 
        {
            socket.send('pong')
        }
    },
    broadcast({socket, data, listSockets})
    {
        if (data.content && data.author && data.createDate)
        {
            for (skt in listSockets)
            {
                skt.send(data)
            }
        }
    }
}