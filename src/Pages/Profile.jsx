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
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
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
  const { position } = useContext(MyContext);

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
  const handleAddressChange = (e) => {
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f8fa", py: 6, mt: 0 }}>
      {/* Home Link */}
      <Box sx={{ position: "absolute", top: 24, left: 40, zIndex: 10 }}>
        <Button
          onClick={() => navigate("/")}
          startIcon={<HomeOutlinedIcon />}
          sx={{
            color: "#444",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              marginBottom: 10,
            },
          }}
        >
          {t("Home.NavBar.Profile.home")}
        </Button>
      </Box>

      {/* أيقونة البروفايل أعلى يمين الصفحة */}
      <Box sx={{ position: "absolute", top: 24, right: 40, zIndex: 10 }}>
        <IconButton aria-label="profile" onClick={handleProfileMenuOpen}>
          <PermIdentityIcon sx={{ color: "#444", fontSize: 38 }} />
        </IconButton>
        <Menu
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={handleProfileMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: { minWidth: 260, borderRadius: 3, boxShadow: 6, p: 0 },
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
              <PermIdentityIcon sx={{ color: "gray", fontSize: 28 }} />
              <Typography variant="body2" color="gray">
                {user?.email || ""}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 1 }} />
          <MenuItem
            onClick={() => {
              handleProfileMenuClose();
              navigate("/profile");
            }}
          >
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </Menu>
      </Box>

      {/* باقي صفحة البروفايل كما هي */}
      <Box
        sx={{
          maxWidth: 700,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* Profile Card */}
        <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h5" fontWeight={700}>
                {t("Home.NavBar.Profile.profile")}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                {t("Home.NavBar.Profile.name")}
              </Typography>
              <Tooltip title="Edit name">
                <IconButton size="small" onClick={() => setEditModal(true)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography color="text.secondary" mb={2}>
              {profile.firstName || profile.lastName
                ? `${profile.firstName} ${profile.lastName}`
                : "-"}
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {t("Home.NavBar.Profile.profile")}
            </Typography>
            <Typography color="text.secondary" mb={2}>
              {t("Home.NavBar.Profile.email")}
            </Typography>
          </CardContent>
        </Card>

        {/* Addresses Card */}
        <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h6" fontWeight={700}>
                {t("Home.NavBar.Profile.addresses")}
              </Typography>
              <Tooltip title="Add address">
                <IconButton
                  color="primary"
                  onClick={() => setAddressModal(true)}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {profile.addresses && profile.addresses.length > 0 ? (
              profile.addresses.map((addr, idx) => (
                <Card
                  key={idx}
                  sx={{
                    mb: 2,
                    bgcolor: addr.isDefault ? "#e3f2fd" : "#fafafa",
                    borderRadius: 3,
                    boxShadow: 1,
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <HomeOutlinedIcon
                        color={addr.isDefault ? "primary" : "action"}
                      />
                      <Typography fontWeight={600}>
                        {addr.isDefault
                          ? "Default address"
                          : `Address ${idx + 1}`}
                      </Typography>
                    </Box>
                    <Typography color="text.secondary">
                      {addr.country}, {addr.city}, {addr.governorate}
                    </Typography>
                    <Typography color="text.secondary">
                      {addr.address}
                      {addr.apartment ? `, ${addr.apartment}` : ""}
                    </Typography>
                    <Typography color="text.secondary">
                      {addr.firstName} {addr.lastName} - {addr.phone}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                py={4}
              >
                <HomeOutlinedIcon
                  sx={{ fontSize: 40, color: "#bdbdbd", mb: 1 }}
                />
                <Typography color="text.secondary">
                  {t("Home.NavBar.Profile.no_addresses")}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Edit Profile Modal */}
      <Modal open={editModal} onClose={() => setEditModal(false)}>
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
            minWidth: 400,
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
                disabled
                helperText={t("Home.NavBar.Profile.email_helper")}
                sx={
                  {
                    // direction: position === "right" ? "ltr" : "ltr",
                  }
                }
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

      {/* Add Address Modal */}
      <Modal
        open={addressModal}
        onClose={() => setAddressModal(false)}
        sx={{ overflowY: "auto", display: "flex", flexDirection: "column" }}
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

            width: { xs: "90%", sm: 600, md: 700 },
            display: "flex",
            flexDirection: "column",
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
            <Typography variant="h6">
              {t("Home.NavBar.Profile.add_address")}
            </Typography>
            <IconButton onClick={() => setAddressModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={address.isDefault}
                onChange={handleAddressCheckbox}
              />
            }
            label={t("Home.NavBar.Profile.default_address_checkbox")}
          />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label={t("Home.NavBar.Profile.country")}
                name="country"
                value={address.country}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("Home.NavBar.Profile.first_name")}
                name="firstName"
                value={address.firstName}
                onChange={handleAddressChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t("Home.NavBar.Profile.last_name")}
                name="lastName"
                value={address.lastName}
                onChange={handleAddressChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t("Home.NavBar.Profile.governorate")}
                name="address"
                value={address.address}
                onChange={handleAddressChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t("Home.NavBar.Profile.apartment")}
                name="apartment"
                value={address.apartment}
                onChange={handleAddressChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={t("Home.NavBar.Profile.city")}
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                // label="G"
                name="governorate"
                value={address.governorate}
                onChange={handleAddressChange}
                fullWidth
              >
                {position === "right"
                  ? governoratesAr.map((gov) => (
                      <MenuItem key={gov} value={gov}>
                        {gov}
                      </MenuItem>
                    ))
                  : governorates.map((gov) => (
                      <MenuItem key={gov} value={gov}>
                        {gov}
                      </MenuItem>
                    ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={t("Home.NavBar.Profile.postal_code")}
                name="postalCode"
                value={address.postalCode}
                onChange={handleAddressChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t("Home.NavBar.Profile.phone")}
                name="phone"
                value={address.phone}
                onChange={handleAddressChange}
                fullWidth
                sx={{
                  paddingLeft: "-1",

                  direction: position === "right" ? "ltr" : "ltr",
                }}
                InputProps={{
                  startAdornment: (
                    <span role="img" aria-label="egypt">
                      🇪🇬
                    </span>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
          >
            <Button
              onClick={() => setAddressModal(false)}
              color="primary"
              variant="outlined"
              sx={{ borderRadius: 3 }}
            >
              {t("Home.NavBar.Profile.cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleAddressSave}
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
