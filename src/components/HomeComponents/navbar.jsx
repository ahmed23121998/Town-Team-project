import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Container, Box, Button, Divider, Menu, MenuItem, MenuList, Paper, Stack, Badge, Typography, Link, IconButton, Drawer, List, ListItem, ListItemText, InputBase, Modal, colors } from '@mui/material';
import { styled } from '@mui/material/styles';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import SearchIcon from '@mui/icons-material/Search';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import logo from './../../assets/TownTeamLogo.png';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

// ============ Styled Components ============
const SubMenu = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '120%',
    left: 0,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    zIndex: theme.zIndex.appBar + 1,
    minWidth: 230,
}));

const NestedSubMenu = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: '100%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    zIndex: theme.zIndex.appBar + 2,
    minWidth: 230,
}));

// ============ Sub Menu Item Component ============
const SubMenuItem = ({ item }) => {
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

    return (
        <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{ position: 'relative' }}
        >
            <MenuItem
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover': {
                        textDecoration: 'underline',
                    },
                }}
            >
                {item.label}
                <KeyboardArrowRightIcon fontSize="small" />
            </MenuItem>
            {hasSubmenu && open && (
                <NestedSubMenu>
                    <MenuList>
                        {item.submenu.map((label, i) => (
                            <React.Fragment key={i}>
                                <MenuItem
                                    sx={{
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    {label}
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

// ============ Nav Item Component ============
const NavItem = ({ item }) => {
    const [open, setOpen] = React.useState(false);
    const timeoutRef = React.useRef(null);
    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpen(false);
        }, 200);
    };

    const handleClickAway = () => {
        clearTimeout(timeoutRef.current);
        setOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{ position: 'relative', display: 'inline-block' }}
            >
                <Button disableRipple sx={{ color: 'white', fontWeight: 'bold', position: 'relative' }}>
                    {item.label}
                    {item.tag && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -12,
                                right: -12,
                                backgroundColor:
                                    item.tag === 'New' ? 'green' :
                                        item.tag === 'Sale' ? 'red' : 'orange',
                                color: 'white',
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
                                    {typeof sub === 'string' || !sub.submenu ? (
                                        <MenuItem>{sub.label || sub}</MenuItem>
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

// ============ NavBar Component ============
export default function NavBar() {
    // =============== loclizatio ===============
    const { t, i18n } = useTranslation();
    // const changeLanguage = (lng) => {
    //     i18n.changeLanguage(lng);
    // };
    // =============== Router ===============
    const navigate = useNavigate();

    // =============== Drawer state ===============
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    // ===============Language state===============
    const [anchorEl, setAnchorEl] = useState(null);
    const [language, setLanguage] = useState('EN');
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        handleClose();
    };

    // =============== Search state ===============
    const [openSearch, setOpenSearch] = React.useState(false);

    const [searchValue, setSearchValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const showSuggestions = isFocused || searchValue.length > 0;

    // =============== Nav Items ===============
    const navItems = [
        {
            // label: 'MEN',
            label: t('Home.NavBar.Menu.MEN'),
            submenu: [
                {
                    label: t('Home.NavBar.SubMenu.ACCESSORIES'),
                    submenu: [t('Home.NavBar.SubMenu.BAGS'), t('Home.NavBar.SubMenu.BELTS'), t('Home.NavBar.SubMenu.BODY CARE'), t('Home.NavBar.SubMenu.BODY SPLASH'), t('Home.NavBar.SubMenu.BOXERS'), t('Home.NavBar.SubMenu.DEODORANT'), t('Home.NavBar.SubMenu.GLOVES'), t('Home.NavBar.SubMenu.ICE CAPS'), t('Home.NavBar.SubMenu.PERFUMES'), t('Home.NavBar.SubMenu.SETS'), t('Home.NavBar.SubMenu.SOCKS'), t('Home.NavBar.SubMenu.WALLETS')]
                },
                {
                    label: t('Home.NavBar.SubMenu.CLOSES'),
                    submenu: [t('Home.NavBar.SubMenu.BOYS JACKETS'), t('Home.NavBar.SubMenu.BOYS PULLOVERS'), t('Home.NavBar.SubMenu.BOYS SWEATSHIRTS')]
                },
                {
                    label: t('Home.NavBar.SubMenu.SHOES'),
                    submenu: [t('Home.NavBar.SubMenu.CANVAS'), t('Home.NavBar.SubMenu.LEATHER'), t('Home.NavBar.SubMenu.SNEAKERS'), t('Home.NavBar.SubMenu.SPORT')]
                },
                {
                    label: t('Home.NavBar.SubMenu.TROUSERS'),
                    submenu: [t('Home.NavBar.SubMenu.JEANS'), t('Home.NavBar.SubMenu.JOGGERS'), t('Home.NavBar.SubMenu.PANTS'), t('Home.NavBar.SubMenu.RELAXED FIT')]
                }
            ]
        },
        {
            // label: 'KIDS',
            label: t('Home.NavBar.Menu.KIDS'),
            submenu: [
                {
                    label: t('Home.NavBar.SubMenu.ACCESSORIES'),
                    submenu: [t('Home.NavBar.SubMenu.BAGS'), t('Home.NavBar.SubMenu.BELTS'), t('Home.NavBar.SubMenu.BODY CARE'), t('Home.NavBar.SubMenu.BODY SPLASH'), t('Home.NavBar.SubMenu.BOXERS'), t('Home.NavBar.SubMenu.DEODORANT'), t('Home.NavBar.SubMenu.GLOVES'), t('Home.NavBar.SubMenu.ICE CAPS'), t('Home.NavBar.SubMenu.PERFUMES'), t('Home.NavBar.SubMenu.SETS'), t('Home.NavBar.SubMenu.SOCKS'), t('Home.NavBar.SubMenu.WALLETS')]
                },
                {
                    label: t('Home.NavBar.SubMenu.CLOSES'),
                    submenu: [t('Home.NavBar.SubMenu.BOYS JACKETS'), t('Home.NavBar.SubMenu.BOYS PULLOVERS'), t('Home.NavBar.SubMenu.BOYS SWEATSHIRTS')]
                },
                {
                    label: t('Home.NavBar.SubMenu.SHOES'),
                    submenu: [t('Home.NavBar.SubMenu.CANVAS'), t('Home.NavBar.SubMenu.LEATHER'), t('Home.NavBar.SubMenu.SNEAKERS'), t('Home.NavBar.SubMenu.SPORT')]
                },
                {
                    label: t('Home.NavBar.SubMenu.TROUSERS'),
                    submenu: [t('Home.NavBar.SubMenu.JEANS'), t('Home.NavBar.SubMenu.JOGGERS'), t('Home.NavBar.SubMenu.PANTS'), t('Home.NavBar.SubMenu.RELAXED FIT')]
                }
            ]
        },
        {
            // label: 'SUMMER',
            label: t('Home.NavBar.Menu.SUMMER'),
            tag: 'New', submenu: [
                {
                    label: t('Home.NavBar.SubMenu.SUMMER'),
                    submenu: [t('Home.NavBar.SubMenu.MEN POLO SHIRTS'), t('Home.NavBar.SubMenu.MEN T-SHIRTS')]
                }
            ]
        },
        {
            // label: 'WINTER',
            label: t('Home.NavBar.Menu.WINTER'),
            tag: 'Sale', submenu: [
                {
                    label: t('Home.NavBar.SubMenu.WINTER'),
                    submenu: [t('Home.NavBar.SubMenu.MEN AUTUMN SHIRTS'), t('Home.NavBar.SubMenu.MEN JACKETS'), t('Home.NavBar.SubMenu.MEN PULLOVERS'), t('Home.NavBar.SubMenu.MEN SWEATSHIRTS')]
                }
            ]
        },
        {
            // label: 'NEW ARRIVAL',
            label: t('Home.NavBar.Menu.NEW ARRIVAL'),
            submenu: [
                {
                    label: t('Home.NavBar.SubMenu.NEW ARRIVAL'), submenu: [
                        t('Home.NavBar.SubMenu.MEN JACKETS'), t('Home.NavBar.SubMenu.MEN OVER SHIRTS'), t('Home.NavBar.SubMenu.MEN PULLOVERS'), t('Home.NavBar.SubMenu.MEN SWEATSHIRTS')
                    ]
                }
            ]
        },
        {
            // label: 'ALL COLLECTIONS',
            label: t('Home.NavBar.Menu.ALL COLLECTIONS'),
            submenu: [
                {
                    label: t('Home.NavBar.SubMenu.SHOES'),
                    submenu: [t('Home.NavBar.SubMenu.CANVAS'), t('Home.NavBar.SubMenu.LEATHER'), t('Home.NavBar.SubMenu.SNEAKERS'), t('Home.NavBar.SubMenu.SPORT')]
                },
                {
                    label: t('Home.NavBar.SubMenu.SUMMER'),
                    submenu: [t('Home.NavBar.SubMenu.MEN POLO SHIRTS'), t('Home.NavBar.SubMenu.MEN T-SHIRTS')]
                },
                {
                    label: t('Home.NavBar.SubMenu.TROUSERS'),
                    submenu: [t('Home.NavBar.SubMenu.JEANS'), t('Home.NavBar.SubMenu.JOGGERS'), t('Home.NavBar.SubMenu.PANTS'), t('Home.NavBar.SubMenu.RELAXED FIT')]
                },
                {
                    label: t('Home.NavBar.SubMenu.WINTER'),
                    submenu: [t('Home.NavBar.SubMenu.MEN AUTUMN SHIRTS'), t('Home.NavBar.SubMenu.MEN JACKETS'), t('Home.NavBar.SubMenu.MEN PULLOVERS'), t('Home.NavBar.SubMenu.MEN SWEATSHIRTS')]
                }
            ]
        },
    ];

    return (
        <AppBar sx={{ height: 90, backgroundColor: 'black' }} elevation={0}>
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
                    <Button variant="text" sx={{ height: 90 }}
                        onClick={() => navigate(0)} >
                        <img src={logo} alt="TownTeam Logo" style={{ height: 90 }}
                        />
                    </Button>
                    {/* Nav Items */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        {navItems.map((item) =>
                            item.submenu ? (
                                <NavItem key={item.label} item={item} />
                            ) : (
                                <Box key={item.label} sx={{ position: 'relative' }}>
                                    <Button disableRipple sx={{ color: 'white', fontWeight: 'bold' }}>
                                        <Link underline="hover" color="inherit" href={item.href || '/'}>
                                            {item.label}
                                        </Link>
                                    </Button>
                                    {item.tag && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: -8,
                                                right: -12,
                                                backgroundColor:
                                                    item.tag === 'New' ? 'green' :
                                                        item.tag === 'Sale' ? 'orange' : 'red',
                                                color: 'white',
                                                fontSize: 12,
                                                px: 0.5,
                                            }}
                                        >
                                            {item.tag}
                                        </Box>
                                    )}
                                </Box>
                            )
                        )}
                    </Box>

                    {/* Icons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box>
                            <IconButton onClick={handleClick} sx={{ padding: 0 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <img
                                        src={language === 'EN' ? 'https://flagcdn.com/gb.svg' : 'https://flagcdn.com/eg.svg'}
                                        alt={language}
                                        width={20}
                                    />
                                    <Typography sx={{ color: 'white', fontSize: 14 }}>{language}</Typography>
                                    {open ? (
                                        <KeyboardArrowUpIcon sx={{ color: 'white', fontSize: 20 }} />
                                    ) : (
                                        <KeyboardArrowDownIcon sx={{ color: 'white', fontSize: 20 }} />
                                    )}
                                </Stack>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'language-selector',
                                }}
                                sx={{
                                    '& .MuiPaper-root': {
                                        backgroundColor: 'black',
                                        color: 'white',
                                    },
                                }}
                            >
                                {language === 'EN' ? (
                                    <MenuItem
                                        onClick={() => {
                                            handleLanguageChange('AR'); // Update the state
                                            i18n.changeLanguage('ar'); // Change the language in i18n
                                        }}
                                    >
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <img src="https://flagcdn.com/eg.svg" alt="AR" width={20} />
                                            <Typography>AR</Typography>
                                        </Stack>
                                    </MenuItem>
                                ) : (
                                    <MenuItem
                                        onClick={() => {
                                            handleLanguageChange('EN'); 
                                            i18n.changeLanguage('en'); 
                                        }}
                                    >
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <img src="https://flagcdn.com/gb.svg" alt="EN" width={20} />
                                            <Typography>EN</Typography>
                                        </Stack>
                                    </MenuItem>
                                )}
                            </Menu>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <IconButton onClick={() => setOpenSearch(true)}>
                                <SearchIcon sx={{ color: 'white', fontSize: 30 }} />
                            </IconButton>
                            <Modal open={openSearch} onClose={() => setOpenSearch(false)}>
                                <Box
                                    onClick={() => setOpenSearch(false)}
                                    sx={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        width: '100vw',
                                        height: '100vh',
                                        bgcolor: 'rgba(0, 0, 0, 0.85)',
                                        zIndex: 9999,
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Box
                                        onClick={(e) => e.stopPropagation()}
                                        sx={{
                                            bgcolor: 'white',
                                            width: '100%',
                                            maxWidth: 'none',
                                            px: 4,
                                            py: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            position: 'relative',
                                        }}
                                    >
                                        {/* Close Icon */}
                                        <IconButton
                                            onClick={() => setOpenSearch(false)}
                                            sx={{ alignSelf: 'flex-end', mb: 2 }}
                                        >
                                            <CloseIcon />
                                        </IconButton>

                                        {/* Search Section */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                <InputBase
                                                    fullWidth
                                                    placeholder="Search products..."
                                                    value={searchValue}
                                                    onChange={(e) => setSearchValue(e.target.value)}
                                                    onFocus={() => setIsFocused(true)}
                                                    onBlur={() => setIsFocused(false)}
                                                    sx={{
                                                        fontSize: 20,
                                                        borderBottom: '1px solid gray',
                                                        pb: 1,
                                                    }}
                                                />
                                                <IconButton>
                                                    <SearchIcon />
                                                </IconButton>
                                            </Box>
                                            {/* Suggestions Section */}
                                            {showSuggestions && (
                                                <Box sx={{ mt: 2, width: '100%' }}>
                                                    <Typography variant="h6">Trending Now</Typography>
                                                    <Divider sx={{ my: 1, mt: 2 }} />

                                                    <Stack direction="row" spacing={2} >
                                                        <Button sx={{ backgroundColor: '#f7f7f7' }}>
                                                            <Stack direction="row" spacing={1}>
                                                                <SearchIcon sx={{ color: 'gray' }} />
                                                                <Typography sx={{ color: 'gray' }}>{t('Home.NavBar.Search.men jackets')}</Typography>
                                                            </Stack>
                                                        </Button>
                                                        <Button sx={{ backgroundColor: '#f7f7f7' }}>
                                                            <Stack direction="row" spacing={1}>
                                                                <SearchIcon sx={{ color: 'gray' }} />
                                                                <Typography sx={{ color: 'gray' }}>{t('Home.NavBar.Search.pullover')}</Typography>
                                                            </Stack>
                                                        </Button>
                                                        <Button sx={{ backgroundColor: '#f7f7f7' }}>
                                                            <Stack direction="row" spacing={1}>
                                                                <SearchIcon sx={{ color: 'gray' }} />
                                                                <Typography sx={{ color: 'gray' }}>{t('Home.NavBar.Search.sweatshirts')}</Typography>
                                                            </Stack>
                                                        </Button>
                                                        <Button sx={{ backgroundColor: '#f7f7f7' }}>
                                                            <Stack direction="row" spacing={1}>
                                                                <SearchIcon sx={{ color: 'gray' }} />
                                                                <Typography sx={{ color: 'gray' }}>{t('Home.NavBar.Search.t-shirt')}</Typography>
                                                            </Stack>
                                                        </Button>
                                                        <Button sx={{ backgroundColor: '#f7f7f7' }}>
                                                            <Stack direction="row" spacing={1}>
                                                                <SearchIcon sx={{ color: 'gray' }} />
                                                                <Typography sx={{ color: 'gray' }}>{t('Home.NavBar.Search.polo shirt')}</Typography>
                                                            </Stack>
                                                        </Button>
                                                    </Stack>
                                                    <Divider sx={{ my: 1, mt: 2 }} />
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </Modal>
                            <IconButton aria-label="user"
                                onClick={() => navigate('/login')}
                            >
                                <PermIdentityIcon sx={{ color: 'white', fontSize: 30 }} />
                            </IconButton>
                            <IconButton aria-label="favorite" >
                                <FavoriteBorderIcon sx={{ color: 'white', fontSize: 30 }} />
                            </IconButton>
                            <IconButton aria-label="add to shopping cart">
                                <Badge badgeContent={0} color="success" showZero>
                                    <ShoppingCartIcon sx={{ color: 'white', fontSize: 30 }} />
                                </Badge>
                            </IconButton>
                            <IconButton aria-label="menu" onClick={toggleDrawer(true)}>
                                <MenuIcon sx={{ color: 'white', fontSize: 30 }} />
                            </IconButton>
                        </Stack>
                    </Box>
                </Toolbar>
            </Container>
            {/* Drawer */}
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box
                    sx={{ width: 350 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: '#f8f8f8' }}>
                        <Typography sx={{ fontWeight: 'bold' }}>Language</Typography>
                        <IconButton onClick={toggleDrawer(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Language Options */}
                    <Box sx={{ px: 2, py: 3 }}>
                        <Stack direction="row" spacing={6} alignItems="center" justifyContent="flex-start">
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ cursor: 'pointer' }}>
                                <img src="https://flagcdn.com/gb.svg" alt="GB" width={24} />
                                <Typography sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>EN</Typography>
                            </Stack>
                            <Stack sx={{ cursor: 'pointer' }} >
                                <Typography>AR</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </Drawer>
        </AppBar>
    );
}