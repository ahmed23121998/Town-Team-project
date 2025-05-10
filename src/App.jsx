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

function App() {
  const [Filteration, setFilteration] = useState();
  const [cartProducts, setcartProducts] = useState([]);
  const contextObject = {
    Filteration,
    setFilteration,
    cartProducts,
    setcartProducts,
  };

  return (
    <ContextProvider value={contextObject}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/productDetails" element={<ProductDetails />} />
          <Route path="/Wishlist" element={<Wishlist />} />
          <Route path="/MainCart" element={<MainCart />} />
            <Route path="/CheckoutForm" element={<CheckoutForm />} />
         <Route path="/payment-success" element={<PaymentSuccess />} /> 
        </Routes>
            <Toaster />
      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
