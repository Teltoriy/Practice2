const pg = require('pg')
const client = new pg.Client({
    ssl: false,
    host: "localhost",
    user : "postgres",
    password : "livmas",
    database : "shit",
    port : 5432
  });
client.connect()
const db = 
{
    inputUser({nickname, password})
    {
        // inputUser({_email : 'example3@gmail.com', _nickname : 'exampleNickname3', _password : '3'})
        return client.query('insert into users (nickname, password) values ($1::text, $2::text)', [nickname, password]);
    } , 
    getByNick(nickname)
    {
        return client.query('select * from users where nickname = $1::text', [nickname])
    },
    insertMessage(content, user_id, date) {
        return client.query('insert into messages (content, user_id, date) values ($1::text, $2::int, $3::text)', [content, user_id, date])
    },
}
module.exports = db