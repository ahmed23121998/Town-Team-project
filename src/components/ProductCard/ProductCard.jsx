import React, { useEffect, useState } from "react";
import { addToCart } from "../cartUtils";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, toggleCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [isWishlistHovered, setIsWishlistHovered] = useState(false);
  const [selectedSize] = useState(null);

  const [hoveredSize, setHoveredSize] = useState(null);

  const [randomPrice, setRandomPrice] = useState(null);

  const navigate = useNavigate();

  const addProductToCart = async (product) => {
    toggleCart();
    const userId = "u1234567890";
    try {
      await addToCart(userId, product, 1);
    } catch (error) {
      console.error("Cart update failed:", error);
    }
  };
  useEffect(() => {
    const basePrice = parseFloat(
      product.price?.toString().replace(/[^\d.]/g, "")
    );
    const generatedPrice = basePrice || Math.floor(Math.random() * 900 + 1000);
    setRandomPrice(generatedPrice.toFixed(2));
  }, [product.price]);

  const toggleWishlist = () => {
    setInWishlist(!inWishlist);
  };

  const handleImageMouseEnter = () => {
    setIsHovered(true);
  };
  const handleImageMouseLeave = () => {
    setIsHovered(false);
  };

  const handleSizeMouseEnter = (size) => {
    setHoveredSize(size);
  };

  const handleSizeMouseLeave = () => {
    setHoveredSize(null);
  };

  const extraSizes = 3;
  // const random = (randomPrice * 0.6).toFixed(2);
  return (
    <Card className="product-card">
      <Box className="sale-tag">Sale 70%</Box>

      <Box
        className={`wishlist-container ${isWishlistHovered ? "hovered" : ""} ${
          inWishlist ? "active" : ""
        }`}
        onClick={toggleWishlist}
        onMouseEnter={() => setIsWishlistHovered(true)}
        onMouseLeave={() => setIsWishlistHovered(false)}
      >
        {inWishlist ? (
          <FavoriteBorderIcon className="wishlist-icon" />
        ) : (
          <FavoriteBorderIcon className="wishlist-icon" />
        )}
        {(isWishlistHovered || inWishlist) && (
          <span className="wishlist-text">
            {inWishlist ? "Added To Wishlist" : "Add To Wishlist"}
          </span>
        )}
      </Box>

      <Box
        className="image-container"
        onMouseEnter={handleImageMouseEnter}
        onMouseLeave={handleImageMouseLeave}
      >
        <CardMedia
          component="img"
          className="product-image"
          image={product.image?.src}
          alt={product.product?.title}
          onClick={() =>
            navigate("/productDetails", { state: { product, randomPrice } })
          }
        />

        {isHovered && (
          <Box className="size-options-container">
            <Box className="size-options">
              {product.sizes.map((size) => (
                <Box
                  key={size}
                  onMouseEnter={() => handleSizeMouseEnter(size)}
                  onMouseLeave={handleSizeMouseLeave}
                  className="size-circle"
                  sx={{
                    backgroundColor:
                      hoveredSize === size || selectedSize === size
                        ? "white"
                        : "black",
                    color:
                      hoveredSize === size || selectedSize === size
                        ? "black"
                        : "white",
                    border:
                      hoveredSize === size || selectedSize === size
                        ? ""
                        : "none",
                  }}
                >
                  {size}
                </Box>
              ))}
              <Box
                className=" extra-sizes"
                onMouseEnter={() => handleSizeMouseEnter("extra")}
                onMouseLeave={handleSizeMouseLeave}
                sx={{
                  color: hoveredSize === "extra" ? "black" : "white",
                }}
              >
                +{extraSizes}
              </Box>
            </Box>
          </Box>
        )}

        {isHovered && (
          <Button
            fullWidth
            className="quick-add-button"
            onClick={() => addProductToCart(product)}
          >
            QUICK ADD
          </Button>
        )}
      </Box>

      <CardContent className="product-info">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            component="a"
            // onClick={() => onProductClick(product)}
            className="product-title"
            sx={{
              fontSize: "16px",
              display: "block",
              textDecoration: "none",
              cursor: "pointer",
              color: "black",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
              "&:hover": {
                textDecoration: "underline",
                color: "black",
              },
            }}
          >
            {product.product?.title}
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontSize: "16px",
              whiteSpace: "nowrap",
              color: "black",
            }}
          >
            - {product?.colors[0]}
          </Typography>
        </Box>

        <Box className="price-container">
          <Typography
            variant="body2"
            component="span"
            className="original-price"
          >
            {randomPrice} EGP
          </Typography>
          <Typography variant="body1" component="span" className="sale-price">
            {product.price?.amount || `EGP ${randomPrice}`}{" "}
            {product.price?.currencyCode}
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={1}
          className="product-thumbnails"
          sx={{
            mt: 1,
            px: 2,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          {product.colors.map((color, index) => (
            <Box
              key={index}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: color,
                border: "1px solid #ccc",
                cursor: "pointer",
                "&:hover": {
                  border: "1px solid #000",
                },
              }}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
