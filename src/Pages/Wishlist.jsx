import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Pagination,
  ToggleButtonGroup,
  ToggleButton,
  styled,
  Breadcrumbs,
  Link,
  IconButton,
} from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
import ProductCardShared from "../component/ProductCardShared/ProductCardShared";
import { addToCart } from "../component/cartUtils";
// import { addToCart } from "../components/cartUtils";
// import ProductCardShared from "../components/ProductCardShared/ProductCardShared";
import { useTranslation } from "react-i18next";

const StyledToggleButton = styled(ToggleButton)(() => ({
  border: "2px solid transparent",
  padding: 4,
  "&.Mui-selected": { borderColor: "#000" },
  "&:not(:last-of-type)": { marginRight: 4 },
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const SaleBadge = styled(Box)(() => ({
  backgroundColor: "#f44336",
  color: "#fff",
  padding: "4px 8px",
  fontSize: "14px",
  fontWeight: "bold",
  position: "absolute",
  top: 8,
  right: 8,
  zIndex: 1,
}));

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [view, setView] = useState("module");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // const { setFav } = useContext(MyContext);
  const userId = localStorage.getItem("userId");
  const itemsPerPage = 3;

  const { t } = useTranslation();
  useEffect(() => {
    if (!userId) {
      setWishlist([]);
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, "favorites", userId, "items"),
      (snapshot) => {
        const items = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            discount: data.discount || 0,
          };
        });
        setWishlist(items);
        // setFav(items);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  const handleDelete = async (id) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, "favorites", userId, "items", id));
      // toast.success("Product removed from wishlist");
    } catch {
      // toast.error("Delete error");
    }
  };

  const AddToCart = async (item) => {
    try {
      await addToCart(userId, item, 1);
      // toast.success("Added to cart!");
    } catch (err) {
      console.error(err);
      // toast.error("Failed to add to cart");
    }
  };

  const idxLast = page * itemsPerPage;
  const idxFirst = idxLast - itemsPerPage;
  const currentItems =
    view === "list" ? wishlist.slice(idxFirst, idxLast) : wishlist;

  const renderCard = (item) => {
    if (!item || !item.id) return null;

    console.log("Rendering item", item); // للمساعدة في تتبع الـ data

    try {
      return (
        <ProductCardShared
          key={item.id}
          product={item}
          view={view}
          onAddToCart={() => AddToCart(item)}
          onToggleWishlist={() => console.log("Toggle Wishlist")}
          onDelete={() => handleDelete(item.id)}
          showDelete={true}
          inWishlist={true}
          discount={item.discount || 0} // استخدمي الخصم الحقيقي بدل ما هو ثابت 50
          navigateToDetails={() => navigate(`/product/${item.id}`)}
          showFullDetails={false}
        />
      );
    } catch (error) {
      console.error("Error rendering item:", item, error);
      return null;
    }
  };

  return (
    <Box sx={{ p: 3, minHeight: "80vh" }}>
      <Breadcrumbs sx={{ mb: 3, opacity: 0.7 }}>
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer" }}
        >
          {/* Home */}
          {t("WISHLIST.HOME")}
        </Link>
        <Typography color="text.primary">{t("WISHLIST.WISHLIST")}</Typography>
      </Breadcrumbs>

      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: "bold", mt: { sx: 58, md: 13 } }}
      >
        {t("WISHLIST.WISHLIST")}
      </Typography>

      {/* Switch View */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
        <Typography>{t("WISHLIST.View as")}</Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(e, v) => v && (setView(v), setPage(1))}
        >
          <StyledToggleButton value="list">
            <ViewListIcon />
          </StyledToggleButton>
          <StyledToggleButton value="agenda">
            <ViewAgendaIcon />
          </StyledToggleButton>
          <StyledToggleButton value="module">
            <ViewModuleIcon />
          </StyledToggleButton>
        </ToggleButtonGroup>
      </Box>

      {loading ? (
        <Typography align="center">Loading...</Typography>
      ) : wishlist.length === 0 ? (
        <Typography
          align="center"
          color="text.secondary"
          sx={{ py: 18, fontSize: "1.8rem" }}
        >
          No products in wishlist.
        </Typography>
      ) : view === "list" ? (
        <>
          {currentItems.map(renderCard)}
          {wishlist.length > itemsPerPage && (
            <Pagination
              count={Math.ceil(wishlist.length / itemsPerPage)}
              page={page}
              onChange={(_, v) => setPage(v)}
              sx={{ display: "flex", justifyContent: "center", mt: 2 }}
            />
          )}
        </>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              view === "agenda" ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            gap: 3,
          }}
        >
          {wishlist.map(renderCard)}
        </Box>
      )}
    </Box>
  );
};

export default Wishlist;
