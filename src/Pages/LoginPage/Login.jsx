import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { Toaster, toast } from "react-hot-toast";
import { loginUser } from "../../Firebase/auth";
import { useContext, useEffect } from "react";
import { authContext } from "../../Context/auth";
import { useNavigate } from "react-router-dom";
import { getCartItems } from "../../component/cartUtils.jsx";
import { MyContext } from "../../Context/FilterContaext.js"; // Ensure this is the correct path

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { setCartItems } = useContext(MyContext);
  const { setIsAuth } = useContext(authContext);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate("/Profile");
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data.email, data.password);
      const user = res.user;

      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("userId", user.uid);
        const userId = localStorage.getItem("userId");
        setCartItems(await getCartItems(userId));

        localStorage.setItem("token", token);

        setIsAuth(true);

        navigate("/Profile");

        toast.success("Login successful!");
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
        minHeight: { xs: "80vh", sm: "100vh" },
        px: { xs: 1, sm: 2 },
        mt: { xs: 2, sm: 5 },
      }}
    >
      <Toaster position="top-center" />
      <Box
        sx={{
          border: "1px solid #ddd",
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          backgroundColor: "#fff",
          boxShadow: 3,
          width: { xs: "100%", sm: 400, md: 420 },
          maxWidth: 480,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Town Team
        </Typography>
        <Typography
          variant="h5"
          align="left"
          gutterBottom
          sx={{ fontSize: { xs: 20, sm: 24 } }}
        >
          Log in
        </Typography>
        <Typography
          variant="body2"
          align="left"
          gutterBottom
          sx={{
            color: "gray",
            fontWeight: 300,
            fontSize: { xs: 13, sm: 15 },
          }}
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
            sx={{ fontSize: { xs: 13, sm: 15 } }}
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
            sx={{ fontSize: { xs: 13, sm: 15 } }}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              mt: 2,
              p: { xs: 1, sm: 1.4 },
              borderRadius: 2,
              backgroundColor: "#2175bd",
              "&:hover": { backgroundColor: "#2175bd" },
              textTransform: "none",
              fontSize: { xs: 15, sm: 16 },
            }}
          >
            Continue
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body2" sx={{ fontSize: { xs: 13, sm: 14 } }}>
            Don’t have an account?{" "}
            <Link
              component="button"
              underline="hover"
              sx={{ cursor: "pointer", color: "#2175bd", fontWeight: 500 }}
              onClick={() => {
                navigate("/#signup");
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
