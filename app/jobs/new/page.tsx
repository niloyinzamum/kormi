"use client";

import Header from "@/app/components/header";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api_client } from "@/lib/axios";
import { REQUIRED_ERROR } from "@/lib/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { JOB_ROLES_ENUMS, JOB_TYPES } from "@/app/assets/resources";
import { EDUCTATION_LEVELS, JOB_ROLES } from "@/lib/constant";

const jobSchema = z.object({
  title: z.string().min(1, REQUIRED_ERROR),
  shortDescription: z.string().min(1, REQUIRED_ERROR),
  longDescription: z.string().min(1, REQUIRED_ERROR),
  qualification: z.string().min(1, REQUIRED_ERROR),
  experience: z.string().min(1, REQUIRED_ERROR),
  birthCertificate: z.string().nullable(),
  portEntryPermit: z.string().nullable(),
  applicationDeadline: z
    .string()
    .min(1, REQUIRED_ERROR)
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Deadline must be a valid date."
    }),
  location: z.string().min(1, REQUIRED_ERROR),
  salary: z.string().nullable(),
  jobType: z.enum(JOB_TYPES, {
    errorMap: () => ({ message: REQUIRED_ERROR })
  }),
  jobRole: z.enum(JOB_ROLES_ENUMS, {
    errorMap: () => ({ message: REQUIRED_ERROR })
  })
});

export default function NewJobRoute() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [jobRole, setJobRole] = useState<string>();
  const [jobType, setJobType] = useState<string>();

  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      longDescription: "",
      qualification: "NO_FORMAL_EDUCATION",
      experience: "0-1",
      applicationDeadline: moment().format("YYYY-MM-DDTHH:mm"),
      location: "",
      salary: null,
      jobRole: "চেকার",
      jobType: "ফুল টাইম",
      birthCertificate: "",
      portEntryPermit: ""
    }
  });

  async function onSubmit(values: z.infer<typeof jobSchema>) {
    setIsLoading(true);

    api_client
      .post("jobs", {
        ...values,
        applicationDeadline: date
      })
      .then((res) => {
        if (res.data.status === "success") {
          router.push("/");
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

  return (
    <>
      <Header />

      <section className="relative py-36">
        <div className="container">
          <h3 className="font-semibold text-3xl text-center">
            নতুন চাকরি তৈরি করুন
          </h3>
          <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <form
                className="text-left mt-20 max-w-2xl mx-auto"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="grid grid-cols-1 gap-6">
                  <div className="text-left">
                    <label className="font-semibold" htmlFor="title">
                      চাকরির শিরোনাম
                    </label>
                    <Input
                      id="title"
                      className="mt-1"
                      placeholder="চাকরির শিরোনাম"
                      {...form.register("title")}
                    />
                  </div>

                  <div className="text-left">
                    <label className="font-semibold" htmlFor="shortDescription">
                      কাজের সারসংক্ষেপ
                    </label>
                    <Textarea
                      id="shortDescription"
                      className="mt-1"
                      placeholder="কাজের সারসংক্ষেপ"
                      rows={4}
                      {...form.register("shortDescription")}
                    />
                  </div>

                  <div className="text-left">
                    <label className="font-semibold" htmlFor="longDescription">
                      কাজের বিবরণ
                    </label>
                    <Textarea
                      id="longDescription"
                      className="mt-1"
                      placeholder="কাজের বিবরণ"
                      rows={4}
                      {...form.register("longDescription")}
                    />
                  </div>

                  <div className="text-left">
                    <label className="font-semibold" htmlFor="qualification">
                      শিক্ষাগত যোগ্যতা
                    </label>
                    <select
                      id="experience"
                      defaultValue="No Formal Education"
                      onChange={(event) => {
                        console.log(event.target.value);
                        form.setValue("qualification", event.target.value);
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
                      className="mt-1"
                      placeholder="শিক্ষাগত যোগ্যতা"
                      {...form.register("qualification")}
                    /> */}
                  </div>

                  <div className="text-left">
                    <label className="font-semibold" htmlFor="experience">
                      অভিজ্ঞতা
                    </label>
                    <select
                      id="experience"
                      className="mt-1 h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 appearance-none"
                      defaultValue="0-1"
                      onChange={(event) => {
                        console.log(event.target.value);
                        form.setValue("experience", event.target.value);
                      }}
                    >
                      <option value="0-1">০ — ১ বছর</option>
                      <option value="1-2">১ — ২ বছর</option>
                      <option value="2-3">২ — ৩ বছর</option>
                      <option value="3-4">৩ — ৪ বছর</option>
                      <option value="4-5">৪ — ৫ বছর</option>
                      <option value="5-7">৫ — ৭ বছর</option>
                      <option value="7-10">৭ — ১০ বছর</option>
                      <option value="10+">১০+ বছর</option>
                    </select>
                    {/* <Input
                      id="experience"
                      className="mt-1"
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

                  {form.getValues("jobRole") === "truck-driver" && (
                    <div className="mb-4 text-left flex items-center gap-8">
                      <div>
                        <input
                          type="checkbox"
                          id="chairman-birth-certificate"
                        />
                        <label
                          htmlFor="chairman-birth-certificate"
                          className="ml-1"
                        >
                          Chairman signed birth certificate
                        </label>
                      </div>
                      <div>
                        <input type="checkbox" id="port-entry-permit" />
                        <label htmlFor="port-entry-permit" className="ml-1">
                          Port entry permit
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="mb-4 text-left">
                    <label className="font-semibold" htmlFor="jobType">
                      চাকরির ধরন
                    </label>
                    <select
                      id="jobType"
                      value={jobType}
                      onChange={(event) => {
                        const value = event.target.value;
                        setJobType(value);
                        form.setValue("jobType", value);
                      }}
                    >
                      {JOB_TYPES.map((item, idx) => {
                        return (
                          <option key={idx} value={item}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="text-left">
                    <label className="font-semibold" htmlFor="deadline">
                      আবেদনের শেষ তারিখ
                    </label>
                    <Input
                      id="deadline"
                      className="mt-1"
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

                  <div className="text-left">
                    <label className="font-semibold" htmlFor="location">
                      কর্মস্থল
                    </label>
                    <Input
                      id="location"
                      className="mt-1"
                      placeholder="কর্মস্থল"
                      {...form.register("location")}
                    />
                  </div>

                  <div className="text-left">
                    <label className="font-semibold" htmlFor="salary">
                      বেতন
                    </label>
                    <Input
                      id="salary"
                      className="mt-1"
                      placeholder="বেতন"
                      {...form.register("salary")}
                    />
                  </div>

                  <div className="">
                    <Button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white rounded-md w-full"
                      disabled={isLoading}
                    >
                      {isLoading && <Loader className="animate-spin" />} সাবমিট
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </>
  );
}
