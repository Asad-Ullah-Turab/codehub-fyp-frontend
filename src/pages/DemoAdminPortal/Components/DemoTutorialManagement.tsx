import { useState, useEffect } from "react";
import { fetchTutorials, removeTutorial } from "../../../functions";
import { PAGINATION } from "../../../constants";
import "./DemoTutorialManagement.css";

interface Tutorial {
  _id: string;
  title: string;
  language: string;
  concept: string;
  difficulty: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  pages: number;
  currentPage: number;
}

function DemoTutorialManagement({ onError }: { onError: (msg: string) => void }) {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    pages: 0,
    currentPage: 1,
  });

  const loadTutorials = async (page = 1) => {
    try {
      setLoading(true);
      const data = await fetchTutorials(page, PAGINATION.DEFAULT_LIMIT, languageFilter, search);
      setTutorials(data.tutorials);
      setPagination({
        total: data.total,
        pages: data.pages,
        currentPage: page,
      });
    } catch {
      onError("Failed to load tutorials");
      // Ensure we have valid state even on error
      setTutorials([]);
      setPagination({
        total: 0,
        pages: 0,
        currentPage: page,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutorials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, languageFilter]);

  const handleDeleteTutorial = async (tutorial: Tutorial) => {
    if (window.confirm(`Are you sure you want to delete "${tutorial.title}"?`)) {
      try {
        await removeTutorial(tutorial._id);
        loadTutorials(pagination.currentPage);
        onError("");
      } catch {
        onError("Failed to delete tutorial");
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "#10b981";
      case "intermediate":
        return "#f59e0b";
      case "advanced":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="demo-tutorial-management">
      <div className="management-header">
        <h2>Tutorial Management</h2>
        <p>Total Tutorials: {pagination.total}</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by title or concept..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Languages</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      {/* Tutorials Grid */}
      {loading ? (
        <div className="demo-loading">Loading tutorials...</div>
      ) : !tutorials || tutorials.length === 0 ? (
        <div className="no-data">No tutorials found</div>
      ) : (
        <div className="tutorials-grid">
          {tutorials.map((tutorial) => (
            <div key={tutorial._id} className="tutorial-card">
              <div className="card-header">
                <h3>{tutorial.title}</h3>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteTutorial(tutorial)}
                  title="Delete tutorial"
                >
                  🗑️
                </button>
              </div>

              <div className="card-meta">
                <span className="language-badge">
                  {tutorial.language === "python"
                    ? "🐍"
                    : tutorial.language === "javascript"
                    ? "🟨"
                    : "⚙️"}{" "}
                  {tutorial.language}
                </span>

                <span
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(tutorial.difficulty) }}
                >
                  {tutorial.difficulty}
                </span>
              </div>

              <div className="card-content">
                <p className="concept">Concept: {tutorial.concept}</p>
                <p className="created-date">
                  Created: {new Date(tutorial.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="pagination">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => fetchTutorials(page)}
              className={`page-btn ${pagination.currentPage === page ? "active" : ""}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default DemoTutorialManagement;
