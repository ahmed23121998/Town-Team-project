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
  const userId = "u1234567890";

  const filteredProducts = useMemo(() => {
    return filterProducts(rawProducts, Filteration);
  }, [rawProducts, filterString]);

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Box
          sx={{
            margin: { xs: "10px 0", md: "20px 0" },
            padding: "5px",
            backgroundColor: "black",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: "10px", md: "20px" },
            width: "100%",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Products
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {filteredProducts.length} products found
          </Typography>
          <button
            onClick={toggleCart}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ffeb3b",
              color: "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cart
          </button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            maxWidth: "100%",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "250px" },
              minWidth: { md: "200px" },
              padding: { xs: "10px", md: "20px" },
            }}
          >
            <FiltereTheProducts />
          </Box>

          <ThemeProvider theme={theme}>
            {loading ? (
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  textAlign: "center",
                  width: "100%",
                  flexGrow: 1,
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
                sx={{ width: "100%", flexGrow: 1 }}
              >
                <Typography variant="h5" color="error">
                  {error}
                </Typography>
              </Box>
            ) : (
              <Container
                maxWidth="xl"
                sx={{ py: 4, flexGrow: 1, width: { xs: "100%", md: "auto" } }}
              >
                {filteredProducts.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Box
                      sx={{
                        marginBottom: "20px",
                        padding: "5px",
                        backgroundColor: "black",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "20px",
                        borderRadius: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#ffeb3b",
                          color: "black",
                          border: "none",
                          borderRadius: "4px",
                        }}
                      >
                        CART
                      </button>
                      <Typography variant="h4" gutterBottom>
                        Products
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        {filteredProducts.length} products found
                      </Typography>
                    </Box>
                    <Typography variant="h5">
                      No products match the current filters
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                      },
                      gap: { xs: 2, md: 3 },
                    }}
                    className="products-grid"
                  >
                    {filteredProducts.map((product) => (
                      <Box key={product.id} className="product-item">
                        <ProductCard product={product} />
                      </Box>
                    ))}
                  </Box>
                )}
              </Container>
            )}
          </ThemeProvider>
        </Box>
      </Box>

      <Box sx={{ position: "absolute", height: "100vh", width: "100%" }}>
        <Box
          onClick={() => toggleCart()}
          sx={{
            backgroundColor: "black",
            color: "orange",
            width: "75%",
            // minHeight: "760px",
            minHeight: "100vh",
            opacity: "0.5",
            cursor: "pointer",
            // zIndex: "100",
          }}
        ></Box>
        <Box
          sx={{
            position: { xs: "fixed", md: "absolute" },
            top: 0,
            right: 0,
            height: "100vh",
            width: { xs: cart ? "100%" : 0, md: cart ? "420px" : 0 },
            zIndex: 1000,
            backgroundColor: "white",
            transition: "width 0.3s ease",
            overflowY: "auto",
            boxShadow: cart ? "-2px 0 5px rgba(0,0,0,0.2)" : "none",
          }}
        >
          {/* <button onClick={() => toggleCart()}>clos</button> */}
          <Subcart userId={userId} />
        </Box>
      </Box>
    </>
  );
};

export default ProductList;
