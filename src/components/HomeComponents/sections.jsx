import { Box } from '@mui/material';
import img1 from './../../assets/Images/lastchanceen.webp';
import img2 from './../../assets/Images/Su25en_1880x.webp';
import img3 from './../../assets/Images/DiscoverBBdisken.webp';
import img4 from './../../assets/Images/SHCen.webp';
import img5 from './../../assets/Images/DeCen_1880x.webp';
import img6 from './../../assets/Images/KCen_1880x.webp';

export default function Sections() {
    return (
        <>      
           <Box
                component="img"
                src={img1}
                alt="Image 1"
                sx={{
                    width: '100%',
                    objectFit: 'cover',
                    display:'block'
                }}
            />

            <Box
            component='img'
            src={img2}
            alt="Image 2"
            sx={{
                width:'100%',
                objectFit:'cover',
                display:'block'
            }}
            />

            <Box 
            component='img'
            src={img3}
            alt='image 3'
            sx={{
                width:'100%',
                objectFit:'cover',
                display:'block'
            }}
            />

            <Box 
            component='img'
            src={img4}
            alt='image 4'
            sx={{
                width:'100%',
                objectFit:'cover',
                display:'block'
            }}
            />

            <Box 
            component='img'
            src={img5}
            alt='image 5'
            sx={{
                width:'100%',
                objectFit:'cover',
                display:'block'
            }}
            />

            <Box 
            component='img'
            src={img6}
            alt='image 6'
            sx={{
                width:'100%',
                objectFit:'cover',
                display:'block'
            }}
            />
        </>
    )
}