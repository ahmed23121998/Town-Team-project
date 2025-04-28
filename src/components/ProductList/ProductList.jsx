import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import {  Box} from "@mui/material";
import {  CircularProgress,Container} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css'; 

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffeb3b', // Yellow color for primary
    },
    secondary: {
      main: '#f44336', // Red color for sale tag
    },
  },


});


const ProductList = ({ category ,  onProductClick}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching category:", category);
        const colRef = collection(db, "men", "closes", "Boys Pullovers");
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          /////////////////
          price: doc.data().price || 2399,
          originalPrice: doc.data().originalPrice || 3999,
          stock: doc.data().stock || 2,
          recentSales: doc.data().recentSales || 5,
          productCode: doc.data().productCode || "TST25SSPT15004TM1",
          colors: doc.data().colors || ["Beige", "White"],
          sizes: doc.data().sizes || ["S", "XL", "L", "2XL", "M", "3XL", "4XL"],
          // brand: doc.data().brand || "Town Team",
          category: doc.data().category || "T-shirt Sets",
        }));
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error(" Firebase fetch error:", error.message);
        setLoading(false);
        ///////
        setProducts([]);
      }
    };

    fetchData();
  }, [category]);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );

  

  return (
    <ThemeProvider theme={theme}>
    <Container maxWidth="xl" sx={{ py: 4 }}>
    <Box className="products-grid">
            {products.map((product) => (
              <Box key={product.id} className="product-item">
                <ProductCard product={product} 
                onProductClick={onProductClick}
                />
              </Box>
        ))}
      </Box>
      </Container>
      </ThemeProvider>
  )
}

export default ProductList;
