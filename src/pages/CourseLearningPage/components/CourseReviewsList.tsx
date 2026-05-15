import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { getCourseReviews, markReviewHelpful } from '../../../functions/CourseFunctions/courseFunctions';
import type { CourseReview } from '../../../functions/CourseFunctions/courseFunctions';

interface CourseReviewsListProps {
  courseId: string;
  sortBy?: 'recent' | 'rating-high' | 'rating-low' | 'helpful';
}

const CourseReviewsList: React.FC<CourseReviewsListProps> = ({
  courseId,
  sortBy = 'recent',
}) => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({});
  const [markedHelpful, setMarkedHelpful] = useState<Set<string>>(new Set());

  const limit = 10;

  useEffect(() => {
    loadReviews();
  }, [courseId, sortBy, page]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCourseReviews(
        courseId,
        page,
        limit,
        sortBy as any
      );

      setReviews(Array.isArray(response?.reviews) ? response.reviews : []);
      setTotalPages(typeof response?.pages === 'number' ? response.pages : 1);

      const normalizedDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      const distributionSource = response?.ratingDistribution;

      if (Array.isArray(distributionSource)) {
        distributionSource.forEach((item: any) => {
          const rating = Number(item?._id);
          if (rating >= 1 && rating <= 5) {
            normalizedDistribution[rating] = Number(item?.count) || 0;
          }
        });
      } else if (distributionSource && typeof distributionSource === 'object') {
        [1, 2, 3, 4, 5].forEach((rating) => {
          normalizedDistribution[rating] = Number((distributionSource as Record<number, number>)[rating]) || 0;
        });
      }

      setRatingDistribution(normalizedDistribution);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Failed to load reviews');
      showToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await markReviewHelpful(reviewId);
      setMarkedHelpful((prev) => new Set([...prev, reviewId]));
      showToast('Marked as helpful', 'success');
      // Reload reviews to update helpful count
      loadReviews();
    } catch (err) {
      console.error('Error marking review helpful:', err);
      showToast('Failed to mark as helpful', 'error');
    }
  };

  const renderRatingDistribution = () => {
    const total = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);

    if (total === 0) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-800 mb-4">Rating Distribution</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{star}</span>
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Course Reviews ({Array.isArray(reviews) ? reviews.length : 0})
        </h3>

        {renderRatingDistribution()}

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review this course!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-800">
                        {review.user.name}
                      </h4>
                      {review.isVerifiedEnrollment && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Verified Learner
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Star Rating */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Review Comment */}
                {review.comment && (
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                )}

                {/* Helpful Button */}
                <button
                  onClick={() => handleMarkHelpful(review._id)}
                  disabled={markedHelpful.has(review._id)}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 disabled:text-gray-400 transition-colors"
                >
                  <ThumbsUp size={16} />
                  Helpful ({review.helpful})
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseReviewsList;
