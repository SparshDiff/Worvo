import { Separator } from "@/components/ui/separator";
import ProjectAnalytics from "@/components/workspace/project/project-analytics";
import ProjectHeader from "@/components/workspace/project/project-header";
// import TaskTable from "@/components/workspace/task/task-table";
import { lazy, Suspense, useEffect } from "react";
import TableSkeleton from "@/components/skeleton-loaders/table-skeleton";

// 👇 lazy import
const TaskTable = lazy(
  () =>
    import("@/components/workspace/task/task-table")
);


const ProjectDetails = () => {
  useEffect(() => {
    import("@/components/workspace/task/task-table");
  }, []);

  console.log("ProjectDetails render")
  return (
    <div className="w-full space-y-6 py-4 md:pt-3">
      <ProjectHeader />
      <div className="space-y-5">
        <ProjectAnalytics />
        <Separator />
        {/* {Task Table} */}
        <Suspense fallback={<TableSkeleton columns={6}  rows={2}/>}>
          <TaskTable />
        </Suspense>
      </div>
    </div>
  );
};

export default ProjectDetails;
