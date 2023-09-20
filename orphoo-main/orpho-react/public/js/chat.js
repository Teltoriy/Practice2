
var socket = new WebSocket(location.origin.replace(/^http/, 'ws'))
const wsHandlers = 
{
    pong(data)
    {
        if (data == 'ping') 
        {
            console.log(data)
        }
    },
    fetchMessage(data)
    {
        const {content, author, createDate} = data
        if (!(content && author && createDate)) return;
        const authorDOM = document.createElement('div')
        authorDOM.className = 'author'
        const contentDOM = document.createElement('div')
        contentDOM.className = 'data'
        const messageDOM = document.createElement('div')
        messageDOM.className = 'message'
        contentDOM.textContent = content
        authorDOM.textContent = author || 'Анонимус'
        message.append(author)
        message.append(data)
        document.querySelector('.view').prepend(message)
    }
    
}
setInterval(() => {
    socket.send('ping')
}, 10000);
socket.onmessage = (data) =>
{   
    for (handler in wsHandlers)
    {
        handler(data)
    }
}

[...document.getElementsByClassName('send')].forEach(send => 
    {
        const btn = send.querySelector('.msg-submit')
        const field = send.querySelector('.msg-field')
        btn.addEventListener('click', (ev) => submit(btn))
        field.addEventListener('keydown', (ev) => 
        {
            if (ev.key == 'Enter')
            {
                submit(btn)
            }
        })
    }
    )
function submit(target)
{
    const send = target.closest('.send')
    const field = send.querySelector('.msg-field')

    if (socket.readyState == socket.CLOSED)
    {
        console.log('reopening')
        socket.close()
        socket = new WebSocket(location.origin.replace(/^http/, 'ws'))
    }
    function Send()
    {
        socket.send(field.value)
    }
    try
    {
        Send()
    }
    catch(err)
    {
        setTimeout(Send, 5000)
    }
    field.value = ''
}
