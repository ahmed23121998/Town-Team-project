import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Container,
  Paper,
  Divider,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Add, Remove, Close, ShoppingBag, Info } from "@mui/icons-material";
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const MainCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes in seconds
  const [userId] = useState(`u1234567890`);
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return `LE ${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );
  const total = subtotal;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const cartRef = collection(db, "users", userId, "cart");

    try {
      const unsubscribe = onSnapshot(
        cartRef,
        (snapshot) => {
          if (snapshot.empty) {
            setCartItems([]);
          } else {
            const items = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setCartItems(items);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching cart:", error);
          setError("Failed to load cart items");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up cart listener:", error);
      setError("Failed to connect to cart");
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 99) newQuantity = 99;

    try {
      const itemRef = doc(db, "users", userId, "cart", itemId);
      await updateDoc(itemRef, { quantity: newQuantity });
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError("Failed to update quantity");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const itemRef = doc(db, "users", userId, "cart", itemId);
      await deleteDoc(itemRef);
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Failed to remove item");
    }
  };

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  const handleCheckout = () => {
    navigate("/CheckoutForm", {
      state: {
        cartItems,
        total,
      },
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh", // Full viewport height
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, sm: 4 }, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => {
            setError(null);
            setLoading(true);
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const onClose = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 5 },
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg" sx={{ height: "100%" }}>
        <Box
          sx={{
            p: 2,
            backgroundColor: "white",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
            }}
          >
            YOUR CART
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
          {subtotal >= 1399 ? (
            <Typography
              sx={{ color: "#009688", fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              You You qualify for free shipping!
            </Typography>
          ) : (
            <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
              Free shipping for all orders over LE 1,399.00!
            </Typography>
          )}
          <Box
            sx={{
              mt: 1,
              width: "100%",
              height: 6,
              backgroundColor: "#e0e0e0",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${Math.min((subtotal / 1399) * 100, 100)}%`,
                height: "100%",
                backgroundColor: "#1bb57f",
              }}
            />
          </Box>
        </Box>

        {cartItems.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              my: 2,
              p: 2,
              backgroundColor: "#FFF8E1",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Info color="action" />
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              Please, hurry! Someone has placed an order on one of the items you
              have in the cart. We'll keep it for you for{" "}
              {formatTimeRemaining()} minutes.
            </Typography>
          </Paper>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
            {cartItems.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 8,
                }}
              >
                {/* <ShoppingBag
                  sx={{ fontSize: { xs: 50, sm: 60 }, color: "#9e9e9e", mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
                >
                  Your cart is empty
                </Typography> */}
              </Box>
            ) : (
              <>
                <Divider />
                {cartItems.map((item) => (
                  <Box key={item.id} sx={{ py: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Box sx={{ width: { xs: 70, sm: 90 }, mr: 2 }}>
                          <img
                            src={item.image || "/placeholder-image.jpg"}
                            alt={item.title}
                            style={{
                              width: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.src = "/placeholder-image.jpg";
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "bold",
                              fontSize: { xs: "0.9rem", sm: "1rem" },
                            }}
                          >
                            {item.title || "Product"}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                          >
                            {item.color && `${item.color} /`} {item.size}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                          >
                            {item.brand}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={2} sx={{ textAlign: "center" }}>
                        <Typography
                          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                        >
                          {formatCurrency(item.price || 0)}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={2} sx={{ textAlign: "center" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                            maxWidth: 120,
                            mx: "auto",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography
                            sx={{
                              width: 40,
                              textAlign: "center",
                              fontSize: { xs: "0.9rem", sm: "1rem" },
                            }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= 99}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={2}
                        sx={{ textAlign: { xs: "center", sm: "right" } }}
                      >
                        <Typography
                          fontWeight="bold"
                          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                        >
                          {formatCurrency((item.price || 0) * item.quantity)}
                        </Typography>
                      </Grid>
                      {/* <Button
                        variant="text"
                        color="error"
                        size="small"
                        sx={{
                          p: 0,
                          mt: 1,
                          minWidth: "auto",
                          fontSize: { xs: "0.8rem", sm: "0.875rem" },
                          marginRight: "0px",
                        }}
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </Button> */}
                      <IconButton
                        sx={{ color: "red", marginRight: "Auto" }}
                        onClick={() => removeItem(item.id)}
                      >
                        <Close />
                      </IconButton>
                    </Grid>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </>
            )}
          </Box>

          {cartItems.length > 0 && (
            <Box
              sx={{
                p: 3,
                width: { xs: "100%", md: "30%" },
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1.2rem", sm: "1.5rem" },
                }}
              >
                ORDER SUMMARY
              </Typography>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                  Subtotal
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                  }}
                >
                  {formatCurrency(subtotal)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography
                  gutterBottom
                  sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                >
                  Coupon Code
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter Coupon Code"
                  size="small"
                  value={couponCode}
                  onChange={handleCouponChange}
                  sx={{ mb: 1 }}
                />
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                >
                  Coupon code will be applied on the checkout page
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1rem", sm: "1.2rem" },
                  }}
                >
                  TOTAL:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1rem", sm: "1.2rem" },
                  }}
                >
                  {formatCurrency(total)}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mb: 1,
                  py: 1.5,
                  backgroundColor: "#f9d100",
                  color: "#000",
                  "&:hover": { backgroundColor: "#e0be00" },
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
                onClick={handleCheckout}
              >
                PROCEED TO CHECKOUT
              </Button>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  py: 1.5,
                  backgroundColor: "#000",
                  color: "#f9d100",
                  "&:hover": { backgroundColor: "#333" },
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
                onClick={onClose}
              >
                CONTINUE SHOPPING
              </Button>
            </Box>
          )}

          {cartItems.length === 0 && (
            <Box sx={{ p: 2, width: "100%" }}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  py: 1.5,
                  backgroundColor: "#000",
                  color: "#f9d100",
                  "&:hover": { backgroundColor: "#333" },
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
                onClick={onClose}
              >
                CONTINUE SHOPPING
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

MainCart.propTypes = {
  onClose: PropTypes.func,
};

export default MainCart;
