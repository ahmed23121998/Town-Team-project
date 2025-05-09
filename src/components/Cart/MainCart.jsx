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
} from "@mui/material";
import { Add, Remove, Close, ShoppingBag, Info } from "@mui/icons-material";
import {
  collection,
  // getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../Firebase/firebase";

const MainCart = ({ onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [userId] = useState(`u1234567890`);
  // Currency format function
  const formatCurrency = (amount) => {
    return `LE ${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price?.amount || 0) * item.quantity,
    0
  );
  const total = subtotal; // Can be modified later to include shipping, discounts, etc.

  // Fetch cart data
  useEffect(() => {
    if (!userId) return;

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

  // Handle countdown timer
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Format time remaining
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle quantity updates
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const itemRef = doc(db, "users", userId, "cart", itemId);
      await updateDoc(itemRef, { quantity: newQuantity });
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError("Failed to update quantity");
    }
  };

  // Handle item removal
  const removeItem = async (itemId) => {
    try {
      const itemRef = doc(db, "users", userId, "cart", itemId);
      await deleteDoc(itemRef);
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Failed to remove item");
    }
  };

  // Handle coupon code
  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  // Proceed to checkout
  const handleCheckout = () => {
    // Implement checkout logic
    console.log("Proceeding to checkout with items:", cartItems);
    // Redirect to checkout page or open checkout modal
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>Loading your cart...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ height: "100%" }}>
      {/* Cart Header */}
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
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          YOUR CART
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {/* Free Shipping Progress */}
      <Box sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
        {subtotal >= 1399 ? (
          <Typography sx={{ color: "#009688" }}>
            You qualify for free shipping!
          </Typography>
        ) : (
          <Typography>
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
              backgroundColor: "#00C853",
            }}
          />
        </Box>
      </Box>

      {/* Urgency Message */}
      {cartItems.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            my: 2,
            mx: 2,
            p: 2,
            backgroundColor: "#FFF8E1",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Info color="action" />
          <Typography variant="body2">
            Please, hurry! Someone has placed an order on one of the items you
            have in the cart. We'll keep it for you for {formatTimeRemaining()}{" "}
            minutes.
          </Typography>
        </Paper>
      )}

      {/* Cart Content */}
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
            <ShoppingBag sx={{ fontSize: 60, color: "#9e9e9e", mb: 2 }} />
            <Typography variant="h6">Your cart is empty</Typography>
          </Box>
        ) : (
          <>
            {/* Cart Items Header */}
            <Grid container sx={{ fontWeight: "bold", pb: 1 }}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">PRODUCT</Typography>
              </Grid>
              <Grid item xs={2} sx={{ textAlign: "center" }}>
                <Typography variant="subtitle2">PRICE</Typography>
              </Grid>
              <Grid item xs={2} sx={{ textAlign: "center" }}>
                <Typography variant="subtitle2">QUANTITY</Typography>
              </Grid>
              <Grid item xs={2} sx={{ textAlign: "right" }}>
                <Typography variant="subtitle2">TOTAL</Typography>
              </Grid>
            </Grid>

            <Divider />

            {/* Cart Items */}
            {cartItems.map((item) => (
              <Box key={item.id} sx={{ py: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  {/* Product Info */}
                  <Grid
                    item
                    xs={6}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Box sx={{ width: 80, height: 80, mr: 2 }}>
                      <img
                        src={item.image || "/api/placeholder/80/80"}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {item.title || "Product"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.color && `${item.color} /`} {item.size}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.brand}
                      </Typography>
                      <Button
                        variant="text"
                        color="error"
                        size="small"
                        sx={{ p: 0, mt: 1, minWidth: "auto" }}
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Grid>

                  {/* Price */}
                  <Grid item xs={2} sx={{ textAlign: "center" }}>
                    <Typography>
                      {formatCurrency(item.price?.amount || 0)}
                    </Typography>
                  </Grid>

                  {/* Quantity */}
                  <Grid item xs={2} sx={{ textAlign: "center" }}>
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
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>

                  {/* Total */}
                  <Grid item xs={2} sx={{ textAlign: "right" }}>
                    <Typography fontWeight="bold">
                      {formatCurrency(
                        (item.price?.amount || 0) * item.quantity
                      )}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </>
        )}
      </Box>

      {/* Order Summary */}
      {cartItems.length > 0 && (
        <Box
          sx={{
            borderTop: "1px solid #e0e0e0",
            p: 2,
            backgroundColor: "#fafafa",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            ORDER SUMMARY
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography>Subtotal</Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              {formatCurrency(subtotal)}
            </Typography>
          </Box>

          {/* Coupon Code */}
          <Box sx={{ mb: 2 }}>
            <Typography gutterBottom>Coupon Code</Typography>
            <TextField
              fullWidth
              placeholder="Enter Coupon Code"
              size="small"
              value={couponCode}
              onChange={handleCouponChange}
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color="textSecondary">
              Coupon code will be applied on the checkout page
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Total */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>TOTAL:</Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {formatCurrency(total)}
            </Typography>
          </Box>

          {/* Checkout Buttons */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              mb: 1,
              py: 1.5,
              backgroundColor: "#f9d100",
              color: "#000",
              "&:hover": {
                backgroundColor: "#e0be00",
              },
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
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
            onClick={onClose}
          >
            CONTINUE SHOPPING
          </Button>
        </Box>
      )}

      {/* Continue Shopping Button (Empty Cart) */}
      {cartItems.length === 0 && (
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              py: 1.5,
              backgroundColor: "#000",
              color: "#f9d100",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
            onClick={onClose}
          >
            CONTINUE SHOPPING
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default MainCart;
