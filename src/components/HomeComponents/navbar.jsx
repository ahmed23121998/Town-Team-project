import React, { useState } from 'react';
import { AppBar, Toolbar, Container, Box, Button, Divider, Menu, MenuItem, MenuList, Paper, Stack, Badge, Typography, Link, IconButton, Drawer, List, ListItem, ListItemText, InputBase, Modal } from '@mui/material';
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

// ============ Styled Components ============
const SubMenu = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '120%',
    left: 0,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    zIndex: theme.zIndex.appBar + 1,
    minWidth: 200,
}));

const NestedSubMenu = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: '100%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    zIndex: theme.zIndex.appBar + 2,
    minWidth: 200,
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
        }, 0);
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
                                            textDecoration: 'underline', // يظهر خط تحت العنصر عند hover
                                        },
                                    }}
                                >
                                    {label}
                                </MenuItem>
                                {i < item.submenu.length - 1 && <Divider />} {/* Divider بين العناصر */}
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

    // =============== Nav Items ===============
    const navItems = [
        {
            label: 'MEN',
            submenu: [
                { label: 'ACCESSORIES', submenu: ['BAGS', 'BELTS', 'BODY CARE', 'BODY SPLASH', 'BOXERS', 'DEODORANT', 'GLOVES', 'ICE CAPS', 'PERFUMES', 'SETS', 'SOCKS', 'WALLETS'] },
                { label: 'CLOSES', submenu: ['BOYS JACKETS', 'BOYS PULLOVERS', 'BOYS SWEATSHIRTS'] },
                { label: 'SHOES', submenu: ['CANVAS', 'CASUAL', 'LEATHER', 'SNEAKERS', 'SPORT'] },
                { label: 'TROUSERS', submenu: ['JEANS', 'JOGGERS', 'PANTS', 'RELAXED FIT'] }
            ]
        },
        {
            label: 'KIDS',
            submenu: [
                { label: 'ACCESSORIES', submenu: ['BAGS', 'BELTS', 'BODY CARE', 'BODY SPLASH', 'BOXERS', 'DEODORANT', 'GLOVES', 'ICE CAPS', 'PERFUMES', 'SETS', 'SOCKS', 'WALLETS'] },
                { label: 'CLOSES', submenu: ['BOYS JACKETS', 'BOYS PULLOVERS', 'BOYS SWEATSHIRTS'] },
                { label: 'SHOES', submenu: ['CANVAS', 'CASUAL', 'LEATHER', 'SNEAKERS', 'SPORT'] },
                { label: 'TROUSERS', submenu: ['JEANS', 'JOGGERS', 'PANTS', 'RELAXED FIT'] }
            ]
        },
        {
            label: 'SUMMER', tag: 'New', submenu: [
                { label: 'SUMMER', submenu: ['MEN POLO SHIRTS', 'MEN T-SHIRTS'] }
            ]
        },
        {
            label: 'WINTER CLEARANCE', tag: 'Sale', submenu: [
                { label: 'WINTER CLEARANCE', submenu: ['MEN AUTUMN SHIRTS', 'MEN JACKETS', 'MEN PULLOVERS', 'MEN SWEATSHIRTS'] }
            ]
        },
        {
            label: 'NEW ARRIVALS',
            submenu: [
                {
                    label: 'NEW ARRIVALS', submenu: [
                        'MEN JACKETS', 'MEN OVER SHIRTS', 'MEN PULLOVERS', 'MEN SWEATSHIRTS'
                    ]
                }
            ]
        },
        {
            label: 'ALL COLLECTIONS',
            submenu: [
                { label: 'SHOES', submenu: ['CANVAS', 'CASUAL', 'LEATHER', 'SNEAKERS', 'SPORT'] },
                { label: 'SUMMER', submenu: ['MEN POLO SHIRTS', 'MEN T-SHIRTS'] },
                { label: 'TROUSERS', submenu: ['JEANS', 'JOGGERS', 'PANTS', 'RELAXED FIT'] },
                { label: 'WINTER', submenu: ['MEN AUTUMN SHIRTS', 'MEN JACKETS', 'MEN PULLOVERS', 'MEN SWEATSHIRTS'] }
            ]
        },
    ];

    return (
        <AppBar sx={{ height: 90, backgroundColor: 'black' }} elevation={0}>
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
                    <Button variant="text" sx={{ height: 90 }}>
                        <img src={logo} alt="TownTeam Logo" style={{ height: 90 }} />
                    </Button>
                    {/* Nav Items */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
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
                                    <MenuItem onClick={() => handleLanguageChange('AR')}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <img src="https://flagcdn.com/eg.svg" alt="AR" width={20} />
                                            <Typography>AR</Typography>
                                        </Stack>
                                    </MenuItem>
                                ) : (
                                    <MenuItem onClick={() => handleLanguageChange('EN')}>
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

                                        {/* Search Input */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <InputBase
                                                fullWidth
                                                placeholder="Search products..."
                                                color="black"
                                                sx={{ fontSize: 20, borderBottom: '1px solid gray', pb: 1 }}
                                            />
                                            <IconButton>
                                                <SearchIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Box>
                            </Modal>

                            <IconButton aria-label="user" >
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
                    sx={{ width: 450 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        <ListItem>
                            <ListItemText primary="Language" />
                        </ListItem>
                        <ListItem>
                            <Stack direction="row" spacing={1}>
                                <img src="https://flagcdn.com/gb.svg" alt="GB" width={20} />
                                <Typography>English</Typography>
                            </Stack>
                        </ListItem>
                        <ListItem>
                            <Stack direction="row" spacing={1}>
                                <img src="https://flagcdn.com/eg.svg" alt="EG" width={20} />
                                <Typography>Arabic</Typography>
                            </Stack>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </AppBar>
    );
}