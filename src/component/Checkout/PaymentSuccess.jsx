// src/Components/PaymentSuccess.js
import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData || {};
  
  const { t } = useTranslation();

  // Calculate total if not directly available
  const total = orderData.total || 
                (orderData.cartItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0)) || 0;

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 80, color: 'green', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
           {t('Products.Payment Successful!')}
        </Typography>
        <Box>
        <Typography variant="body1" paragraph>
         {t('Products.Thank you for your order. Your payment has been processed successfully.')}
        </Typography>
        </Box>
        
        
        {/* Order Summary */}
        <Box sx={{ textAlign: 'left', mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>Order Summary</Typography>
          {orderData.cartItems?.map((item) => (
            <Box key={item.id} display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body1">
                {item.title} × {item.quantity}
              </Typography>
              <Typography variant="body1">
                {(item.price * item.quantity).toFixed(2)} EGP
              </Typography>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">{total} EGP</Typography>
          </Box>
        </Box>

        {orderData.transactionId && (
          <Typography variant="body2" paragraph>
            Transaction ID: {orderData.transactionId}
          </Typography>
        )}
        
        <Typography variant="body1" paragraph sx={{ fontWeight: 'bold' }}>
           {t('Products.Payment Method')}: {orderData.paymentMethod === 'paypal' ? 'PayPal' : 
                          orderData.paymentMethod === 'creditCard' ? 'Credit Card' : 
                          orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                          orderData.paymentMethod === 'valU' ? 'valU' : ''}
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 3 }}
          onClick={() => navigate('/')}
        >
           {t('Products.Return to Home')}
        </Button>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;