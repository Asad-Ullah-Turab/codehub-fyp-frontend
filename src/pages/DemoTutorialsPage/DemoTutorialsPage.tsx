import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { 
  fetchMainConcepts, 
  fetchTutorialsByLanguageAndConcept,
  type TutorialItem,
  type MainConcepts,
} from "../../functions";
import { LANGUAGES } from "../../constants";
import api from "../../services/api";
import "./DemoTutorialsPage.css";
import LanguageSelector from "./Components/DemoLanguageSelector";
import ConceptSelector from "./Components/DemoConceptSelector";
import TutorialList from "./Components/DemoTutorialList";
import TutorialViewer from "./Components/DemoTutorialViewer";

const TutorialsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(LANGUAGES.PYTHON);
  const [selectedConcept, setSelectedConcept] = useState<string>("");
  const [mainConcepts, setMainConcepts] = useState<MainConcepts>({
    python: [],
    javascript: [],
    cpp: [],
  });
  const [tutorials, setTutorials] = useState<TutorialItem[]>([]);
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialItem | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [savedTutorials, setSavedTutorials] = useState<string[]>([]);

  // Check suspension status
  useEffect(() => {
    if (user?.accountStatus === 'suspended') {
      logout();
      navigate('/signin?error=account_suspended');
    }
  }, [user, logout, navigate]);

  // Fetch main concepts when component mounts
  useEffect(() => {
    const loadConcepts = async () => {
      try {
        const concepts = await fetchMainConcepts();
        setMainConcepts(concepts);
      } catch (error) {
        console.error("Error fetching concepts:", error);
      }
    };
    loadConcepts();
  }, []);

  // Fetch tutorials when language or concept changes
  useEffect(() => {
    const loadTutorials = async () => {
      setLoading(true);
      try {
        const data = await fetchTutorialsByLanguageAndConcept(selectedLanguage, selectedConcept);
        setTutorials(data);

        // Set first tutorial as selected if available
        if (data && data.length > 0) {
          setSelectedTutorial(data[0]);
        }
      } catch (error) {
        console.error("Error fetching tutorials:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedLanguage) {
      loadTutorials();
    }
  }, [selectedLanguage, selectedConcept]);

  // Fetch saved tutorials
  useEffect(() => {
    const fetchSavedTutorials = async () => {
      try {
        const response = await api.get("/tutorials/user/saved");
        setSavedTutorials(response.data?.data?.map((t: TutorialItem) => t._id) || []);
      } catch (error) {
        console.error("Error fetching saved tutorials:", error);
      }
    };

    fetchSavedTutorials();
  }, []);

  const handleSaveTutorial = async (tutorial: TutorialItem) => {
    try {
      const response = await api.post("/tutorials/save", {
        tutorialId: tutorial._id,
      });

      if (response.status === 200 || response.status === 201) {
        setSavedTutorials([...savedTutorials, tutorial._id]);
      }
    } catch (error) {
      console.error("Error saving tutorial:", error);
    }
  };

  const handleUnsaveTutorial = async (tutorialId: string) => {
    try {
      const response = await api.delete(`/tutorials/saved/${tutorialId}`);

      if (response.status === 200) {
        setSavedTutorials(savedTutorials.filter((id) => id !== tutorialId));
      }
    } catch (error) {
      console.error("Error removing saved tutorial:", error);
    }
  };

  return (
    <div className="tutorials-page">
      <div className="tutorials-header">
        <h1>📚 Learning Tutorials</h1>
        <p>
          Select a language and concept to get started with AI-powered tutorials
        </p>
      </div>

      <div className="tutorials-container">
        {/* Sidebar for selection */}
        <div className="tutorials-sidebar">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={(lang) => {
              setSelectedLanguage(lang);
              setSelectedConcept("");
            }}
          />

          <ConceptSelector
            selectedConcept={selectedConcept}
            concepts={
              mainConcepts[selectedLanguage as keyof MainConcepts] || []
            }
            onConceptChange={setSelectedConcept}
          />

          <TutorialList
            tutorials={tutorials}
            selectedTutorial={selectedTutorial}
            savedTutorials={savedTutorials}
            loading={loading}
            onSelectTutorial={setSelectedTutorial}
            onSaveTutorial={handleSaveTutorial}
            onUnsaveTutorial={handleUnsaveTutorial}
          />
        </div>

        {/* Main content area */}
        <div className="tutorials-content">
          {selectedTutorial ? (
            <TutorialViewer
              tutorial={selectedTutorial}
              isSaved={savedTutorials.includes(selectedTutorial._id)}
              onSave={() => handleSaveTutorial(selectedTutorial)}
              onUnsave={() => handleUnsaveTutorial(selectedTutorial._id)}
            />
          ) : (
            <div className="tutorials-empty-state">
              <p>Select a tutorial to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialsPage;
