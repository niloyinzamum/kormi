"use client";

import { DIVISIONS, JOB_ROLES_ENUMS } from "@/app/assets/resources";
import Header from "@/app/components/header";
import useJobById from "@/app/hooks/jobs/useJobById";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api_client } from "@/lib/axios";
import { EDUCTATION_LEVELS, JOB_ROLES } from "@/lib/constant";
import { REQUIRED_ERROR } from "@/lib/error";
import { TJob } from "@/utils/types/job";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useUserInfo } from "@/app/hooks/useUserInfo";
import { useJobContext } from "@/app/contexts/JobContext";

const jobSchema = z.object({
  title: z
    .string()
    .min(1, REQUIRED_ERROR)
    .max(40, "সর্বোচ্চ ৪০ টি শব্দ গ্রহনযোগ্য"),
  shortDescription: z
    .string()
    .min(1, REQUIRED_ERROR)
    .max(80, "সর্বোচ্চ ৮০ টি শব্দ গ্রহনযোগ্য"),
  longDescription: z
    .string()
    .min(1, REQUIRED_ERROR)
    .max(500, "সর্বোচ্চ ৫০০ টি শব্দ গ্রহনযোগ্য"),
  qualification: z.string().min(1, REQUIRED_ERROR),
  experience: z.string().min(1, REQUIRED_ERROR),
  applicationDeadline: z
    .string()
    .min(1, REQUIRED_ERROR)
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Deadline must be a valid date."
    }),
  salary: z
    .string()
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string"
    })
    .optional(),
  jobRole: z.enum(JOB_ROLES_ENUMS),
  isBirthCertificateRequired: z.boolean().optional(),
  isPortEntryPermitRequired: z.boolean().optional(),
  division: z.string().min(1, REQUIRED_ERROR),
  district: z.string().min(1, REQUIRED_ERROR)
});

export type TJobProps = Omit<
  TJob,
  "_id" | "__v" | "createdAt" | "updatedAt" | "user"
>;

