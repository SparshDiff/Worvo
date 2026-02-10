import AnalyticsCard from "./common/analytics-card";
import { useState } from "react";
import { Button } from "@/components/ui/button"

const WorkspaceAnalytics = () => {

  const [openChart, SetOpenChart] = useState<boolean>(false);


  const workspaceList = [
    {
      id: "active-task",
      title: "Active Tasks",
      value: 0,
      gradient: "from-blue-700  to-cyan-600",
    },
    {
      id: "overdue-task",
      title: "Overdue",
      value: 0,
      gradient: "from-blue-900 to-slate-500 ",
    },
    {
      id: "today's-task",
      title: "Due Today",
      value: 4,
      gradient: "from-teal-800 to-green-600",
    },
    {
      id: "in-review-task",
      title: "In Review",
      value: 4,
      gradient: "from-orange-600 to-yellow-500",

    },
    {
      id: "weekly-completed-task",
      title: "Weekly Completed",
      value: 4,
      gradient: "from-red-600 to-pink-500",
    },
  ];




  return (
    <div>

      <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-5">
        {workspaceList?.map((v) => (
          <AnalyticsCard
            key={v.id}
            isLoading={false}
            title={v.title}
            value={v.value}
            setChart={SetOpenChart}
            gradient={v.gradient}
          />
        ))}
      </div>
      
      {(openChart) && (
        <div className="flex flex-col items-end">
          <div className="w-full mt-4 flex h-[250px] justify-center items-center text-white bg-blue-800">
            Bar
          </div>
          <Button onClick={() => { SetOpenChart(!openChart) }} className="mt-4" variant="collapse" size="sm">Collapse</Button>
        </div>)
      }
    </div>
  );
};

export default WorkspaceAnalytics;
