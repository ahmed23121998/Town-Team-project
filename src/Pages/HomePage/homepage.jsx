import Footer from "../../components/HomeComponents/Footer";
import Header from "../../components/HomeComponents/header";
import NavBar from "../../components/HomeComponents/navbar";
import Sections from "../../components/HomeComponents/sections";

export default function HomePage() {
  return (
    <>
      <div
        style={{
          marginBottom: "60px",
        }}
      >
        <NavBar />
      </div>
      <Header />
      <Sections />
    </>
  );
}
