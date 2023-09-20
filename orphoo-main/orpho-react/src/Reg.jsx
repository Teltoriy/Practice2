import React from 'react'
import { useNavigate } from 'react-router-dom'
import Form from './UI/Form.jsx'
function Reg(props)
{   
    const navigate = useNavigate()
    React.useEffect(() =>
    {
        RegForm(navigate)
    })
    return (
        <Form></Form>
    )
    
}
export default Reg;
function RegForm(navigate)
{
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
    fetch('/register', {
    method : 'POST',
    body: JSON.stringify(data),
    headers : 
    {
        'Content-Type' : 'application/json'
    }})
    const {ok, key} = await response.json()
    if (ok)
    {
        form.querySelector('#nick').value = ''
        form.querySelector('#pass').value = ''
        setCookie('key', key)
        navigate('/')
    }
    else
    {
        alert('С вашими данными что-то не так. Длина ника и пароля должна быть от 8 до 24 символов, при этом ник не должен быть зарегистрирован.')
    }
})

}
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