import { db } from "../Firebase/firebase";
import { doc, setDoc, deleteDoc, getDoc, updateDoc, getDocs, collection, increment } from "firebase/firestore";

export const addToCart = async (userId, product, quantity = 1) => {
  try {
    if (!product?.id) throw new Error("Invalid product data");

    const ref = doc(db, `users/${userId}/cart/${product.id}`);
    const existingDoc = await getDoc(ref);

    if (existingDoc.exists()) {
      await updateDoc(ref, {
        quantity: increment(quantity),
        price: increment(product.price?.amount * quantity),
      });
    } else {
      await setDoc(ref, {
        id: product.id,
        title: product.title,
        image: product.image?.src,
        unitPrice: product.price?.amount,
        price: product.price?.amount * quantity,
        category: product.category || "unknown",
        quantity,
      });
    }
  } catch (error) {
    console.error("Cart error:", error);
    throw error;
  }
};

export const removeFromCart = async (userId, productId) => {
  try {
    const ref = doc(db, `users/${userId}/cart/${productId}`);
    await deleteDoc(ref);
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

export const updateCartQuantity = async (userId, productId, newQty) => {
  try {
    if (newQty < 1 || isNaN(newQty)) return;

    const ref = doc(db, `users/${userId}/cart/${productId}`);
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      const productData = docSnap.data();
      const unitPrice = productData.unitPrice || productData.price / productData.quantity;

      await updateDoc(ref, {
        quantity: newQty,
        price: unitPrice * newQty,
      });
    }
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    throw error;
  }
};

export const getCartItems = async (userId) => {
  try {
    const snapshot = await getDocs(collection(db, `users/${userId}/cart`));
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error getting cart items:", error);
    throw error;
  }
};
