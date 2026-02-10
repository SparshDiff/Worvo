import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";

const WorkspaceHeader = () => {
  const isLoading = false;
  return (
    <>
      <div className="w-full max-w-3xl mx-auto pb-2">
        {isLoading ? (
          <Loader className="w-8 h-8 animate-spin" />
        ) : (
          <div className="flex items-center gap-4">
            <Avatar className="size-16 rounded-lg font-bold ">
              <AvatarFallback className="rounded-lg text-4xl bg-gradient-to-tl to-black from-black text-white">
                W
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-semibold text-xl">Test Co</span>
              <span className="truncate text-sm">Free</span>
            </div>
          </div>
        )}
      </div>
      <Separator className="my-4" />
    </>
  );
};

export default WorkspaceHeader;
