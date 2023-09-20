import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {Routes, Route} from 'react-router-dom'
import App from './App';
import Reg from './Reg'
import Log from './Log'
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* <App /> */}
    <BrowserRouter>
      {/* <Reg></Reg> */}
      <Routes>
        <Route path = '/log' element = {<Log></Log>} ></Route>
        <Route path = '/reg' element = {<Reg></Reg>}></Route>
        <Route path = '/' element = {<App></App>}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

