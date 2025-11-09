import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./DemoTutorialsPage.css";
import LanguageSelector from "./Components/DemoLanguageSelector";
import ConceptSelector from "./Components/DemoConceptSelector";
import TutorialList from "./Components/DemoTutorialList";
import TutorialViewer from "./Components/DemoTutorialViewer";

// API Base URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface Tutorial {
  _id: string;
  title: string;
  description: string;
  language: string;
  concept: string;
  mainConcept: boolean;
  difficulty: string;
  content: string;
  tags: string[];
  codeExamples: Array<{
    title: string;
    description: string;
    code: string;
    input: string;
    expectedOutput: string;
  }>;
}

interface MainConcepts {
  python: string[];
  javascript: string[];
  cpp: string[];
}

const TutorialsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python");
  const [selectedConcept, setSelectedConcept] = useState<string>("");
  const [mainConcepts, setMainConcepts] = useState<MainConcepts>({
    python: [],
    javascript: [],
    cpp: [],
  });
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(
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
    const fetchMainConcepts = async () => {
      try {
        // This would be fetched from backend - for now using hardcoded data
        setMainConcepts({
          python: [
            "Variables",
            "Data Types",
            "Control Flow",
            "Loops",
            "Functions",
          ],
          javascript: [
            "Variables",
            "Conditionals",
            "Loops",
            "Functions",
            "DOM Manipulation",
          ],
          cpp: [
            "Variables",
            "Input/Output",
            "Control Structures",
            "Loops",
            "Functions",
          ],
        });
      } catch (error) {
        console.error("Error fetching concepts:", error);
      }
    };
    fetchMainConcepts();
  }, []);

  // Fetch tutorials when language or concept changes
  useEffect(() => {
    const fetchTutorials = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE_URL}/tutorials?language=${selectedLanguage}`;
        if (selectedConcept) {
          url += `&concept=${selectedConcept}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        setTutorials(data.data || []);

        // Set first tutorial as selected if available
        if (data.data && data.data.length > 0) {
          setSelectedTutorial(data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching tutorials:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedLanguage) {
      fetchTutorials();
    }
  }, [selectedLanguage, selectedConcept]);

  // Fetch saved tutorials
  useEffect(() => {
    const fetchSavedTutorials = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tutorials/user/saved`, {
          credentials: "include",
        });
        const data = await response.json();
        setSavedTutorials(data.data?.map((t: Tutorial) => t._id) || []);
      } catch (error) {
        console.error("Error fetching saved tutorials:", error);
      }
    };

    fetchSavedTutorials();
  }, []);

  const handleSaveTutorial = async (tutorial: Tutorial) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tutorials/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ tutorialId: tutorial._id }),
      });

      if (response.ok) {
        setSavedTutorials([...savedTutorials, tutorial._id]);
      }
    } catch (error) {
      console.error("Error saving tutorial:", error);
    }
  };

  const handleUnsaveTutorial = async (tutorialId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/tutorials/saved/${tutorialId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
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
