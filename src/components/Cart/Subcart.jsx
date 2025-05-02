import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { MyContext } from "../..//Context/FilterContaext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
// import { Icon } from "@mui/material";
import "../Cart/Subcart.css";

import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
const Subcart = (category) => {
  const { cartProducts, setcartProducts } = useContext(MyContext);
  const [fullProductDetails, setFullProductDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [Quantity, setQuantity] = useState([0, 100]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!cartProducts || cartProducts.length === 0) {
        console.log("Cart is empty.");
        setFullProductDetails([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const productPromises = cartProducts.map(async (product) => {
          const docRef = doc(
            db,
            // `${category}` || ("men", "closes", "Boys Pullovers"),
            "men",
            "closes",
            "Boys Pullovers",
            product.id
          );
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
          } else {
            console.warn(`No product found for ID: ${product.id}`);
            return null;
          }
        });

        const products = await Promise.all(productPromises);
        setFullProductDetails(products.filter((product) => product !== null));
      } catch (err) {
        setError("Error fetching products: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [cartProducts]);

  // const handleQuantityChange = (product) => {
  //   const value = parseInt(e.target.value, 10);
  // };
  console.log("cartProductsFrom the subCart", cartProducts);
  console.log("Full product details:", fullProductDetails);

  return (
    <div style={{ margin: "0px", padding: "20px" }}>
      <h2 style={{ fontWeight: "bolder" }}>Shoppimg Cart</h2>
      <p>{fullProductDetails.length} items</p>
      <div>
        <br />
        <hr style={{ height: "10px", color: "teal" }} />
        <hr style={{ height: "10px", color: "teal" }} />
        <hr />
        <h3 style={{ color: "gray", marginTop: "20px" }}>
          Only LE 200.00 away from free shipping
        </h3>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}
      {fullProductDetails.length > 0 ? (
        fullProductDetails.map((product) => (
          <div
            key={product.id}
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ alignItems: "center" }}>
              <div style={{ display: "flex", gap: "20px" }}>
                <img
                  src={product.image.src}
                  alt={product.title}
                  style={{ width: "90px" }}
                />
                <div>
                  <h3 style={{ marginTop: "10px" }}>{product.title}</h3>
                  <h3 style={{ marginTop: "20px" }}>
                    {product.colors[0]} / {product.sizes[0]}
                    <DriveFileRenameOutlineOutlinedIcon
                      sx={{
                        color: "black",
                        fontSize: 20,
                        marginLeft: "10px",
                      }}
                    />
                  </h3>
                  <p
                    style={{
                      color: "red",
                      fontSize: "20px",
                      fontWeight: "bolder",
                      marginTop: "20px",
                    }}
                  >
                    {product.price?.amount} {product.price?.currencyCode}
                  </p>
                </div>
              </div>
              <div
                style={{
                  border: "1px solid black",
                  width: "100px",
                  height: "45px",
                  marginTop: "20px",
                  borderRadius: "5px",
                  marginLeft: "100px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  boxSizing: "border-box",
                }}
              >
                <span
                  className="cursured"
                  onClick={() => setQuantity((prev) => prev - 1)}
                >
                  -
                </span>
                <input
                  type="number"
                  value={Quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{
                    border: "none",
                    width: "40px",
                    textAlign: "center",
                  }}
                />
                <span
                  className="cursured"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </span>
              </div>
            </div>
            <hr style={{ marginTop: "20px" }} />
          </div>
        ))
      ) : (
        <p>No products in the cart.</p>
      )}
    </div>
  );
};

export default Subcart;
