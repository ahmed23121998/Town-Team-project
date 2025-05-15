import React, { useContext, useEffect, useState, useMemo } from "react";
import { db } from "../../Firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  IconButton,
  Drawer,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ProductCard from "../ProductCard/ProductCard";
import FiltereTheProducts from "../Filtration/FiltereTheProducts";
import Subcart from "../Cart/Subcart";
import { MyContext } from "../../Context/FilterContaext";
import FilterListIcon from "@mui/icons-material/FilterList";
import "./ProductList.css";
import { useLocation } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: { main: "#ffeb3b" },
    secondary: { main: "#f44336" },
  },
});

const ProductList = () => {
  const { Filteration } = useContext(MyContext);
  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const location = useLocation();

  const { category = "default/category" } = location.state || {};

  const normalizeFilterValue = (value) => {
    return String(value).toLowerCase().trim().replace(/['"]/g, "");
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
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

  // let category = "kids/closes/Boys Jackets";
  // let cat = "men/accessories/bags";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const collectionPath = category.split("/"); // Split path
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
        setRawProducts(data);
      } catch (error) {
        console.error("Firebase error:", error);
        setError("Failed to load products. Please try again.");
        setRawProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if (!category) {
      setError("No category selected");
      setLoading(false);
      return;
    }
    fetchData();
  }, [category]);

  const userId = "u1234567890";

  const filteredProducts = useMemo(() => {
    return filterProducts(rawProducts, Filteration);
  }, [rawProducts, filterString]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", marginTop: "100px" }}>
      <IconButton
        onClick={toggleFilters}
        sx={{ display: { xs: "block", md: "none" }, color: "black", marginLeft: "20px" }}
      >
        <FilterListIcon />
      </IconButton>
      {/* <Box
        sx={{
          margin: { xs: "10px 0", md: "20px 0" },
          padding: "5px",
          backgroundColor: "black",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: { xs: "10px", md: "20px" },
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <IconButton
            onClick={toggleFilters}
            sx={{ display: { xs: "block", md: "none" }, color: "white" }}
          >
            <FilterListIcon />
          </IconButton>
          <Typography variant="h4" gutterBottom>
            Products
          </Typography>
        </Box>
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
      </Box> */}

      <Box sx={{ display: "flex", position: "relative", flexGrow: 1 }}>
        <Drawer
          anchor="left"
          open={filtersOpen}
          onClose={toggleFilters}
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <Box sx={{ width: 310, padding: "20px" }}>
            <FiltereTheProducts toggleFilters={toggleFilters} />
          </Box>
        </Drawer>

        <Box
          sx={{
            width: { xs: "0", md: "250px" },
            padding: { md: "20px" },
            display: { xs: "none", md: "block" },
            marginRight: "50px",
          }}
        >
          <FiltereTheProducts />
        </Box>

        <ThemeProvider theme={theme}>
          <Container
            maxWidth="xl"
            sx={{
              py: 4,
              flexGrow: 1,
              transition: "margin-right 0.3s ease",
              marginRight: { md: cartOpen ? "420px" : 0 },
            }}
          >
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
                  {error}---
                  {category}
                </Typography>
              </Box>
            ) : filteredProducts.length === 0 ? (
              <Box textAlign="center" py={8}>
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
                    lg: "repeat(3, 1fr)",
                  },
                  gap: { xs: "2px", sm: "5px", md: "10px", lg: "15px" },
                }}
                className="products-grid"
              >
                {filteredProducts.map((product) => (
                  <Box key={product.id} className="product-item">
                    <ProductCard product={product} toggleCart={toggleCart} />
                  </Box>
                ))}
              </Box>
            )}
          </Container>
        </ThemeProvider>

        <Drawer
          anchor="right"
          open={cartOpen}
          onClose={toggleCart}
          sx={{
            width: { xs: "100%", md: 420 },
            "& .MuiDrawer-paper": {
              width: { xs: "100%", md: 420 },
              boxSizing: "border-box",
              backgroundColor: "white",
            },
          }}
        >
          <Box sx={{ width: { xs: "100%", md: 420 }, padding: "20px" }}>
            <Subcart
              userId={userId}
              onClose={toggleCart}
              toggleCart={toggleCart}
            />
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default ProductList;