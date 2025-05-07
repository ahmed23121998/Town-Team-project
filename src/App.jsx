import HomePage from "./Pages/HomePage/homepage";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./Pages/LoginPage/Login";
import { AuthProvider } from "./Context/auth"; 
import { useState } from 'react'
import NavBar from "./components/HomeComponents/navbar";
import Footer from "./components/HomeComponents/footer";
function App() {
  const [isAuth, setIsAuth] = useState(false); 
  return (
    <AuthProvider value={{ isAuth, setIsAuth }}> 
      <BrowserRouter>
      {/* <NavBar /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </AuthProvider>
     
  )
}

export default App
