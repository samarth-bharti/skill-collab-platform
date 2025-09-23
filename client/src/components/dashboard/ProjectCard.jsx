// client/src/components/dashboard/ProjectCard.jsx
import React from "react";

export default function ProjectCard({ project }) {
  const title = project?.name ?? project?.title ?? "Untitled Project";
  const desc = project?.description ?? project?.desc ?? "";

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-[#121212]">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
      {desc && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{desc}</p>}
      {project?.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {project.tags.map((t) => (
            <span key={t} className="text-xs text-white/90 bg-zinc-700 px-2 py-1 rounded-full">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}