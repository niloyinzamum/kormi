import { api_client } from "@/lib/axios";
import { Applicant } from "@/utils/types/applicant";
import { TJob } from "@/utils/types/job";
import { useEffect, useState } from "react";

const usePendingReviews = () => {
  const [pendingReviews, setPendingReviews] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await api_client.get("reviews/pending");
      setPendingReviews(res.data.data);
    } catch (error) {
      console.error("Failed to fetch pending reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitReview = async (jobId: string, applicantId: string, review: { rating: number; feedback: string }) => {
    const backup_reviews = pendingReviews;
    try {
      setIsSubmitting(true);
      setPendingReviews((reviews) => reviews.filter((review) => review._id !== applicantId));
      await api_client.post(`reviews/${jobId}`, {
        applicantId,
        review
      });
      setIsSubmitting(false);
    } catch (error) {
      setPendingReviews(backup_reviews);
      console.error("Failed to submit review:", error);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    pendingReviews,
    setPendingReviews,
    isLoading,
    refetch: fetchReviews,
    submitReview,
    isSubmitting
  };
};

export default usePendingReviews;
