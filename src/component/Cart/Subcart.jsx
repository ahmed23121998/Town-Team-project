import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { removeFromCart, updateCartQuantity } from "../cartUtils";
import "./SubCart.css";
import { Close } from "@mui/icons-material";

import { IconButton } from "@mui/material";

import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { MyContext } from "../../Context/FilterContaext";

const SubCart = ({ toggleCart }) => {
  const { cartItems, setCartItems } = useContext(MyContext);
  const [loading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [userId] = useState(() => localStorage.getItem("userId"));

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(userId, productId);

      setCartItems(cartItems.filter((item) => item.id !== productId));
    } catch (err) {
      setError("Failed to remove item.");
      console.error(err);
    }
  };

  const [setLoadingItems] = useState({});

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1 || isNaN(newQty)) return;
    if (newQty > 99) newQty = 99;

    setLoadingItems((prev) => ({ ...prev, [productId]: true }));
    try {
      await updateCartQuantity(userId, productId, newQty);
      setCartItems(
        cartItems.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: newQty,
                price: (item.unitPrice || item.price) * newQty,
              }
            : item
        )
      );
    } catch (err) {
      setError("Failed to update quantity.");
      console.error(err);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const total = cartItems
    .reduce((sum, item) => {
      const unitPrice = item.unitPrice || item.price;
      return sum + unitPrice * (item.quantity || 1);
    }, 0)
    .toFixed(2);

  return (
    <>
      {!userId ? (
        <div className="cart-empty">
          <IconButton onClick={() => toggleCart()}>
            <Close />
          </IconButton>
          <h2>{t("Please login to view your cart")}</h2>
        </div>
      ) : (
        <div
          style={{
            // padding: "1rem",

            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontSize: "1.8rem",
              color: "#2d3436",
              marginBottom: "1.5rem",
              borderBottom: "12px solid #098",
              paddingBottom: ".5rem",
            }}
          >
            {t("SubCart.ShoppingCart")}
            <h4 style={{ opacity: "0.5", fontWeight: "bolder" }}>
              {cartItems.length} items
            </h4>
            <IconButton onClick={() => toggleCart()}>
              <Close />
            </IconButton>
          </div>

          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                color: "yellow",
              }}
            >
              <div className="spinner"></div>
              Loading cart items...
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#ffeef0",
                color: "#ff7675",
                borderRadius: "8px",
                margin: "1rem 0",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {!loading && cartItems.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#636e72",
              }}
            >
              ✨ Your cart is empty. Start shopping!
            </div>
          )}

          {!loading && cartItems.length > 0 && (
            <div
              style={{
                marginTop: "0.5rem",
                display: "grid",
                gap: "1.5rem",
                maxHeight: "470px",
                overflow: "scroll",
              }}
            >
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    padding: "0.5rem",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                    transition: "transform 0.2s",
                    ":hover": {
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "90px",

                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        margin: "0 0 0.5rem",
                        color: "#2d3436",
                        fontSize: "1.1rem",
                      }}
                    >
                      {item.title}
                    </h4>

                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        Quantity:
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              parseInt(e.target.value)
                            )
                          }
                          min="1"
                          style={{
                            width: "60px",
                            padding: "0.3rem 0.5rem",
                            border: "1px solid #dfe6e9",
                            borderRadius: "4px",
                            fontSize: "1rem",
                            ":focus": {
                              outline: "2px solid #0984e3",
                              borderColor: "transparent",
                            },
                          }}
                        />
                      </span>

                      <span
                        style={{
                          fontWeight: "700",
                          color: "#ff7675",
                        }}
                      >
                        EGP {item.price.toFixed(2)}
                      </span>
                    </div>

                    <IconButton onClick={() => handleRemove(item.id)}>
                      <Close />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            style={{
              display: "grid",
              marginTop: "1rem",
              paddingTop: "0.5rem",
              // borderTop: "2px solid #dfe6e9",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h4
                style={{
                  fontSize: "1.4rem",
                  margin: "0 0 1rem",
                  color: "#2d3436",
                }}
              >
                {t("SubCart.Total")}
              </h4>
              <h2>{total}EGP</h2>
            </div>

            <button
              style={{
                backgroundColor: "#ffc300",
                color: "black",
                border: "none",

                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() =>
                navigate("/CheckoutForm", {
                  state: {
                    cartItems: cartItems,
                    total: total,
                  },
                })
              }
            >
              {t("SubCart.Checkout")}
            </button>
            <button
              style={{
                backgroundColor: "black",
                color: "#ffc300",
                border: "none",

                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s",
                marginTop: "15px",
              }}
              onClick={() =>
                navigate("/MainCart", {
                  state: {
                    cartItems: cartItems,
                    total: total,
                  },
                })
              }
            >
              View Cart
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SubCart;
