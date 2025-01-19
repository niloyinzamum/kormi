export interface Review {
  reviewerId: string;
  reviewerName?: string;
  jobId: string;
  jobTitle?: string;
  rating: number;
  feedback: string;
  createdAt: string;
}
