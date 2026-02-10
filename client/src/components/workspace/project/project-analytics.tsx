import { useState } from "react";
import AnalyticsCard from "../common/analytics-card";
import { Button } from "@/components/ui/button"

const ProjectAnalytics = () => {

  const [openChart, SetOpenChart] = useState<boolean>(false);
  const analyticsList = [
    {
      id: "total-task",
      title: "Total Tasks",
      value: 10,
      gradient: "from-blue-700  to-cyan-600",
    },
    {
      id: "active-task",
      title: "Active Tasks",
      value: 10,
      gradient: "from-blue-900 to-slate-500 ",
    },
    {
      id: "overdue-task",
      title: "Overdue",
      value: 30,
      gradient: "from-teal-800 to-green-600",
    },
    {
      id: "today's-task",
      title: "Due Today",
      value: 18,
      gradient: "from-orange-600 to-yellow-500",
    },
    {
      id: "weekly-completed-task",
      title: "Weekly Completed",
      value: 0,
      gradient: "from-red-600 to-pink-500",
    },
  ];

  return (<div>
    <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-5">
      {analyticsList?.map((v) => (
        <AnalyticsCard
          title={v.title}
          value={v.value}
          isLoading={false}
          key={v.id}
          setChart={SetOpenChart}
          gradient={v.gradient}
        />

      ))}
    </div>
    {(openChart) && (
      <div className="flex mt-4 flex-col items-end">
        <div className="grid grid-cols-2 rounded-xl  bg-indigo-900 w-full gap-2 overflow-auto">
          <div className="flex h-[250px] justify-center items-center text-white bg-blue-800">
            Bar
          </div>
          <div className="flex h-[250px] justify-center items-center text-white bg-blue-800">
            Pie
          </div>
        </div>
        <Button onClick={() => { SetOpenChart(!openChart) }} className="mt-4" variant="collapse" size="sm">Collapse</Button>
      </div>)
    }
  </div>
  );
};

export default ProjectAnalytics;
