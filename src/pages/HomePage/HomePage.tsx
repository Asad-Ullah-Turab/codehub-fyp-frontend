import Hero from "./Components/Hero";
import HowItWorks from "./Components/HowItWorks";
import StartJourney from "./Components/StartJourney";
import Testimonial from "./Components/Testimonial";
import WhyCodeHub from "./Components/WhyCodeHub";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <WhyCodeHub />
      <HowItWorks />
      <Testimonial />
      <StartJourney />
    </div>
  );
};

export default HomePage;
