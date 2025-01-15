import { Button } from "@/components/ui/button";
import { APPLICATION_STATUS } from "@/lib/constant";
import { Bolt } from "lucide-react";
import { useState } from "react";

interface ApplicantFilterProps {
  onFilterChange: (status: keyof typeof APPLICATION_STATUS) => void;
}

export function ApplicantFilter({ onFilterChange }: ApplicantFilterProps) {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-0 shadow rounded-md p-2 relative max-w-lg">
      <form action="#">
        <div className="text-dark text-start">
          <div className="flex items-center gap-3">
            <div className="w-full relative flex items-center px-4 bg-gray-50 h-h-full dark:bg-slate-900 rounded-md">
              <span className="">
                <Bolt size={18} color="#10b981" />
              </span>
              <select
                value={selectedStatus}
                onChange={handleChange}
                className="w-full text-sm bg-transparent dark:bg-transparent border-0 focus:ring-0 focus:outline-none text-slate-900 dark:text-slate-200"
              >
                <option value="ALL" className="text-slate-900 dark:text-slate-200">
                  সব
                </option>
                {Object.keys(APPLICATION_STATUS).map((status) => (
                  <option
                    key={status}
                    value={status}
                    className="text-slate-900 dark:text-slate-200 dark:bg-slate-900"
                  >
                    {APPLICATION_STATUS[status as keyof typeof APPLICATION_STATUS].label}
                  </option>
                ))}
              </select>
            </div>


            <Button
              className="bg-[#10b981] hover:bg-[#10b981] text-white dark:text-white w-full h-full dark:bg-[#10b981] dark:hover:bg-[#10b981] transition-all duration-200"
              onClick={(e) => {
                e.preventDefault();
                onFilterChange(selectedStatus as keyof typeof APPLICATION_STATUS);
              }}
            >
              অনুসন্ধান
            </Button>

          </div>
        </div>
      </form>
    </div>

  );
}
