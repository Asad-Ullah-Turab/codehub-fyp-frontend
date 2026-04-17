import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../contexts/ToastContext";
import { getProfile, markPromptShown } from "../../functions/ProfileFunctions/profileFunctions";
import ProfileCompletionModal from "../../components/ProfileCompletionModal/ProfileCompletionModal";
import CollaborationSection from "./Components/CollaborationSection";
import Languages from "./Components/Languages";
import Hero from "./Components/Hero";
import HowItWorks from "./Components/HowItWorks";
import StartJourney from "./Components/StartJourney";
import Testimonial from "./Components/Testimonial";
import WhyCodeHub from "./Components/WhyCodeHub";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [creatorStatus, setCreatorStatus] = useState<"none" | "pending" | "approved" | "rejected" | null>(null);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (isAuthenticated) {
        try {
          const profileRes = await getProfile();
          // Only show modal for newly created accounts (first login only)
          if (!profileRes.data.profileCompletionPromptShown) {
            setShowProfileModal(true);
          }
          setCreatorStatus(profileRes.data.creatorApplication?.status || "none");
          setIsCreator(profileRes.data.role === "creator");
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

  const handleGoToCreatorForm = () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }
    navigate("/creator-application");
  };

  return (
    <div>
      <ProfileCompletionModal
        isOpen={showProfileModal}
        onSkip={handleSkipModal}
        onGoToProfile={handleGoToProfile}
      />
      <Hero />
      {!isAdmin && (
        <section className="mx-6 mt-10 rounded-[2rem] bg-gradient-to-r from-slate-950 via-indigo-900 to-blue-800 px-6 py-10 text-white shadow-2xl sm:mx-10 lg:mx-16">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-slate-300">
                Become a creator
              </p>
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Share knowledge, build your audience, and earn recognition.
              </h2>
              <p className="mt-4 max-w-2xl text-sm text-slate-200 sm:text-base">
                Apply to become a CodeHub content creator and get access to future creator tools, publishing privileges, and visibility across our learning platform.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-300">Application status</p>
                  <p className="text-xl font-semibold text-white">
                    {isCreator
                      ? "Approved Creator"
                      : creatorStatus === "pending"
                      ? "Pending Review"
                      : creatorStatus === "rejected"
                      ? "Rejected"
                      : "Ready to apply"}
                  </p>
                </div>
                <p className="text-sm text-slate-200">
                  {isCreator
                    ? "You are now a validated content creator on CodeHub. More creator tools are coming soon."
                    : creatorStatus === "pending"
                    ? "Your creator application is under review. We will notify you once a decision is made."
                    : creatorStatus === "rejected"
                    ? "Your last application was rejected. You may try again when ready."
                    : "Click the button below to submit your creator application."}
                </p>
                <div className="pt-4">
                  <button
                    onClick={handleGoToCreatorForm}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                  >
                    {isAuthenticated
                      ? "Go to creator application page"
                      : "Sign in to apply"}
                  </button>
                  {!isAuthenticated && (
                    <p className="mt-3 text-xs text-slate-300">
                      Sign in to access the dedicated creator application form.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
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
