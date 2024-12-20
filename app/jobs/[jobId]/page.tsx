"use client";

import { HeroSection } from "@/app/components/common/HeroSection";
import Header from "@/app/components/header";
import useJobById from "@/app/hooks/jobs/useJobById";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { ApplicantListModal } from "../components/ApplicantListModal";
import moment from "moment";
import { TimerOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function JobDetailsRoute({
  params
}: {
  params: { jobId: string };
}) {
  const [open, setIsOpen] = useState(false);

  const { job } = useJobById({ jobId: params.jobId });

  return (
    <>
      <ApplicantListModal open={open} setIsOpen={setIsOpen} />

      <Header />
      <HeroSection title={job?.title as string} />

      <section className="relative md:py-24 py-16">
        <div className="container">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="grid md:grid-cols-12 grid-cols-1 gap-[30px]">
                <div className="lg:col-span-4 md:col-span-6">
                  <div className="shadow dark:shadow-gray-700 rounded-md bg-white dark:bg-slate-900 sticky top-20">
                    <div className="p-5">
                      <h5 className="text-lg font-semibold">
                        চাকরির সারসংক্ষেপ
                      </h5>
                    </div>
                    <div className="p-6 border-t border-slate-100 dark:border-t-gray-700">
                      <ul className="list-none">
                        <li className="flex items-center mt-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-5"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx={12} cy={10} r={3} />
                          </svg>
                          <div className="ms-4">
                            <p className="font-medium">কর্মস্হল:</p>
                            <span className="text-emerald-600 font-medium text-sm">
                              {job?.location}
                            </span>
                          </div>
                        </li>

                        <li className="flex items-center mt-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-5"
                          >
                            <rect
                              x={2}
                              y={7}
                              width={20}
                              height={14}
                              rx={2}
                              ry={2}
                            />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
                          <div className="ms-4">
                            <p className="font-medium">অভিজ্ঞতা:</p>
                            <span className="text-emerald-600 font-medium text-sm">
                              {job?.experience} বছর
                            </span>
                          </div>
                        </li>
                        <li className="flex items-center mt-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-5"
                          >
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                          </svg>
                          <div className="ms-4">
                            <p className="font-medium">শিক্ষাগত যোগ্যতা:</p>
                            <span className="text-emerald-600 font-medium text-sm">
                              {job?.qualification}
                            </span>
                          </div>
                        </li>
                        {job?.salary && (
                          <li className="flex items-center mt-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-5"
                            >
                              <line x1={12} y1={1} x2={12} y2={23} />
                              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            <div className="ms-4">
                              <p className="font-medium">বেতন:</p>
                              <span className="text-emerald-600 font-medium text-sm">
                                {job?.salary}
                              </span>
                            </div>
                          </li>
                        )}

                        <li className="flex items-center mt-3">
                          <TimerOff size={22} />
                          <div className="ms-4">
                            <p className="font-medium">আবেদনের শেষ তারিখ:</p>
                            <span className="text-emerald-600 font-medium text-sm">
                              {moment(job?.applicationDeadline).format(
                                "DD-MM-YYYY"
                              )}
                            </span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-8 md:col-span-6">
                  <div className="pt-6 flex items-start justify-between">
                    <h5 className="text-lg font-semibold">কাজের বিবরণ</h5>
                    <div className="mb-5 flex justify-end">
                      <Link href={`/jobs/1/applicant-list`}>
                        <Button className="bg-emerald-600/5 border-emerald-100 border hover:bg-emerald-600 hover:border-emerald-600 text-emerald-600 hover:text-white rounded-md ms-2">
                          আবেদনকারীর তালিকা (১০)
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <pre className="text-slate-800 mt-4">
                    {job?.shortDescription}
                  </pre>
                  <pre className="text-slate-800 mt-8">
                    {job?.longDescription}
                  </pre>

                  {/* <h5 className="text-lg font-semibold mt-6">
                কম্পেন্সেশন এবং অন্যান্য সুবিধাসমূহ :{" "}
              </h5>
              <p className="text-slate-800 mt-4">
                It sometimes makes sense to select texts containing the various
                letters and symbols specific to the output language.
              </p>
              <ul className="list-none">
                <li className="text-slate-800 mt-2 inline-flex items-center">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    className="text-emerald-600 me-1"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
                  </svg>
                  Proven experience as a .NET Developer or Application Developer
                </li>
                <li className="text-slate-800 mt-2 inline-flex items-center">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    className="text-emerald-600 me-1"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
                  </svg>
                  good understanding of SQL and Relational Databases,
                  specifically Microsoft SQL Server.
                </li>
                <li className="text-slate-800 mt-2 inline-flex items-center">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    className="text-emerald-600 me-1"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
                  </svg>
                  Experience designing, developing and creating RESTful web
                  services and APIs
                </li>
                <li className="text-slate-800 mt-2 inline-flex items-center">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    className="text-emerald-600 me-1"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
                  </svg>
                  Basic know how of Agile process and practices
                </li>
                <li className="text-slate-800 mt-2 inline-flex items-center">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    className="text-emerald-600 me-1"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
                  </svg>
                  Good understanding of object-oriented programming.
                </li>
                <li className="text-slate-800 mt-2 inline-flex items-center">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    className="text-emerald-600 me-1"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
                  </svg>
                  Good understanding of concurrent programming.
                </li>
                <li className="text-slate-800 mt-2 inline-flex items-center">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    className="text-emerald-600 me-1"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
                  </svg>
                  Sound knowledge of application architecture and design.
                </li>
                <li className="text-slate-800 mt-2 inline-flex items-center">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    className="text-emerald-600 me-1"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
                  </svg>
                  Excellent problem solving and analytical skills
                </li>
              </ul> */}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
      <Footer />
    </>
  );
}
