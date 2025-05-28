import React, { useEffect, useState, useContext } from "react";

import { auth, db } from "../Firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Modal,
  Grid,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  Tooltip,
  Menu,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CloseIcon from "@mui/icons-material/Close";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { MyContext } from "../Context/FilterContaext";

const governorates = [
  "Cairo",
  "Giza",
  "Alexandria",
  "6th of October",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbiya",
  "Ismailia",
  "Menofia",
  "Minya",
  "Qaliubiya",
  "New Valley",
  "Suez",
  "Aswan",
  "Assiut",
  "Beni Suef",
  "Port Said",
  "Damietta",
  "Sharkia",
  "South Sinai",
  "Kafr Al sheikh",
  "Matrouh",
  "Luxor",
  "Qena",
  "North Sinai",
  "Sohag",
];
const governoratesAr = [
  "القاهرة", // Cairo
  "الجيزة", // Giza
  "الإسكندرية", // Alexandria
  "6 أكتوبر", // 6th of October
  "الدقهلية", // Dakahlia
  "البحر الأحمر", // Red Sea
  "البحيرة", // Beheira
  "الفيوم", // Fayoum
  "الغربية", // Gharbiya
  "الإسماعيلية", // Ismailia
  "المنوفية", // Menofia
  "المنيا", // Minya
  "القليوبية", // Qaliubiya
  "الوادي الجديد", // New Valley
  "السويس", // Suez
  "أسوان", // Aswan
  "أسيوط", // Assiut
  "بني سويف", // Beni Suef
  "بورسعيد", // Port Said
  "دمياط", // Damietta
  "الشرقية", // Sharkia
  "جنوب سيناء", // South Sinai
  "كفر الشيخ", // Kafr Al sheikh
  "مطروح", // Matrouh
  "الأقصر", // Luxor
  "قنا", // Qena
  "شمال سيناء", // North Sinai
  "سوهاج", // Sohag
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const { position, UPname, UPmail, UPPhone } = useContext(MyContext);
  const [profile, setProfile] = useState({
    firstName: UPname,
    lastName: "",
    email: user?.email || "",
    addresses: [],
  });
  const [address, setAddress] = useState({
    country: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    governorate: "",
    postalCode: "",
    phone: "+20",
    isDefault: false,
  });
  const [editModal, setEditModal] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setProfile((prev) => ({ ...prev, email: firebaseUser.email }));
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile((prev) => ({ ...prev, ...data }));
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handlers for profile edit
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleProfileSave = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await setDoc(
      docRef,
      {
        firstName: profile.firstName,
        lastName: profile.lastName,
      },
      { merge: true }
    );
    setEditModal(false);
  };

  // Handlers for address
  const handleAddressChange = (e) => {b
    setAddress({ ...address, [e.target.name]: e.target.value });
  };
  const handleAddressCheckbox = (e) => {
    setAddress({ ...address, isDefault: e.target.checked });
  };
  const handleAddressSave = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const newAddresses = [...(profile.addresses || []), address];
    await setDoc(docRef, { addresses: newAddresses }, { merge: true });
    setProfile((prev) => ({ ...prev, addresses: newAddresses }));
    setAddress({
      country: "Egypt",
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      governorate: "",
      postalCode: "",
      phone: "+20",
      isDefault: false,
    });
    setAddressModal(false);
  };

  // Profile menu handlers
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };
  const handleLogout = () => {
    handleProfileMenuClose();
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!user) return <Typography>You must signup</Typography>;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f8fa", py: 6, mt: 0, gap: 2 }}>
      {/* Header Section */}
      <Box
        sx={{
          position: "absolute",
          top: 44,
          left: 40,
          right: 40,
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          maxWidth: "30wh",
          bgcolor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          borderRadius: "12px",
          p: 1,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Button
          onClick={() => navigate("/")}
          startIcon={<HomeOutlinedIcon sx={{ fontSize: 20 }} />}
          sx={{
            fontSize: "15px",
            color: "#444",
            transition: "all 0.3s ease",
            borderRadius: "8px",
            px: 2,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              transform: "scale(1.05)",
              color: "primary.main",
              "& .MuiSvgIcon-root": {
                color: "primary.main",
              }
            },
          }}
        >
          {t("Home.NavBar.Profile.home")}
        </Button>
        <IconButton 
          aria-label="profile" 
          onClick={handleProfileMenuOpen}
          sx={{
            transition: "all 0.3s ease",
            bgcolor: "rgba(0, 0, 0, 0.02)",
            borderRadius: "8px",
            p: 1,
            "&:hover": {
              transform: "scale(1.1)",
              bgcolor: "rgba(0, 0, 0, 0.04)",
              "& .MuiSvgIcon-root": {
                color: "primary.main",
              }
            }
          }}
        >
          <PermIdentityIcon sx={{ color: "#444", fontSize: 38 }} />
        </IconButton>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          marginTop: 12,
          px: 2,
        }}
      >
        {/* Profile Card */}
        <Card sx={{ borderRadius: 4, boxShadow: 3, overflow: "hidden" }}>
          <CardContent sx={{ p: 4 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"

              mb={3}
            >
              <Typography variant="h5" fontWeight={700} color="primary">
                {t("Home.NavBar.Profile.profile")}
              </Typography>
              <Tooltip title="Edit name">
                  <IconButton size="small" onClick={() => setEditModal(true)}>
                    <EditIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip> 
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Name Section */}
            <Box sx={{ mb: 4 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                  {t("Home.NavBar.Profile.name")}
                </Typography>
              
              </Box>
              <Typography 
                color="text.secondary" 
                sx={{ 
                  fontSize: "1.1rem",
                  bgcolor: "#f5f5f5",
                  p: 1.5,
                  borderRadius: 1
                }}
              >
                {profile.firstName || profile.lastName
                  ? `${profile.firstName} ${profile.lastName}`
                  : "-"}
              </Typography>
            </Box>

            {/* Email Section */}
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                  {t("Home.NavBar.Profile.email")}
                </Typography>
              </Box>
              <Typography 
                color="text.secondary"
                sx={{ 
                  fontSize: "1.1rem",
                  bgcolor: "#f5f5f5",
                  p: 1.5,
                  borderRadius: 1,
                  wordBreak: "break-word"
                }}
              >
                {user?.email || "-"}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { 
            minWidth: 260, 
            borderRadius: 3, 
            boxShadow: 6, 
            p: 0,
            mt: 1
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            p: 2,
            pb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <PermIdentityIcon sx={{ color: "primary.main", fontSize: 28 }} />
            <Typography variant="body2" color="text.secondary">
              {user?.email || ""}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <MenuItem 
          onClick={handleLogout}
          sx={{ 
            color: "error.main",
            "&:hover": { bgcolor: "error.lighter" }
          }}
        >
          Log out
        </MenuItem>
      </Menu>

      {/* Edit Profile Modal */}
      <Modal 
        open={editModal} 
        onClose={() => setEditModal(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 4,
            minWidth: { xs: "90%", sm: 400 },
            maxWidth: 500,
            maxHeight: "90vh",
            overflow: "auto"
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Edit profile</Typography>
            <IconButton onClick={() => setEditModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label={t("Home.NavBar.Profile.first_name")}
                name="firstName"
                value={profile.firstName}
                onChange={handleProfileChange}
                fullWidth
                autoFocus
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("Home.NavBar.Profile.last_name")}
                name="lastName"
                value={profile.lastName}
                onChange={handleProfileChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t("Home.NavBar.Profile.email")}
                value={profile.email}
                fullWidth
           
                helperText={t("Home.NavBar.Profile.email_helper")}
              
                
              />
            </Grid>
          </Grid>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
          >
            <Button
              onClick={() => setEditModal(false)}
              color="primary"
              variant="outlined"
              sx={{ borderRadius: 3 }}
            >
              {t("Home.NavBar.Profile.cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleProfileSave}
              sx={{ borderRadius: 3 }}
            >
              {t("Home.NavBar.Profile.save")}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Profile;
