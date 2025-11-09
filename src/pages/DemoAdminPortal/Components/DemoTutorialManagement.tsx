import { useState, useEffect } from "react";
import { fetchTutorials, removeTutorial, createNewTutorial } from "../../../functions";
import { PAGINATION, LANGUAGES, DIFFICULTY_LEVELS } from "../../../constants";
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: LANGUAGES.PYTHON,
    concept: "",
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    content: "",
    notes: [""],
    tips: [""],
    tags: [""],
    codeExamples: [
      {
        title: "",
        description: "",
        code: "",
        expectedOutput: "",
      },
    ],
  });
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

  const handleAddTutorial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.concept || !formData.content) {
      onError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Filter empty items from arrays
      const filteredData = {
        ...formData,
        notes: formData.notes.filter((n) => n.trim() !== ""),
        tips: formData.tips.filter((t) => t.trim() !== ""),
        tags: formData.tags.filter((tag) => tag.trim() !== ""),
        codeExamples: formData.codeExamples.filter(
          (ex) => ex.title.trim() !== "" && ex.code.trim() !== ""
        ),
      };

      await createNewTutorial(filteredData);
      setShowAddModal(false);
      setFormData({
        title: "",
        description: "",
        language: LANGUAGES.PYTHON,
        concept: "",
        difficulty: DIFFICULTY_LEVELS.BEGINNER,
        content: "",
        notes: [""],
        tips: [""],
        tags: [""],
        codeExamples: [
          {
            title: "",
            description: "",
            code: "",
            expectedOutput: "",
          },
        ],
      });
      onError("");
      loadTutorials(1);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create tutorial';
      onError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle array field changes
  const handleArrayItemChange = (
    field: "notes" | "tips" | "tags",
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  // Add new item to array field
  const addArrayItem = (field: "notes" | "tips" | "tags") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  // Remove item from array field
  const removeArrayItem = (field: "notes" | "tips" | "tags", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Handle code example changes
  const handleCodeExampleChange = (
    index: number,
    field: keyof (typeof formData.codeExamples)[0],
    value: string
  ) => {
    setFormData((prev) => {
      const newExamples = [...prev.codeExamples];
      newExamples[index] = {
        ...newExamples[index],
        [field]: value,
      };
      return { ...prev, codeExamples: newExamples };
    });
  };

  // Add new code example
  const addCodeExample = () => {
    setFormData((prev) => ({
      ...prev,
      codeExamples: [
        ...prev.codeExamples,
        {
          title: "",
          description: "",
          code: "",
          expectedOutput: "",
        },
      ],
    }));
  };

  // Remove code example
  const removeCodeExample = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      codeExamples: prev.codeExamples.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="demo-tutorial-management">
      <div className="management-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2>Tutorial Management</h2>
            <p>Total Tutorials: {pagination.total}</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
          >
            + Add Tutorial
          </button>
        </div>
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

      {/* Add Tutorial Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              backgroundColor: "#0f172a",
              padding: "30px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "700px",
              maxHeight: "95vh",
              overflowY: "auto",
              border: "1px solid rgba(102, 126, 234, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 20px 0", color: "#f1f5f9", fontSize: "20px" }}>
              Add New Tutorial
            </h3>

            <form onSubmit={handleAddTutorial} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Title */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#cbd5e1", fontSize: "14px" }}>
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Tutorial title"
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#1e293b",
                    border: "1px solid rgba(102, 126, 234, 0.3)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#cbd5e1", fontSize: "14px" }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Brief description of the tutorial"
                  required
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#1e293b",
                    border: "1px solid rgba(102, 126, 234, 0.3)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Language */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#cbd5e1", fontSize: "14px" }}>
                  Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#1e293b",
                    border: "1px solid rgba(102, 126, 234, 0.3)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                >
                  <option value={LANGUAGES.PYTHON}>Python</option>
                  <option value={LANGUAGES.JAVASCRIPT}>JavaScript</option>
                  <option value={LANGUAGES.CPP}>C++</option>
                </select>
              </div>

              {/* Concept */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#cbd5e1", fontSize: "14px" }}>
                  Concept *
                </label>
                <input
                  type="text"
                  name="concept"
                  value={formData.concept}
                  onChange={handleFormChange}
                  placeholder="e.g., Variables, Functions"
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#1e293b",
                    border: "1px solid rgba(102, 126, 234, 0.3)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Difficulty */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#cbd5e1", fontSize: "14px" }}>
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#1e293b",
                    border: "1px solid rgba(102, 126, 234, 0.3)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                >
                  <option value={DIFFICULTY_LEVELS.BEGINNER}>Beginner</option>
                  <option value={DIFFICULTY_LEVELS.INTERMEDIATE}>Intermediate</option>
                  <option value={DIFFICULTY_LEVELS.ADVANCED}>Advanced</option>
                </select>
              </div>

              {/* Content */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#cbd5e1", fontSize: "14px" }}>
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  placeholder="Tutorial content and detailed explanation"
                  required
                  rows={6}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#1e293b",
                    border: "1px solid rgba(102, 126, 234, 0.3)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Notes Section */}
              <div style={{ borderTop: "1px solid rgba(102, 126, 234, 0.2)", paddingTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <label style={{ color: "#cbd5e1", fontSize: "14px", fontWeight: "600" }}>
                    📝 Key Notes (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem("notes")}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#667eea",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    + Add
                  </button>
                </div>
                {formData.notes.map((note, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => handleArrayItemChange("notes", idx, e.target.value)}
                      placeholder={`Note ${idx + 1}`}
                      style={{
                        flex: 1,
                        padding: "8px",
                        backgroundColor: "#1e293b",
                        border: "1px solid rgba(102, 126, 234, 0.3)",
                        borderRadius: "6px",
                        color: "#f1f5f9",
                        fontSize: "13px",
                        boxSizing: "border-box",
                      }}
                    />
                    {formData.notes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("notes", idx)}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Tips Section */}
              <div style={{ borderTop: "1px solid rgba(102, 126, 234, 0.2)", paddingTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <label style={{ color: "#cbd5e1", fontSize: "14px", fontWeight: "600" }}>
                    💡 Tips & Best Practices (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem("tips")}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#667eea",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    + Add
                  </button>
                </div>
                {formData.tips.map((tip, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <input
                      type="text"
                      value={tip}
                      onChange={(e) => handleArrayItemChange("tips", idx, e.target.value)}
                      placeholder={`Tip ${idx + 1}`}
                      style={{
                        flex: 1,
                        padding: "8px",
                        backgroundColor: "#1e293b",
                        border: "1px solid rgba(102, 126, 234, 0.3)",
                        borderRadius: "6px",
                        color: "#f1f5f9",
                        fontSize: "13px",
                        boxSizing: "border-box",
                      }}
                    />
                    {formData.tips.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("tips", idx)}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Tags Section */}
              <div style={{ borderTop: "1px solid rgba(102, 126, 234, 0.2)", paddingTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <label style={{ color: "#cbd5e1", fontSize: "14px", fontWeight: "600" }}>
                    🏷️ Tags (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem("tags")}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#667eea",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    + Add
                  </button>
                </div>
                {formData.tags.map((tag, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayItemChange("tags", idx, e.target.value)}
                      placeholder={`Tag ${idx + 1}`}
                      style={{
                        flex: 1,
                        padding: "8px",
                        backgroundColor: "#1e293b",
                        border: "1px solid rgba(102, 126, 234, 0.3)",
                        borderRadius: "6px",
                        color: "#f1f5f9",
                        fontSize: "13px",
                        boxSizing: "border-box",
                      }}
                    />
                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("tags", idx)}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Code Examples Section */}
              <div style={{ borderTop: "1px solid rgba(102, 126, 234, 0.2)", paddingTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <label style={{ color: "#cbd5e1", fontSize: "14px", fontWeight: "600" }}>
                    👨‍💻 Code Examples (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={addCodeExample}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#667eea",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    + Add Example
                  </button>
                </div>
                {formData.codeExamples.map((example, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "#1a1f3a",
                      padding: "12px",
                      borderRadius: "8px",
                      marginBottom: "12px",
                      border: "1px solid rgba(102, 126, 234, 0.2)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <h4 style={{ margin: "0", color: "#cbd5e1", fontSize: "13px" }}>Example {idx + 1}</h4>
                      {formData.codeExamples.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCodeExample(idx)}
                          style={{
                            padding: "4px 8px",
                            backgroundColor: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "11px",
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {/* Example Title */}
                    <div style={{ marginBottom: "10px" }}>
                      <label style={{ display: "block", marginBottom: "4px", color: "#a1aec7", fontSize: "12px" }}>
                        Title
                      </label>
                      <input
                        type="text"
                        value={example.title}
                        onChange={(e) => handleCodeExampleChange(idx, "title", e.target.value)}
                        placeholder="Example title"
                        style={{
                          width: "100%",
                          padding: "6px",
                          backgroundColor: "#0f172a",
                          border: "1px solid rgba(102, 126, 234, 0.2)",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "12px",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {/* Example Description */}
                    <div style={{ marginBottom: "10px" }}>
                      <label style={{ display: "block", marginBottom: "4px", color: "#a1aec7", fontSize: "12px" }}>
                        Description
                      </label>
                      <input
                        type="text"
                        value={example.description}
                        onChange={(e) => handleCodeExampleChange(idx, "description", e.target.value)}
                        placeholder="What does this example demonstrate?"
                        style={{
                          width: "100%",
                          padding: "6px",
                          backgroundColor: "#0f172a",
                          border: "1px solid rgba(102, 126, 234, 0.2)",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "12px",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {/* Example Code */}
                    <div style={{ marginBottom: "10px" }}>
                      <label style={{ display: "block", marginBottom: "4px", color: "#a1aec7", fontSize: "12px" }}>
                        Code
                      </label>
                      <textarea
                        value={example.code}
                        onChange={(e) => handleCodeExampleChange(idx, "code", e.target.value)}
                        placeholder="Enter the code example"
                        rows={4}
                        style={{
                          width: "100%",
                          padding: "6px",
                          backgroundColor: "#0f172a",
                          border: "1px solid rgba(102, 126, 234, 0.2)",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "12px",
                          boxSizing: "border-box",
                          fontFamily: "monospace",
                        }}
                      />
                    </div>

                    {/* Expected Output */}
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", color: "#a1aec7", fontSize: "12px" }}>
                        Expected Output
                      </label>
                      <textarea
                        value={example.expectedOutput}
                        onChange={(e) => handleCodeExampleChange(idx, "expectedOutput", e.target.value)}
                        placeholder="Expected output when code is run"
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "6px",
                          backgroundColor: "#0f172a",
                          border: "1px solid rgba(102, 126, 234, 0.2)",
                          borderRadius: "4px",
                          color: "#f1f5f9",
                          fontSize: "12px",
                          boxSizing: "border-box",
                          fontFamily: "monospace",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "20px", borderTop: "1px solid rgba(102, 126, 234, 0.2)", paddingTop: "16px" }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: isSubmitting ? "#667eea4d" : "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {isSubmitting ? "Creating..." : "Create Tutorial"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: "#64748b",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DemoTutorialManagement;
