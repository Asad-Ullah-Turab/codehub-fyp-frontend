import Hero from "./Components/Hero";
import HowItWorks from "./Components/HowItWorks";
import StartJourney from "./Components/StartJourney";
import WhyCodeHub from "./Components/WhyCodeHub";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <WhyCodeHub />
      <HowItWorks />
      <StartJourney />
    </div>
  );
};

export default HomePage;
