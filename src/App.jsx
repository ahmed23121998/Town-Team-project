import { useState, useEffect } from "react";
import { ContextProvider } from "./Context/FilterContaext";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProductList from "./component/ProductList/ProductList.jsx";
import ProductDetails from "./component/ProductDetails/ProductDetails.js";
import Wishlist from "./Pages/Wishlist";
import MainCart from "./component/Cart/MainCart.js";
import CheckoutForm from "./component/Checkout/CheckoutForm.js";
import PaymentSuccess from "./component/Checkout/PaymentSuccess.js";
import { Toaster } from "react-hot-toast";
import HomePage from "./Pages/HomePage/homepage";
import Login from "./Pages/LoginPage/Login";
import { AuthProvider } from "./Context/auth";
import NavBar from "./component/HomeComponents/navbar.js";
import Footer from "./component/HomeComponents/Footer.js";
import { useTranslation } from "react-i18next";
import AIContextProvider from "./AI-CHAT-PUT/context/aiTownteam.jsx";
import MainPage from "./AI-CHAT-PUT/components/MainPage/MianPage";
import Profile from "./Pages/Profile.jsx";

function AppContent() {
  const [Filteration, setFilteration] = useState();
  const [cartProducts, setcartProducts] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [fav, setFav] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [position, setPosition] = useState("");

  const contextObject = {
    Filteration,
    setFilteration,
    cartProducts,
    setcartProducts,
    setFav,
    fav,
    cartItems,
    setCartItems,
    position,
  };

  const location = useLocation();
  const hideNavAndFooter =
    location.pathname === "/login" || location.pathname === "/Profile";

  const { i18n } = useTranslation();
  useEffect(() => {
    if (i18n.language === "ar" || i18n.language === "AR") {
      document.documentElement.dir = "rtl";
      setPosition("right");
    } else {
      document.documentElement.dir = "ltr";
      setPosition("left");
    }
  }, [i18n.language]);

  return (
    <ContextProvider value={contextObject}>
      <AuthProvider value={{ isAuth, setIsAuth }}>
        <AIContextProvider>
          {!hideNavAndFooter && <NavBar />}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/ProductList" element={<ProductList />} />
            <Route path="/productDetails" element={<ProductDetails />} />
            <Route path="/Wishlist" element={<Wishlist />} />
            <Route path="/MainCart" element={<MainCart />} />
            <Route path="/CheckoutForm" element={<CheckoutForm />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/ai-chat" element={<MainPage />} />
            <Route path="/search" element={<ProductList />} />
          </Routes>
          {!hideNavAndFooter && <Footer />}
          <Toaster />
        </AIContextProvider>
      </AuthProvider>
    </ContextProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
