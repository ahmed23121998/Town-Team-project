import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import img1 from './../../assets/Images/lastchanceen.webp';
import img2 from './../../assets/Images/Su25en_1880x.webp';
import img3 from './../../assets/Images/DiscoverBBdisken.webp';
import img4 from './../../assets/Images/SHCen.webp';
import img5 from './../../assets/Images/DeCen_1880x.webp';
import img6 from './../../assets/Images/KCen_1880x.webp';
import img7 from './../../assets/Images/TSHCen.webp';

export default function Sections() {
    const [sliderIndex, setSliderIndex] = useState(0);
    const navigate = useNavigate();

    const sliderImages = [
        { src: img4, link: '' },
        { src: img7, link: '' }
    ];

    const handlePrev = () => {
        setSliderIndex((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSliderIndex((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    };

    const handleClick = (link) => {
        navigate(link);
    };


    return (
        <>
           <Box sx={{m:'0'}}>
           <Link to=''>
                <Box
                    component="img"
                    src={img1}
                    alt="Image 1"
                    sx={{
                        width: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        m:'0'
                    }}
                />
            </Link>

            <Link to=''>
                <Box
                    component='img'
                    src={img2}
                    alt="Image 2"
                    sx={{
                        width: '100%',
                        objectFit: 'cover',
                        display: 'block'
                    }}
                />
            </Link>

            <Link to='' sx={{m:'0'}}>
                <Box
                    component='img'
                    src={img3}
                    alt='image 3'
                    sx={{
                        width: '100%',
                        objectFit: 'cover',
                        display: 'block'
                    }}
                />
            </Link>

            <Box sx={{ position: 'relative', width: '100%', height: '700px', overflow: 'hidden' }}>
                {sliderImages.map((item, index) => (
                    <Box
                        key={index}
                        component="img"
                        src={item.src}
                        alt={`Slider image ${index}`}
                        onClick={() => handleClick(item.link)}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            opacity: index === sliderIndex ? 1 : 0,
                            transition: 'opacity 0.6s ease-in-out',
                            cursor: 'pointer'
                        }}
                    />
                ))}

                <IconButton
                    onClick={handlePrev}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 110,
                        transform: 'translateY(-50%)',
                        backgroundColor: '#f7da4c',
                        '&:hover': {
                            backgroundColor: 'black',
                        },
                        '& .MuiSvgIcon-root': {
                            color: 'black',
                            '&:hover': {
                                color: '#f7da4c',
                            }
                        }
                    }}
                >
                    <ArrowBackIos />
                </IconButton>

                <IconButton
                    onClick={handleNext}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        right: 110,
                        transform: 'translateY(-50%)',
                        backgroundColor: '#f7da4c',
                        '&:hover': {
                            backgroundColor: 'black',
                        },
                        '& .MuiSvgIcon-root': {
                            color: 'black',
                            '&:hover': {
                                color: '#f7da4c',
                            }
                        }
                    }}
                >
                    <ArrowForwardIos />
                </IconButton>
            </Box>

            <Link to=''>
                <Box
                    component='img'
                    src={img5}
                    alt='image 5'
                    sx={{
                        width: '100%',
                        objectFit: 'cover',
                        display: 'block'
                    }}
                />
            </Link>

            <Link to=''>
                <Box
                    component='img'
                    src={img6}
                    alt='image 6'
                    sx={{
                        width: '100%',
                        objectFit: 'cover',
                        display: 'block'
                    }}
                />
            </Link>
           </Box>
        </>
    )
}