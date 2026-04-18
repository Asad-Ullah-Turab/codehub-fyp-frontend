import { useEffect, useState } from "react";
import { adminAPI } from "../../../services/adminAPI";
import { useToast } from "../../../contexts/ToastContext";
import AdminPageLayout from "./AdminPageLayout";

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
    <AdminPageLayout
      title="Creator Applications"
      subtitle="Review pending creator applications and manage creator onboarding"
      actions={
        <button
          onClick={loadApplications}
          className="theme-primary-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white"
        >
          Refresh applications
        </button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Pending applications</p>
          <p className="mt-3 text-3xl font-semibold text-gray-900">{loading ? "..." : applications.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Latest status</p>
          <p className="mt-3 text-sm text-gray-600">Load the latest pending creator applications and review each submission.</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
              <p className="mt-4 text-sm text-gray-500">Loading creator applications...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
              {error}
            </div>
          ) : applications.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-gray-600">No pending creator applications at the moment.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="bg-gray-50 px-6 py-5 sm:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
                          Creator Applicant
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-gray-900 truncate">{application.name}</h2>
                        <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
                          <span>{application.email}</span>
                          <span>Requested: {new Date(application.creatorApplication.submittedAt || application.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                          {application.creatorApplication.status}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">Role: {application.role}</span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">Status: {application.accountStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-6 sm:px-8">
                    <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-gray-200 bg-slate-50 p-5">
                          <p className="text-sm font-semibold text-gray-900">Application summary</p>
                          <p className="mt-3 text-sm leading-7 text-gray-700 whitespace-pre-line">
                            {application.creatorApplication.details?.message || "No details provided."}
                          </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          {application.creatorApplication.details?.portfolioLink && (
                            <div className="rounded-2xl border border-gray-200 bg-white p-4">
                              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Portfolio</p>
                              <p className="mt-2 text-sm text-indigo-700 break-all">{application.creatorApplication.details.portfolioLink}</p>
                            </div>
                          )}
                          {application.creatorApplication.details?.experienceSummary && (
                            <div className="rounded-2xl border border-gray-200 bg-white p-4">
                              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Experience</p>
                              <p className="mt-2 text-sm text-gray-700">{application.creatorApplication.details.experienceSummary}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-2xl border border-gray-200 bg-slate-50 p-5">
                          <p className="text-sm font-semibold text-gray-900">Admin response</p>
                          <textarea
                            id={`review-comment-${application._id}`}
                            value={reviewComments[application._id] || ""}
                            onChange={(event) =>
                              setReviewComments((prev) => ({
                                ...prev,
                                [application._id]: event.target.value,
                              }))
                            }
                            rows={5}
                            className="mt-3 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                            placeholder="Add a message for the applicant (required when rejecting)"
                          />
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                          <button
                            type="button"
                            onClick={() => handleReview(application._id, "approve")}
                            disabled={reviewingId === application._id}
                            className="inline-flex min-w-[140px] items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-600"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReview(application._id, "reject")}
                            disabled={reviewingId === application._id}
                            className="inline-flex min-w-[140px] items-center justify-center rounded-lg border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:bg-slate-100 disabled:text-slate-400"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </AdminPageLayout>
  );
}
