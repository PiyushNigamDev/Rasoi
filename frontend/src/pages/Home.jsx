import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import PopularDishes from "../components/PopularDishes";
import Footer from "../components/Footer";
import BestDeals from "../components/BestDeal";
import { useLocation } from "react-router-dom";
import BreakFast from "../components/BreakFast";
import Lunch from "../components/Lunch";
import Dinner from "../components/Dinner";
import FastFoods from "../components/Fastfoods";
import DessertSlideshow from "../components/DessertSlideshow";
function Home() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("search") || "";

  return (
    <>
      <Navbar />

      <Hero />

      <section id="breakfast"><BreakFast/></section>
      <section id="fastfood"><FastFoods/></section>
      <BestDeals />

      <section id="lunch"><Lunch/></section>

      <section id="dinner"><Dinner/></section>

      <DessertSlideshow />

      {/* Pass search query to PopularDishes */}
      <PopularDishes searchQuery={searchQuery} />

      <Features />

      <HowItWorks />

      <Footer />
    </>
  );
}

export default Home;

