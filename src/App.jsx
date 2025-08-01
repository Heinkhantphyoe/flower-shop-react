import { useState } from 'react'
import reactLogo from './assets/react.svg'
import AppRouter from './router/AppRouter'
import { ToastContainer } from 'react-toastify'

function App() {

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000}  newestOnTop/>
      <AppRouter />
    </>

  )
}

export default App
