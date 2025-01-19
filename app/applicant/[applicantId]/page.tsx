"use client";

import { HeroSection } from "@/app/components/common/HeroSection";
import Header from "@/app/components/header";
import useUserById from "@/app/hooks/users/useUserById";
import { Button } from "@/components/ui/button";
import { api_client } from "@/lib/axios";
import {
  APPLICATION_STATUS,
  EDUCTATION_LEVELS,
  JOB_ROLES,
  MAX_EDUCATION_LEVEL
} from "@/lib/constant";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader, Star, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

import { useSearchParams } from "next/navigation";
import { formatEnglishToBangalNum } from "@/utils/formatEtoBLang";
import { ImagePreview } from "@/app/components/common/ImagePreview";
import useReviewsByApplicantId from "@/app/hooks/reviews/useReviewsByApplicantId";
import Reviews from "./Reviews";

export default function ApplicantProfileRoute({
  params
}: {
  params: { applicantId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId") as string;
  const { user, isLoading } = useUserById({ userId: params.applicantId });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplicantStatus = async (
    status: keyof typeof APPLICATION_STATUS
  ) => {
    setIsProcessing(true);
    try {
      const response = await api_client.patch(
        `/jobs/${jobId}/${params.applicantId}`,
        {
          status
        }
      );

      if (response.data.status === "success") {
        toast.success(response.data.message);
        router.push(`/jobs/${jobId}/applicant-list`);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative">
      {" "}
      {/* Added relative to parent */}
      <Header />
      <HeroSection title="Applicants" />
      <section className="relative lg:mt-12 mt-[74px] mb-10">
        <div className="lg:container container-fluid">
          {isLoading ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center min-h-[400px]"
              >
                <Loader size={22} className="animate-spin" />
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 50 }} // Start with opacity 0 and a vertical offset
                animate={{ opacity: 1, y: 0 }} // Fade in and reset vertical position
                transition={{
                  delay: 0.05,
                  duration: 0.5,
                  ease: "easeOut" // Smooth easing
                }}
                className="relative mt-[50px] dark:text-white p-6 rounded-lg"
              >
                {/* Cover Photo */}
                <div className="relative h-[100px] w-full rounded-t-lg bg-gradient-to-b from-emerald-100 to-white dark:from-emerald-700/50 dark:to-dark/10 overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/10 to-transparent dark:from-black/10"></div>
                  <div className="relative z-10 flex items-center justify-end gap-2">
                    <span className="text-white text-sm bg-violet-800 px-4 py-2 m-5 mt-10 rounded-3xl dark:bg-violet-700">
                      আবেদন{" "}
                      {
                        APPLICATION_STATUS[
                          user?.applicationStatus as keyof typeof APPLICATION_STATUS
                        ]?.label
                      }
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute right-6 top-[160px] flex gap-3 z-50">
                  <button
                    className="text-white bg-[#10b981] hover:bg-[#0ea371] px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50 relative z-50"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleApplicantStatus("ACCEPTED");
                    }}
                    disabled={isProcessing}
                  >
                    <Check className="h-4 w-4" />
                    গ্রহণ করুন
                  </button>

                  <button
                    className="text-gray-800 dark:text-white border border-gray-600 hover:bg-gray-600 hover:text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50 relative z-50"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleApplicantStatus("SHORT_LISTED");
                    }}
                    disabled={isProcessing}
                  >
                    <Star className="h-4 w-4" />
                    শর্টলিস্ট করুন
                  </button>

                  <button
                    className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50 relative z-50"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleApplicantStatus("REJECTED");
                    }}
                    disabled={isProcessing}
                  >
                    <X className="h-4 w-4" />
                    বাতিল করুন
                  </button>
                </div>

                {/* Profile Content */}
                <div className="rounded-b-lg shadow-sm relative z-10">
                  {/* Profile Photo and Basic Info */}
                  <div className="relative mt-5 px-6">
                    <div className="flex items-end gap-6">
                      {user?.profilePhoto ? (
                        <Image unoptimized
                          alt={user?.name as string}
                          src={`${user?.profilePhoto}`}
                          className="size-32 rounded-full border-4 border-white shadow-lg object-cover"
                          width={128}
                          height={128}
                        />
                      ) : (
                        <div className="size-32 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                          <span className="text-4xl text-gray-400">👤</span>
                        </div>
                      )}
                      <div className="mb-8 items-center">
                        <h1 className="text-2xl font-bold">{user?.name}</h1>
                        <p className="text-gray-600 dark:text-gray-300">
                          {
                            // @ts-expect-error: job_roles cannot be number
                            JOB_ROLES[user?.role as keyof typeof JOB_ROLES]?.label
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Main Content Sections */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4 pb-2 border-b dark:border-slate-700">
                          পেশাগত তথ্য
                        </h2>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-300">
                              শিক্ষাগত যোগ্যতা:
                            </span>
                            <span>
                              {
                                EDUCTATION_LEVELS.find(
                                  (level) =>
                                    level.id === Number(user?.maxEducationLevel)
                                )?.label
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-300">
                              পেশা:
                            </span>
                            <span>
                              {
                                // @ts-expect-error: job_roles cannot be number
                                JOB_ROLES[user?.role as keyof typeof JOB_ROLES]?.label
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-300">
                              অভিজ্ঞতা:
                            </span>
                            <span>
                              {formatEnglishToBangalNum(
                                user?.yearsOfExperience
                              )}{" "}
                              বছর
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4 pb-2 border-b dark:border-slate-700">
                          যোগাযোগের তথ্য
                        </h2>
                        <div className="space-y-3">
                          {user?.email && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 dark:text-gray-300">
                                ইমেইল:
                              </span>
                              <span>{user.email}</span>
                            </div>
                          )}
                          {user?.phone && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 dark:text-gray-300">
                                ফোন:
                              </span>
                              <span>{user.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-300">
                              বিভাগ:
                            </span>
                            <span>{user?.division}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 dark:text-gray-300">
                              জেলা:
                            </span>
                            <span>{user?.district}</span>
                          </div>
                        </div>
                      </div>

                      {/* Documents */}
                      <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4 pb-2 border-b dark:border-slate-700">
                          নথিপত্র
                        </h2>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 dark:text-gray-300">
                                এন আইডি নং:
                              </span>
                              <span>{user?.nidNumber}</span>
                            </div>
                            {user?.nidCopy && (
                              <div className="mt-2">
                                <p className="text-gray-600 dark:text-gray-300 mb-2">
                                  এন আইডি কপি:
                                </p>
                                <div className="flex flex-col items-center">
                                  <ImagePreview
                                    src={user.nidCopy}
                                    alt="NID Copy"
                                    width={200}
                                    height={120}
                                  />
                                  <a
                                    href={`${user.nidCopy}`}
                                    download
                                    className="mt-2 px-4 py-2 bg-emerald-500 text-white font-semibold rounded hover:bg-emerald-600 transition duration-200"
                                  >
                                    ডাউনলোড করুন
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>

                          {user?.maxEducationLevel && (
                            <div>
                              {user?.maxEducationLevelCertificateCopy && (
                                <div className="mt-2">
                                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                                    সার্টিফিকেট কপি:
                                  </p>
                                  <div className="flex flex-col items-center">
                                    <ImagePreview
                                      alt="Certificate Copy"
                                      src={
                                        user.maxEducationLevelCertificateCopy
                                      }
                                      width={200}
                                      height={120}
                                    />
                                    <a
                                      href={`${user.maxEducationLevelCertificateCopy}`}
                                      download
                                      className="mt-2 px-4 py-2 bg-emerald-500 text-white font-semibold rounded hover:bg-emerald-600 transition duration-200"
                                    >
                                      ডাউনলোড করুন
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {user?.drivingLicense && (
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 dark:text-gray-300">
                                  ড্রাইভিং লাইসেন্স:
                                </span>
                                <span>{user?.drivingLicense}</span>
                              </div>
                              {user?.drivingLicenseCopy && (
                                <div className="mt-2">
                                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                                    ড্রাইভিং লাইসেন্স কপি:
                                  </p>
                                  <div className="flex flex-col items-center">
                                    <ImagePreview
                                      alt="Driving License Copy"
                                      src={user.drivingLicenseCopy}
                                      width={200}
                                      height={120}
                                    />
                                    <a
                                      href={`${user.drivingLicenseCopy}`}
                                      download
                                      className="mt-2 px-4 py-2 bg-emerald-500 text-white font-semibold rounded hover:bg-emerald-600 transition duration-200"
                                    >
                                      ডাউনলোড করুন
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Extra documents */}
                      <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4 pb-2 border-b dark:border-slate-700">
                          অতিরিক্ত নথিপত্র
                        </h2>
                        <div className="space-y-3">
                          {user?.chairmanCertificateCopy ||
                            user?.portEntryPermitCopy ? (
                            <>
                              {user?.chairmanCertificateCopy && (
                                <div className="mt-2">
                                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                                    চেয়ারম্যান সার্টিফিকেট কপি:
                                  </p>
                                  <div className="flex flex-col items-center">
                                    <ImagePreview
                                      alt="Chairman Certificate Copy"
                                      src={user.chairmanCertificateCopy}
                                      width={200}
                                      height={120}
                                    />
                                    <a
                                      href={`${user.chairmanCertificateCopy}`}
                                      download
                                      className="mt-2 px-4 py-2 bg-emerald-500 text-white font-semibold rounded hover:bg-emerald-600 transition duration-200"
                                    >
                                      ডাউনলোড করুন
                                    </a>
                                  </div>
                                </div>
                              )}

                              {user?.portEntryPermitCopy && (
                                <div className="mt-2">
                                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                                    পোর্ট এন্ট্রি পারমিট কপি:
                                  </p>
                                  <div className="flex flex-col items-center">
                                    <ImagePreview
                                      alt="Port Entry Permit Copy"
                                      src={user.portEntryPermitCopy}
                                      width={200}
                                      height={120}
                                    />
                                    <a
                                      href={`${user.portEntryPermitCopy}`}
                                      download
                                      className="mt-2 px-4 py-2 bg-emerald-500 text-white font-semibold rounded hover:bg-emerald-600 transition duration-200"
                                    >
                                      ডাউনলোড করুন
                                    </a>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-600 dark:text-gray-300">
                              কোনো অতিরিক্ত নথি নেই
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Reviews */}
                      <div className="col-span-2 bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
                        <Reviews applicantId={params.applicantId} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  );
}
