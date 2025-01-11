import { Button } from "@/components/ui/button";
import { JOB_ROLES, JOB_STATUS } from "@/lib/constant";
import { Bolt } from "lucide-react";
import { useState } from "react";

interface JobFilterProps {
  onFilterChange: (status: string) => void;
}

export function JobFilterByStatus({ onFilterChange }: JobFilterProps) {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };
  return (
    <div className="bg-white dark:bg-slate-900 border-0 shadow rounded-md px-3 py-1 relative max-w-md">
      <form action="#">
        <div className="text-dark text-start">
          <div className="flex items-center gap-3">
            <div className="w-full relative flex items-center px-4 py-1 h-full">
              <span>
                <Bolt size={18} color="#10b981" />
              </span>
              <select value={selectedStatus} onChange={handleChange} className="w-full text-sm bg-transparent dark:bg-transparent border-0 focus:outline-none px-4 py-0">
                <option value="all">সব স্ট্যাটাস</option>
                {JOB_STATUS.map((item, idx) => {
                  return (
                    <option key={idx} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <Button className="bg-[#10b981] hover:bg-[#10b981]"
              onClick={(e) => { e.preventDefault(); onFilterChange(selectedStatus); }}>
              অনুসন্ধান
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}