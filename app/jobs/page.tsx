"use client";

import Footer from "@/components/sections/Footer";
import { HeroSection } from "../components/common/HeroSection";
import { WhySection } from "../components/common/WhySection";
import Header from "../components/header";
import { JobBox } from "./components/JobBox";
import { JobFilter } from "./components/JobFilter";
import { useJobContext } from "../contexts/JobContext";
import { JobFilterByStatus } from "./components/JobFilterByStatus";
import { useEffect, useState } from "react";
import { CustomPagination } from "../components/common/Pagination";

export default function JobsRoute() {
  const { jobs, isLoading, pagination, refetch } = useJobContext();

  const [currentPage, setCurrentPage] = useState(pagination.currentPage);
  const [jobRoleFilter, setjobRoleFilter] = useState<string>('all');
  const [jobStatusFilter, setJobStatusFilter] = useState<string>('all');
  const [forceTrigger, setForceTrigger] = useState(false);

  useEffect(() => {
    // Refetch jobs whenever the page or filter changes
    refetch({ page: currentPage, jobRole: jobRoleFilter === 'all' ? undefined : jobRoleFilter, jobStatus: jobStatusFilter === 'all' ? undefined : jobStatusFilter });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, forceTrigger]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    else {
      setForceTrigger(!forceTrigger);
    }
  }, [jobRoleFilter, jobStatusFilter]);

  return (
    <>
      <Header />

      <HeroSection title="জব্‌স" />

      <section className="md:pb-24 pb-16">
        <div className="container z-1">
          <div className="mt-6 flex gap-6">
            <JobFilter onFilterChange={setjobRoleFilter} />
            <JobFilterByStatus onFilterChange={setJobStatusFilter} />
          </div>
          <JobBox jobs={jobs} isLoading={isLoading} />
          {jobs !== null && jobs?.length > 0 && (
            <div className="flex justify-center items-center w-full mt-12">
              <CustomPagination
                totalPages={pagination.totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>

        <WhySection />
      </section>

      <Footer />
    </>
  );
}
