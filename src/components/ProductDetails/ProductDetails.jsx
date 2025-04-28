
import {  useState } from "react" ///useMemo,
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
} from "@mui/material"
import { Add, Remove, LocalFireDepartment } from "@mui/icons-material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffeb3b", // Yellow color for primary
    },
    secondary: {
      main: "#f44336", // Red color for sale tag
    },
  },
})

const ProductDetails = ({ product, onBackClick }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)

  const handleColorChange = (color) => {
    setSelectedColor(color)
  }

  const handleSizeChange = (event, newSize) => {
    if (newSize !== null) {
      setSelectedSize(newSize)
    }
  }
  // const sizes = ["S",  "L", "XL", "2XL"];

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity(quantity + 1)
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1)
    }
  }
  // const generateRandomColor = () =>
  //   `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  
  // // Memoized array of 3 random colors
  // const randomColors = useMemo(() => {
  //   return Array.from({ length: 3 }, () => generateRandomColor());
  // }, []);

  // Calculate discount percentage
  // const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Back button and breadcrumbs */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
          <Button onClick={onBackClick} sx={{ ml: 3, color: "grey" ,  '&:hover': {color:"black"}}}  >
          Home{< ArrowForwardIosIcon sx={{maxWidth:"15px", ml:"5px"}} />}
          </Button>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography color="inherit">{product.name || product.productCode}</Typography>
          </Breadcrumbs>
        </Box>
       
        <Grid container spacing={4}>
          {/* Left side - Product Image */}
          <Grid item xs={12} md={7} lg={8}>
          <Box sx={{ position: "relative" }}>
            
         {/* Sale Tag Positioned Above the Image */}
         <Box
          sx={{
          position: "absolute",
          top: "10px" ,
          right: "10px",
          backgroundColor: "rgb(243, 92, 47)",
          color: "#fff",
          padding: "4px 8px",
          zIndex: 2,
         }}
           >
          Sale 70%
          </Box>
            </Box>
            <CardMedia
          component="img"
          image={product.image?.src}
          alt={product.product?.title}
          sx={{
            maxWidth: "100%",
            maxHeight: "1000px",
            objectFit: "contain",
          }}
          />
          </Grid>

          {/* Right side - Product Details */}
          <Grid item xs={12} md={5} lg={4}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
            <Box sx={{ pl: { md: 4 } }}>
              {/* Product Code */}
              <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                {product.productCode}
              </Typography>

              {/* Recent Sales Indicator */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocalFireDepartment color="error" sx={{ mr: 1 }} />
                <Typography variant="body2" color="rgb(243, 92, 47)" fontWeight="bold">
                  {product.recentSales} sold in last 25 hours
                </Typography>
              </Box>

              {/* Brand/Category */}
              <Typography variant="subtitle1" color="black" gutterBottom>
                {product.brand[0]} / {product.brand[1]} - {product.category}
              </Typography>

              {/* Availability */}
              <Typography variant="body2" sx={{ mb: 2 }}>
                Availability: {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
              </Typography>

              {/* Price */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography
                  variant="h6"
                  component="span"
                  sx={{ textDecoration: "line-through", color: "black",fontWeight:"bold" , fontSize: "25px",mr: 2 }}
                >
                  EGP {product.originalPrice.toLocaleString()}
                </Typography>
                <Typography variant="h5" component="span" color="rgb(243, 92, 47)" fontWeight="bold">
                  EGP {product.price?.amount.toLocaleString()}
                </Typography>
              </Box>


              {/* Color Selection */}
              <Box sx={{ mb: 3 }}>
             <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
               Color: {selectedColor}
               </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                {product.colors.map((color) => (
                <Box
                 key={color}
                    onClick={() => handleColorChange(color)}
                     sx={{
                      width: 40,
                     height: 40,
                     borderRadius: "50%",
                    bgcolor: color,
                    border: selectedColor === color ? "2px solid #000" : "1px solid #ddd",
                    cursor: "pointer",
                     display: "flex",
                     justifyContent: "center",
                     alignItems: "center",
                      }}
                 />
                  ))}
                 </Box>
               </Box>

              {/* Size Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                  Size: {selectedSize}
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
               mr: index !== product.sizes.length - 1 ? 2 : 0,  // Add right margin except on last button
               '&:hover': {
                color: "white",
                bgcolor: "black",
              },
              '&.Mui-selected': { // Style for the selected state
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

              {/* Quantity Selector */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                  Quantity:
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <ButtonGroup variant="black" aria-label="size selection"  sx={{
                 mt: 1,
                 border: "2px solid grey",        
                 p: 0.5,                             
                  }}> 
                  {/* aria-label="size selection" */}
                    <Button onClick={() => handleQuantityChange("decrease")} disabled={quantity <= 1}>
                      <Remove />
                    </Button>
                    <Button sx={{ minWidth: 60, pointerEvents: "none" }}>{quantity}</Button>
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
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 3 }}>
                Subtotal: EGP {(product.price?.amount * quantity).toLocaleString()}
              </Typography>

              {/* Free Shipping Notice */}
              <Paper
              // fullWidth
               sx={{
              bgcolor: "black",
             color: "primary.main",
             py: 1, // reduced vertical padding
             px: 2,
            textAlign: "center",
             mb: 3,
            maxWidth: "100%",
             }}
            >
          <Box display="flex" justifyContent="center" alignItems="center" gap={0.5} borderLeft={0}>
            <Typography variant="body1" fontWeight="bold" fontSize={18}>
             Free shipping on order over 499
               </Typography>
               <Typography fontSize={10} fontWeight="bold">
                 EGP
               </Typography>
            </Box>
            </Paper>


              {/* Add to Cart Button */}
              <Box sx={{ display: "flex", gap: 2, py: 0.5 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  // size="large"
                  sx={{
                    height: "34px",         // Slim height
                    fontSize: "14px",       // Slightly smaller font
                   color: "black",
                   fontWeight: "bold",
                     width: "100%", // makes it stretch full width inside the flex container
                    '&:hover': {
                      border: '1px solid black',
                      color: 'black',
                      backgroundColor: 'white',
                    },
                  }}
                >
                  ADD TO CART
                </Button>
                <IconButton
                  aria-label="add to favorites"
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    p: 1.5,
                    backgroundColor: "white",
                    color: "black",
                    transition: "all 0.3s ease",
                    '&:hover': {
                      backgroundColor: "black",
                      color: " #ffd700",
                    },
                  }}
                >
                  <FavoriteBorderIcon />
                </IconButton>
                
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
          Buy it now
        </Button>
            </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

export default ProductDetails
