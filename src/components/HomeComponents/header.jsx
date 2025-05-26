import video from './../../assets/Videos/TOWN-TEAM-VIDEO.mp4'
import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

export default function Header() {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isIconVisible, setIsIconVisible] = useState(true);

    const handleVideoClick = (event) => {
        const videoElement = event.target;
        if (isPlaying) {
            videoElement.pause();
        } else {
            videoElement.play();
        }
        setIsPlaying(!isPlaying);
        setIsIconVisible(false);
    };

    const handleIconClick = (e) => {
        e.stopPropagation();
        const videoElement = e.currentTarget.previousSibling;
        if (isPlaying) {
            videoElement.pause();
        } else {
            videoElement.play();
        }
        setIsPlaying(!isPlaying);
        setIsIconVisible(false); 
    };

    return (
        <>
            <Box sx={{ position: 'relative', width: '100%', maxHeight: '800px' }}>

                <video
                    src={video}
                    loop
                    autoPlay
                    muted
                    onClick={handleVideoClick}
                    style={{
                        width: '100%',
                        maxHeight: '800px',
                        objectFit: 'cover',
                        display:'block'
                    }}
                />
                 {isIconVisible && (  
                    <IconButton
                        onClick={handleIconClick}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: 'white',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            },
                        }}
                    >
                        {isPlaying ? <PauseIcon sx={{ fontSize: 48 }} /> : <PlayArrowIcon sx={{ fontSize: 48 }} />}
                    </IconButton>
                )}
            </Box>
        </>
    )
}