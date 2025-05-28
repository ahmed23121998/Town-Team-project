import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper,
  Fade,
  Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3),
  background: '#ffffff',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
}));

const StyledErrorIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  fontSize: '120px',
  color: '#f15322',
  marginBottom: theme.spacing(2),
}));

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={1000}>
          <StyledPaper elevation={3}>
            <Zoom in timeout={1500}>
              <StyledErrorIcon />
            </Zoom>
            
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '6rem', sm: '8rem' },
                fontWeight: 'bold',
                color: '#f15322',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              404
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 'medium',
                color: '#000000',
                textAlign: 'center',
              }}
            >
              {t('Page Not Found')}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#000000',
                textAlign: 'center',
                maxWidth: '400px',
                mb: 2,
              }}
            >
              {t('The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.')}
            </Typography>

            <Button
              component={Link}
              to="/"
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              sx={{
                mt: 2,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #f15322 30%, #f7da4c 90%)',
                boxShadow: '0 3px 5px 2px rgba(241, 83, 34, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #f7da4c 30%, #f15322 90%)',
                },
                color: '#000000'
              }}
            >
              {t('Back to Home')}
            </Button>
          </StyledPaper>
        </Fade>
      </Container>
    </Box>
  );
};

export default NotFound; 