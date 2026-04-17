import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { adminTutorialAPI } from "../../../services/adminTutorialAPI";
import { useToast } from "../../../contexts/ToastContext";

const initialTutorialForm = {
  title: "",
  description: "",
  language: "",
  concept: "",
  difficulty: "beginner",
  isPremium: false,
  content: "",
  tags: [] as string[],
  codeExamples: [] as Array<{ code: string; explanation?: string }> ,
  notes: [] as string[],
  tips: [] as string[],
};

export default function TutorialCreatePage() {
  const [formData, setFormData] = useState(initialTutorialForm);
  const [languages, setLanguages] = useState<string[]>([]);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [newLanguage, setNewLanguage] = useState("");
  const [newConcept, setNewConcept] = useState("");
  const [showNewLanguageInput, setShowNewLanguageInput] = useState(false);
  const [showNewConceptInput, setShowNewConceptInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const response = await adminTutorialAPI.getLanguages();
        setLanguages(response.data || []);
      } catch (error) {
        console.error("Error loading tutorial languages:", error);
      }
    })();
  }, []);

  const fetchConcepts = async (language: string) => {
    try {
      const response = await adminTutorialAPI.getConcepts(language);
      setConcepts(response.data || []);
    } catch (error) {
      console.error("Error loading concepts:", error);
    }
  };

  const handleLanguageChange = (language: string) => {
    setFormData({ ...formData, language, concept: "" });
    if (language) {
      fetchConcepts(language);
    }
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData({ ...formData, tags: [...formData.tags, trimmed] });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((tag) => tag !== tagToRemove) });
  };

  const addNote = (note: string) => {
    const trimmed = note.trim();
    if (trimmed) {
      setFormData({ ...formData, notes: [...formData.notes, trimmed] });
    }
  };

  const removeNote = (index: number) => {
    setFormData({ ...formData, notes: formData.notes.filter((_, i) => i !== index) });
  };

  const addTip = (tip: string) => {
    const trimmed = tip.trim();
    if (trimmed) {
      setFormData({ ...formData, tips: [...formData.tips, trimmed] });
    }
  };

  const removeTip = (index: number) => {
    setFormData({ ...formData, tips: formData.tips.filter((_, i) => i !== index) });
  };

  const addCodeExample = () => {
    setFormData({ ...formData, codeExamples: [...formData.codeExamples, { code: "", explanation: "" }] });
  };

  const updateCodeExample = (index: number, field: "code" | "explanation", value: string) => {
    const updated = [...formData.codeExamples];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, codeExamples: updated });
  };

  const removeCodeExample = (index: number) => {
    setFormData({ ...formData, codeExamples: formData.codeExamples.filter((_, i) => i !== index) });
  };

  const handleAddNewLanguage = () => {
    if (!newLanguage.trim()) return;
    const lower = newLanguage.trim().toLowerCase();
    if (!languages.includes(lower)) {
      setLanguages([...languages, lower]);
    }
    handleLanguageChange(lower);
    setNewLanguage("");
    setShowNewLanguageInput(false);
  };

  const handleAddNewConcept = () => {
    if (!newConcept.trim()) return;
    const conceptValue = newConcept.trim();
    if (!concepts.includes(conceptValue)) {
      setConcepts([...concepts, conceptValue]);
    }
    setFormData({ ...formData, concept: conceptValue });
    setNewConcept("");
    setShowNewConceptInput(false);
  };

  const handleCancel = () => {
    navigate("/admin/tutorials");
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.language || !formData.concept || !formData.content.trim()) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    try {
      setLoading(true);
      await adminTutorialAPI.createTutorial(formData);
      showToast("Tutorial created successfully", "success");
      navigate("/admin/tutorials");
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Failed to create tutorial", "error");
      console.error("Error saving tutorial:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm text-gray-500">Admin Panel / Tutorials / Create</div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Tutorial</h1>
        </div>
        <button
          onClick={handleCancel}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tutorials
        </button>
      </div>

      <div className="p-6">
        <div className="mx-auto max-w-6xl bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter tutorial title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Short description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Language *
                  </label>
                  {!showNewLanguageInput ? (
                    <div className="space-y-2">
                      <select
                        value={formData.language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">Select a language</option>
                        {languages.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowNewLanguageInput(true)}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        + Add new language
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddNewLanguage();
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Enter new language"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleAddNewLanguage}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700"
                        >
                          Add Language
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowNewLanguageInput(false);
                            setNewLanguage("");
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Concept *
                  </label>
                  {!showNewConceptInput ? (
                    <div className="space-y-2">
                      <select
                        value={formData.concept}
                        onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                        disabled={!formData.language}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50"
                      >
                        <option value="">Select a concept</option>
                        {concepts.map((concept) => (
                          <option key={concept} value={concept}>
                            {concept}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowNewConceptInput(true)}
                        disabled={!formData.language}
                        className="text-xs text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        + Add new concept
                      </button>
                      {!formData.language && (
                        <p className="text-xs text-gray-500">Select a language first</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={newConcept}
                        onChange={(e) => setNewConcept(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddNewConcept();
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Enter new concept"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleAddNewConcept}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700"
                        >
                          Add Concept
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowNewConceptInput(false);
                            setNewConcept("");
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPremium}
                    onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                    id="premium-checkbox"
                    className="h-4 w-4 text-yellow-500 border-gray-300 rounded"
                  />
                  <label htmlFor="premium-checkbox" className="text-sm font-medium text-gray-900">
                    Premium tutorial
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:bg-blue-100 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Press enter to add a tag"
                  />
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Tutorial Content *</label>
                  <textarea
                    rows={14}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-h-[320px]"
                    placeholder="Write the tutorial content here..."
                  />
                  <p className="text-xs text-gray-500 mt-2">Supports markdown-style content.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-900">Code Examples</h2>
                    <button
                      type="button"
                      onClick={addCodeExample}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700"
                    >
                      + Add Example
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.codeExamples.map((example, idx) => (
                      <div key={idx} className="border border-gray-300 rounded-2xl p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-gray-700">Example {idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeCodeExample(idx)}
                            className="text-red-500 text-xs hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-3">
                          <textarea
                            rows={4}
                            value={example.code}
                            onChange={(e) => updateCodeExample(idx, "code", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Code snippet"
                          />
                          <input
                            type="text"
                            value={example.explanation || ""}
                            onChange={(e) => updateCodeExample(idx, "explanation", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Explanation (optional)"
                          />
                        </div>
                      </div>
                    ))}
                    {formData.codeExamples.length === 0 && (
                      <p className="text-xs text-gray-500">No code examples added yet.</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Notes</label>
                    <div className="space-y-2 mb-2">
                      {formData.notes.map((note, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-3 border border-gray-200 rounded-xl bg-white text-sm">
                          <span className="flex-1">{note}</span>
                          <button type="button" onClick={() => removeNote(idx)} className="text-red-500 hover:text-red-700">×</button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="text"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addNote(e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Press enter to add a note"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Tips</label>
                    <div className="space-y-2 mb-2">
                      {formData.tips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-3 border border-gray-200 rounded-xl bg-white text-sm">
                          <span className="flex-1">{tip}</span>
                          <button type="button" onClick={() => removeTip(idx)} className="text-red-500 hover:text-red-700">×</button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="text"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTip(e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Press enter to add a tip"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-5 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="w-full sm:w-auto px-5 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Tutorial"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
