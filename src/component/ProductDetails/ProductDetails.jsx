import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  IconButton,
  Paper,
  ButtonGroup,
  Breadcrumbs,
  CardMedia,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Add, Remove, LocalFireDepartment } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useLocation } from "react-router-dom";
import {
  addToFavorites,
  removeFromFavorites,
  isFavorite,
} from "../favorites/favUtils";
import { addToCart } from "../cartUtils";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { MyContext } from "../../Context/FilterContaext";
import { getCartItems } from "../cartUtils";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffeb3b",
    },
    secondary: {
      main: "#f44336",
    },
  },
});

const ProductDetails = ({ onBackClick }) => {
  const location = useLocation();
  const product = location.state?.product;

  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [setIsWishlistHovered] = useState(false);
  const [userId] =useState( localStorage.getItem("userId"));
  const { setCartItems } = useContext(MyContext);

  useEffect(() => {
    if (userId && product?.id) {
      isFavorite(userId, product.id).then(setIsFav);
    }
  }, [userId, product?.id]);

  const { t } = useTranslation();
  const isArabic = t.language === "ar";
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const selectedColor = isArabic
    ? product?.colors_ar?.[selectedColorIndex]
    : product?.colors?.[selectedColorIndex];

  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.[0] || "defaultSize"
  );

  if (!product) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography variant="h5" color="error" align="center">
            Product not found. Please go back and select a product.
          </Typography>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button
              onClick={onBackClick}
              variant="contained"
              color="primary"
              sx={{ color: "black" }}
            >
              Back to Products
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  const handleColorChange = (index) => setSelectedColorIndex(index);
  const handleSizeChange = (event, newSize) =>
    newSize && setSelectedSize(newSize);
  const handleQuantityChange = (action) => {
    if (action === "increase" && quantity < (product.stock || 10)) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const discountedPrice = product?.price?.amount;
  const originalPrice = discountedPrice ? discountedPrice * 2 : undefined;
  const discountPercentage = 50;

  const toggleWishlist = async () => {
    if (!userId || !product?.id) {
      alert("You must be logged in to use the wishlist.");
      return;
    }
    try {
      if (isFav) {
        await removeFromFavorites(userId, product.id);
        setIsFav(false);
      } else {
        await addToFavorites(userId, product);
        setIsFav(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  const addProductToCart = async (product) => {
    const userId = localStorage.getItem("userId");
    try {
      await addToCart(userId, product, quantity);
      const fetchCartItems = async () => {
        try {
          const items = await getCartItems(userId);
          setCartItems(items);
          // setcartProducts(items);
        } catch (err) {
          console.log(err);
          console.error(err);
        }
      };

      fetchCartItems();
    } catch (error) {
      console.error("Cart update failed:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Back button and breadcrumbs */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
          <Button
            onClick={onBackClick}
            sx={{ ml: 3, color: "grey", "&:hover": { color: "black" } }}
          >
            {t("Products.Home")}
            <ArrowForwardIosIcon sx={{ maxWidth: "15px", ml: "5px" }} />
          </Button>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography color="inherit">{t("Products.Products")}</Typography>
            <Typography color="inherit">
              {product.name || product.productCode || "Unknown Product"}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Rest of the component */}
        <Grid container spacing={4}>
          {/* Left side - Product Image */}
          <Grid item xs={12} md={7} lg={8}>
            <Grid sx={{ position: "relative" }}>
              <Box
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "rgb(243, 92, 47)",
                  color: "#fff",
                  padding: "4px 8px",
                  zIndex: 2,
                }}
              >
                % {t("Products.Sale")} {discountPercentage}
              </Box>
              <CardMedia
                component="img"
                image={product.image?.src || "fallback-image-url"}
                alt={product.name || product.productCode || "Product Image"}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "1000px",
                  objectFit: "contain",
                }}
              />
            </Grid>
          </Grid>

          {/* Right side - Product Details */}
          <Grid item xs={12} md={5} lg={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Box sx={{ pl: { md: 4 } }}>
                {/* Product Code */}
                <Typography
                  variant="h5"
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                >
                  {product.productCode}
                </Typography>

                {/* Recent Sales Indicator */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocalFireDepartment color="error" sx={{ mr: 1 }} />
                  <Typography
                    variant="body2"
                    color="rgb(243, 92, 47)"
                    fontWeight="bold"
                  >
                    {product.recentSales} {t("Products.sold in last 25 hours")}
                  </Typography>
                </Box>

                {/* Brand/Category */}
                <Typography variant="subtitle1" color="black" gutterBottom>
                  {product.brand?.[0]} / {product.brand?.[1]} -{" "}
                  {product.category}
                </Typography>

                {/* Availability */}
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {t("Products.Availability")}:{" "}
                  {product.stock > 0
                    ? `${product.stock} In Stock`
                    : "Out of Stock"}
                </Typography>

                {/* Price */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  {/* السعر الأصلي */}
                  {originalPrice && (
                    <Typography
                      variant="h6"
                      component="span"
                      sx={{
                        textDecoration: "line-through",
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "25px",
                        mr: 2,
                      }}
                    >
                      EGP {originalPrice.toLocaleString()}
                    </Typography>
                  )}

                  {/* السعر المخفض */}
                  <Typography
                    variant="h5"
                    component="span"
                    color="rgb(243, 92, 47)"
                    fontWeight="bold"
                  >
                    EGP {discountedPrice.toLocaleString()}
                  </Typography>

                  {discountPercentage > 0 && (
                    <Typography
                      variant="body2"
                      color="error"
                      fontWeight="bold"
                      sx={{ ml: 2 }}
                    ></Typography>
                  )}
                </Box>

                {/* Color Selection */}
                {product.colors?.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      {t("Products.Color")}: {selectedColor}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      {product.colors.map((color, idx) => (
                        <Box
                          key={color}
                          onClick={() => handleColorChange(idx)}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            bgcolor: color,
                            border:
                              selectedColorIndex === idx
                                ? "2px solid #000"
                                : "1px solid #ddd",
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Size Selection */}
                {product.sizes?.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: "bold" }}
                    >
                      {t("Products.Size")} {selectedSize}
                    </Typography>
                    <ToggleButtonGroup
                      value={selectedSize}
                      exclusive
                      onChange={handleSizeChange}
                      aria-label="size selection"
                      sx={{ mt: 1 }}
                    >
                      {product.sizes.map((size, index) => (
                        <ToggleButton
                          key={size}
                          value={size}
                          sx={{
                            minWidth: 20,
                            pl: 2,
                            pr: 2,
                            color: "white",
                            bgcolor: "black",
                            mr: index !== product.sizes.length - 1 ? 2 : 0,
                            "&:hover": {
                              color: "white",
                              bgcolor: "black",
                            },
                            "&.Mui-selected": {
                              color: "white",
                              bgcolor: "black",
                            },
                          }}
                        >
                          {size}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Box>
                )}

                {/* Quantity Selector */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    {t("Products.Quantity")}:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <ButtonGroup
                      variant="black"
                      aria-label="quantity selection"
                      sx={{
                        mt: 1,
                        border: "2px solid grey",
                        p: 0.5,
                      }}
                    >
                      <Button
                        onClick={() => handleQuantityChange("decrease")}
                        disabled={quantity <= 1}
                      >
                        <Remove />
                      </Button>
                      <Button sx={{ minWidth: 60, pointerEvents: "none" }}>
                        {quantity}
                      </Button>
                      <Button
                        onClick={() => handleQuantityChange("increase")}
                        disabled={quantity >= (product.stock || 10)}
                      >
                        <Add />
                      </Button>
                    </ButtonGroup>
                  </Box>
                </Box>

                {/* Subtotal */}
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 3 }}
                >
                  {t("Products.Subtotal")}:EGP{" "}
                  {(product.price?.amount * quantity).toLocaleString()}
                </Typography>

                {/* Free Shipping Notice */}
                <Paper
                  sx={{
                    bgcolor: "black",
                    color: "primary.main",
                    py: 1,
                    px: 2,
                    textAlign: "center",
                    mb: 3,
                    maxWidth: "100%",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    gap={0.5}
                    borderLeft={0}
                  >
                    <Typography variant="body1" fontWeight="bold" fontSize={18}>
                      {t("Products.Free shipping on order over 499")}
                    </Typography>
                    {/* <Typography fontSize={10} fontWeight="bold">
                      {t('Products.EGP')}
                    </Typography> */}
                  </Box>
                </Paper>

                {/* Add to Cart Button */}
                <Box sx={{ display: "flex", gap: 2, py: 0.5 }} >
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={userId?false: true}
                    sx={{
                      height: "34px",
                      fontSize: "14px",
                      color: "black",
                      fontWeight: "bold",
                      width: "100%",
                      "&:hover": {
                        border: "1px solid black",
                        color: "black",
                        backgroundColor: "white",
                      },
                    }}
                    onClick={() => addProductToCart(product)}
                  >
                    {t("Products.ADD TO CART")}
                  </Button>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <IconButton
                      onClick={toggleWishlist}
                      disabled={userId?false: true}
                      onMouseEnter={() => setIsWishlistHovered(true)}
                      onMouseLeave={() => setIsWishlistHovered(false)}
                      sx={{
                        backgroundColor: "black",
                        color: isFav ? "#ffeb3b" : "white",
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                        "&:hover": {
                          backgroundColor: "#333",
                        },
                      }}
                    >
                      <FavoriteBorderIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                padding: "12px",
                borderRadius: 0,
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              {t("Products.Buy it now")}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default ProductDetails;
