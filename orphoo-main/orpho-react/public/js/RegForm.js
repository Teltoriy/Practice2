const form = document.getElementById('reg')

form.addEventListener('submit', async (event) =>
{
    event.preventDefault()
    const nick = form.querySelector('#nick').value
    const pass = form.querySelector('#pass').value
    const data = 
    {
        nickname : nick, 
        password : pass
    }
    let response = await
    fetch(location.origin + '/register', {
    method : 'POST',
    body: JSON.stringify(data),
    headers : 
    {
        'Content-Type' : 'application/json'
    }})
    const {ok} = await response.json()
    if (ok)
    {
        form.querySelector('#nick').value = ''
        form.querySelector('#pass').value = ''
        location.reload()
    }
    else
    {
        alert('С вашими данными что-то не так. Длина ника и пароля должна быть от 8 до 24 символов, при этом ник не должен быть зарегистрирован.')
    }
})
