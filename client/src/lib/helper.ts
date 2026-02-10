import { ComponentType } from "react";

//THE UPDATED ONE BECAUSE OF THE FILTERS ->  Take Note ->
export const transformOptions = (
  options: string[],
  iconMap?: Record<string, ComponentType<{ className?: string }>>
) =>
  options.map((value) => ({
    label: value
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    value: value,
    icon: iconMap ? iconMap[value] : undefined,
  }));

export const transformStatusEnum = (status: string): string => {
  return status.replace(/_/g, " ");
};

export const formatStatusToEnum = (status: string): string => {
  return status.toUpperCase().replace(/\s+/g, "_");
};

export const getAvatarColor = (initials: string): string => {
  const colors = [
    // Original
    "bg-red-500 text-white",
    "bg-blue-500 text-white",
    "bg-green-500 text-white",
    "bg-yellow-500 text-black",
    "bg-purple-500 text-white",
    "bg-pink-500 text-white",
    "bg-teal-500 text-white",
    "bg-orange-500 text-black",
    "bg-gray-500 text-white",

    // Blue
    "bg-blue-400 text-white",
    "bg-blue-600 text-white",
    "bg-blue-700 text-white",
    "bg-sky-400 text-black",
    "bg-sky-500 text-white",
    "bg-sky-600 text-white",
    "bg-indigo-400 text-white",
    "bg-indigo-500 text-white",
    "bg-indigo-600 text-white",

    // Green
    "bg-green-400 text-black",
    "bg-green-600 text-white",
    "bg-green-700 text-white",
    "bg-emerald-400 text-black",
    "bg-emerald-500 text-white",
    "bg-emerald-600 text-white",
    "bg-lime-400 text-black",
    "bg-lime-500 text-black",
    "bg-lime-600 text-black",

    // Red / Orange
    "bg-red-400 text-white",
    "bg-red-600 text-white",
    "bg-red-700 text-white",
    "bg-rose-400 text-black",
    "bg-rose-500 text-white",
    "bg-rose-600 text-white",
    "bg-orange-400 text-black",
    "bg-orange-600 text-black",
    "bg-amber-400 text-black",
    "bg-amber-500 text-black",

    // Purple / Pink
    "bg-purple-400 text-white",
    "bg-purple-600 text-white",
    "bg-purple-700 text-white",
    "bg-violet-400 text-white",
    "bg-violet-500 text-white",
    "bg-violet-600 text-white",
    "bg-fuchsia-400 text-white",
    "bg-fuchsia-500 text-white",
    "bg-fuchsia-600 text-white",
    "bg-pink-400 text-black",
    "bg-pink-600 text-white",

    // Neutral
    "bg-gray-400 text-black",
    "bg-gray-600 text-white",
    "bg-gray-700 text-white",
    "bg-slate-400 text-black",
    "bg-slate-500 text-white",
    "bg-slate-600 text-white",
    "bg-zinc-400 text-black",
    "bg-zinc-500 text-white",
    "bg-neutral-400 text-black",
    "bg-neutral-500 text-white",
    "bg-stone-400 text-black",
    "bg-stone-500 text-white",

    // Teal / Cyan
    "bg-teal-400 text-black",
    "bg-teal-600 text-white",
    "bg-teal-700 text-white",
    "bg-cyan-400 text-black",
    "bg-cyan-500 text-black",
    "bg-cyan-600 text-white",
  ];


  // Simple hash to map initials to a color index
  const hash = initials
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return colors[hash % colors.length];
};

export const getAvatarFallbackText = (name: string) => {
  if (!name) return "NA";
  const initials = name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2); // Ensure only two initials
  return initials || "NA";
};
