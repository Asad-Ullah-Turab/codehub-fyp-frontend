import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../contexts/ToastContext";
import {
  applyForCreatorRole,
  getProfile,
  type CreatorApplicationInput,
} from "../../functions/ProfileFunctions/profileFunctions";

const CreatorApplicationPage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"none" | "pending" | "approved" | "rejected">("none");
  const [reviewComment, setReviewComment] = useState<string>("");
  const [application, setApplication] = useState<CreatorApplicationInput>({
    message: "",
    portfolioLink: "",
    experienceSummary: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAdmin) {
      navigate("/profile");
      return;
    }

    const loadProfile = async () => {
      try {
        if (!isAuthenticated) {
          navigate("/signin");
          return;
        }

        if (isAdmin) {
          navigate("/profile");
          return;
        }

        const profileRes = await getProfile();
        setStatus(profileRes.data.creatorApplication?.status || "none");

        if (profileRes.data.creatorApplication?.details) {
          setApplication({
            message: profileRes.data.creatorApplication.details.message || "",
            portfolioLink: profileRes.data.creatorApplication.details.portfolioLink || "",
            experienceSummary:
              profileRes.data.creatorApplication.details.experienceSummary || "",
          });
        }
        setReviewComment(profileRes.data.creatorApplication?.reviewComment || "");
      } catch (err) {
        console.error("Error loading creator application details:", err);
        setError(err instanceof Error ? err.message : "Failed to load application status");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, navigate]);

  const handleSubmit = async () => {
    if (!application.message.trim()) {
      showToast("Please describe why you want to become a creator.", "warning");
      return;
    }

    try {
      setSubmitting(true);
      const response = await applyForCreatorRole(application);
      setStatus(response.data.creatorApplication?.status || "pending");
      showToast(response.message || "Creator application submitted successfully", "success");
    } catch (err) {
      console.error("Error submitting creator application:", err);
      showToast(err instanceof Error ? err.message : "Failed to submit application", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Creator application</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Apply to become a creator</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Tell us why you want to become a content creator on CodeHub. We’ll review your application and notify you once a decision is made.
            </p>
          </div>
          <button
            onClick={() => navigate("/profile?tab=applications")}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
          >
            Back to profile applications
          </button>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500"></div>
            <p className="mt-4 text-sm text-slate-600">Loading application status...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700 shadow-sm">
            <h2 className="text-lg font-semibold">Unable to load application</h2>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Application status</p>
                  <p className="mt-3 text-2xl font-bold text-slate-900 capitalize">{status}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {status === "approved"
                      ? "Your creator application has been approved. Creator privileges will be activated soon."
                      : status === "pending"
                      ? "Your application is pending review. We’ll notify you once a decision is made."
                      : status === "rejected"
                      ? "Your application was rejected. Update your details below and resubmit when you’re ready."
                      : "Fill out the form below to apply for creator access."}
                  </p>
                  {status === "rejected" && reviewComment && (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                      <p className="text-sm font-semibold text-red-700">Admin feedback</p>
                      <p className="mt-2 text-sm text-red-800 whitespace-pre-line">
                        {reviewComment}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-900">Why do you want to become a content creator?</label>
                    <textarea
                      value={application.message}
                      onChange={(event) =>
                        setApplication((prev) => ({
                          ...prev,
                          message: event.target.value,
                        }))
                      }
                      rows={6}
                      className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Describe your experience and what you want to create for CodeHub"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900">Portfolio link or sample work (optional)</label>
                    <input
                      type="url"
                      value={application.portfolioLink}
                      onChange={(event) =>
                        setApplication((prev) => ({
                          ...prev,
                          portfolioLink: event.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      placeholder="e.g. GitHub, blog, YouTube, portfolio"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900">Experience summary (optional)</label>
                    <input
                      value={application.experienceSummary}
                      onChange={(event) =>
                        setApplication((prev) => ({
                          ...prev,
                          experienceSummary: event.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      placeholder="Share your teaching style, skills, or background"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === "pending" || status === "approved" || submitting}
                    className="inline-flex w-full items-center justify-center rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-700"
                  >
                    {status === "approved"
                      ? "Application approved"
                      : status === "pending"
                      ? "Application pending"
                      : submitting
                      ? "Submitting..."
                      : "Submit application"}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">How creator review works</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Share your goals clearly and include sample work where possible. Our admin team checks applications manually and updates your status once they finish the review.
                  </p>
                </div>
                <div className="rounded-3xl bg-indigo-50 p-5">
                  <p className="text-sm font-semibold text-indigo-700">Next steps</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>• Fill the form with your creator intent.</li>
                    <li>• Add any portfolio or sample links.</li>
                    <li>• Submit and wait for admin review.</li>
                    <li>• You’ll be notified once your status changes.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorApplicationPage;
