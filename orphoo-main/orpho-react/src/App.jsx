
import './styles/App.css'
import {useNavigate} from 'react-router-dom'
import {useEffect, useLayoutEffect} from 'react'
import imageCompression from 'browser-image-compression'
let messages = new Set()
function App() {
  const navigate = useNavigate()
  const key = getCookie('key')
  
  useEffect( () => {
    // window.history.pushState(null, 'orphoo', window.location.origin)
    Fetch(navigate, key)
  }, []);
  
  return (
    <div className="App">
      <div className="chat">
                
      
            <div className="view"> 
            {/* <div className="message">
                <div className="author">QWERTY</div>
                <div className="data">Test Message</div>
                <div className='timestamp'>27 aug 16:30</div>
              </div> */}
              <div className="message preview"><div className="author"></div><div className="data"><i>Начало переписки</i></div></div>
            </div>
            
            <form className="send">
              <input id="msg-file" type= "file" accept='image/*' onChange={onAddImage} onClick = {onclickAddImage}></input>
              <label htmlFor = "msg-file"></label> 
              <div contentEditable type="text" className="msg-field" onKeyDown={onShiftEnter} placeholder = {"Сообщение"}></div>
              <input type="submit" className ="msg-submit" value={''}></input>
            </form>
        </div>
    </div>
  );
}
export default App;
function getCookie(name) 
{
  let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
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
async function Fetch(navigate, key)
{
  if (!key) navigate('/log')
    else 
    {
      let response = await (fetch('/fetch', {
        method : 'POST',
        body: JSON.stringify({key}),
        headers : 
        {
            'Content-Type' : 'application/json'
        }}))
      const body = (await response.json())
      if (body.ok && body.nickname) 
      {
        window.nickname = body.nickname
        Chat()
      }
      else
      {
        setCookie('key', '', {'max-age' : -1})
        navigate('/log')
      }
    }
}
const wsHandlers = 
{
    
    pong(data)
    {
        if (data == 'pong')
        {
          const pingDelay = Date.now() - window.pingTime
          console.log('ping ' + pingDelay +'ms')
        }
    },
    fetchMessage(data)
    {
        let parsedData;
        try
        {
          parsedData = JSON.parse(data)
        }
        catch(err)
        {
          return
        }
        
        const {content, author, createDate, image, client, messageKey} = parsedData
        let Imagecontent
        if (image)
        {
          let key;
          let imageList = [] 
          for (key in image)
          {
            imageList.push(image[key])
          }
           Imagecontent = new Uint8Array(imageList)
        }
        if (!((content || image) && author && createDate)) return;
        const authorDOM = document.createElement('div')
              authorDOM.className = 'author'
        const contentDOM = document.createElement('div')
              contentDOM.className = 'data'
        const timestampDOM = document.createElement('div')
              timestampDOM.className = 'timestamp'
        const messageDOM = document.createElement('div')
              messageDOM.className = 'message'

        contentDOM.innerText = content
        const messageDate = new Date(createDate)
        timestampDOM.innerText = (add0(messageDate.getHours()) +':' + add0(messageDate.getMinutes()))
        authorDOM.textContent = author || 'Анонимус'
        messageDOM.append(authorDOM)
        messageDOM.append(contentDOM)
        messageDOM.append(timestampDOM)
        if (Imagecontent)
        {
          const ImageDOM = document.createElement('img')
          ImageDOM.className = 'image'
          ImageDOM.src = URL.createObjectURL(
            new Blob([Imagecontent.buffer]))
          messageDOM.append(ImageDOM)
        }
        if (client)
        {
          messageDOM.classList.add('client')
          authorDOM.classList.add('client')
        }
        const view = document.querySelector('.view')
        view.prepend(messageDOM)
        view.scrollTop = Infinity; 
        
        messages.delete(messageKey)
        if (messages.size < 1)
        {
          setTimeout(() =>
          {
            document.querySelector('.send .msg-field').disabled = false
            document.querySelector('.send input.msg-submit').disabled = false
          }, 600)
          
        } 

        const Mfile = Math.round((Math.random())*30)
        let audio = new Audio(`/music/gachi/incoming/${Mfile}.mp3`)
        audio.volume = 0.3
        audio.play()
    } 
}
function createSocket()
{ 
  if(window.socket)
  {
    window.socket.close()
  }
  const socket = new WebSocket(window.location.origin.replace(/^http/, 'ws'))
  return socket
}
async function Send(message)
{
  await window.socket.send(JSON.stringify(message))
}
let submitForm;
function Chat()
{ 
  /* начало */ 
  window.socket = createSocket()
  function ping()
  {
    window.socket.send('ping')
    window.pingTime = Date.now()
  }
  setInterval(() => {
    ping()
    if (window.socket.readyState > 1)
    {
      window.socket = createSocket()
    }
  }, 10000);
  window.socket.onmessage = (event) =>
  {
    let key;
    for (key in wsHandlers)
    {
        (wsHandlers[key])(event.data, event)
    }
  }
  
  [...document.getElementsByClassName('send')].forEach(send => 
      {
        send.addEventListener('submit', (event) =>
          {
            event.preventDefault()

            submit(event.target).catch(err => console.log(err)).then(() =>
            {
              send.reset()
            })
          })
      })
  
  async function submit(target)
  {   
      

      
      const send = target.closest('.send')
      const field = send.querySelector('.msg-field')
      const image = send.querySelector('#msg-file').files[0]
      let loadImage;
      if (!field.innerText && !image) return;
      const messageKey = createUniqueKey();
      send.querySelector('.msg-submit').disabled = true
      send.querySelector('.msg-field').disabled = true
      setTimeout(() => {
        send.querySelector('.msg-submit').disabled = false
        send.querySelector('.msg-field').disabled = false
      }, 30000);
      if (image)
      {
        const reader = new FileReader()
        const options = 
        {
          maxSizeMB: 0.25,
          maxWidthOrHeight: 400,
          useWebWorker: true
        }
        const compressedImage = await imageCompression(image, options)
        reader.readAsArrayBuffer(compressedImage)
        loadImage = new Promise(async function(resolve, reject) 
        {
          if (!image)
            reject('no image')
          setTimeout(() =>
          {
            reject('timeout')
          }, 10000)
          reader.onload = ev =>
          {
            resolve(reader.result)
          }
        })
        loadImage.catch(err =>
          {
            alert('Непредвиденная ошибка. Текст ошибки: ' + err)
          })
      }
      
      const message = 
      {
        content : field.innerText,
        key : getCookie('key'),
        image : loadImage ? JSON.stringify(new Uint8Array(await loadImage)) : undefined,
        messageKey : messageKey
      }
      await Send(message)
      field.textContent = ''
      clearImageIcon(send.querySelector('#msg-file'))
  }
  submitForm = submit;
}
function onShiftEnter(ev)
{
 
  if ((ev.key != 'Enter') || (!ev.shiftKey)) return ;
  ev.preventDefault()
  const form = ev.target.parentNode
  submitForm(form.querySelector('.msg-submit'))
}
function onAddImage(ev)
{
  if (ev.target.files.length)
  {
    ev.target.closest('.send').querySelector('label').classList.add('active')
    ev.target.closest('.send').querySelector('.msg-field').setAttribute('placeholder', 'Ого! Вы прикрепили картинку!')
  }
}
function onclickAddImage(ev)
{
  clearImageIcon(ev.target, ev)
}
function clearImageIcon(target, ev)
{
  if (target.closest('.send').querySelector('label').classList.contains('active'))
  {
    if (ev) ev.preventDefault();
    target.value = ''
    target.closest('.send').querySelector('label').classList.remove('active')
    target.closest('.send').querySelector('.msg-field').setAttribute('placeholder', 'Сообщение')
  }
}
function createUniqueKey()
{
  let id;
  do
  {
    id = Math.random().toString().slice(2,9)
  } 
  while (id in messages)
  messages.add(id)
  return id
}
function add0(num)
{
  let string = '' + num
  if (string.length === 1)
  {
    string = '0' + string
  }
  return string
}
