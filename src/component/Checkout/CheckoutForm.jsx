// At the top of CheckoutForm.js
import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Container,
  Paper,
  Grid,
  Divider,
  MenuItem,
  RadioGroup,
  Radio,
  FormControl,
  FormHelperText,
  InputAdornment,
  IconButton,
  Select,
  Link,
  ThemeProvider,
  createTheme,
  CssBaseline,

} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PayPalPayment from './PayPalPayment';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { db } from "../../Firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems = [], total = 0 } = location.state || {};
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    governorate: 'Sohag',
    postalCode: '',
    phone: '',
    saveInfo: false,
    emailNews: true,
    textNews: false,
    shippingMethod: 'Qibly',
    paymentMethod: 'creditCard',
    cardNumber: '',
    expirationDate: '',
    securityCode: '',
    nameOnCard: '',
    useShippingAddress: true
  });

  // Error state
  const [errors, setErrors] = useState({});

  const { t } = useTranslation();

  // Add this to display order summary
  const OrderSummary = () => (
    <Box elevation={0} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
        {t('Products.Order Summary')}
      </Typography>
      {cartItems.map((item) => (
        <Box key={item.id} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center">
            {item.image && (
              <Box
                component="img"
                src={item.image}
                alt={item.title}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 1,
                  mr: 2
                }}
              />
            )}
            <Box >
              <Typography variant="body1" fontWeight="medium"  >
                {item.id}
              </Typography>

              <Typography variant="body2" color="text.secondary" >
                {item.title}/ {item.size}
              </Typography>
              <Typography variant="body2" color="text.secondary"  >
                {t('Products.Quantity')}: {item.quantity}
              </Typography>
              <br></br>
            </Box>
          </Box>

        </Box>
      ))}
      <Box>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField label="Discount code" size="small" fullWidth />
          <Button variant="outlined" size="small" sx={{ height: "40px" }} >
            {t('Products.Apply')}
          </Button>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="body1">Subtotal</Typography>
        <Typography variant="body1">{total} EGP</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="body1" sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <span> {t('Products.Shipping')}</span>
          <span> {t('Products.FREE')}</span>
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <span> {t('Products.Total')}</span>
          <span fontWeight="bold">{total} EGP</span>
        </Typography>
      </Box>
    </Box>
  );
  // Create custom theme
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      background: {
        default: '#f8f9fa',
      },
    },
    typography: {
      fontFamily: [
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    components: {
      MuiTextField: {
        defaultProps: {
          size: 'medium',
          variant: 'outlined',
        },
        styleOverrides: {
          root: {
            marginBottom: '12px',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            backgroundColor: '#fff',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
          },
        },
      },
    },
  });

  // Country options
  const countries = [
    { value: 'Egypt', label: t('Products.Egypt') },
    { value: 'UAE', label: t('Products.UAE') },
    { value: 'KSA', label: t('Products.Saudi Arabia') }
  ];


  // Governorate options
  const governorates = [
    { value: 'Sohag', label: t('Products.Sohag') },
    { value: 'Cairo', label: t('Products.Cairo') },
    { value: 'Alexandria', label: t('Products.Alexandria') },
    { value: 'Giza', label: t('Products.Giza') },
    { value: 'Port Said', label: t('Products.Port Said') },
    { value: 'Suez', label: t('Products.Suez') },
    { value: 'Luxor', label: t('Products.Luxor') },
    { value: 'El-Mahalla El-Kubra', label: t('Products.El-Mahalla El-Kubra') },
    { value: 'Tanta', label: t('Products.Tanta') },
    { value: 'Asyut', label: t('Products.Asyut') },
    { value: 'Ismailia', label: t('Products.Ismailia') },
    { value: 'Fayyum', label: t('Products.Fayyum') },
    { value: 'Zagazig', label: t('Products.Zagazig') },
    { value: 'Aswan', label: t('Products.Aswan') },
    { value: 'Damietta', label: t('Products.Damietta') },
    { value: 'Damanhur', label: t('Products.Damanhur') },
    { value: 'al-Minya', label: t('Products.Minya') },
    { value: 'Beni Suef', label: t('Products.Beni Suef') },
    { value: 'Qena', label: t('Products.Qena') },
    { value: 'Mallawi', label: t('Products.Mallawi') },
    { value: 'Kafr El Sheikh', label: t('Products.Kafr El Sheikh') },
    { value: 'Qalyubia', label: t('Products.Qalyubia') },
    { value: 'Sharqia', label: t('Products.Sharqia') },
  ];

  // Handle input changes
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Name validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';

    // Address validation
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,12}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Card validation if credit card is selected
    if (formData.paymentMethod === 'creditCard') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }

      if (!formData.expirationDate) {
        newErrors.expirationDate = 'Expiration date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expirationDate)) {
        newErrors.expirationDate = 'Format: MM/YY';
      }

      if (!formData.securityCode) {
        newErrors.securityCode = 'Security code is required';
      } else if (!/^\d{3,4}$/.test(formData.securityCode)) {
        newErrors.securityCode = 'Invalid security code';
      }

      if (!formData.nameOnCard) newErrors.nameOnCard = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // PayPal event handlers
  const handlePayPalApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      // Process successful payment
      console.log('Payment completed:', details);
      toast.success(`Payment completed by ${details.payer.name.given_name}!`);
      submitOrder('paypal', details.id);
    });
  };

  const handlePayPalError = (err) => {
    console.error("PayPal error:", err);
    alert("Payment failed. Please try another payment method.");
  };

  const handlePayPalCancel = (data) => {
    console.log("Payment cancelled:", data);
  };

  const submitOrder = async (paymentMethod, transactionId = null) => {
    const userId = localStorage.getItem("userId");
    const orderData = {
      ...formData,
      paymentMethod,
      transactionId,
      cartItems,
      total,
      userId,
      createdAt: new Date().toISOString(),
    };
    try {
      await addDoc(collection(db, "orders"), orderData);
    } catch (err) {
      console.error("Error saving order:", err);
      toast.error("Failed to save order!");
    }
    if (paymentMethod === 'paypal') {
      toast.success('Payment completed successfully!', {
        position: "top-center",
        autoClose: 3000,
      });
    }
    setTimeout(() => {
      navigate('/payment-success', { state: { orderData } });
    }, paymentMethod === 'paypal' ? 3500 : 0);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.paymentMethod === 'paypal') return; // PayPal handles its own submission

    if (validateForm()) {
      submitOrder(formData.paymentMethod);
    } else {
      console.log('Form has errors:', errors);
      toast.error('Please fill out the form!', {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Town Team
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={4}>
            {/* Left Column - Form */}
            <Grid item xs={12} md={4}>
              <form onSubmit={handleSubmit}>
                {/* Contact Section */}
                <Box mb={4}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" component="h2">
                      {t('Products.Contact')}
                    </Typography>
                    <Link href="#" underline="always">
                      {t('Products.Log in')}
                    </Link>
                  </Box>

                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label={t('Products.Email or mobile phone number')}
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    margin="normal"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.emailNews}
                        onChange={handleChange}
                        name="emailNews"
                        color="primary"
                      />
                    }
                    label={t('Products.Email me with news and offers')}
                  />
                </Box>

                {/* Delivery Section */}
                <Box mb={4}>
                  <Typography variant="h5" component="h2" mb={2}>
                    {t('Products.Delivery')}
                  </Typography>

                  <Select
                    fullWidth
                    id="country"
                    name="country"
                    value="Egypt"
                    IconComponent={ExpandMoreIcon}
                    sx={{ mb: 2 }}
                    displayEmpty
                  >
                    {countries.map((country) => (
                      <MenuItem key={country.value} value={country.value}>
                        {country.label}
                      </MenuItem>
                    ))}
                  </Select>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="firstName"
                        name="firstName"
                        label={t('Products.First name')}
                        variant="outlined"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="lastName"
                        name="lastName"
                        label={t('Products.Last name')}
                        variant="outlined"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    id="address"
                    name="address"
                    label={t('Products.Address')}
                    variant="outlined"
                    value={formData.address}
                    onChange={handleChange}
                    error={!!errors.address}
                    helperText={errors.address}
                    margin="normal"
                  />

                  <TextField
                    fullWidth
                    id="apartment"
                    name="apartment"
                    label={t('Products.Apartment, suite, etc. (optional)')}
                    variant="outlined"
                    value={formData.apartment}
                    onChange={handleChange}
                    margin="normal"
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        id="city"
                        name="city"
                        label={t('Products.City')}
                        variant="outlined"
                        value={formData.city}
                        onChange={handleChange}
                        error={!!errors.city}
                        helperText={errors.city}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Select
                        fullWidth
                        id="governorate"
                        name="governorate"
                        value={formData.governorate}
                        onChange={handleChange}
                        IconComponent={ExpandMoreIcon}
                        displayEmpty
                      >
                        {governorates.map((gov) => (
                          <MenuItem key={gov.value} value={gov.value}>
                            {gov.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        id="postalCode"
                        name="postalCode"
                        label={t('Products.Postal code (optional)')}
                        variant="outlined"
                        value={formData.postalCode}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    id="phone"
                    name="phone"
                    label={t('Products.Phone')}
                    variant="outlined"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end">
                            <HelpOutlineIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.saveInfo}
                          onChange={handleChange}
                          name="saveInfo"
                          color="primary"
                        />
                      }
                      label={t('Products.Save this information for next time')}
                    />
                  </Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.textNews}
                        onChange={handleChange}
                        name="textNews"
                        color="primary"
                      />
                    }
                    label={t('Products.Text me with news and offers')}
                  />
                </Box>

                {/* Shipping Method Section */}
                <Box mb={4}>
                  <Typography variant="h5" component="h2" mb={2}>
                    {t('Products.Shipping method')}
                  </Typography>

                  <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#e3f2fd', borderColor: '#1976d2' }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Typography variant="body1">Qibly</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body2" sx={{ textDecoration: 'line-through', display: 'block', mr: 1 }}>
                          £99.00
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" display="block">
                          {t('Products.FREE')}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>

                {/* Payment Section */}
                <Box mb={4}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {t('Products.Payment')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {t('Products.All transactions are secure and encrypted.')}
                  </Typography>

                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                    >
                      {/* Credit Card Option */}
                      <Paper
                        variant="outlined"
                        sx={{
                          mb: 2,
                          p: 2,
                          backgroundColor: formData.paymentMethod === 'creditCard' ? '#f1f1f1' : '#fff',
                        }}
                      >
                        <Box sx={{ backgroundColor: '#dee9f2' }}>
                          <FormControlLabel
                            value="creditCard"
                            control={<Radio color="primary" />}
                            label={
                              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                                <Typography variant="body1" sx={{ flexGrow: 1 }}> {t('Products.Credit card')}</Typography>
                                <Box display="flex">
                                  <Box
                                    component="img"
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRDj5Z8d53TG94bKWJ1WQO75Ih3cxUb8vEmw&s"
                                    alt="Mastercard"
                                    sx={{ height: 30, mr: 1 }}
                                  />
                                  <Box
                                    component="img"
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1hGV6XSh3L3eG2Jdp6oUFs0UglPcCfWvyCQ&s"
                                    alt="Visa"
                                    sx={{ height: 30, mr: 1 }}
                                  />
                                  <Box
                                    component="img"
                                    src="https://yt3.googleusercontent.com/ytc/AIdro_nL5AV2DyNrAF_rWPABl1dJwxof7ewjgVzdOjpn9b673A=s900-c-k-c0x00ffffff-no-rj"
                                    alt="Meiza"
                                    sx={{ height: 30 }}
                                  />
                                </Box>
                              </Box>
                            }
                            sx={{ width: '100%', alignItems: 'center' }}
                          />
                        </Box>

                        {formData.paymentMethod === 'creditCard' && (
                          <Box mt={2}>
                            <TextField
                              fullWidth
                              id="cardNumber"
                              name="cardNumber"
                              label={t('Products.Card number')}
                              variant="outlined"
                              value={formData.cardNumber}
                              onChange={(e) => {
                                const formatted = formatCardNumber(e.target.value);
                                setFormData({
                                  ...formData,
                                  cardNumber: formatted
                                });
                                if (errors.cardNumber) {
                                  setErrors({
                                    ...errors,
                                    cardNumber: null
                                  });
                                }
                              }}
                              error={!!errors.cardNumber}
                              helperText={errors.cardNumber}
                              margin="normal"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <LockIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />

                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  id="expirationDate"
                                  name="expirationDate"
                                  label={t('Products.Expiration date (MM / YY)')}
                                  variant="outlined"
                                  value={formData.expirationDate}
                                  onChange={handleChange}
                                  error={!!errors.expirationDate}
                                  helperText={errors.expirationDate}
                                  margin="normal"
                                  placeholder="MM / YY"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  id="securityCode"
                                  name="securityCode"
                                  label={t('Products.Security code')}
                                  variant="outlined"
                                  value={formData.securityCode}
                                  onChange={handleChange}
                                  error={!!errors.securityCode}
                                  helperText={errors.securityCode}
                                  margin="normal"
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton edge="end">
                                          <HelpOutlineIcon />
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                            </Grid>

                            <TextField
                              fullWidth
                              id="nameOnCard"
                              name="nameOnCard"
                              label={t('Products.Name on card')}
                              variant="outlined"
                              value={formData.nameOnCard}
                              onChange={handleChange}
                              error={!!errors.nameOnCard}
                              helperText={errors.nameOnCard}
                              margin="normal"
                            />

                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.useShippingAddress}
                                  onChange={handleChange}
                                  name="useShippingAddress"
                                  color="primary"
                                />
                              }
                              label={t('Products.Use shipping address as billing address')}
                            />
                          </Box>
                        )}
                      </Paper>

                      {/* PayPal Option */}
                      <Paper
                        variant="outlined"
                        sx={{
                          mb: 2,
                          p: 2,
                          backgroundColor: formData.paymentMethod === 'paypal' ? '#f1f1f1' : '#fff',
                        }}
                      >
                        <FormControlLabel
                          value="paypal"
                          control={<Radio color="primary" />}
                          label={
                            <Box display="flex" alignItems="center">
                              <Typography variant="body1">PayPal</Typography>
                              <Box ml="auto">
                                <Box
                                  component="img"
                                  src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png"
                                  alt="PayPal"
                                  sx={{ height: 30 }}
                                />
                              </Box>
                            </Box>
                          }
                        />

                        {formData.paymentMethod === 'paypal' && (
                          <PayPalPayment
                            amount={total}
                            cartItems={cartItems}
                            onApprove={handlePayPalApprove}
                            onError={handlePayPalError}
                            onCancel={handlePayPalCancel}
                          />
                        )}
                      </Paper>

                      {/* valU Option */}
                      <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
                        <FormControlLabel
                          value="valU"
                          control={<Radio color="primary" />}
                          label={
                            <Box display="flex" alignItems="center">
                              <Typography variant="body1" mr={1}>valU</Typography>
                              <Box ml="auto">
                                <Box
                                  component="img"
                                  src="https://media.licdn.com/dms/image/v2/D4D0BAQEkYWVgNjiQRQ/company-logo_200_200/company-logo_200_200/0/1692709161493/valuegypt_logo?e=2147483647&v=beta&t=v-qnIvPIZbfDABnHf4vDXu93QBmtOydRvugtM_p0_rI"
                                  alt="valU"
                                  sx={{ height: 30 }}
                                />
                              </Box>
                            </Box>
                          }
                        />
                      </Paper>

                      {/* COD Option */}
                      <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
                        <FormControlLabel
                          value="cod"
                          control={<Radio color="primary" />}
                          label={t('Products.Cash on Delivery (COD)')}
                        />
                      </Paper>
                    </RadioGroup>
                  </FormControl>
                </Box>

                {/* Pay Now Button */}
                <Button
                  type={formData.paymentMethod === 'paypal' ? 'button' : 'submit'}
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    backgroundColor: '#0B60B0',
                    mb: 4,
                    '&:hover': {
                      backgroundColor: '#03346E',
                    },
                  }}
                >
                  {t('Products.Pay Now')}
                </Button>

                <Divider sx={{ mb: 2 }} />

                {/* Footer Links */}
                <Box display="flex" gap={2} mb={2}>
                  <Link href="#" underline="hover" color="primary">
                    {t('Products.Refund policy')}
                  </Link>
                  <Link href="#" underline="hover" color="primary">
                    {t('Products.Privacy policy')}
                  </Link>
                  <Link href="#" underline="hover" color="primary">
                    {t('Products.Terms of service')}
                  </Link>
                </Box>
              </form>
            </Grid>

            {/* Right Column - Order Summary */}
            <Grid item xs={12} md={8} >
              <OrderSummary />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default CheckoutForm;