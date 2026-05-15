import React, { useState, useEffect } from 'react';
import { BarChart3, BookOpen, ChevronDown, MessageSquare, Star } from 'lucide-react';
import AdminPageLayout from '../../AdminPortal/Components/AdminPageLayout';
import { useToast } from '../../../contexts/ToastContext';
import creatorCourseAPI from '../../../services/creatorCourseAPI';

interface ReviewSummary {
  courseId: string;
  courseTitle: string;
  reviews: any[];
  averageRating: number;
  totalReviews: number;
}

interface ReviewsBySummary {
  summary: ReviewSummary[];
  totalReviews: number;
  averageRating: number;
}

const CreatorCourseReviews: React.FC = () => {
  const { showToast } = useToast();
  const [summary, setSummary] = useState<ReviewsBySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadReviewsSummary();
  }, []);

  const loadReviewsSummary = async () => {
    try {
      setLoading(true);
      const response = await creatorCourseAPI.getCreatorReviewsSummary();
      setSummary(response.data ?? response);
    } catch (error) {
      console.error('Error loading reviews summary:', error);
      showToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseExpansion = (courseId: string) => {
    setExpandedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex gap-1 items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : i < rating
                  ? 'fill-yellow-200 text-yellow-400'
                  : 'text-gray-300'
            }
          />
        ))}
        <span className="text-sm font-medium text-gray-700 ml-2">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminPageLayout
        title="Course Reviews"
        subtitle="Feedback left by learners on your creator courses."
      >
        <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white py-16 shadow-sm">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />
            <p className="mt-4 text-sm text-slate-600">Loading reviews...</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  if (!summary || !summary.summary || summary.summary.length === 0) {
    return (
      <AdminPageLayout
        title="Course Reviews"
        subtitle="Feedback left by learners on your creator courses."
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <MessageSquare className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">No reviews yet</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            When learners rate your courses, their feedback will appear here.
          </p>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Course Reviews"
      subtitle="Feedback left by learners on your creator courses."
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Courses with reviews</p>
                <p className="text-2xl font-semibold text-slate-900">{summary.summary.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Star className="h-5 w-5 fill-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Average rating</p>
                <p className="text-2xl font-semibold text-slate-900">{summary.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Total reviews</p>
                <p className="text-2xl font-semibold text-slate-900">{summary.totalReviews}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-lg font-semibold text-slate-900">Reviews by course</h3>
            <p className="mt-1 text-sm text-slate-600">
              Expand a course to see the latest learner feedback.
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {summary.summary.map((course) => (
              <div key={course.courseId} className="bg-white">
                <button
                  onClick={() => toggleCourseExpansion(course.courseId)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-slate-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="truncate text-base font-semibold text-slate-900">
                        {course.courseTitle}
                      </h4>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                        {course.totalReviews} reviews
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
                      {renderRatingStars(course.averageRating)}
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 transition-transform ${
                      expandedCourses.has(course.courseId) ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedCourses.has(course.courseId) && (
                  <div className="border-t border-slate-200 bg-slate-50 px-6 py-6">
                    {course.reviews && course.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {course.reviews.slice(0, 5).map((review) => (
                          <div
                            key={review._id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-semibold text-slate-900">
                                    {review.user?.name || 'Anonymous'}
                                  </p>
                                  {review.isVerifiedEnrollment && (
                                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                                      Verified learner
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 text-xs text-slate-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={
                                      i < review.rating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-300'
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                            {review.comment && (
                              <p className="mt-3 text-sm leading-6 text-slate-700">
                                {review.comment}
                              </p>
                            )}
                          </div>
                        ))}
                        {course.reviews.length > 5 && (
                          <p className="pt-2 text-center text-sm text-slate-500">
                            +{course.reviews.length - 5} more reviews
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No reviews yet for this course.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default CreatorCourseReviews;
