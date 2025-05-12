import { useState } from "react";
import { ContextProvider } from "./Context/FilterContaext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "./Components/ProductList/ProductList";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import Wishlist from "./Pages/Wishlist";
import MainCart from "./components/Cart/MainCart";

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
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
