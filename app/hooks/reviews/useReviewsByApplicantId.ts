import { api_client } from "@/lib/axios";
import { Review } from "@/utils/types/reviews";
import { useEffect, useState } from "react";

const useReviewsByApplicantId = ({ applicantId }: { applicantId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await api_client.get("reviews/" + applicantId);
      setReviews(res.data.data.reviews);
      setAverageRating(res.data.data.averageRating);
    } catch (error) {
      console.error("Failed to fetch all reviews:", error);
    } finally {
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    reviews,
    averageRating,
    isLoading,
    refetch: fetchReviews
  };
};

export default useReviewsByApplicantId;
