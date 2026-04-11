import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus, Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { createProject, getProjectMembership, getProjects, requestToJoinProject } from "../../lib/api";

const initialForm = {
  name: "",
  tagline: "",
  description: "",
  category: "Student Project",
  visibility: "Public",
  dueDate: "",
  requiredSkills: "",
  lookingFor: "",
};

export default function ProjectsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [memberships, setMemberships] = useState({});

  const loadProjects = async () => {
    const nextProjects = await getProjects();
    setProjects(nextProjects);
    if (currentUser) {
      const states = await Promise.all(
        nextProjects.map(async (project) => [project.id, await getProjectMembership(project.id, currentUser.$id)])
      );
      setMemberships(Object.fromEntries(states));
    }
  };

  useEffect(() => {
    loadProjects();
  }, [currentUser]);

  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.name.toLowerCase().includes(query.toLowerCase()) ||
          project.description.toLowerCase().includes(query.toLowerCase()) ||
          project.requiredSkills.some((skill) => skill.toLowerCase().includes(query.toLowerCase()))
      ),
    [projects, query]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-xl md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Project workspaces</p>
            <h1 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
              Create, join, and track projects like a lightweight GitHub plus LinkedIn workspace.
            </h1>
            <p className="mt-4 text-slate-300">
              Each project has collaborators, required skills, tasks, progress, updates, and room for backend APIs later.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="inline-flex items-center gap-2 rounded-2xl bg-lime-300 px-5 py-4 text-sm font-medium text-slate-950"
          >
            <FolderPlus className="h-4 w-4" />
            {showForm ? "Close project form" : "Create project"}
          </button>
        </div>

        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects, skills, or focus areas"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-12 pr-4 text-white outline-none transition focus:border-lime-300/40"
          />
        </div>
      </section>

      {showForm && (
        <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-xl">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Project name"
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
            />
            <input
              value={form.tagline}
              onChange={(event) => setForm((prev) => ({ ...prev, tagline: event.target.value }))}
              placeholder="Short tagline"
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
            />
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="What are you building?"
              className="min-h-32 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none md:col-span-2"
            />
            <input
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              placeholder="Category"
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
            />
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
            />
            <input
              value={form.requiredSkills}
              onChange={(event) => setForm((prev) => ({ ...prev, requiredSkills: event.target.value }))}
              placeholder="Required skills, comma separated"
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
            />
            <input
              value={form.lookingFor}
              onChange={(event) => setForm((prev) => ({ ...prev, lookingFor: event.target.value }))}
              placeholder="Looking for, comma separated"
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={async () => {
                if (!currentUser || !form.name.trim()) return;

                const nextProject = await createProject(currentUser.$id, {
                  ...form,
                  requiredSkills: form.requiredSkills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean),
                  lookingFor: form.lookingFor
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                });

                setForm(initialForm);
                setShowForm(false);
                await loadProjects();
                navigate(`/dashboard/projects/${nextProject.id}`);
              }}
              className="rounded-2xl bg-lime-300 px-5 py-3 text-sm font-medium text-slate-950"
            >
              Create workspace
            </button>
          </div>
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/dashboard/projects/${project.id}`)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate(`/dashboard/projects/${project.id}`);
              }
            }}
            role="button"
            tabIndex={0}
            className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-left shadow-xl transition hover:border-lime-300/40 hover:bg-white/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">{project.category}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{project.name}</h2>
                <p className="mt-2 text-sm text-slate-300">{project.tagline}</p>
              </div>
              <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-300">
                {project.status}
              </span>
            </div>

            <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">{project.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.requiredSkills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs text-lime-100"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-lime-300" style={{ width: `${project.progress}%` }} />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
              <span>{project.members.length} collaborators</span>
              <span>Due {project.dueDate || "TBD"}</span>
            </div>

            <div className="mt-4">
              {memberships[project.id] === "visitor" && (
                <button
                  type="button"
                  onClick={async (event) => {
                    event.stopPropagation();
                    if (!currentUser) return;
                    await requestToJoinProject(project.id, currentUser.$id);
                    await loadProjects();
                  }}
                  className="w-full rounded-xl border border-lime-300/30 bg-lime-300/10 px-4 py-3 text-sm text-lime-100"
                >
                  Request to join
                </button>
              )}
              {memberships[project.id] === "requested" && (
                <div className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                  Join request sent
                </div>
              )}
              {memberships[project.id] === "invited" && (
                <div className="rounded-xl border border-lime-300/30 bg-lime-300/10 px-4 py-3 text-sm text-lime-100">
                  You have a pending invite for this project
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
