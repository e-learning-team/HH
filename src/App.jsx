import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Path from './utils/path'
import Public from './pages/Public'
import Home from './pages/Home'
import Login from './components/Login/Login'
import Register from './components/Register/Register'


function App() {
  return (
    <div className=''>
      <Routes>
        <Route path={Path.PUBLIC} element={<Public />}>
          <Route path={Path.HOME} element={<Home />} />
          <Route path={Path.LOGIN} element={<Login />} />
          <Route path={Path.REGISTER} element={<Register />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
