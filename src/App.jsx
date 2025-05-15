import { useState } from "react";
import { ContextProvider } from "./Context/FilterContaext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "./Components/ProductList/ProductList";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import Wishlist from "./Pages/Wishlist";
import MainCart from "./Components/Cart/MainCart";
import CheckoutForm from "./components/Checkout/CheckoutForm";
import PaymentSuccess from "./components/Checkout/PaymentSuccess";
import { Toaster } from 'react-hot-toast';
import HomePage from "./Pages/HomePage/homepage";
import Login from "./Pages/LoginPage/Login";
import { AuthProvider } from "./Context/auth";
import NavBar from "./components/HomeComponents/navbar";
import Footer from "./components/HomeComponents/footer";

function App() {
  const [Filteration, setFilteration] = useState();
  const [cartProducts, setcartProducts] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const contextObject = {
    Filteration,
    setFilteration,
    cartProducts,
    setcartProducts,
  };

  return (
    <ContextProvider value={contextObject}>
      <AuthProvider value={{ isAuth, setIsAuth }}>
        <BrowserRouter>
           <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/ProductList" element={<ProductList />} />
            <Route path="/productDetails" element={<ProductDetails />} />
            <Route path="/Wishlist" element={<Wishlist />} />
            <Route path="/MainCart" element={<MainCart />} />
            <Route path="/CheckoutForm" element={<CheckoutForm />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
          </Routes>
          <Footer />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>

    </ContextProvider>
  );
}

export default App;
