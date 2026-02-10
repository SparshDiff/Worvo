import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye } from "lucide-react"
import { useState } from "react";


const ProjectWatchers = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button >
                        <Eye />
                        Watchers
                        <span className="sr-only">Project Watchers</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="mr-5 bg-secondary rounded-lg" >
                    <DropdownMenuLabel className="flex justify-center items-center gap-1"> <Eye />Watchers</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <div className="flex gap-1">
                        <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger className="" asChild>
                                <Button>
                                    Add Watcher
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg border-0">

                            </DialogContent>
                        </Dialog>

                        <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger className="" asChild>
                                <Button>
                                    Remove Watcher
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg border-0">

                            </DialogContent>
                        </Dialog>
                    </div>

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default ProjectWatchers