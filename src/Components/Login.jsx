
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { Toaster, toast } from "react-hot-toast";
import { loginUser } from "../Firebase/auth";
import { useContext } from "react";
import { authContext } from "../Context/auth";
import { useNavigate } from "react-router-dom";



function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
    
      const { setIsAuth } = useContext(authContext);
      const navigate = useNavigate();
    
      const onSubmit = async (data) => {
        try {
          const res = await loginUser(data.email, data.password);
          const user = res.user;
    
          if (user) {
            const token = await user.getIdToken();
            localStorage.setItem("token", token);
            setIsAuth(true);
    
            toast.success("Login successful!");
            navigate("/");
          }
        } catch (error) {
          console.error("Login Error:", error);
          toast.error(error.message || "Please check your login credentials");
        }
      };
    
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 5,
            px: 2,
          }}
        >
          <Toaster position="top-center" />
          <Box
            sx={{
              border: "1px solid #ddd",
              p: 4,
              borderRadius: 3,
              backgroundColor: "#fff",
              boxShadow: 3,
              width: { xs: "100%", sm: 400 },
            }}
          >
            <Typography variant="h5" align="center" gutterBottom>
              Town Team
            </Typography>
            <Typography variant="h5" align="left" gutterBottom>
              Log in
            </Typography>
            <Typography
              variant="body2"
              align="left"
              gutterBottom
              sx={{ color: "gray", fontWeight: 300 }}
            >
              Enter your email and password
            </Typography>
    
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Email"
                variant="outlined"
                size="small"
                fullWidth
                margin="normal"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Enter a valid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
    
              <TextField
                label="Password"
                variant="outlined"
                size="small"
                fullWidth
                margin="normal"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
              />
    
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{
                  mt: 2,
                  p: 1.4,
                  borderRadius: 2,
                  backgroundColor: "#2175bd",
                  "&:hover": { backgroundColor: "#2175bd" },
                  textTransform: "none",
                }}
              >
                Continue
              </Button>
    
              <Typography variant="body2" sx={{ mt: 3, color: "gray" }}>
                <Link href="./Privicy.jsx" underline="hover">
                  Privacy
                </Link>
              </Typography>
            </form>
          </Box>
        </Box>
      );
    }

export default Login
