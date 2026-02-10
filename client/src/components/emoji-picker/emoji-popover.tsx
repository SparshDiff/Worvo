import { lazy, memo, startTransition, Suspense, useState } from "react";
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

const EmojiPickerComponent = lazy(() => import("./"));

interface EmojiPopoverProps {
    emoji: string;
    handleEmojiSelection: (emoji: string) => void;
}

function EmojiPopover({ emoji, handleEmojiSelection }: EmojiPopoverProps) {
    console.log("Emoji Render")
    const [open, setOpen] = useState<boolean>(false);

    const handleOpenChange = (nextOpen: boolean) => {
        startTransition(() => {
            setOpen(nextOpen);
        });
    };
    return (
        <Popover open={open} onOpenChange={handleOpenChange} >
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className="size-20 mt-2 rounded-md"
                >
                    <span className="text-5xl">{emoji}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                sideOffset={3}
                className="!p-0 w-full max-h-[52vh] overflow-y-auto rounded-lg"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
            >
                <Suspense fallback={<div className="p-4 text-sm">Loading emojis…</div>}>
                    <EmojiPickerComponent onSelectEmoji={handleEmojiSelection} />
                </Suspense>
            </PopoverContent>
        </Popover>
    )
}

export default memo(EmojiPopover)