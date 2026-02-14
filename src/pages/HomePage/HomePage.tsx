import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  getProfile,
  markPromptShown,
} from "../../functions/ProfileFunctions/profileFunctions";
import ProfileCompletionModal from "../../components/ProfileCompletionModal/ProfileCompletionModal";
import CollaborationSection from "./Components/CollaborationSection";
import Languages from "./Components/Languages";
import Hero from "./Components/Hero";
import HowItWorks from "./Components/HowItWorks";
import StartJourney from "./Components/StartJourney";
import Testimonial from "./Components/Testimonial";
import WhyCodeHub from "./Components/WhyCodeHub";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (isAuthenticated) {
        try {
          const profileRes = await getProfile();
          // Only show modal for newly created accounts (first login only)
          if (!profileRes.data.profileCompletionPromptShown) {
            setShowProfileModal(true);
          }
        } catch (err) {
          console.error("Error checking profile completion:", err);
        }
      }
    };

    checkProfileCompletion();
  }, [isAuthenticated]);

  const handleSkipModal = async () => {
    setShowProfileModal(false);
    try {
      await markPromptShown();
      // User data will be fetched on next auth check
    } catch (err) {
      console.error("Error marking prompt as shown:", err);
    }
  };

  const handleGoToProfile = async () => {
    try {
      await markPromptShown();
      // User data will be fetched on next auth check
      navigate("/profile?tab=settings");
      setShowProfileModal(false);
    } catch (err) {
      console.error("Error marking prompt as shown:", err);
    }
  };

  return (
    <div>
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onSkip={handleSkipModal}
        onGoToProfile={handleGoToProfile}
      />
      <Hero />
      <Languages />
      <WhyCodeHub />
      <CollaborationSection />
      <HowItWorks />
      <Testimonial />
      <StartJourney />
    </div>
  );
};

export default HomePage;
