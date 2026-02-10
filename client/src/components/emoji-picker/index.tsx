import { memo, useEffect, useState } from "react";
import Picker from "@emoji-mart/react";
import useTheme from "@/context/theme-context";

interface EmojiPickerComponentProps {
  onSelectEmoji: (emoji: string) => void;
}

let emojiDataPromise: Promise<unknown> | null = null;
let emojiDataCache: unknown | null = null;

const getEmojiData = () => {
  if (emojiDataCache) {
    return Promise.resolve(emojiDataCache);
  }

  if (!emojiDataPromise) {
    emojiDataPromise = import("@emoji-mart/data").then((m) => {
      emojiDataCache = m.default;
      return emojiDataCache;
    });
  }

  return emojiDataPromise;
}

const EmojiPickerComponent = ({
  onSelectEmoji,
}: EmojiPickerComponentProps) => {
  const { theme } = useTheme()
  const [data, setData] = useState<unknown>(() => emojiDataCache);
  useEffect(() => {
    if (!data) {
      getEmojiData().then(setData);
    }
  }, [data]);
  if (!data) {
    return <div className="p-4 text-sm">Loading emojis…</div>;
  }
  
  // Handle emoji selection
  const handleEmojiSelect = (emoji: { native: string }) => {
    console.log(emoji, "emoji");
    onSelectEmoji(emoji.native); // Pass the selected emoji to parent component
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Picker
        data={data}
        categories={[
          "frequent",
          "people",
          "nature",
          "activity",
          "flags",
          "foods",
          "objects",
          "places",
          "symbols",
        ]}
        set={"Google"}
        onEmojiSelect={handleEmojiSelect}
        previewPosition={"none"}
        theme={theme === "system" ? "Auto" : theme}
        perLine={8}
        emojiButtonRadius={`3px`}
        emojiButtonColors={["rgba(102, 51, 153, .2)"]}
      />
    </div>
  );
};

export default memo(EmojiPickerComponent);
