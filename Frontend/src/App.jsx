import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navibar from "./components/Navibar";
const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navibar />
      <Hero />
      <Footer />
    </div>
  );
};

export default App;
