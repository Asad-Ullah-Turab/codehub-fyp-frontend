import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "../../../contexts/ToastContext";
import { creatorCourseAPI } from "../../../services/creatorCourseAPI";

interface CourseApprovalItem {
  _id: string;
  title: string;
  shortDescription: string;
  language: string;
  category: string;
  difficulty: string;
  publishRequestedAt?: string | null;
  instructor: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function CreatorCourseApprovals() {
  const [courses, setCourses] = useState<CourseApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const { showToast } = useToast();

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await creatorCourseAPI.getPendingPublishRequests();
      setCourses(response.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching pending publish requests:", err);
      setError("Unable to load pending creator course approvals.");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (courseId: string, action: "approve" | "reject") => {
    if (action === "reject" && !comment.trim()) {
      showToast("Please provide a rejection comment.", "warning");
      return;
    }

    try {
      setActionLoading(courseId);
      await creatorCourseAPI.reviewPublishRequest(courseId, action, comment.trim());
      showToast(
        action === "approve"
          ? "Course publish request approved"
          : "Course publish request rejected",
        "success",
      );
      setComment("");
      setExpandedId(null);
      fetchPendingRequests();
    } catch (err) {
      console.error("Error reviewing publish request:", err);
      showToast("Failed to review publish request", "error");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Loader className="mx-auto h-10 w-10 animate-spin text-indigo-600" />
          <p className="mt-4 text-sm text-slate-600">Loading pending creator course approvals...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-600 shadow-sm">
          No creator course publish requests are pending review.
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course._id} className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                className="w-full px-6 py-5 text-left"
                onClick={() => setExpandedId(expandedId === course._id ? null : course._id)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-indigo-600">Creator course request</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">{course.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{course.shortDescription}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2 py-1">{course.language}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1">{course.category}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1">{course.difficulty}</span>
                    </div>
                  </div>
                  <div>
                    {expandedId === course._id ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
                  </div>
                </div>
              </button>
              {expandedId === course._id && (
                <div className="border-t border-slate-200 bg-slate-50 p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-slate-500">Creator</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{course.instructor.name}</p>
                      <p className="text-sm text-slate-500">{course.instructor.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Requested at</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {course.publishRequestedAt
                          ? new Date(course.publishRequestedAt).toLocaleString()
                          : "--"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <textarea
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      placeholder="Optional comment for rejection"
                      className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      rows={4}
                    />
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() => handleReview(course._id, "reject")}
                        className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={actionLoading === course._id}
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReview(course._id, "approve")}
                        className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={actionLoading === course._id}
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
