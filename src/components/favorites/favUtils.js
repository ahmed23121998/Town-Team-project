import { db } from "../../Firebase/firebase";
import { doc, setDoc, deleteDoc, getDoc, getDocs, collection, } from "firebase/firestore";

// إضافة منتج إلى المفضلة
export const addToFavorites = async (userId, product) => {
  const ref = doc(db, `favorites/${userId}/items/${product.id}`);
  await setDoc(ref, {
    id: product.id,
    title: product.title,
    image: product.image?.src,
    price: product.price?.amount,
    category: product.category || "unknown",
  });
};

// حذف منتج من المفضلة (تم تصحيح استخدام productId)
export const removeFromFavorites = async (userId, productId) => {
  const ref = doc(db, `favorites/${userId}/items/${productId}`);
  await deleteDoc(ref);
};

// جلب كل المنتجات في المفضلة
export const getFavorites = async (userId) => {
  const favRef = collection(db, `favorites/${userId}/items`);
  const snapshot = await getDocs(favRef);
  return snapshot.docs.map((doc) => doc.data());
};

// التحقق ما إذا كان المنتج موجودًا في المفضلة (تم تصحيح استخدام productId)
export const isFavorite = async (userId, productId) => {
  const ref = doc(db, `favorites/${userId}/items/${productId}`);
  const snapshot = await getDoc(ref);
  return snapshot.exists();
};
