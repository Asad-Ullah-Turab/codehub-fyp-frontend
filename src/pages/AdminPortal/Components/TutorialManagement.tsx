import React, { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  X,
  Bold,
  Italic,
  Underline,
  List,
  Link,
  Code,
  Info,
} from "lucide-react";

export default function TutorialManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: ["python", "beginners"],
    status: "draft",
    content: "",
  });

  // Sample tutorials data
  const [tutorials] = useState([
    {
      id: 1,
      title: "Introduction to Python Variables",
      category: "Python Basics",
      author: "John Doe",
      status: "Published",
      date: "2024-01-15",
      views: 1234,
      language: "Python",
    },
    {
      id: 2,
      title: "JavaScript Array Methods",
      category: "JavaScript",
      author: "Jane Smith",
      status: "Published",
      date: "2024-01-14",
      views: 856,
      language: "JavaScript",
    },
    {
      id: 3,
      title: "Understanding React Hooks",
      category: "React",
      author: "Mike Johnson",
      status: "Draft",
      date: "2024-01-13",
      views: 432,
      language: "JavaScript",
    },
    {
      id: 4,
      title: "Python List Comprehensions",
      category: "Python Advanced",
      author: "Sarah Williams",
      status: "Published",
      date: "2024-01-12",
      views: 967,
      language: "Python",
    },
    {
      id: 5,
      title: "CSS Flexbox Guide",
      category: "CSS",
      author: "Alex Brown",
      status: "Published",
      date: "2024-01-11",
      views: 723,
      language: "CSS",
    },
  ]);

  const addTag = (tag) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tag.trim()] });
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesSearch =
      tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || tutorial.language === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">
              Admin Panel / Tutorials
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tutorial Management
            </h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Tutorial
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Languages</option>
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
            <option value="CSS">CSS</option>
          </select>
        </div>
      </div>

      {/* Tutorials Table */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600">
                  TITLE
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600">
                  CATEGORY
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600">
                  AUTHOR
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600">
                  STATUS
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600">
                  DATE
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600">
                  VIEWS
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTutorials.map((tutorial) => (
                <tr
                  key={tutorial.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {tutorial.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {tutorial.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {tutorial.author}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-medium ${
                        tutorial.status === "Published"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {tutorial.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(tutorial.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {tutorial.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {filteredTutorials.length} of {tutorials.length} tutorials
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Tutorial Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  Admin Panel / Tutorials / Create New
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Create New Tutorial
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Changes saved
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                  Save as Draft
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600">
                  Publish
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-3 gap-6 p-6">
                {/* Left Sidebar */}
                <div className="space-y-6">
                  {/* Tutorial Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Tutorial Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Tutorial Title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a category</option>
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript</option>
                      <option value="react">React</option>
                      <option value="css">CSS</option>
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:bg-blue-100 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add tags..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag(e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Add tags to improve discoverability.
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Status
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setFormData({ ...formData, status: "draft" })
                        }
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium border ${
                          formData.status === "draft"
                            ? "bg-gray-100 border-gray-300 text-gray-900"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        Draft
                      </button>
                      <button
                        onClick={() =>
                          setFormData({ ...formData, status: "published" })
                        }
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium border ${
                          formData.status === "published"
                            ? "bg-gray-100 border-gray-300 text-gray-900"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        Published
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="col-span-2">
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    {/* Toolbar */}
                    <div className="bg-gray-50 border-b border-gray-300 px-4 py-2 flex items-center gap-1">
                      <button className="p-1.5 hover:bg-gray-200 rounded">
                        <Bold className="w-4 h-4 text-gray-700" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded">
                        <Italic className="w-4 h-4 text-gray-700" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded">
                        <Underline className="w-4 h-4 text-gray-700" />
                      </button>
                      <div className="w-px h-6 bg-gray-300 mx-2"></div>
                      <button className="p-1.5 hover:bg-gray-200 rounded">
                        <List className="w-4 h-4 text-gray-700" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded">
                        <List className="w-4 h-4 text-gray-700 transform rotate-180" />
                      </button>
                      <div className="w-px h-6 bg-gray-300 mx-2"></div>
                      <button className="p-1.5 hover:bg-gray-200 rounded">
                        <Link className="w-4 h-4 text-gray-700" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded">
                        <Code className="w-4 h-4 text-gray-700" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded">
                        <Info className="w-4 h-4 text-blue-500" />
                      </button>
                    </div>

                    {/* Text Editor */}
                    <div className="bg-white p-4 min-h-[400px]">
                      <textarea
                        placeholder="Start writing your tutorial here... Use the toolbar to format text and insert code blocks."
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        className="w-full h-full min-h-[380px] text-sm text-gray-700 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
