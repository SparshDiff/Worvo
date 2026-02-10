/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import CreateTaskDialog from "../task/create-task-dialog";
import EditProjectDialog from "./edit-project-dialog";
import ProjectWatchers from "../member/project-watchers";
 
const ProjectHeader = () => {
  const param = useParams();
  const projectId = param.projectId as string;

  const isPending = false;
  const isError = false;

  // Fallback if no project data is found
  const projectEmoji = "📊";
  const projectName = "Untitled project loremLorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum, illum.";

  const renderContent = () => {
    if (isPending) return <span>Loading...</span>;
    if (isError) return <span>Error occured</span>;
    return (
      <>
        <span>{projectEmoji}</span>
        {projectName}
      </>
    );
  };
  return (
    <div className="flex items-center justify-between space-y-2">
      
      <div className="flex items-center gap-2">
        <h2 className="flex items-center gap-3 text-xl font-medium tracking-tight break-all">
          {renderContent()}
        </h2>
        <EditProjectDialog project={{} as any} />
      </div>

      <div className="ml-3 flex flex-col w-full gap-3 items-end sm:flex-row sm:justify-end sm:items-center">
        <CreateTaskDialog projectId={projectId} />
        <ProjectWatchers />
      </div>

    </div>
  );
};

export default ProjectHeader;
