import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './pages/layout'
import Home from './pages/home/page'
import SignIn from './pages/auth/signIn'
import SignUp from './pages/auth/signUp'
import Verification from './pages/auth/verification'
import NewPanel from './pages/AddPanel/newPanel'
import DetailsPanel from './pages/ads/detailsPanel'

function App() {
  return (<BrowserRouter>
    <Routes>
      <Route path='/*' element={<Layout/>}>
        <Route path='' element={<Home/>}/>
        <Route path='auth/signIn' element={<SignIn/>}/>
        <Route path='auth/signUp' element={<SignUp/>}/>
        <Route path='auth/verification' element={<Verification/>}/>
        <Route path='smm-panel/new' element={<NewPanel/>}/>
        <Route path='smm-panel/:name' element={<DetailsPanel/>} />
      </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App
