import Footer from "../../component/HomeComponents/Footer";
import Header from "../../component/HomeComponents/header";
import NavBar from "../../component/HomeComponents/navbar";
import Sections from "../../component/HomeComponents/sections";

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
