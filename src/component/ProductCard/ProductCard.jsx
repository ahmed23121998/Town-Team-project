import { useEffect, useState, useCallback, useContext } from "react";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebase.js";
import ProductCardShared from "../ProductCardShared/ProductCardShared.jsx";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../cartUtils.jsx";
import { toast } from "react-hot-toast";
import { MyContext } from "../../Context/FilterContaext.js"; // Ensure this is the correct path
import { getCartItems } from "../cartUtils.jsx"; // Ensure this is the correct path

const ProductCard = ({ product, toggleCart }) => {
  const [inWishlist, setInWishlist] = useState(false);
  const userId = localStorage.getItem("userId");
  const { setCartItems } = useContext(MyContext);

  const navigate = useNavigate();

  const addProductToCart = useCallback(
    async (product) => {
      if (userId === null) {
        toast.error("Please log in to add products to the cart.");
        return;
      }

      if (!product.in_stock || product.quantity <= 0) {
        toast.error(
          "This product is out of stock and cannot be added to the cart."
        );
        return;
      }

      try {
        await addToCart(userId, product, 1);
        const updatedItems = await getCartItems(userId); 
        setCartItems(updatedItems); 
        toggleCart();
        toast.success("Product added to cart!");
      } catch (error) {
        console.error("Cart update failed:", error);
        toast.error(
          "Something went wrong while adding the product to the cart."
        );
      }
    },
    [toggleCart, userId, setCartItems]
  );

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favRef = doc(db, "favorites", userId, "items", product.id);
        const docSnap = await getDoc(favRef);
        setInWishlist(docSnap.exists());
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };
    checkFavorite();
  }, [product.id]);

  const toggleWishlist = useCallback(async () => {
    const favRef = doc(db, "favorites", userId, "items", product.id);
    try {
      if (inWishlist) {
        await deleteDoc(favRef);
        setInWishlist(false);
      } else {
        await setDoc(favRef, {
          ...product,
          addedAt: new Date().toISOString(),
        });
        setInWishlist(true);
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  }, [inWishlist, product]);

  const navigateToDetails = () => {
    navigate("/productDetails", { state: { product } });
  };

  return (
    <ProductCardShared
      product={product}
      onAddToCart={() => addProductToCart(product)}
      onToggleWishlist={toggleWishlist}
      inWishlist={inWishlist}
      navigateToDetails={navigateToDetails}
      showDelete={false}
      showWishlist={true}
      discount={50}
    />
  );
};

export default ProductCard;
