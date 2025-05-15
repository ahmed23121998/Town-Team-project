import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  Badge,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  InputBase,
  Modal,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import SearchIcon from "@mui/icons-material/Search";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloseIcon from "@mui/icons-material/Close";
import logo from "./../../assets/TownTeamLogo.png";
import { useTranslation } from "react-i18next";

// Styled Components
const SubMenu = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "120%",
  left: 0,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  zIndex: theme.zIndex.appBar + 1,
  minWidth: 230,
}));

const NestedSubMenu = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: "100%",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  zIndex: theme.zIndex.appBar + 2,
  minWidth: 230,
}));

// SubMenuItem Component
const SubMenuItem = ({ item }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef(null);
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 50);
  };

  const handleSubItemClick = (subitem) => {
    navigate("/ProductList", { state: { category: subitem.category } });
  };

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{ position: "relative" }}
    >
      <MenuItem
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        {item.label}
        <KeyboardArrowRightIcon fontSize="small" />
      </MenuItem>
      {hasSubmenu && open && (
        <NestedSubMenu>
          <MenuList>
            {item.submenu.map((subitem, i) => (
              <React.Fragment key={i}>
                <MenuItem
                  onClick={() => handleSubItemClick(subitem)}
                  sx={{ "&:hover": { textDecoration: "underline" } }}
                >
                  {subitem.label}
                </MenuItem>
                {i < item.submenu.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </MenuList>
        </NestedSubMenu>
      )}
    </Box>
  );
};

// NavItem Component
const NavItem = ({ item }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  const handleClickAway = () => {
    clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  const handleClick = () => {
    if (item.category) {
      navigate("/ProductList", { state: { category: item.category } });
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{ position: "relative", display: "inline-block" }}
      >
        <Button
          disableRipple
          sx={{ color: "white", fontWeight: "bold", position: "relative" }}
          onClick={handleClick}
        >
          {item.label}
          {item.tag && (
            <Box
              sx={{
                position: "absolute",
                top: -12,
                right: -12,
                backgroundColor:
                  item.tag === "New"
                    ? "green"
                    : item.tag === "Sale"
                    ? "red"
                    : "orange",
                color: "white",
                fontSize: 12,
                px: 0.5,
              }}
            >
              {item.tag}
            </Box>
          )}
        </Button>
        {item.submenu && open && (
          <SubMenu>
            <MenuList>
              {item.submenu.map((sub, i) => (
                <React.Fragment key={i}>
                  {!sub.submenu ? (
                    <MenuItem
                      onClick={() =>
                        navigate("/ProductList", {
                          state: { category: sub.category },
                        })
                      }
                    >
                      {sub.label}
                    </MenuItem>
                  ) : (
                    <SubMenuItem item={sub} />
                  )}
                  {i < item.submenu.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </MenuList>
          </SubMenu>
        )}
      </Box>
    </ClickAwayListener>
  );
};

// NavBar Component
export default function NavBar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [language, setLanguage] = useState("EN");
  const [openSearch, setOpenSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const showSuggestions = isFocused || searchValue.length > 0;

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang.toLowerCase());
    handleClose();
  };

  const handleSearch = () => {
    if (searchValue) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
      setOpenSearch(false);
      setSearchValue("");
    }
  };

  const navItems = [
    {
      label: t("Home.NavBar.Menu.MEN"),
      category: "men/closes/Boys Sweatshirts",
      submenu: [
        {
          label: t("Home.NavBar.SubMenu.ACCESSORIES"),
          category: "men/accessories/Perfumes",
          submenu: [
            {
              label: t("Home.NavBar.SubMenu.BAGS"),
              category: "men/accessories/Bags",
            },
            {
              label: t("Home.NavBar.SubMenu.BELTS"),
              category: "men/accessories/Belts",
            },
            {
              label: t("Home.NavBar.SubMenu.BODY CARE"),
              category: "men/accessories/Body Care",
            },
            {
              label: t("Home.NavBar.SubMenu.BODY SPLASH"),
              category: "men/accessories/Body Splash",
            },
            {
              label: t("Home.NavBar.SubMenu.BOXERS"),
              category: "men/accessories/Boxers",
            },
            {
              label: t("Home.NavBar.SubMenu.DEODORANT"),
              category: "men/accessories/Deodorant",
            },
            {
              label: t("Home.NavBar.SubMenu.GLOVES"),
              category: "men/accessories/Gloves",
            },
            {
              label: t("Home.NavBar.SubMenu.ICE CAPS"),
              category: "men/accessories/Ice Caps",
            },
            {
              label: t("Home.NavBar.SubMenu.PERFUMES"),
              category: "men/accessories/Perfumes",
            },
            {
              label: t("Home.NavBar.SubMenu.SETS"),
              category: "men/accessories/Sets",
            },
            {
              label: t("Home.NavBar.SubMenu.SOCKS"),
              category: "men/accessories/Socks",
            },
            {
              label: t("Home.NavBar.SubMenu.WALLETS"),
              category: "men/accessories/Wallets",
            },
          ],
        },
        {
          label: t("Home.NavBar.SubMenu.CLOSES"),
          category: "men/closes",
          submenu: [
            {
              label: t("Home.NavBar.SubMenu.BOYS JACKETS"),
              category: "men/closes/Boys Jackets",
            },
            {
              label: t("Home.NavBar.SubMenu.BOYS PULLOVERS"),
              category: "men/closes/Boys Pullovers",
            },
            {
              label: t("Home.NavBar.SubMenu.BOYS SWEATSHIRTS"),
              category: "men/closes/Boys Sweatshirts",
            },
          ],
        },
        {
          label: t("Home.NavBar.SubMenu.SHOES"),
          category: "men/shoes",
          submenu: [
            {
              label: t("Home.NavBar.SubMenu.CANVAS"),
              category: "men/shoes/Canvas",
            },
            {
              label: t("Home.NavBar.SubMenu.LEATHER"),
              category: "men/shoes/Leather",
            },
            {
              label: t("Home.NavBar.SubMenu.SNEAKERS"),
              category: "men/shoes/Sneakers",
            },
            {
              label: t("Home.NavBar.SubMenu.SPORT"),
              category: "men/shoes/Sport",
            },
          ],
        },
        {
          label: t("Home.NavBar.SubMenu.TROUSERS"),
          category: "men/trousers",
          submenu: [
            {
              label: t("Home.NavBar.SubMenu.JEANS"),
              category: "men/trousers/Jeans",
            },
            {
              label: t("Home.NavBar.SubMenu.JOGGERS"),
              category: "men/trousers/Joggers",
            },
            {
              label: t("Home.NavBar.SubMenu.PANTS"),
              category: "men/trousers/Pants",
            },
            {
              label: t("Home.NavBar.SubMenu.RELAXED FIT"),
              category: "men/trousers/Relaxed Fit",
            },
          ],
        },
      ],
    },
    {
      label: t("Home.NavBar.Menu.KIDS"),
      category: "kids/closes/Boys Sweatshirts",
      submenu: [
        {
          label: t("Home.NavBar.SubMenu.ACCESSORIES"),
          category: "kids/accessories",
          submenu: [
            {
              label: t("Home.NavBar.SubMenu.BAGS"),
              category: "kids/accessories/Bags",
            },
            {
              label: t("Home.NavBar.SubMenu.BELTS"),
              category: "kids/accessories/Belts",
            },
            {
              label: t("Home.NavBar.SubMenu.BODY CARE"),
              category: "kids/accessories/Body Care",
            },
            {
              label: t("Home.NavBar.SubMenu.BODY SPLASH"),
              category: "kids/accessories/Body Splash",
            },
            {
              label: t("Home.NavBar.SubMenu.BOXERS"),
              category: "kids/accessories/Boxers",
            },
            {
              label: t("Home.NavBar.SubMenu.DEODORANT"),
              category: "kids/accessories/Deodorant",
            },
            {
              label: t("Home.NavBar.SubMenu.GLOVES"),
              category: "kids/accessories/Gloves",
            },
            {
              label: t("Home.NavBar.SubMenu.ICE CAPS"),
              category: "kids/accessories/Ice Caps",
            },
            {
              label: t("Home.NavBar.SubMenu.PERFUMES"),
              category: "kids/accessories/Perfumes",
            },
            {
              label: t("Home.NavBar.SubMenu.SETS"),
              category: "kids/accessories/Sets",
            },
            {
              label: t("Home.NavBar.SubMenu.SOCKS"),
              category: "kids/accessories/Socks",
            },
            {
              label: t("Home.NavBar.SubMenu.WALLETS"),
              category: "kids/accessories/Wallets",
            },
          ],
        },
        {
          label: t("Home.NavBar.SubMenu.CLOSES"),
          category: "kids/closes",
          submenu: [
            {
              label: t("Home.NavBar.SubMenu.BOYS JACKETS"),
              category: "kids/closes/Boys Jackets",
            },
            {
              label: t("Home.NavBar.SubMenu.BOYS PULLOVERS"),
              category: "kids/closes/Boys Pullovers",
            },
            {
              label: t("Home.NavBar.SubMenu.BOYS SWEATSHIRTS"),
              category: "kids/closes/Boys Sweatshirts",
            },
          ],
        },
        {
          label: t("Home.NavBar.SubMenu.SHOES"),
          category: "kids/shoes",
          submenu: [
            {
              label: t("Home.NavBar.SubMenu.CANVAS"),
              category: "kids/shoes/Canvas",
            },
            {
              label: t("Home.NavBar.SubMenu.CASUAL"),
              category: "kids/shoes/Casual",
            }, // Added "Casual" based on Firestore
            {
              label: t("Home.NavBar.SubMenu.LEATHER"),
              category: "kids/shoes/Leather",
            },
            {
              label: t("Home.NavBar.SubMenu.SNEAKERS"),
              category: "kids/shoes/Sneakers",
            },
            {
              label: t("Home.NavBar.SubMenu.SPORT"),
              category: "kids/shoes/Sport",
            },
          ],
        },
        {
          label: t("Home.NavBar.SubMenu.TROUSERS"),
          category: "kids/trousers",
          submenu: [
            {
              label: t("Home.NavBar.SubMenu.JEANS"),
              category: "kids/trousers/Jeans",
            },
            {
              label: t("Home.NavBar.SubMenu.JOGGERS"),
              category: "kids/trousers/Joggers",
            },
            {
              label: t("Home.NavBar.SubMenu.PANTS"),
              category: "kids/trousers/Pants",
            },
            {
              label: t("Home.NavBar.SubMenu.RELAXED FIT"),
              category: "kids/trousers/Relaxed Fit",
            },
          ],
        },
      ],
    },
    {
      label: t("Home.NavBar.Menu.SUMMER"),
      tag: "New",
      category: "summer/summer/Men T-shirts",
      submenu: [
        {
          label: t("Home.NavBar.SubMenu.SUMMER"),
          category: "summer",
          submenu: [
            {
              label: t("Home.NavBar.SubMenu.MEN POLO SHIRTS"),
              category: "summer/summer/Men Polo shirts",
            },
            {
              label: t("Home.NavBar.SubMenu.MEN T-SHIRTS"),
              category: "summer/summer/Men T-shirts",
            },
          ],
        },
      ],
    },
    {
      label: t("Home.NavBar.Menu.WINTER"),
      tag: "Sale",
      category: "winter/winter/Men Pullovers",
      submenu: [
        {
          label: t("Home.NavBar.SubMenu.WINTER"),
          category: "winter",
          submenu: [
            {
              label: t("Home.NavBar.SubMenu.MEN AUTUMN SHIRTS"),
              category: "winter/winter/Men Autumn Shirts",
            },
            {
              label: t("Home.NavBar.SubMenu.MEN JACKETS"),
              category: "winter/winter/Men Jackets",
            },
            {
              label: t("Home.NavBar.SubMenu.MEN PULLOVERS"),
              category: "winter/winter/Men Pullovers",
            },
            {
              label: t("Home.NavBar.SubMenu.MEN SWEATSHIRTS"),
              category: "winter/winter/Men Sweatshirts",
            },
          ],
        },
      ],
    },
    {
      label: t("Home.NavBar.Menu.NEW ARRIVAL"),
      category: "newarrival/newarrival/Men Pullovers",
      submenu: [
        {
          label: t("Home.NavBar.SubMenu.NEW ARRIVAL"),
          category: "new-arrival",
          submenu: [
            {
              label: t("Home.NavBar.SubMenu.MEN JACKETS"),
              category: "newarrival/newarrival/Men Jackets",
            },
            {
              label: t("Home.NavBar.SubMenu.MEN OVER SHIRTS"),
              category: "newarrival/newarrival/Men Over Shirts",
            },
            {
              label: t("Home.NavBar.SubMenu.MEN PULLOVERS"),
              category: "newarrival/newarrival/Men Pullovers",
            },
            {
              label: t("Home.NavBar.SubMenu.MEN SWEATSHIRTS"),
              category: "newarrival/newarrival/Men Sweatshirts",
            },
          ],
        },
      ],
    },
    {
      label: t("Home.NavBar.Menu.ALL COLLECTIONS"),
      category: "allcollections/summer/Men T-shirts",
      submenu: [
        {
          label: t("Home.NavBar.SubMenu.SHOES"),
          category: "allcollections/shoes",
          submenu: [
            {
              label: t("Home.NavBar.SubMenu.CANVAS"),
              category: "allcollections/shoes/Canvas",
            },
            {
              label: t("Home.NavBar.SubMenu.CASUAL"),
              category: "allcollections/shoes/Casual",
            },
            {
              label: t("Home.NavBar.SubMenu.LEATHER"),
              category: "allcollections/shoes/Leather",
            },
            {
              label: t("Home.NavBar.SubMenu.SNEAKERS"),
              category: "allcollections/shoes/Sneakers",
            },
            {
              label: t("Home.NavBar.SubMenu.SPORT"),
              category: "allcollections/shoes/Sport",
            },
          ],
        },
        {
          label: t("Home.NavBar.SubMenu.SUMMER"),
          category: "allcollections/summer",
          submenu: [
            {
              label: t("Home.NavBar.SubMenu.MEN POLO SHIRTS"),
              category: "allcollections/summer/Men Polo shirts",
            },
            {
              label: t("Home.NavBar.SubMenu.MEN T-SHIRTS"),
              category: "allcollections/summer/Men T-shirts",
            },
          ],
        },
        {
          label: t("Home.NavBar.SubMenu.TROUSERS"),
          category: "allcollections/trousers",
          submenu: [
            {
              label: t("Home.NavBar.SubMenu.JEANS"),
              category: "allcollections/trousers/Jeans",
            },
            {
              label: t("Home.NavBar.SubMenu.JOGGERS"),
              category: "allcollections/trousers/Joggers",
            },
            {
              label: t("Home.NavBar.SubMenu.PANTS"),
              category: "allcollections/trousers/Pants",
            },
            {
              label: t("Home.NavBar.SubMenu.RELAXED FIT"),
              category: "allcollections/trousers/Relaxed Fit",
            },
          ],
        },
        {
          label: t("Home.NavBar.SubMenu.WINTER"),
          category: "allcollections/winter",
          submenu: [
            {
              label: t("Home.NavBar.SubMenu.MEN AUTUMN SHIRTS"),
              category: "allcollections/winter/Men Autumn Shirts",
            },
            {
              label: t("Home.NavBar.SubMenu.MEN JACKETS"),
              category: "allcollections/winter/Men Jackets",
            },
            {
              label: t("Home.NavBar.SubMenu.MEN PULLOVERS"),
              category: "allcollections/winter/Men Pullovers",
            },
            {
              label: t("Home.NavBar.SubMenu.MEN SWEATSHIRTS"),
              category: "allcollections/winter/Men Sweatshirts",
            },
          ],
        },
      ],
    },
  ];

  return (
    <AppBar sx={{ height: 90, backgroundColor: "black" }} elevation={0}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
          <Button
            variant="text"
            sx={{ height: 90 }}
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="TownTeam Logo" style={{ height: 90 }} />
          </Button>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {navItems.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box>
              <IconButton onClick={handleClick} sx={{ padding: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <img
                    src={
                      language === "EN"
                        ? "https://flagcdn.com/gb.svg"
                        : "https://flagcdn.com/eg.svg"
                    }
                    alt={language}
                    width={20}
                  />
                  <Typography sx={{ color: "white", fontSize: 14 }}>
                    {language}
                  </Typography>
                  {anchorEl ? (
                    <KeyboardArrowUpIcon
                      sx={{ color: "white", fontSize: 20 }}
                    />
                  ) : (
                    <KeyboardArrowDownIcon
                      sx={{ color: "white", fontSize: 20 }}
                    />
                  )}
                </Stack>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{ "aria-labelledby": "language-selector" }}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "black",
                    color: "white",
                  },
                }}
              >
                {language === "EN" ? (
                  <MenuItem onClick={() => handleLanguageChange("AR")}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <img
                        src="https://flagcdn.com/eg.svg"
                        alt="AR"
                        width={20}
                      />
                      <Typography>AR</Typography>
                    </Stack>
                  </MenuItem>
                ) : (
                  <MenuItem onClick={() => handleLanguageChange("EN")}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <img
                        src="https://flagcdn.com/gb.svg"
                        alt="EN"
                        width={20}
                      />
                      <Typography>EN</Typography>
                    </Stack>
                  </MenuItem>
                )}
              </Menu>
            </Box>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => setOpenSearch(true)}>
                <SearchIcon sx={{ color: "white", fontSize: 30 }} />
              </IconButton>
              <Modal open={openSearch} onClose={() => setOpenSearch(false)}>
                <Box
                  onClick={() => setOpenSearch(false)}
                  sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    bgcolor: "rgba(0, 0, 0, 0.85)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      bgcolor: "white",
                      width: "100%",
                      maxWidth: "none",
                      px: 4,
                      py: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      position: "relative",
                    }}
                  >
                    <IconButton
                      onClick={() => setOpenSearch(false)}
                      sx={{ alignSelf: "flex-end", mb: 2 }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <InputBase
                          fullWidth
                          placeholder="Search products..."
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleSearch()
                          }
                          sx={{
                            fontSize: 20,
                            borderBottom: "1px solid gray",
                            pb: 1,
                          }}
                        />
                        <IconButton onClick={handleSearch}>
                          <SearchIcon />
                        </IconButton>
                      </Box>
                      {showSuggestions && (
                        <Box sx={{ mt: 2, width: "100%" }}>
                          <Typography variant="h6">Trending Now</Typography>
                          <Divider sx={{ my: 1, mt: 2 }} />
                          <Stack direction="row" spacing={2}>
                            {[
                              t("Home.NavBar.Search.men jackets"),
                              t("Home.NavBar.Search.pullover"),
                              t("Home.NavBar.Search.sweatshirts"),
                              t("Home.NavBar.Search.t-shirt"),
                              t("Home.NavBar.Search.polo shirt"),
                            ].map((term) => (
                              <Button
                                key={term}
                                sx={{ backgroundColor: "#f7f7f7" }}
                                onClick={() => {
                                  setSearchValue(term);
                                  navigate(`/search?q=${encodeURIComponent(term)}`);
                                  setOpenSearch(false);
                                  setSearchValue("");
                                }}
                              >
                                <Stack direction="row" spacing={1}>
                                  <SearchIcon sx={{ color: "gray" }} />
                                  <Typography sx={{ color: "gray" }}>
                                    {term}
                                  </Typography>
                                </Stack>
                              </Button>
                            ))}
                          </Stack>
                          <Divider sx={{ my: 1, mt: 2 }} />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Modal>
              <IconButton aria-label="user" onClick={() => navigate("/login")}>
                <PermIdentityIcon sx={{ color: "white", fontSize: 30 }} />
              </IconButton>
              <IconButton aria-label="favorite">
                <FavoriteBorderIcon sx={{ color: "white", fontSize: 30 }} />
              </IconButton>
              <IconButton aria-label="add to shopping cart">
                <Badge badgeContent={0} color="success" showZero>
                  <ShoppingCartIcon sx={{ color: "white", fontSize: 30 }} />
                </Badge>
              </IconButton>
              <IconButton aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon sx={{ color: "white", fontSize: 30 }} />
              </IconButton>
            </Stack>
          </Box>
        </Toolbar>
      </Container>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 350 }} role="presentation">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              bgcolor: "#f8f8f8",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Menu</Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {navItems.map((item) => (
              <React.Fragment key={item.label}>
                <ListItem
                  button
                  onClick={() =>
                    navigate("/ProductList", {
                      state: { category: item.category },
                    })
                  }
                >
                  <ListItemText primary={item.label} />
                </ListItem>
                {item.submenu.map((sub) => (
                  <React.Fragment key={sub.label}>
                    <ListItem
                      button
                      sx={{ pl: 4 }}
                      onClick={() =>
                        navigate("/ProductList", {
                          state: { category: sub.category },
                        })
                      }
                    >
                      <ListItemText primary={sub.label} />
                    </ListItem>
                    {sub.submenu &&
                      sub.submenu.map((subitem) => (
                        <ListItem
                          button
                          key={subitem.label}
                          sx={{ pl: 8 }}
                          onClick={() =>
                            navigate("/ProductList", {
                              state: { category: subitem.category },
                            })
                          }
                        >
                          <ListItemText primary={subitem.label} />
                        </ListItem>
                      ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
            <Divider />
            <ListItem
              button
              onClick={() => {
                handleLanguageChange(language === "EN" ? "AR" : "EN");
                toggleDrawer(false)();
              }}
            >
              <ListItemText
                primary={`Switch to ${language === "EN" ? "AR" : "EN"}`}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}