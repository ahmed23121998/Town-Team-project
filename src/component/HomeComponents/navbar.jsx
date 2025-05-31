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
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloseIcon from "@mui/icons-material/Close";
import logo from "./../../assets/TownTeamLogo.png";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { MyContext } from "../../Context/FilterContaext.js";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MainPage from "../../AI-CHAT-PUT/components/MainPage/MianPage.jsx";

const SubMenu = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "120%",
  left: 0,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  zIndex: theme.zIndex.appBar + 1,
  minWidth: 230,
}));
const NestedSubMenu = styled(Paper)(({ theme, language }) => ({
  position: "absolute",
  top: 0,
  left: language === "EN" ? "100%" : "-100%",
  // left: language === "EN" ?{ xs:"-100%"} : {"100%"},

  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  zIndex: theme.zIndex.appBar + 2,
  minWidth: 230,
}));
// SubMenuItem Component
const SubMenuItem = ({ item, position, language }) => {
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
          flexDirection: language === "EN" ? "row" : "auto",
          justifyContent: "space-between",
          alignItems: "center",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        {item.label}
        {language === "EN" ? (
          <KeyboardArrowRightIcon fontSize="small" />
        ) : (
          <KeyboardArrowLeftIcon fontSize="small" />
        )}
      </MenuItem>
      {hasSubmenu && open && (
        <NestedSubMenu position={position} language={language}>
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
const NavItem = ({ item, position, language }) => {
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
                    <SubMenuItem
                      item={sub}
                      position={position}
                      language={language}
                    />
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

export default function NavBar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerOpenChat, setDrawerOpenChar] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [language, setLanguage] = useState("EN");
  const [openSearch, setOpenSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const showSuggestions = isFocused || searchValue.length > 0;
  const { cartItems, position } = useContext(MyContext);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 280);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem("userId"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };
  const toggleChatDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "c" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpenChar(open);
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

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth", transitionDuration: "1.5s" });
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
              label: t("Home.NavBar.SubMenu.CASUAL"),
              category: "men/shoes/Casual",
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
    <AppBar
      sx={{ height: { xs: 70, md: 90 }, backgroundColor: "black" }}
      elevation={0}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 0.5, sm: 2 }, mb: { sx: 50 } }}>
        <Toolbar
          sx={{
            flexDirection: { xs: "row", md: "row" },
            alignItems: { xs: "", md: "center" },
            justifyContent: "space-between",
            px: { xs: 0.5, sm: 2 },
            minHeight: { xs: 70, md: 90 },
            display: "flex",
          }}
        >
          <Button
            variant="text"
            sx={{
              height: { xs: 50, md: 70 },
              minWidth: 70,
              p: 0,
              mr: { xs: 0, sm: 2 },
              mb: { xs: 1, md: 0 },

              color: "white",
              gap: { xs: " 52vw", sm: "70vw", md: 2 },
              // marginRight: { xs: 20 },
            }}
          >
            <img
              onClick={() => navigate("/")}
              src={logo}
              alt="TownTeam Logo"
              style={{ height: 50, maxWidth: 100, width: "auto" }}
            />
            <IconButton
              onClick={handleClick}
              sx={{
                padding: 0,
                display: { xs: "flex", md: "flex", lg: "none" },
              }}
            >
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
                  <KeyboardArrowUpIcon sx={{ color: "white", fontSize: 20 }} />
                ) : (
                  <KeyboardArrowDownIcon
                    sx={{ color: "white", fontSize: 20 }}
                  />
                )}
              </Stack>
            </IconButton>
          </Button>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {navItems.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                language={language}
                position={position}
              />
            ))}
          </Box>
          <Box
            sx={{
              // display: "flex",
              display: { xs: "none", md: "none", lg: "flex" },
              alignItems: "center",
              gap: { xs: 0.5, sm: 2 },
              width: { xs: "100%", md: "auto" },
              justifyContent: { xs: "flex-end", md: "flex-end" },
              mt: { xs: -4, md: 0 },
            }}
          >
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
              <IconButton
                onClick={() => setOpenSearch(true)}
                sx={{
                  bgcolor: {
                    xs: "transparent",
                    md: "transparent",
                    lg: "black",
                  },
                }}
              >
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
                                  navigate(
                                    `/search?q=${encodeURIComponent(term)}`
                                  );
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
              <IconButton
                aria-label="user"
                onClick={() => navigate("/login")}
                sx={{
                  bgcolor: {
                    xs: "transparent",
                    md: "transparent",
                    lg: "black",
                  },
                }}
              >
                <PermIdentityIcon sx={{ color: "white", fontSize: 30 }} />
              </IconButton>
              <IconButton
                aria-label="favorite"
                onClick={() => navigate("/Wishlist")}
                sx={{
                  bgcolor: {
                    xs: "transparent",
                    md: "transparent",
                    lg: "black",
                  },
                }}
              >
                <Badge color="success" showZero>
                  <FavoriteBorderIcon sx={{ color: "white", fontSize: 30 }} />
                </Badge>
              </IconButton>
              <IconButton
                aria-label="add to shopping cart"
                onClick={() => navigate("/MainCart")}
                sx={{
                  bgcolor: {
                    xs: "transparent",
                    md: "transparent",
                    lg: "black",
                  },
                }}
              >
                <Badge
                  badgeContent={userId ? cartItems?.length || 0 : 0}
                  color="primary"
                  showZero
                >
                  <ShoppingCartIcon sx={{ color: "white", fontSize: 30 }} />
                </Badge>
              </IconButton>
              <IconButton
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{
                  bgcolor: {
                    xs: "transparent",
                    md: "transparent",
                    lg: "black",
                  },
                }}
              >
                <MenuIcon sx={{ color: "white", fontSize: 30 }} />
              </IconButton>
            </Stack>
          </Box>
        </Toolbar>
      </Container>

      <Box
        sx={{
          display: { xs: "flex", md: "flex", lg: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100vw",
          bgcolor: "white",
          zIndex: 1400,
          justifyContent: "space-around",
          alignItems: "center",
          py: 1,
          boxShadow: 3,
        }}
      >
        <IconButton
          onClick={() => setOpenSearch(true)}
          sx={{ bgcolor: "white" }}
        >
          <SearchIcon sx={{ color: "black", fontSize: 28 }} />
        </IconButton>
        <IconButton
          aria-label="user"
          onClick={() => navigate("/login")}
          sx={{ bgcolor: "white" }}
        >
          <PermIdentityIcon sx={{ color: "black", fontSize: 28 }} />
        </IconButton>
        <IconButton
          aria-label="favorite"
          onClick={() => navigate("/Wishlist")}
          sx={{ bgcolor: "white" }}
        >
          <Badge color="success" showZero>
            <FavoriteBorderIcon sx={{ color: "black", fontSize: 28 }} />
          </Badge>
        </IconButton>
        <IconButton
          aria-label="add to shopping cart"
          onClick={() => navigate("/MainCart")}
          sx={{ bgcolor: "white" }}
        >
          <Badge
            badgeContent={userId ? cartItems?.length || 0 : 0}
            color="primary"
            showZero
          >
            <ShoppingCartIcon sx={{ color: "black", fontSize: 28 }} />
          </Badge>
        </IconButton>
        <IconButton
          aria-label="menu"
          onClick={toggleDrawer(true)}
          sx={{ bgcolor: "white" }}
        >
          <MenuIcon sx={{ color: "black", fontSize: 28 }} />
        </IconButton>
      </Box>
      <Drawer
        anchor={position}
        open={drawerOpen}
        sx={{
          "& .MuiDrawer-paper": {
            width: 350,
            backgroundColor: "#f8f8f8",
            direction: language === "AR" ? "rtl" : "ltr",
          },
        }}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 350, direction: language === "AR" ? "rtl" : "ltr" }}
          role="presentation"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              bgcolor: "#f8f8f8",
              direction: language === "AR" ? "rtl" : "ltr",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Menu</Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List
            sx={{
              width: "100%",
              bgcolor: "#f8f8f8",
              position: "relative",
              direction: language === "AR" ? "rtl" : "ltr",
            }}
          >
            {navItems.map((item) => (
              <React.Fragment
                sx={{ direction: language === "AR" ? "rtl" : "ltr" }}
                key={item.label}
                // right={position === "right" ? true : false}
              >
                <ListItem
                  button
                  sx={{
                    direction: language === "AR" ? "ltr" : " rtl",
                  }}
                  onClick={() =>
                    navigate("/ProductList", {
                      state: { category: item.category },
                    })
                  }
                >
                  <ListItemText
                    primary={item.label}
                    sx={{
                      textAlign: language === "AR" ? "right" : "left",
                      direction: language === "AR" ? "rtl" : "ltr",
                    }}
                  />
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
                      <ListItemText
                        primary={sub.label}
                        sx={{
                          textAlign: language === "AR" ? "right" : "left",
                          direction: language === "AR" ? "rtl" : "ltr",
                        }}
                      />
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
                          <ListItemText
                            primary={subitem.label}
                            sx={{
                              textAlign: language === "AR" ? "right" : "left",
                              direction: language === "AR" ? "rtl" : "ltr",
                            }}
                          />
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
                sx={{
                  textAlign: language === "AR" ? "right" : "left",
                  direction: language === "AR" ? "rtl" : "ltr",
                  cursor: "pointer",
                }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Drawer
        anchor={position}
        open={drawerOpenChat}
        onClose={toggleChatDrawer(false)}
        transitionDuration={500}
        sx={{
          "& .MuiDrawer-paper": {
            maxWidth: { xs: "100vw", md: "60vw" },
            backgroundColor: { xs: "black", md: "#f8f8f8" },
            textAlign: language === "AR" ? "right" : "left",
            direction: language === "AR" ? "rtl" : "ltr",
          },
        }}
      >
        <MainPage toggleChatDrawer={toggleChatDrawer} />
      </Drawer>
      <IconButton
        onClick={toggleChatDrawer(true)}
        sx={{
          borderRadius: { xs: 2, sm: 3, md: 3, lg: "50%" },
          mt: { xs: 10, sm: 2, md: 4, lg: 46 },
          bgcolor: "#fcdc3a",
          width: { xs: 40, sm: 48, md: 56, lg: 60 },
          height: { xs: 40, sm: 48, md: 56, lg: 60 },
          position: { xs: "fixed", md: "fixed", lg: "static" },
          bottom: { xs: 68, sm: 120, md: 240, lg: "auto" },
          right: { xs: 12, sm: 16, md: 24, lg: 0 },
          zIndex: 1301,
          boxShadow: { xs: 2, sm: 3, md: 4, lg: 5 },
        }}
      >
        <ChatBubbleOutlineIcon
          sx={{
            bgcolor: {
              xs: "transparent",
              sm: "transparent",
              md: "transparent",
              lg: "#fcdc3a",
            },
            fontSize: { xs: 26, sm: 32, md: 40, lg: 48 },
            borderRadius: { xs: 2, sm: 3, md: 3, lg: "50%" },
            color: "black",
            width: { xs: 32, sm: 36, md: 44, lg: 48 },
            height: { xs: 32, sm: 36, md: 44, lg: 48 },
            "&:hover": { bgcolor: { xs: "#ffe066", lg: "#ffe066" } },
            transition: "all 0.2s",
          }}
        />
      </IconButton>

      {showScrollTop && (
        <IconButton
          onClick={handleScrollToTop}
          sx={{
            bgcolor: "white",
            fontSize: { xs: 26, sm: 32, md: 40, lg: 48 },
            borderRadius: { xs: 2, sm: 3, md: 3, lg: "50%" },
            color: "black",
            boxShadow: { xs: 2, sm: 3, md: 4, lg: 5 },
            width: { xs: 40, sm: 48, md: 56, lg: 60 },
            height: { xs: 40, sm: 48, md: 56, lg: 60 },
            // bottom: { xs: 68, sm: 120, md: 240, lg: "auto" },
            bottom: { xs: 120, sm: 150, md: 304, lg: "auto" },
            right: { xs: 12, sm: 16, md: 24, lg: 16 },
            position: { xs: "fixed", md: "fixed", lg: "static" },
            "&:hover": { bgcolor: "#ffe066" },
            transition: "all 0.3s",
          }}
        >
          <KeyboardArrowUpIcon
            sx={{ fontSize: { xs: 20, sm: 28, md: 36, lg: 40 } }}
          />
        </IconButton>
      )}
      <style>{`
        @media (max-width: 900px) {
          .MuiToolbar-root {
            flex-direction: column !important;
            align-items: flex-start !important;
            height: auto !important;
            padding: 8px 0 !important;
          }
        }
        @media (max-width: 600px) {
          .MuiContainer-root {
            padding-left: 2px !important;
            padding-right: 2px !important;
          }
          .MuiToolbar-root {
            padding-left: 2px !important;
            padding-right: 2px !important;
          }
        }
      `}</style>
    </AppBar>
  );
};