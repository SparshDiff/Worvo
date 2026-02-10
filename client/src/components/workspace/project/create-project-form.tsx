import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../../ui/textarea";
import { useCallback, useState } from "react";
import EmojiPopover from "@/components/emoji-picker/emoji-popover";

const CreateProjectForm = () => {
  console.log("CreateProjectForm render");

  const [emoji, setEmoji] = useState("📊");

  const formSchema = z.object({
    name: z
      .string()
      .trim()
      .min(1, {
        message: "Project title is required",
      })
      .max(255),
    description: z.string().trim(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleEmojiSelection = useCallback((emoji: string) => {
    setEmoji(emoji);
  }, []);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="w-full h-auto max-w-full">
      {/* <div className="h-full"> */}

        <div className="mb-5 pb-2 border-b">
          <h1
            className="text-xl dark:text-[#fcfdffef] font-semibold mb-1
           text-center sm:text-left"
          >
            Create Project
          </h1>
          <p className="text-muted-foreground text-sm leading-tight">
            Organize and manage tasks, resources, and team collaboration
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-primary dark:text-[#f1f7feb5]">
                Select Emoji
              </label>

              <EmojiPopover
                emoji={emoji}
                handleEmojiSelection={handleEmojiSelection}
              />

            </div>
            <div className="mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm text-primary">
                      Project title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Website Redesign"
                        className="!h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm text-primary">
                      Project description
                      <span className="text-xs font-light ml-2">
                        Optional
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Projects description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              className="flex place-self-end h-10 font-semibold "
              type="submit"
            >
              Create
            </Button>
          </form>
        </Form>
      </div>
    // </div>
  );
}

export default CreateProjectForm;
