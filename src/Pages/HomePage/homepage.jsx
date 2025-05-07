import Footer from "../../components/HomeComponents/footer";
import Header from "../../components/HomeComponents/header";
import NavBar from "../../components/HomeComponents/navbar";
import Sections from "../../components/HomeComponents/sections";
import { useState } from 'react'
import { AuthProvider } from './../../Context/auth'

export default function HomePage() {

  const [isAuth, setIsAuth] = useState(false);
  return (
    <>
      <NavBar />
      <Header />
      <Sections />
      <AuthProvider value={{ isAuth, setIsAuth }}>
        <Footer />
      </AuthProvider>
    </>
  )
}