export default function EditJobRoute({
  params
}: {
  params: { jobId: string };
}) {
  const router = useRouter();
  const { job, isLoading: jobLoading } = useJobById({ jobId: params.jobId });
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [qualification, setQualification] = useState<string>();
  const [experience, setExperience] = useState<string>();
  const [jobRole, setJobRole] = useState<string>();
  const [districts, setDistricts] = useState([]);
  const { refetch } = useJobContext();

  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      longDescription: "",
      qualification: "NO_FORMAL_EDUCATION",
      experience: "0-1",
      applicationDeadline: moment().format("YYYY-MM-DDTHH:mm"),
      salary: "0",
      jobRole: "চেকার",
      isBirthCertificateRequired: false,
      isPortEntryPermitRequired: false,
      division: "",
      district: ""
    }
  });

  async function onSubmit(values: z.infer<typeof jobSchema>) {
    setIsLoading(true);

    const body = {
      ...values,
      applicationDeadline: date
    };

    api_client
      .patch(`jobs/${job?._id}`, body)
      .then((res) => {
        if (res.data.status === "success") {
          refetch();
          router.push(`/jobs/${job?._id}`);
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (job) {
      Object.keys(form.getValues()).forEach((key) => {
        setExperience(job["experience"]);
        setQualification(job["qualification"]);

        if (key === "applicationDeadline") {
          const deadline = new Date(job?.applicationDeadline)
            .toISOString()
            .split(".")[0]
            .toString();
          setDate(new Date(job?.applicationDeadline));
          form.setValue("applicationDeadline", deadline);
        } else {
          // eslint-disable-next-line
          // @ts-ignore
          form.setValue(key as keyof TJobProps, job[key]);
        }
      });
    }

    // eslint-disable-next-line
  }, [job]);

  useEffect(() => {
    if (job) {
      setDistricts(
        (DIVISIONS.find((item) => item.division === job.division)
          ?.districts as []) || []
      );
    }
  }, [job]);

  return (
    <>
      <Header />

      <section className="relative py-36">
        <div className="container">
          <h3 className="font-semibold text-3xl text-center">
            চাকরিটি এডিট করুন
          </h3>

          {jobLoading ? (
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
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.5 }}
              >
                <form
                  className="text-left mt-20 max-w-2xl mx-auto"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="grid grid-cols-1">
                    <div className="mb-4 text-left">
                      <label className="font-semibold" htmlFor="title">
                        চাকরির শিরোনাম
                      </label>
                      <Input
                        id="title"
                        className="mt-3"
                        placeholder="চাকরির শিরোনাম - সর্বোচ্চ ৪০ টি শব্দ গ্রহনযোগ্য"
                        {...form.register("title")}
                      />
                    </div>
                    <div className="mb-4 text-left">
                      <label
                        className="font-semibold"
                        htmlFor="shortDescription"
                      >
                        কাজের সারসংক্ষেপ
                      </label>
                      <Textarea
                        id="shortDescription"
                        className="mt-3"
                        placeholder="কাজের সারসংক্ষেপ - সর্বোচ্চ ৮০ টি শব্দ গ্রহনযোগ্য"
                        rows={4}
                        {...form.register("shortDescription")}
                      />
                    </div>

                    <div className="mb-4 text-left">
                      <label
                        className="font-semibold"
                        htmlFor="longDescription"
                      >
                        কাজের বিবরণ
                      </label>
                      <Textarea
                        id="longDescription"
                        className="mt-3"
                        placeholder="কাজের বিবরণ - সর্বোচ্চ ৫০০ টি শব্দ গ্রহনযোগ্য"
                        rows={4}
                        {...form.register("longDescription")}
                      />
                    </div>

                    <div className="mb-4 text-left">
                      <label className="font-semibold" htmlFor="qualification">
                        শিক্ষাগত যোগ্যতা
                      </label>
                      <select
                        id="experience"
                        value={qualification}
                        onChange={(event) => {
                          const value = event.target.value;
                          setQualification(value);
                          form.setValue("qualification", value);
                        }}
                      >
                        {EDUCTATION_LEVELS.map((option) => {
                          return (
                            <option key={option.id} value={option.value}>
                              {option.label}
                            </option>
                          );
                        })}
                      </select>

                      {/* <Input
                      id="qualification"
                      className="mt-3"
                      placeholder="শিক্ষাগত যোগ্যতা"
                      {...form.register("qualification")}
                    /> */}
                    </div>

                    <div className="mb-4 text-left">
                      <label className="font-semibold" htmlFor="experience">
                        অভিজ্ঞতা
                      </label>
                      <select
                        id="experience"
                        value={experience}
                        onChange={(event) => {
                          const value = event.target.value;
                          setExperience(value);
                          form.setValue("experience", value);
                        }}
                      >
                        <option value="0-1">0 — 1 year</option>
                        <option value="1-2">1 — 2 years</option>
                        <option value="2-3">2 — 3 years</option>
                        <option value="3-4">3 — 4 years</option>
                        <option value="4-5">4 — 5 years</option>
                        <option value="5-7">5 — 7 years</option>
                        <option value="7-10">7 — 10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                      {/* <Input
                      id="experience"
                      className="mt-3"
                      placeholder="অভিজ্ঞতা"
                      {...form.register("experience")}
                    /> */}
                    </div>

                    <div className="mb-4 text-left">
                      <label className="font-semibold" htmlFor="jobRole">
                        চাকরির ভূমিকা
                      </label>
                      <select
                        id="jobRole"
                        defaultValue={job?.jobRole}
                        value={jobRole}
                        onChange={(event) => {
                          const value = event.target.value;
                          setJobRole(value);
                          form.setValue("jobRole", value);
                        }}
                      >
                        {JOB_ROLES.map((item, idx) => {
                          return (
                            <option key={idx} value={item.value}>
                              {item.label}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {form.getValues("jobRole") === "ট্রাক ড্রাইভার" && (
                      <div className="mb-4 text-left flex items-center gap-8">
                        <div>
                          <input
                            type="checkbox"
                            id="chairman-birth-certificate"
                            {...form.register("isBirthCertificateRequired")}
                          />
                          <label
                            htmlFor="chairman-birth-certificate"
                            className="ml-1"
                          >
                            Chairman signed birth certificate
                          </label>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id="port-entry-permit"
                            {...form.register("isPortEntryPermitRequired")}
                          />
                          <label htmlFor="port-entry-permit" className="ml-1">
                            Port entry permit
                          </label>
                        </div>
                      </div>
                    )}

                    <div className="mb-4 text-left">
                      <label className="font-semibold" htmlFor="division">
                        বিভাগ
                      </label>
                      <Select
                        defaultValue={job?.division}
                        onValueChange={(value) => {
                          form.setValue("division", value);
                          form.setValue("district", "");

                          setDistricts(
                            (DIVISIONS.find((item) => item.division === value)
                              ?.districts as []) || []
                          );
                        }}
                      >
                        <SelectTrigger className="">
                          <SelectValue placeholder="বিভাগ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {DIVISIONS.map((item) => {
                              return (
                                <SelectItem key={item.id} value={item.division}>
                                  {item.division}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {districts.length > 0 ? (
                      <div className="mb-4 text-left">
                        <label className="font-semibold" htmlFor="division">
                          জেলা
                        </label>
                        <Select
                          defaultValue={job?.district}
                          onValueChange={(value) =>
                            form.setValue("district", value)
                          }
                        >
                          <SelectTrigger className="">
                            <SelectValue placeholder="জেলা" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {districts.map((item, idx) => {
                                return (
                                  <SelectItem key={idx} value={item}>
                                    {item}
                                  </SelectItem>
                                );
                              })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div></div>
                    )}

                    <div className="mb-4 text-left">
                      <label
                        className="font-semibold"
                        htmlFor="applicationDeadline"
                      >
                        আবেদনের শেষ তারিখ
                      </label>
                      <Input
                        id="applicationDeadline"
                        className="mt-3"
                        type="datetime-local"
                        placeholder="আবেদনের শেষ তারিখ"
                        value={moment(date).format("YYYY-MM-DDTHH:mm")}
                        onChange={(event) => {
                          setDate(new Date(event.target.value));
                          form.setValue(
                            "applicationDeadline",
                            event.target.value + ":00"
                          );
                        }}
                      />
                      {/* <DatePicker
                      date={date}
                      setDate={(date) => {
                        setDate(date);
                        console.log("------------- for", date);
                        form.setValue(
                          "applicationDeadline",
                          new Date(date as Date).toISOString()
                        );
                      }}
                    /> */}
                    </div>

                    <div className="mb-4 text-left">
                      <label className="font-semibold" htmlFor="salary">
                        বেতন
                      </label>
                      <Input
                        id="salary"
                        type="number"
                        className="mt-3"
                        placeholder="বেতন"
                        {...form.register("salary")}
                      />
                    </div>

                    <div className="mb-4">
                      <Button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white rounded-md w-full"
                        disabled={isLoading}
                      >
                        {isLoading && <Loader className="animate-spin" />}{" "}
                        সাবমিট
                      </Button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
