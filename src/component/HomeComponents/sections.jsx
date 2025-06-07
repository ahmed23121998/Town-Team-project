import React, { useState } from "react";
import {
  Box,
  IconButton,
  Button,
  Tooltip,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import img1 from "./../../assets/Images/lastchanceen.webp";
import img2 from "./../../assets/Images/Su25en_1880x.webp";
import img3 from "./../../assets/Images/DiscoverBBdisken.webp";
import img4 from "./../../assets/Images/SHCen.webp";
import img5 from "./../../assets/Images/DeCen_1880x.webp";
import img6 from "./../../assets/Images/KCen_1880x.webp";
import img7 from "./../../assets/Images/TSHCen.webp";
import { useTranslation } from "react-i18next";

export default function Sections() {
  const { t } = useTranslation();

  const [sliderIndex, setSliderIndex] = useState(0);
  const navigate = useNavigate();

  const sliderImages = [
    {
      src: img4,
      link: "/ProductList",
      state: { category: "newarrival/newarrival/Men Over Shirts" },
    },
    {
      src: img7,
      link: "/ProductList",
      state: { category: "newarrival/newarrival/Men Over Shirts" },
    },
  ];

  const handlePrev = () => {
    setSliderIndex((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSliderIndex((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
  };

  const handleClick = (link, state) => {
    if (link) {
      navigate(link, state ? { state } : undefined);
    }
  };

  return (
    <>
      <Box
        sx={{
          m: "0",
          p: "0",
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        {/* out */}
        <Link to="">
          <Box
            component="img"
            src={img1}
            alt="Image 1"
            sx={{
              width: "100%",
              objectFit: "cover",
              display: "block",
              m: "0",
            }}
          />
        </Link>

        <Link
          to={{
            pathname: "/ProductList",
          }}
          state={{ category: "summer/summer/Men T-shirts" }}
        >
          <Box
            component="img"
            src={img2}
            alt="Image 2"
            // onClick={() =>
            //   nav("/ProductList", {
            //     state: {  },
            //   })
            // }
            sx={{
              width: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Link>

        <Link

        // sx={{ m: "0" }}
        >
          <Box
            component="img"
            src={img3}
            alt="image 3"
            sx={{
              width: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Link>

        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 160, sm: 220, md: 350, lg: 500, xl: 650 },
            overflow: "hidden",
          }}
        >
          {sliderImages.map((item, index) => (
            <Box
              key={index}
              component="img"
              src={item.src}
              alt={`Slider image ${index}`}
              onClick={() => handleClick(item.link, item.state)}
              sx={{
                width: "100%",
                height: { xs: 160, sm: 220, md: 350, lg: 500, xl: 650 },
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
                opacity: index === sliderIndex ? 1 : 0,
                transition: "opacity 0.6s ease-in-out",
                cursor: "pointer",
              }}
            />
          ))}

          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              top: "50%",
              left: { xs: 4, sm: 16, md: 32, lg: 60, xl: 110 },
              transform: "translateY(-50%)",
              backgroundColor: "#f7da4c",
              p: { xs: 0.5, sm: 1, md: 1.5 },
              width: { xs: 28, sm: 36, md: 44 },
              height: { xs: 28, sm: 36, md: 44 },
              "&:hover": {
                backgroundColor: "black",
              },
              "& .MuiSvgIcon-root": {
                fontSize: { xs: 16, sm: 22, md: 28 },
                color: "black",
                "&:hover": {
                  color: "#f7da4c",
                },
              },
            }}
          >
            <ArrowBackIos />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              top: "50%",
              right: { xs: 4, sm: 16, md: 32, lg: 60, xl: 110 },
              transform: "translateY(-50%)",
              backgroundColor: "#f7da4c",
              p: { xs: 0.5, sm: 1, md: 1.5 },
              width: { xs: 28, sm: 36, md: 44 },
              height: { xs: 28, sm: 36, md: 44 },
              "&:hover": {
                backgroundColor: "black",
              },
              "& .MuiSvgIcon-root": {
                fontSize: { xs: 16, sm: 22, md: 28 },
                color: "black",
                "&:hover": {
                  color: "#f7da4c",
                },
              },
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </Box>

        <Link
          to={{
            pathname: "/ProductList",
          }}
          state={{ category: "men/trousers/Jeans" }}
        >
          <Box
            component="img"
            src={img5}
            alt="image 5"
            sx={{
              width: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Link>

        <Link
          to={{
            pathname: "/ProductList",
          }}
          state={{ category: "kids/closes/Boys Jackets" }}
        >
          <Box
            component="img"
            src={img6}
            alt="image 6"
            sx={{
              width: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Link>

        <Box
          sx={{
            display: { xs: "block", sm: "flex" },
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-evenly",
            alignItems: "center",
            my: 2,
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Tooltip
            title={t("Home.List.cash on delivery")}
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -14],
                    },
                  },
                ],
              },
            }}
          >
            <Button>
              <Stack direction="row" spacing={1}>
                <Box
                  component="img"
                  src="/public/images/card.png"
                  alt={t("Home.List.cash on delivery")}
                  sx={{
                    width: { xs: "38px", sm: "50px" },
                    height: { xs: "19px", sm: "25px" },
                  }}
                />
                <Typography
                  sx={{ color: "black", fontSize: "15px", fontWeight: "bold" }}
                >
                  {t("Home.List.cash on delivery")}
                </Typography>
              </Stack>
            </Button>
          </Tooltip>

          <Tooltip
            title={t("Home.List.Free Shipping over 1399 EGP")}
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -14],
                    },
                  },
                ],
              },
            }}
          >
            <Button>
              <Stack direction="row" spacing={1}>
                <Box
                  component="img"
                  src="/public/images/shipping.png"
                  alt={t("Home.List.Free Shipping over 1399 EGP")}
                  sx={{
                    width: { xs: "38px", sm: "50px" },
                    height: { xs: "19px", sm: "25px" },
                  }}
                />
                <Typography
                  sx={{ color: "black", fontSize: "15px", fontWeight: "bold" }}
                >
                  {t("Home.List.Free Shipping over 1399 EGP")}
                </Typography>
              </Stack>
            </Button>
          </Tooltip>
          <Tooltip
            title={t("Home.List.15 Days Return")}
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -14],
                    },
                  },
                ],
              },
            }}
          >
            <Button>
              <Stack direction="row" spacing={1}>
                <Box
                  component="img"
                  src="/public/images/return.png"
                  alt={t("Home.List.15 Days Return")}
                  sx={{
                    width: { xs: "38px", sm: "50px" },
                    height: { xs: "19px", sm: "25px" },
                  }}
                />
                <Typography
                  sx={{ color: "black", fontSize: "15px", fontWeight: "bold" }}
                >
                  {t("Home.List.15 Days Return")}
                </Typography>
              </Stack>
            </Button>
          </Tooltip>
          <Tooltip
            title={t("Home.List.Call Center 16579")}
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -14],
                    },
                  },
                ],
              },
            }}
          >
            <Button>
              <Stack direction="row" spacing={1}>
                <Box
                  component="img"
                  src="/public/images/call-center.png"
                  alt={t("Home.List.Call Center 16579")}
                  sx={{
                    width: { xs: "38px", sm: "50px" },
                    height: { xs: "19px", sm: "25px" },
                  }}
                />
                <Typography
                  sx={{ color: "black", fontSize: "15px", fontWeight: "bold" }}
                >
                  {t("Home.List.Call Center 16579")}
                </Typography>
              </Stack>
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </>
  );
}
