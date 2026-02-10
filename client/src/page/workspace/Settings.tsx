import WorkspaceHeader from "@/components/workspace/common/workspace-header";
import EditWorkspaceForm from "@/components/workspace/edit-workspace-form";
import DeleteWorkspaceCard from "@/components/workspace/settings/delete-workspace-card";

const Settings = () => {
  console.log("Setting render")
  return (
    <div className="w-full h-auto py-2">
      <WorkspaceHeader />
     
      <main>
        <div className="w-full max-w-3xl mx-auto py-1">
          <h2 className="text-xl leading-7 font-semibold mb-3">
            Workspace settings
          </h2>

          <div className="flex flex-col pt-0.5 px-0 ">
            <div className="pt-2">
              <EditWorkspaceForm />
            </div>
            <div className="pt-2">
              <DeleteWorkspaceCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
