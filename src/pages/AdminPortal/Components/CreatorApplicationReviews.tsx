import { useEffect, useState } from "react";
import { adminAPI } from "../../../services/adminAPI";
import { useToast } from "../../../contexts/ToastContext";

interface CreatorApplication {
  _id: string;
  name: string;
  email: string;
  role: string;
  accountStatus: string;
  creatorApplication: {
    status: string;
    submittedAt?: string;
    reviewedAt?: string;
    reviewComment?: string;
    details?: {
      message?: string;
      portfolioLink?: string;
      experienceSummary?: string;
    };
  };
  createdAt: string;
}

export default function CreatorApplicationReviews() {
  const [applications, setApplications] = useState<CreatorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewComments, setReviewComments] = useState<Record<string, string>>({});
  const { showToast } = useToast();

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminAPI.getPendingCreatorApplications(1, 10);
      if (response?.success) {
        setApplications(response.data);
      } else {
        setError(response?.message || "Failed to load creator applications");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load creator applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleReview = async (userId: string, action: "approve" | "reject") => {
    const comment = reviewComments[userId] || "";
    if (action === "reject" && !comment.trim()) {
      showToast("Please enter a rejection message before rejecting the application.", "warning");
      return;
    }

    try {
      setReviewingId(userId);
      const response = await adminAPI.reviewCreatorApplication(userId, action, comment.trim());
      if (response.success) {
        setApplications((prev) => prev.filter((item) => item._id !== userId));
        showToast(
          action === "approve"
            ? "Creator application approved"
            : "Creator application rejected",
          "success",
        );
      } else {
        showToast(response.message || "Failed to review creator application", "error");
      }
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to review creator application",
        "error",
      );
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">
            Creator Applications
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Review pending applications</h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Review applications from users requesting creator access. Approve or reject submissions and keep the workflow separated from the main dashboard.
          </p>
        </div>
        <button
          onClick={loadApplications}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500"></div>
            <p className="mt-4 text-sm text-slate-600">Loading creator applications...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            {error}
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-600">No pending creator applications at the moment.</p>
          </div>
        ) : (
          applications.map((application) => (
            <div
              key={application._id}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">{application.email}</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900 truncate">
                    {application.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Requested: {new Date(application.creatorApplication.submittedAt || application.createdAt).toLocaleDateString()}
                  </p>
                  {((application.creatorApplication.details && application.creatorApplication.details.message) || application.creatorApplication.message) && (
                    <p className="mt-4 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                      {application.creatorApplication.details?.message || application.creatorApplication.message}
                    </p>
                  )}
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    {(application.creatorApplication.details?.portfolioLink || application.creatorApplication.portfolioLink) && (
                      <p className="break-all">
                        <span className="font-semibold text-slate-800">Portfolio:</span> {application.creatorApplication.details?.portfolioLink || application.creatorApplication.portfolioLink}
                      </p>
                    )}
                    {(application.creatorApplication.details?.experienceSummary || application.creatorApplication.experienceSummary) && (
                      <p>
                        <span className="font-semibold text-slate-800">Experience:</span> {application.creatorApplication.details?.experienceSummary || application.creatorApplication.experienceSummary}
                      </p>
                    )}
                  </div>
                  <div className="mt-6">
                    <label htmlFor={`review-comment-${application._id}`} className="text-sm font-medium text-slate-900">
                      Admin note{application.creatorApplication.status === "pending" ? " (required for rejection)" : ""}
                    </label>
                    <textarea
                      id={`review-comment-${application._id}`}
                      value={reviewComments[application._id] || ""}
                      onChange={(event) =>
                        setReviewComments((prev) => ({
                          ...prev,
                          [application._id]: event.target.value,
                        }))
                      }
                      rows={3}
                      className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Add a message for the applicant (required when rejecting)"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleReview(application._id, "approve")}
                    disabled={reviewingId === application._id}
                    className="min-w-[120px] rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:bg-slate-300 disabled:text-slate-600"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReview(application._id, "reject")}
                    disabled={reviewingId === application._id}
                    className="min-w-[120px] rounded-2xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
