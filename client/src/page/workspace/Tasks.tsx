import CreateTaskDialog from "@/components/workspace/task/create-task-dialog";
// import TaskTable from "@/components/workspace/task/task-table";
import { lazy, Suspense, useEffect } from "react";
import TableSkeleton from "@/components/skeleton-loaders/table-skeleton";

// 👇 lazy import
const TaskTable = lazy(
  () =>
    import("@/components/workspace/task/task-table")
);

export default function Tasks() {
  useEffect(() => {
    import("@/components/workspace/task/task-table");
  }, []);
  console.log("Tasks render")
  return (
    <div className="w-full h-full flex-col space-y-8 pt-3 ">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Tasks</h2>
          <p className="text-muted-foreground">
            Here&apos;s the list of tasks for this workspace!
          </p>
        </div>
        <CreateTaskDialog />
      </div>
      {/* {Task Table} */}
      <div>
        <Suspense fallback={<TableSkeleton columns={6} rows={1}/>}>
          <TaskTable />
        </Suspense>
      </div>
    </div>
  );
}
