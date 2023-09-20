const form = document.querySelector('.Reg')
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
    fetch(location.origin + '/login', {
    method : 'POST',
    body: JSON.stringify(data),
    headers : 
    {
        'Content-Type' : 'application/json'
    }})
    const body = await response.json();
    if (body.ok)
    {
        setCookie('key', body.key)
        location.replace('/')
    }
    else
    {
        alert(body.reason)
    }
})

function setCookie(name, value, options = {}) {

    options = {
      path: '/',
      // при необходимости добавьте другие значения по умолчанию
      ...options
    };
  
    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }
  
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  
    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }
  
    document.cookie = updatedCookie;
  }