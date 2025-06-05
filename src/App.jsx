import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './pages/layout'
import Home from './pages/home/page'
import SignIn from './pages/auth/signIn'
import SignUp from './pages/auth/signUp'
import Verification from './pages/auth/verification'

function App() {
  return (<BrowserRouter>
    <Routes>
      <Route path='/*' element={<Layout/>}>
        <Route path='' element={<Home/>}/>
        <Route path='auth/signIn' element={<SignIn/>}/>
        <Route path='auth/signUp' element={<SignUp/>}/>
        <Route path='auth/verification' element={<Verification/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App
