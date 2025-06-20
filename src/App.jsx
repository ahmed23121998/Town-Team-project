import { useState, useEffect } from "react";
import { ContextProvider } from "./Context/FilterContaext";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProductList from "./component/ProductList/ProductList.jsx";
import ProductDetails from "./component/ProductDetails/ProductDetails.jsx";
import Wishlist from "./Pages/Wishlist";
import MainCart from "./component/Cart/MainCart.jsx";
import CheckoutForm from "./component/Checkout/CheckoutForm.jsx";
import PaymentSuccess from "./component/Checkout/PaymentSuccess.jsx";
import { Toaster } from "react-hot-toast";
import HomePage from "./Pages/HomePage/homepage";
import Login from "./Pages/LoginPage/Login";
import { AuthProvider } from "./Context/auth";
import NavBar from "./component/HomeComponents/navbar.jsx";
import Footer from "./component/HomeComponents/Footer.jsx";
import { useTranslation } from "react-i18next";
import AIContextProvider from "./AI-CHAT-PUT/context/aiTownteam.jsx";
import MainPage from "./AI-CHAT-PUT/components/MainPage/MianPage";
import Profile from "./Pages/Profile.jsx";
import NotFound from "./Pages/NotFound.jsx";
import { getCartItems } from "./component/cartUtils.jsx";

function AppContent() {
  const [Filteration, setFilteration] = useState();
  const [cartProducts, setcartProducts] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [fav, setFav] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [position, setPosition] = useState("");
  const [UPname, setUPname] = useState("");
  const [UPmail, setUPmail] = useState("");
  const [UPPassword, setUPPassword] = useState("");
  const cartItemsLength = cartItems.length;

  const [userId] = useState(localStorage.getItem("userId") || null);

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
    cartItemsLength,
    UPname,
    setUPname,
    UPmail,
    setUPmail,
    UPPassword,
    setUPPassword,
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getCartItems(userId);
        setCartItems(items);
      } catch (err) {
        console.log(err);

        console.error(err);
      }
    };

    fetchCartItems();
  }, [userId, setCartItems]);

  const location = useLocation();
  // Determine if the current location matches any of the explicitly hidden paths
  const isExplicitlyHidden = [
    "/login",
    "/Profile",
    "/payment-success",
  ].includes(location.pathname);

  // Check if the location matches any of the defined routes *before* the catch-all route
  // This assumes the catch-all route is the last one defined.
  // If no route before the catch-all matches, we are on the 404 page.
  const definedRoutes = [
    "/",
    "/ProductList",
    "/productDetails",
    "/Wishlist",
    "/MainCart",
    "/CheckoutForm",
    "/ai-chat",
    "/search",
  ];

  const isDefinedRoute = definedRoutes.includes(location.pathname);

  // Hide nav and footer if explicitly hidden or if it's not a defined route (meaning it's the 404 page)
  const hideNavAndFooter = isExplicitlyHidden || !isDefinedRoute;

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
            <Route path="*" element={<NotFound />} />
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
