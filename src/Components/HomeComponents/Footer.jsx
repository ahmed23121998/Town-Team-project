import React from 'react';
import { Box, Typography, TextField, Button, Grid, IconButton } from '@mui/material';
import { Facebook, Instagram, YouTube } from '@mui/icons-material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import { userRegister } from "../../Firebase/auth";
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  const {
    register: formRegister,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await userRegister(data.email, data.password);
      toast.success("\u2705 Signed up successfully!");
      reset();
    } catch (error) {
      console.error("SignUp Error:", error);
      toast.error(error.message || "\u274C Please check your email and password");
    }
  };

  return (
    <>
      <Box sx={{ bgcolor: 'black', color: 'white', pt: 8, pb: 2, px: 5 }}>
        <Toaster position="top-center" />
        <Box textAlign="center" mb={6} mt={-2}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {t('Home.Footer.SIGN-UP')}
          </Typography>
          <Typography variant="body1" color="grey.400" mb={2}>
            {t('Home.Footer.be the first to know about our newest arrivals, special offers and store events near you.')}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 16}}>
            
            {/* Email Input */}
            <TextField
              variant="outlined"
              placeholder={t('Home.Footer.enter your email')}
              {...formRegister("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email"
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                sx: {
                  height: '36px',
                  bgcolor: 'white',
                  borderRadius: '1px',
                  input: {
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    padding: '8px',
                    fontSize: '14px',
                    fontWeight: 400,
                  },
                },
              }}
              InputLabelProps={{
                shrink: false
              }}
              FormHelperTextProps={{
                sx: {
                  mt: '2px',
                  textAlign: 'center',
                  color: '#f44336',
                  fontSize: '12px',
                  background: 'transparent',
                  padding: 0,
                }
              }}
              sx={{ width: { xs: '100%', sm: '300px' }, borderBottom: '1px solid #ccc' }}  // Added grey bottom border
            />

            {/* Password Input */}
            <TextField
              type="password"
              variant="outlined"
              placeholder={t('Home.Footer.enter your password')}
              {...formRegister("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                sx: {
                  height: '36px',
                  bgcolor: 'white',
                  borderRadius: '1px',
                  input: {
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    padding: '8px',
                    fontSize: '14px',
                    fontWeight: 400,
                  },
                },
              }}
              InputLabelProps={{
                shrink: false
              }}
              FormHelperTextProps={{
                sx: {
                  mt: '2px',
                  textAlign: 'center',
                  color: '#f44336',
                  fontSize: '12px',
                  background: 'transparent',
                  padding: 0,
                }
              }}
              sx={{ width: { xs: '100%', sm: '300px' }, borderBottom: '1px solid #ccc' }}  // Added grey bottom border
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: '#f5d042',
                color: 'black',
                px: 4,
                height: '36px',
                '&:hover': { bgcolor: '#e6be00' },
              }}
            >
             {t('Home.Footer.SUBMIT')}
            </Button>
          </form>
        </Box>
       
        <Box sx={{ height: '1px', bgcolor: '#ccc', width: '80%', margin: '0 auto', mt: 2, mb: 4 }} />
        {/* Footer Links */}
        <Grid container spacing={26} justifyContent="center" textAlign={{ xs: 'center', sm: 'left' }}>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {t('Home.Footer.Customer Service')}
            </Typography>
            <Typography variant="body2" color="grey.500" mb={2}>{t('Home.Footer.Town Team Terms And Condition')}</Typography>
            <Typography variant="body2" color="grey.500" mb={2}>{t('Home.Footer.TOWN TEAM Privacy Policy')}</Typography>
            <Typography variant="body2" color="grey.500" mb={2}>{t('Home.Footer.Delivery And Returns')}</Typography>
            <Typography variant="body2" color="grey.500" mb={2}>{t('Home.Footer.Terms of Service')}</Typography>
            <Typography variant="body2" color="grey.500">{t('Home.Footer.Refund policy')}</Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {t('Home.Footer.ABOUT US')}
            </Typography>
            <Typography variant="body2" color="grey.500" mb={2}>{t('Home.Footer.About TOWN TEAM')} </Typography>
            <Typography variant="body2" color="grey.500">{t('Home.Footer.How To Purchase')}</Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
             {t('Home.Footer.CONTACT US')} 
            </Typography>
            <Typography variant="body2" color="grey.500">{t('Home.Footer.Contact Us')}</Typography>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {t('Home.Footer.keep in touch')}
            </Typography>
            <Box display="flex" gap={3} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
              <IconButton sx={{ color: 'white', opacity: 0.6 }}><Facebook /></IconButton>
              <IconButton sx={{ color: 'white', opacity: 0.6 }}><Instagram /></IconButton>
              <IconButton sx={{ color: 'white', opacity: 0.6 }}><YouTube /></IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Payment Methods */}
        <Box mt={0} px={15} textAlign="right" display="flex" flexDirection="column" alignItems="right" gap={2}>
          <Typography variant="subtitle1" fontWeight="bold" mb={1} px={2} >
           {t('Home.Footer.payment accept')}
          </Typography>

          {/* imge  */}
          <Box display="flex" justifyContent="right" px={-1} gap={2} mb={4}>
            <img 
              src="/images/footerimg.png" 
              alt="Payment Methods" 
              style={{ height: '80px', objectFit: 'contain' }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ bgcolor: 'white', color: 'white', pt: 1, pb: 2, px: 4 }}>
        <Typography variant="body2" color="grey.800" textAlign="center" mt={4}>
         {t('Home.Footer.copyright')} 
        </Typography>
      </Box>
    </>
  );
}

export default Footer;
