"use client";

import useUserById from "@/app/hooks/users/useUserById";
import { Button } from "@/components/ui/button";
import { api_client } from "@/lib/axios";
import {
  APPLICATION_STATUS,
  EDUCTATION_LEVELS,
  MAX_EDUCATION_LEVEL,
  USER_ROLE
} from "@/lib/constant";
import { formatEnglishToBangalNum } from "@/utils/formatEtoBLang";
import { Application } from "@/utils/types/applicant";
import { TUser } from "@/utils/types/user";
import { AnimatePresence, motion } from "framer-motion";
import { Languages, Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "sonner";

interface ApplicantCardProps {
  key: string;
  application: Application;
  isDeleted: boolean | undefined;
}

export function ApplicantCard(props: ApplicantCardProps) {
  const router = useRouter();

  const { application } = props;
  const { user, isLoading } = useUserById({
    userId: props.isDeleted ? "" : application?.applicant.id
  });

  const t = useTranslations("ApplicantCard"); // Initialize translations
  const language = useTranslations("language")("code");
  const education = useTranslations("EducationLevels");
  const userRole = useTranslations("UserRoles");

  const { userId } = useParams();

  function handleApplicantStatus(status: keyof typeof APPLICATION_STATUS) {
    api_client
      .patch(`/jobs/${application?.job.id}/${application?.applicant.id}`, {
        status
      })
      .then((res) => {
        if (res.data.status === "success") {
          router.push(`/admin/users/${userId}/jobs/${application?.job.id}`);
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {});
  }

  return (
    <div
      className="w-[290px] relative group bg-white dark:bg-slate-900 overflow-hidden rounded-md shadow dark:shadow-gray-700 text-center p-6 hover:bg-emerald-600/[0.02] hover:dark:bg-emerald-600/5 transition-all duration-500 cursor-pointer"
      onClick={() => {
        console.log(application?.applicant);
        router.push(
          `/admin/users/${userId}/applicant/${application?.applicant.id}?jobId=${application?.job.id}`
        );
      }}
    >
      <p className="text-xs font-semibold absolute top-3 right-2 bg-violet-800 text-violet-200 py-1 px-2 rounded-3xl">
        {application?.isDeleted
          ? "N/A"
          : t(`application_status.${application?.applicationStatus}`)}
      </p>
      {isLoading ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Loader size={22} className="animate-spin" />
          </motion.div>
        </AnimatePresence>
      ) : (
        <>
          <Image
            unoptimized
            src={
              application?.isDeleted
                ? "/assets/applicant-placeholder-image.png"
                : `${user?.profilePhoto || "/"}`
            }
            width={60}
            height={60}
            className="size-20 rounded-full shadow dark:shadow-gray-700 mx-auto object-cover"
            alt="Profile Photo"
          />
          <div className="mt-2">
            <p className="font-semibold text-lg text-slate-800 dark:text-slate-200">
              {application?.isDeleted
                ? "Nibay Job Seeker"
                : application?.applicant.name}
            </p>
            <p className="text-sm text-slate-800 dark:text-slate-400">
              {application?.isDeleted ? "N/A" : userRole(user?.role)}
            </p>
          </div>

          <div className="mt-6 text-left space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-800 dark:text-slate-200 text-sm min-w-[100px] shrink-0 pr-0 mr-0">
                {t("education")}
              </span>
              <span className="p-0 m-0">:</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {application?.isDeleted
                  ? "N/A"
                  : education(user?.maxEducationLevel)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-800 dark:text-slate-200 text-sm min-w-[100px]">
                {t("experience")}
              </span>
              <span className="p-0 m-0">:</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {application?.isDeleted
                  ? "N/A"
                  : formatEnglishToBangalNum(
                      user?.yearsOfExperience,
                      language
                    ) +
                    " " +
                    t("year")}
              </span>
            </div>

            <div className="flex items-center justify-between pt-5">
              <Button
                className="rounded-md bg-emerald-600/5 hover:bg-emerald-500 border-emerald-600/10 hover:border-emerald-600 text-emerald-600 duration-200 transition-all hover:text-white md:relative flex items-center justify-center px-2 py-2 space-x-1 cursor-pointer text-xs font-medium"
                onClick={(event) => {
                  event.stopPropagation();
                  handleApplicantStatus("ACCEPTED");
                }}
                disabled={application?.isDeleted}
              >
                {t("accept")}
              </Button>
              <Button
                className="rounded-md bg-yellow-600/5 hover:bg-yellow-500 border-yellow-600/10 hover:border-yellow-600 text-yellow-600 duration-200 transition-all hover:text-white md:relative flex items-center justify-center px-2 py-2 space-x-1 cursor-pointer text-xs font-medium"
                onClick={(event) => {
                  event.stopPropagation();
                  handleApplicantStatus("SHORT_LISTED");
                }}
                disabled={application?.isDeleted}
              >
                {t("shortlist")}
              </Button>
              <Button
                className="rounded-md bg-red-600/5 hover:bg-red-500 border-red-600/10 hover:border-red-600 text-red-600 duration-200 transition-all hover:text-white md:relative flex items-center justify-center px-2 py-2 space-x-1 cursor-pointer text-xs font-medium"
                onClick={(event) => {
                  event.stopPropagation();
                  handleApplicantStatus("REJECTED");
                }}
                disabled={application?.isDeleted}
              >
                {t("reject")}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
