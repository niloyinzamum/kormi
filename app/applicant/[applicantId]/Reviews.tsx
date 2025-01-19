import { Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import useReviewsByApplicantId from '@/app/hooks/reviews/useReviewsByApplicantId';
import { formatEnglishToBangalNum } from '@/utils/formatEtoBLang';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ApplicantReviews({ applicantId }: { applicantId: string }) {
    const { reviews, averageRating, isLoading: isReviewLoading } = useReviewsByApplicantId({ applicantId });

    const hasReviews = reviews.length > 0

    const renderStars = (rating: number) => {
        const roundedRating = Math.round(rating * 10) / 10 // Round to 1 decimal place
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="relative">
                        <Star className="w-4 h-4 text-gray-300" />
                        <div
                            className="absolute top-0 left-0 overflow-hidden"
                            style={{ width: `${Math.max(0, Math.min(100, (roundedRating - star + 1) * 100))}%` }}
                        >
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        </div>
                    </div>
                ))}
                <span className="ml-1 text-sm text-gray-600">{roundedRating.toFixed(1)}</span>
            </div>
        )
    }

    const ratingCounts = reviews.reduce(
        (acc, review) => {
            const rating = Math.floor(review.rating)
            acc[rating] = (acc[rating] || 0) + 1
            return acc
        },
        {} as Record<number, number>,
    )

    return (
        <div className="container mx-auto p-4 max-w-full">
            <Card className="mb-8">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold">রেটিং এবং রিভিউ</CardTitle>
                </CardHeader>
                <CardContent>
                    {hasReviews ? (
                        <>
                            <div className="flex items-center mb-4">{renderStars(averageRating)}</div>
                            <div className="space-y-1">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="flex items-center text-sm">
                                        <span className="w-3 mr-2">{rating}</span>
                                        <Progress value={((ratingCounts[rating] || 0) / reviews.length) * 100} className="h-2 flex-1" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">{reviews.length} reviews</p>
                        </>
                    ) : (
                        <Alert>
                            <AlertDescription>
                                এই আবেদনকারী এখনও কোন রিভিউ পাননি। আপডেটের জন্য পরে আবার চেক করুন।
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
            {hasReviews ? (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <Card >
                            <CardContent className="pt-4">
                                <div className="flex items-start">
                                    <Avatar className="w-10 h-10 mr-4">
                                        <AvatarFallback>{review.reviewerName?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">{review.reviewerName}</h3>
                                            <span className="text-sm text-gray-500">
                                                {formatEnglishToBangalNum(new Date(review.createdAt).toLocaleDateString())} {/* Placeholder date */}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {review.jobTitle} পজিশনে রিভিউ দেন।
                                            </p>
                                        </div>
                                        <div className="flex items-center mt-1">{renderStars(review.rating)}</div>
                                        <p className="mt-2 text-gray-600">{review.feedback}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : null}
        </div>
    )
}
