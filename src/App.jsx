import React, { useState } from "react";

import { Box } from "@mui/material";
import { ContextProvider } from "./Context/FilterContaext";
// import ProductContainer from "./components/ProductContainer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./App.css";
import ProductList from "./components/ProductList/ProductList";
import ProductDetails from "./components/ProductDetails/ProductDetails";

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
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
