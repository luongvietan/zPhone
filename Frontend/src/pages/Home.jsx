import React from "react";
import Navibar from "../components/Navibar";
import Hero from "../components/Hero";
import LatestCollection from "../components/LastestCollection";
import Policy from "../components/Policy";
import NewsletterBox from "../components/NewsLetterBox";
import RelatedProducts from "../components/RelatedProduct";
import BestSeller from "../components/BestSeller";

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <Policy />
      <NewsletterBox />
    </div>
  );
};

export default Home;
