import React, { useContext, useEffect, useState, useMemo } from "react";
import { db } from "../../Firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, CircularProgress, Container, Typography, IconButton, Drawer, } from "@mui/material";
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

function normalizeBrand(name) {
  return String(name).toLowerCase().replace(/\s+/g, "");
}

const ProductList = () => {
  const { Filteration } = useContext(MyContext);
  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const location = useLocation();
  const userId = localStorage.getItem("userId") || "guest";

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q")?.toLowerCase().trim() || "";

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
        const inStock = product.in_stock === true && product.quantity > 0;
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
          ? product.brand.map(normalizeBrand)
          : [normalizeBrand(product.brand || "")];
        const activeBrands = Object.keys(filters.brand).filter(
          (b) => filters.brand[b]
        );
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
        if (searchQuery) {
          const mainCollections = [
            "men",
            "kids",
            "accessories",
            "shoes",
            "summer",
            "winter",
            "newarrival",
          ];
          // جلب كل المنتجات من جميع الكوليكشنات والساب كوليكشنز بشكل متوازي بالكامل
          const allProductsNested = await Promise.all(
            mainCollections.map(async (mainCol) => {
              try {
                const colRef = collection(db, mainCol);
                const snapshot = await getDocs(colRef);
                // لكل document، جلب كل الـ subcollections دفعة واحدة
                const subProductsNested = await Promise.all(
                  snapshot.docs.map(async (doc) => {
                    const docData = doc.data();
                    const subcollections = docData.subcollections || [];
                    // جلب كل المنتجات من جميع الـ subcollections لهذا الـ doc دفعة واحدة
                    const subColProductsNested = await Promise.all(
                      subcollections.map(async (subColName) => {
                        try {
                          const subColRef = collection(
                            db,
                            mainCol,
                            doc.id,
                            subColName
                          );
                          const subColSnap = await getDocs(subColRef);
                          return subColSnap.docs.map((subDoc) => {
                            const subDocData = subDoc.data();
                            return {
                              id: subDoc.id,
                              ...subDocData,
                              brand: subDocData.brand || ["Unknown Brand"],
                              colors: Array.isArray(subDocData.colors)
                                ? subDocData.colors
                                : subDocData.colors
                                  ? [subDocData.colors]
                                  : subDocData.color
                                    ? [subDocData.color]
                                    : [],
                              sizes: (subDocData.sizes || []).map((s) =>
                                s.replace(/['"]/g, "")
                              ),
                              price: {
                                amount: subDocData.price?.amount || 0,
                                currencyCode:
                                  subDocData.price?.currencyCode || "USD",
                              },
                              in_stock: subDocData.in_stock || false,
                              quantity: subDocData.quantity || 0,
                              title: subDocData.title || "Untitled Product",
                              image: subDocData.image || "",
                              category: mainCol,
                              subColName: subColName,
                            };
                          });
                        } catch (subErr) {
                          // Error fetching subcollection, log if needed
                          return [];
                        }
                      })
                    );
                    // دمج كل المنتجات من جميع الـ subcollections لهذا الـ doc
                    return subColProductsNested.flat();
                  })
                );
                // دمج كل المنتجات من جميع الـ docs في هذا الكوليكشن
                return subProductsNested.flat();
              } catch (err) {
                // Error fetching main collection, log if needed
                return [];
              }
            })
          );
          // دمج كل المنتجات من جميع الكوليكشنات
          let allProducts = allProductsNested
            .flat(2)
            .filter((prod) => prod && !prod.dummy);
          setRawProducts(allProducts);
          console.log("All products fetched from Firebase:", allProducts);
          console.log("searchQuery:", searchQuery);
        } else {
          // نفس المنطق القديم لو مفيش بحث
          const collectionPath = category.split("/");
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
          console.log("Category products fetched from Firebase:", data);
        }
      } catch (error) {
        console.error("Firebase error:", error);
        setError("Failed to load products. Please try again.");
        setRawProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if (!searchQuery && !category) {
      setError("No category selected");
      setLoading(false);
      return;
    }
    fetchData();
  }, [category, searchQuery]);

  // فلترة المنتجات حسب كلمة البحث
  const filteredProducts = useMemo(() => {
    if (searchQuery && searchQuery.length > 0) {
      const results = rawProducts.filter((product) => {
        const title = (product.title || "").toLowerCase();
        const type = (
          product.type ||
          product.product?.type ||
          ""
        ).toLowerCase();
        const productTitle = (product.product?.title || "").toLowerCase();
        const brand = Array.isArray(product.brand)
          ? product.brand.join(" ")
          : product.brand || "";
        const colors = Array.isArray(product.colors)
          ? product.colors.join(" ")
          : product.colors || "";
        const category = (product.category || "").toLowerCase();
        const subColName = (product.subColName || "").toLowerCase();
        return (
          (title && title.includes(searchQuery)) ||
          (type && type.includes(searchQuery)) ||
          (productTitle && productTitle.includes(searchQuery)) ||
          (brand && brand.toLowerCase().includes(searchQuery)) ||
          (colors && colors.toLowerCase().includes(searchQuery)) ||
          (category && category.includes(searchQuery)) ||
          (subColName && subColName.includes(searchQuery))
        );
      });
      // طباعة تشخيصية عند البحث عن kids
      if (searchQuery === "kids") {
        console.log(
          "Filtered products for 'kids':",
          results.map((p) => ({
            id: p.id,
            category: p.category,
            subColName: p.subColName,
            title: p.title,
          }))
        );
      }
      return results;
    }
    // إذا لم توجد كلمة بحث، استخدم الفلاتر العادية
    return filterProducts(rawProducts, Filteration);
  }, [rawProducts, filterString, searchQuery, Filteration, filterProducts]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        marginTop: "100px",
        gap: { xs: "0", md: "20px" },
        // margin: "20px",
      }}
    >
      <IconButton
        onClick={toggleFilters}
        sx={{
          display: { xs: "block", md: "none" },
          color: "black",
          marginLeft: "20px",
        }}
      >
        <FilterListIcon />
      </IconButton>

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
            marginLeft: "50px",
          }}
        >
          <FiltereTheProducts toggleFilters={toggleFilters} />
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
                  <Box
                    key={`${product.id}-${product.category}-${product.subColName}`}
                    className="product-item"
                  >
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
