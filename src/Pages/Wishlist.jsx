import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardMedia, CardContent, IconButton,
    Pagination, ToggleButtonGroup, ToggleButton, styled,
    Breadcrumbs, Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const StyledToggleButton = styled(ToggleButton)(() => ({
    border: '2px solid transparent',
    padding: 4,
    '&.Mui-selected': { borderColor: '#000' },
    '&:not(:last-of-type)': { marginRight: 4 },
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

const SaleBadge = styled(Box)(() => ({
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '4px 8px',
    fontSize: '14px',
    fontWeight: 'bold',
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1
}));

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [view, setView] = useState('module');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userId = "u1234567890"; // Replace with real user ID from auth

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'favorites', userId, 'items'),
            (snapshot) => {
                setWishlist(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'favorites', userId, 'items', id));
            toast.success('Product removed from wishlist');
        } catch {
            toast.error('Delete error');
        }
    };

    const AddToCart = async (item) => {
        try {
            toast.success("✅ Added to cart!");
        } catch (err) {
            if (err.message === 'ALREADY_EXISTS') {
                toast.info("ℹ️ Product already in cart!");
            } else {
                toast.error("❌ Failed to add to cart");
            }
        }
    };

    const itemsPerPage = 3;
    const idxLast = page * itemsPerPage;
    const idxFirst = idxLast - itemsPerPage;
    const currentItems = view === 'list'
        ? wishlist.slice(idxFirst, idxLast)
        : wishlist;

    const renderCard = (item) => {
        const discount = item.discount ?? (Math.random() > 0.5 ? 70 : 50);
        const original = typeof item.price === 'object' ? item.price.amount : item.price;
        const finalPrice = discount
            ? (original * (1 - discount / 100)).toFixed(2)
            : original;

        return (
            <Card
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 0,
                }}
                key={item.id}
            >
                <IconButton
                    onClick={() => handleDelete(item.id)}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        zIndex: 3,
                        width: 32,
                        height: 32,
                        backgroundColor: '#000',
                        color: '#fff',
                        borderRadius: '50%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            color: '#000',
                            border: '1px solid #000',
                        },
                        fontSize: '18px'
                    }}
                >
                    <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>

                <SaleBadge>
                    Sale {discount}%
                </SaleBadge>

                <Box sx={{ position: 'relative', width: '100%', backgroundColor: '#f0f0f0' }}>
                    <CardMedia
                        component="img"
                        image={item.image?.src}
                        alt={item.title}
                        sx={{
                            width: '100%',
                            objectFit: 'contain',
                            maxHeight: 2000,
                            backgroundColor: '#f0f0f0',
                        }}
                    />
                    <Box
                        onClick={() => AddToCart(item)}
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            textAlign: 'center',
                            backgroundColor: '#ffeb3b',
                            color: '#000',
                            fontWeight: 'bold',
                            py: 1,
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#000',
                                color: '#ffd700',
                            },
                        }}
                    >
                        QUICK ADD 🛒
                    </Box>
                </Box>

                <CardContent>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2, color: '#222' }}>
                        {item.product?.title || item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.product?.type}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
                        {discount && (
                            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                LE {original.toLocaleString()}
                            </Typography>
                        )}
                        <Typography variant="body1" sx={{ color: '#ff3d00', fontWeight: 'bold' }}>
                            LE {Number(finalPrice).toLocaleString()}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Breadcrumb */}
            <Breadcrumbs sx={{ mb: 3, opacity: 0.7 }}>
                <Link
                    underline="hover"
                    color="inherit"
                    onClick={() => navigate('/')}
                    sx={{ cursor: 'pointer' }}
                >
                    Home
                </Link>
                <Typography color="text.primary">Wishlist</Typography>
            </Breadcrumbs>

            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', mt: -1 }}>
                WISHLIST
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                <Typography>VIEW AS</Typography>
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={(e, v) => v && (setView(v), setPage(1))}
                >
                    <StyledToggleButton value="list"><ViewListIcon /></StyledToggleButton>
                    <StyledToggleButton value="agenda"><ViewAgendaIcon /></StyledToggleButton>
                    <StyledToggleButton value="module"><ViewModuleIcon /></StyledToggleButton>
                </ToggleButtonGroup>
            </Box>

            {loading ? (
                <Typography align="center">Loading...</Typography>
            ) : wishlist.length === 0 ? (
                <Typography align="center" color="text.secondary">No products</Typography>
            ) : view === 'list' ? (
                <>
                    {currentItems.map(renderCard)}
                    {wishlist.length > itemsPerPage && (
                        <Pagination
                            count={Math.ceil(wishlist.length / itemsPerPage)}
                            page={page}
                            onChange={(_, v) => setPage(v)}
                            sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
                        />
                    )}
                </>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: view === 'agenda' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                        gap: 3
                    }}
                >
                    {wishlist.map(renderCard)}
                </Box>
            )}
        </Box>
    );
};

export default Wishlist;