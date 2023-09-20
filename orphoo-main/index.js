process.env.PORT = 80;
const express = require('express')
const {Server} = require('ws')
const app = express()
app.use(/*process.env.PORT ? express.static('./build') : */express.static('./build'))
const http = require('http')
const server = http.createServer(app)
const wsServer = new Server({server, maxPayload: 8*1024*1024})
const Message = require('./Message')
const bodyParser = require('body-parser')
const formidable = require('express-formidable')
const {v4} = require('uuid')
const db = require('./db')
const {onMessage} = require('./wsEvents/message')
const users = {}
let sockets = new Set()

wsServer.on('connection', (socket) =>
{
    sockets.add(socket)
    socket.on('message', (data) => onMessage(data, socket, {sockets, users}))
    socket.on('error', (err) =>
    {
        if (err.message == 'Max payload size exceeded') return
        else console.log(err)
    })
})
app.use(bodyParser.urlencoded({ extended: false }))
app.post('/register', bodyParser.json(), async (req, res) =>
{
    if (!req.body) return;
    const nickname = req.body.nickname
    const password = req.body.password
    if (!nickname || !password) return;
    if (checkDigitsLetters8_24(nickname) && checkDigitsLetters8_24(password) && !((await db.getByNick(nickname)).rowCount))
        {
            await db.inputUser({nickname, password})
            res.json({ok : true, key : createUniqueKey(nickname)})
        }
    else
        res.json({ok : false})
})
app.post('/login', bodyParser.json(), async(req, res) =>
{
    if (!req.body) return;
    const nickname = req.body.nickname
    const password = req.body.password
    if (!nickname || !password) return;
    if (checkDigitsLetters8_24(nickname) && checkDigitsLetters8_24(password))
    {
        
        if ((await db.getByNick(nickname)).rowCount)
        {
            const user = (await db.getByNick(nickname)).rows[0]
            if (password == user.password)
            {
                res.json({ok : true, key : createUniqueKey(nickname)})
            }
            else
            {
                res.json({ok : false, reason : 'Неправильный пароль или имя пользователя'})
            }
        }
        else
            res.json({ok : false, reason : 'Неправильный пароль или имя пользователя'})
    }
    else res.json({ok : false, reason : 'Неправильный пароль или имя пользователя'})
})
app.post('/fetch', bodyParser.json(), (req, res) =>
{
    if (!req.body) return
    if (!req.body.key) return
    if (req.body.key in users)
    {
        res.json({ok : true, nickname:  users[req.body.key]})
    }
    else
    {
        res.json({ok : false, reason : 'Ваш ключ устарел! Залогиньтесь снова'})
    }
    
})
server.listen(process.env.PORT || 5000)

function checkDigitsLetters8_24(string)
{
    test = /^[A-Za-zА-Яа-я0-9]{8,24}$/
    return string.match(test)
}

function createUniqueKey(nickname)
{
    let key;
    do 
    {
        key = v4()
    }
    while (key in users)
    users[key] = nickname
   
    return key;
}