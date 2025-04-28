import React, { useEffect,  useState } from 'react'; //useMemo,
import {  Box, Card,  CardMedia, CardContent,  Typography, Button, Stack,} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './ProductCard.css';


const ProductCard = ({ product, onAddToCart ,onProductClick}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [isWishlistHovered, setIsWishlistHovered] = useState(false);
  const [ selectedSize] = useState(null);   //, setSelectedSize
//   const [ setShowHoverElements] = useState(false);
//   const [ setShowWishlistIcon] = useState(true);

  const [hoveredSize, setHoveredSize] = useState(null);

  const [randomPrice, setRandomPrice] = useState(null);

  useEffect(() => {
    // Parse existing price if available, otherwise generate random price
    const basePrice = parseFloat(product.price?.toString().replace(/[^\d.]/g, ''));
    const generatedPrice = basePrice || Math.floor(Math.random() * 900 + 1000);
    setRandomPrice(generatedPrice.toFixed(2));
  }, [product.price]); // Only re-run if product.price changes


  const handleImageMouseEnter = () => {
    setIsHovered(true);
    // setShowHoverElements(true);
  };

  const handleImageMouseLeave = () => {
    setIsHovered(false);
    // setShowHoverElements(false);
    // if (inWishlist) {
    //   setShowWishlistIcon(false);
    // }
  };

//   const handleCardMouseEnter = () => {
//     // Show wishlist when hovering anywhere on the card
//     setShowWishlistIcon(true);
//   };

//   const handleCardMouseLeave = () => {
//     // Hide wishlist when not hovering if it's in wishlist
//     if (inWishlist) {
//       setShowWishlistIcon(false);
//     }
//   };

  const toggleWishlist = () => {
    setInWishlist(!inWishlist);
     // If removing from wishlist, always show the icon
    //  if (inWishlist) {
    //   setShowWishlistIcon(true);
    // }
  };

  // const handleSizeSelect = (size) => {
  //   console.log('Selected size:', size);
  //   setSelectedSize(size);
  //   onProductClick(product);
  // };

   //  Handle mouse entering a size circle
   const handleSizeMouseEnter = (size) => {
    setHoveredSize(size);
  };

  //  Handle mouse leaving a size circle
  const handleSizeMouseLeave = () => {
    setHoveredSize(null);
  };

  // const sizes = ["S", "XL", "L", "2XL"];
  const extraSizes = 3; 

  // const generateRandomColor = () =>
  //     `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    
  //   const randomColors = useMemo(() => {
  //     return Array.from({ length: 3 }, () => generateRandomColor());
  //   }, []);


  return (
    <Card className="product-card"
    // onMouseEnter={handleCardMouseEnter}
    // onMouseLeave={handleCardMouseLeave}
    // onClick={() => onProductClick(product)}
    >  

      {/* Sale Tag */}
      <Box className="sale-tag">
        Sale 70%
      </Box>

      {/* Wishlist Button */}
      <Box 
        className={`wishlist-container ${isWishlistHovered ? 'hovered' : ''} ${inWishlist ? 'active' : ''}`}
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
            {inWishlist ? 'Added To Wishlist' : 'Add To Wishlist'}
          </span>
        )}
      </Box>

      {/* product Image with Hover Elements */}
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
        onClick={() => onProductClick(product)}
        />

        {isHovered && (
          <Box className="size-options-container">
            <Box className="size-options">
              {product.sizes.map((size) => (
                <Box
                  key={size}
                  // onClick={() => handleSizeSelect(size)} 
                  onClick={() => onProductClick(product)}
                  onMouseEnter={() => handleSizeMouseEnter(size)}
                  onMouseLeave={handleSizeMouseLeave}
                  className="size-circle"
                  sx={{
                    backgroundColor: hoveredSize === size || selectedSize === size ? 'white' : 'black',
                    color: hoveredSize === size || selectedSize === size ? 'black' : 'white',
                    border: (hoveredSize === size || selectedSize === size) ? '' : 'none',
                  }}
                >
                  {size}
                </Box>
              ))}
              <Box
                className=" extra-sizes"
                // onClick={() => console.log('Show more sizes')}
                onClick={() => onProductClick(product)}
                onMouseEnter={() => handleSizeMouseEnter('extra')}
                onMouseLeave={handleSizeMouseLeave}
                sx={{
                  color: hoveredSize === 'extra' ? 'black' : 'white',
                }}
              >
                +{extraSizes}
              </Box>
            </Box>
          </Box>
        )}
      
            {isHovered && (
            <Button
              variant="contained"
              fullWidth
              className="quick-add-button"
              onClick={() => onAddToCart && onAddToCart(product)}
            >
              QUICK ADD
            </Button>
            )}
      </Box>
    

      <CardContent className="product-info">
        {/* product Title */}
        <Box sx={{ 
          display: 'flex', 
           alignItems: 'center', 
           justifyContent: 'center', 
          gap: 1,
          width: '100%' 
          }}>
         <Typography 
        variant="h6" 
         component="a" 
         onClick={() => onProductClick(product)}
        className="product-title"
        sx={{
         fontSize: '16px',
         display: 'block',
         textDecoration: 'none',
         cursor: 'pointer',
          color: 'black',
           whiteSpace: 'nowrap',
         overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100%', 
        '&:hover': {
        textDecoration: 'underline',
        color: 'black', 
      },
    }}
    >
     {product.product?.title}
    </Typography>
    <Typography 
    variant="h6" 
    component="div" 
    sx={{
      fontSize: '16px',
      whiteSpace: 'nowrap',
       color: 'black'
      }}
     >
       - {product?.colors[0]}
      </Typography>
     </Box>

          <Box className="price-container">
          <Typography variant="body2" component="span" className="original-price">
            {randomPrice} EGP
          </Typography>
          <Typography variant="body1" component="span" className="sale-price">
            {product.price?.amount || `EGP ${(randomPrice * 0.6).toFixed(2)}`} {product.price?.currencyCode}
          </Typography>
        </Box>
        <Stack   onClick={() => onProductClick(product)} direction="row" spacing={1} className="product-thumbnails" sx={{ mt: 1, px: 2, justifyContent: 'center',
              alignItems: 'center',
              display: 'flex', }}>
               
        {product.colors.map((color, index) => (
          <Box
            key={index}
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: color,
              border: '1px solid #ccc',
              cursor: 'pointer',
              '&:hover': {
                border: '1px solid #000',
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