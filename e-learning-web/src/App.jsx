import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Path from './utils/path'
import Public from './pages/Public'
import Home from './pages/Home'


function App() {


  return (
    <div className=''>
      <Routes>
        <Route path={Path.PUBLIC} element={<Public />}>
          <Route path={Path.HOME} element={<Home />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
