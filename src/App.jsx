import { useState } from 'react'
import Login from './Components/Login'
import { AuthProvider } from './Context/auth'
import { BrowserRouter } from 'react-router-dom'
import Footer from './Components/Footer';

function App() {
  const [isAuth, setIsAuth] = useState(false); 

  return (
    <AuthProvider value={{ isAuth, setIsAuth }}>
    <BrowserRouter>
    <Login/>
    <Footer/>
    </BrowserRouter>
  </AuthProvider>
  
  )
}

export default App
