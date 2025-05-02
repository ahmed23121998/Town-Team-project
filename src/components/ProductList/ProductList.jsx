import React, { useContext, useEffect, useState, useMemo } from "react";
import { db } from "../../Firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ProductCard from "../ProductCard/ProductCard";
import FiltereTheProducts from "../Filtration/FiltereTheProducts";
import Subcart from "../Cart/Subcart";
import { MyContext } from "../../Context/FilterContaext";
import "./ProductList.css";

const theme = createTheme({
  palette: {
    primary: { main: "#ffeb3b" },
    secondary: { main: "#f44336" },
  },
});

const ProductList = ({ category }) => {
  const { Filteration } = useContext(MyContext);
  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(false);

  const normalizeFilterValue = (value) => {
    return String(value).toLowerCase().trim().replace(/['"]/g, "");
  };

  const toggleCart = () => {
    setCart(!cart);
  };
  const filterProducts = (data, filters) => {
    if (!filters || !data.length) return data;

    return data.filter((product) => {
      if (filters.availability) {
        const inStock = product.in_stock || product.quantity > 0;
        if (filters.availability.inStock && !inStock) return false;
        if (filters.availability.outOfStock && inStock) return false;
      }

      if (filters.price) {
        const price = product.price?.amount || 0;
        if (price < (filters.price.min || 0)) return false;
        if (price > (filters.price.max || Infinity)) return false;
      }

      if (filters.brand) {
        const productBrands = Array.isArray(product.brand)
          ? product.brand.map(normalizeFilterValue)
          : [normalizeFilterValue(product.brand || "")];
        const activeBrands = Object.keys(filters.brand)
          .filter((b) => filters.brand[b])
          .map(normalizeFilterValue);
        if (activeBrands.length > 0) {
          if (!productBrands.some((brand) => activeBrands.includes(brand)))
            return false;
        }
      }

      if (filters.size) {
        const productSizes = (product.sizes || []).map(normalizeFilterValue);
        const activeSizes = Object.keys(filters.size)
          .filter((s) => filters.size[s])
          .map(normalizeFilterValue);
        if (activeSizes.length > 0) {
          if (!productSizes.some((size) => activeSizes.includes(size)))
            return false;
        }
      }

      if (filters.color) {
        const productColors = (product.colors || []).map(normalizeFilterValue);
        const activeColors = Object.keys(filters.color)
          .filter((c) => filters.color[c])
          .map(normalizeFilterValue);
        if (activeColors.length > 0) {
          if (!productColors.some((color) => activeColors.includes(color)))
            return false;
        }
      }

      return true;
    });
  };

  const filterString = useMemo(
    () => JSON.stringify(Filteration),
    [Filteration]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const collectionPath = [category || "men", "closes", "Boys Pullovers"];
        console.log("Fetching from collection:", collectionPath.join("/"));

        const colRef = collection(db, ...collectionPath);
        const snapshot = await getDocs(colRef);

        if (snapshot.empty) {
          setError("No products found in this category");
          setRawProducts([]);
          return;
        }

        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            ...docData,
            brand: docData.brand || ["Unknown Brand"],
            colors: docData.colors || [],
            sizes: (docData.sizes || []).map((s) => s.replace(/['"]/g, "")),
            price: {
              amount: docData.price?.amount || 0,
              currencyCode: docData.price?.currencyCode || "USD",
            },
            in_stock: docData.in_stock || false,
            quantity: docData.quantity || 0,
            title: docData.title || "Untitled Product",
            image: docData.image || "",
          };
        });

        console.log("Raw data from Firestore:", data);
        setRawProducts(data);
      } catch (error) {
        console.error("Firebase error:", error);
        setError(`Failed to load products: ${error.message}`);
        setRawProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  const filteredProducts = useMemo(() => {
    return filterProducts(rawProducts, Filteration);
  }, [rawProducts, filterString]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          padding: "5px",
          backgroundColor: "black",
          color: "white",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          width: "100%",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Products
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {filteredProducts.length} products found
        </Typography>
        <button onClick={() => toggleCart()}>Cart</button>
      </div>
      <div style={{ display: "flex", flexDirection: "row", maxWidth: "100%" }}>
        <FiltereTheProducts />

        <ThemeProvider theme={theme}>
          {loading ? (
            <Box
              sx={{
                backgroundColor: "#f5f5f5",
                textAlign: "center",
                width: "100%",
              }}
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100vh"
            >
              <CircularProgress thickness={4} size={100} color="black" />
            </Box>
          ) : error ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="100vh"
              p={4}
            >
              <Typography variant="h5" color="error">
                {error}
              </Typography>
            </Box>
          ) : (
            <Container maxWidth="xl" sx={{ py: 4 }}>
              {filteredProducts.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <div
                    style={{
                      marginBottom: "20px",
                      padding: "5px",
                      backgroundColor: "black",
                      color: "white",
                      display: "flex",
                      textAlign: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "20px",
                      borderRadius: "8px",
                    }}
                  >
                    <button> CART</button>
                    <Typography variant="h4" gutterBottom>
                      Products
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {filteredProducts.length} products found
                    </Typography>
                  </div>
                  <Typography variant="h5">
                    No products match the current filters
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box className="products-grid">
                    {filteredProducts.map((product) => (
                      <Box key={product.id} className="product-item">
                        <ProductCard
                          product={product}
                          // onProductClick={onProductClick}
                        />
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Container>
          )}
        </ThemeProvider>
        <div>
          {}
          {cart ? (
            <div
              style={{
                backgroundColor: "white",
                color: "black",
                position: "fixed",
                right: "0px",
                zIndex: 1000,
                height: "100vh",
                width: "420px",
                top: "0px",
              }}
            >
              <Subcart />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
