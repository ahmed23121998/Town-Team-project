import React, { useState } from "react";

import { ContextProvider } from "./Context/FilterContaext";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProductList from "./components/ProductList/ProductList";
import ProductDetails from "./components/ProductDetails/ProductDetails";
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
          <Route path="/MainCart" element={<MainCart />} />
          <Route path="/productDetails" element={<ProductDetails />} />
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
