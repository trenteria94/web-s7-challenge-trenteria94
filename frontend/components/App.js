import React from 'react'
import Home from './Home'
import Form from './Form'
import { Link, Route, Routes } from 'react-router-dom'
function App() {
  return (
    <div id="app">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/order">Order</Link>
        {/* NavLinks here */}
      </nav>
      <Routes>
        {/* Route and Routes here */}
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Form />} />
      </Routes>
    </div>
  )
}

export default App
