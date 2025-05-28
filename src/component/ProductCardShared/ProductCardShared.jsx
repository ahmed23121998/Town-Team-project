import { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProductCardShared = ({
  product,
  view,
  onAddToCart,
  onToggleWishlist,
  onDelete,
  showDelete = false,
  //   showWishlist = true,
  inWishlist = false,
  discount = 50,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlistHovered, setIsWishlistHovered] = useState(false);
  const discountedPrice = product?.price?.amount;
  const originalPrice = discountedPrice
    ? Math.round(discountedPrice / (1 - discount / 100))
    : undefined;
  const salePrice = discountedPrice?.toFixed(2);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const navigateToDetails = () => {
    navigate("/productDetails", { state: { product } });
  };

  const handleWishlistToggle = () => {
    onToggleWishlist();
  };

  return (
    <Box sx={{ overflowX: "hidden" }}>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: view === "list" ? "row" : "column",
          gap: 2,
          border: "1px solid #eee",
          boxShadow: "none",
          borderRadius: 0,
          overflow: "hidden",
        }}
      >
        {/* Box خاص بالصورة */}
        <Box
          sx={{
            position: "relative",
            width: view === "list" ? "200px" : "100%",
            height: view === "list" ? "250px" : "auto",
            aspectRatio: view === "list" ? "auto" : "3/4",
            flexShrink: 0,
            overflow: "hidden",
            border: "1px solid #eee",
          }}
        >
          {/* شارة الخصم */}
          {discount > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: 1,
                right: 1,
                backgroundColor: "rgb(243, 92, 47)",
                color: "white",
                padding: "6px 9px",
                zIndex: 2,
                fontWeight: "bold",
                fontSize: "13px",
              }}
            >
              % {t("Products.Sale")} {discount}
            </Box>
          )}

          <CardMedia
            component="img"
            image={product.image?.src}
            alt={product.title}
            onClick={navigateToDetails}
            sx={{
              width: "100%",
              height: "95%",
              objectFit: "cover",
              transition: "transform 0.5s ease",
              transform: isHovered ? "scale(1.09)" : "scale(1)",
              cursor: "pointer",
            }}
          />

          {/* أدوات التحكم على الصورة */}
          {isHovered && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                zIndex: 3,
              }}
            >
              {showDelete && inWishlist ? (
                <IconButton
                  onClick={onDelete}
                  sx={{
                    backgroundColor: "black",
                    color: "#ffd700",
                    width: 30,
                    height: 30,
                    "&:hover": {
                      backgroundColor: "black",
                      color: "#ffd700",
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              ) : (
                <Box
                  onMouseEnter={() => setIsWishlistHovered(true)}
                  onMouseLeave={() => setIsWishlistHovered(false)}
                  onClick={handleWishlistToggle}
                  sx={{
                    backgroundColor: "black",
                    color: "#ffd700",
                    borderRadius: "15px",
                    padding: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    transition: "0.3s ease",
                  }}
                >
                  <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                  {isWishlistHovered && (
                    <Typography sx={{ fontSize: "14px" }}>
                      {inWishlist
                        ? t("Products.Added To Wishlist")
                        : t("Products.Add To Wishlist")}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}

          {/* المقاسات */}
          {product.sizes && product.sizes.length > 0 && isHovered && (
            <Box
              sx={{
                position: "absolute",
                bottom: 55,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 1,
                zIndex: 2,
              }}
            >
              {product.sizes.slice(0, 4).map((size, index) => (
                <Box
                  key={index}
                  onClick={navigateToDetails}
                  sx={{
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#000",
                    color: "#fff",
                    borderRadius: "50%",
                    fontSize: "13px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "0.3s ease",
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "#000",
                      border: "1px solid #000",
                    },
                  }}
                >
                  {size}
                </Box>
              ))}
              {product.sizes.length > 4 && (
                <Box
                  onClick={navigateToDetails}
                  sx={{
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#000",
                    color: "#fff",
                    borderRadius: "50%",
                    fontSize: "13px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "0.3s ease",
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "#000",
                      border: "1px solid #000",
                    },
                  }}
                >
                  +{product.sizes.length - 4}
                </Box>
              )}
            </Box>
          )}

          {/* QUICK ADD إذا العرض مش list */}
          {isHovered && view !== "list" && (
            <Button
              onClick={onAddToCart}
              sx={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                backgroundColor: "#ffd700",
                color: "black",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "black",
                  color: "#ffd700",
                },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "12px",
              }}
            >
              {t("Products.QUICK ADD")}
            </Button>
          )}
        </Box>

        {/* Box خاص بالتفاصيل */}
        <Box sx={{ flexGrow: 1 }}>
          <CardContent
            sx={{
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              justifyContent: view === "list" ? "flex-start" : "center",
              textAlign: view === "list" ? "left" : "center",
              alignItems: view === "list" ? "flex-start" : "center",
            }}
          >
            <Typography
              sx={{
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={navigateToDetails}
            >
              {product?.title || "No title available"}

              <Box component="span" sx={{ mx: 1, fontWeight: "normal" }}>
                -
              </Box>
              {product?.colors?.[0]}
            </Typography>

            <Typography sx={{ fontSize: "14px", color: "gray" }}>
              {product.brand || "N/A"}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: view === "list" ? "flex-start" : "center",
                textAlign: view === "list" ? "left" : "center",
                alignItems: view === "list" ? "flex-start" : "center",
              }}
            >
              {originalPrice && (
                <Typography
                  sx={{ textDecoration: "line-through", fontSize: 14 }}
                >
                  {originalPrice.toFixed(2)} EGP
                </Typography>
              )}
              {salePrice && (
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: "#f35c2f",
                  }}
                >
                  {salePrice} EGP
                </Typography>
              )}
            </Box>

            {/* زر QUICK ADD عند العرض list فقط */}
            {view === "list" && (
              <Button
                onClick={onAddToCart}
                sx={{
                  mt: 2,
                  backgroundColor: "#ffd700",
                  color: "black",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "black",
                    color: "#ffd700",
                  },
                  alignSelf: "left",
                  width: "30%",
                }}
              >
                {t("Products.QUICK ADD")}
              </Button>
            )}
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};

export default ProductCardShared;
