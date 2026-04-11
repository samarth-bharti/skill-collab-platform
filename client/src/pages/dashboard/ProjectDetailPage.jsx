import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Plus, Send } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  addProjectTask,
  addProjectUpdate,
  getConnections,
  getIncomingProjectRequests,
  getProjectById,
  getProjectMembership,
  getProjectMessages,
  inviteUserToProject,
  requestToJoinProject,
  respondToProjectRequest,
  sendProjectMessage,
  toggleProjectTask,
} from "../../lib/api";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [project, setProject] = useState(undefined);
  const [membership, setMembership] = useState("visitor");
  const [connections, setConnections] = useState([]);
  const [projectRequests, setProjectRequests] = useState([]);
  const [projectMessages, setProjectMessages] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [updateText, setUpdateText] = useState("");
  const [messageText, setMessageText] = useState("");
  const [inviteTarget, setInviteTarget] = useState("");

  const loadProject = async () => {
    const nextProject = await getProjectById(id);
    setProject(nextProject);

    if (currentUser && nextProject) {
      const [nextMembership, nextConnections, nextRequests, nextMessages] = await Promise.all([
        getProjectMembership(id, currentUser.$id),
        getConnections(currentUser.$id),
        getIncomingProjectRequests(currentUser.$id),
        getProjectMessages(id),
      ]);
      setMembership(nextMembership);
      setConnections(nextConnections);
      setProjectRequests(nextRequests.filter((request) => request.project?.id === nextProject.id));
      setProjectMessages(nextMessages);
    } else {
      setMembership("visitor");
      setConnections([]);
      setProjectRequests([]);
      setProjectMessages([]);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id, currentUser]);

  const canManageProject = membership === "owner" || membership === "member";
  const canInvite = membership === "owner";

  const inviteOptions = useMemo(
    () =>
      connections.filter(
        (person) => project && !project.memberIds.includes(person.$id)
      ),
    [connections, project]
  );

  if (project === undefined) {
    return <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-slate-300">Loading project...</div>;
  }

  if (project === null) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-white">Project not found</h1>
        <p className="mt-3 max-w-xl text-slate-400">
          This project link is invalid or the workspace was removed from local demo storage.
        </p>
        <Link
          to="/dashboard/projects"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-lime-300 px-4 py-3 text-sm font-medium text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-xl md:p-8">
        <Link
          to="/dashboard/projects"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>

        <div className="mt-6 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{project.category}</p>
            <h1 className="mt-3 text-3xl font-semibold text-white md:text-5xl">{project.name}</h1>
            <p className="mt-3 text-lg text-slate-300">{project.tagline}</p>
            <p className="mt-4 text-slate-400">{project.description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4">
              <p className="text-sm text-slate-400">Status</p>
              <p className="mt-2 text-xl font-semibold text-white">{project.status}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4">
              <p className="text-sm text-slate-400">Members</p>
              <p className="mt-2 text-xl font-semibold text-white">{project.members.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4">
              <p className="text-sm text-slate-400">Progress</p>
              <p className="mt-2 text-xl font-semibold text-white">{project.progress}%</p>
            </div>
          </div>
        </div>

        <div className="mt-6 h-3 rounded-full bg-white/10">
          <div className="h-3 rounded-full bg-lime-300" style={{ width: `${project.progress}%` }} />
        </div>

        <div className="mt-6">
          {membership === "visitor" && (
            <button
              type="button"
              onClick={async () => {
                await requestToJoinProject(project.id, currentUser.$id);
                await loadProject();
              }}
              className="rounded-2xl bg-lime-300 px-5 py-3 text-sm font-medium text-slate-950"
            >
              Request to join this project
            </button>
          )}
          {membership === "requested" && (
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-3 text-sm text-slate-300">
              Join request sent. The owner can approve it from their dashboard or project page.
            </div>
          )}
          {membership === "invited" && (
            <div className="rounded-2xl border border-lime-300/30 bg-lime-300/10 px-5 py-3 text-sm text-lime-100">
              You have a pending invite for this project. Accept it from your dashboard home.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Tasks</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Delivery tracker</h2>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-slate-300">
                {project.tasks.filter((task) => task.completed).length}/{project.tasks.length} done
              </div>
            </div>

            {canManageProject ? (
              <>
                <div className="mt-5 flex gap-3">
                  <input
                    value={taskTitle}
                    onChange={(event) => setTaskTitle(event.target.value)}
                    placeholder="Add a task"
                    className="flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!taskTitle.trim()) return;
                      await addProjectTask(project.id, {
                        title: taskTitle.trim(),
                        assigneeId: currentUser?.$id,
                        priority: "Medium",
                      });
                      setTaskTitle("");
                      await loadProject();
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl bg-lime-300 px-4 py-3 text-sm font-medium text-slate-950"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>

                <div className="mt-6 space-y-3">
                  {project.tasks.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={async () => {
                        await toggleProjectTask(project.id, task.id);
                        await loadProject();
                      }}
                      className="flex w-full items-start gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-left transition hover:bg-slate-950/90"
                    >
                      <div
                        className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border ${
                          task.completed
                            ? "border-lime-300 bg-lime-300 text-slate-950"
                            : "border-white/20 text-transparent"
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${task.completed ? "text-slate-400 line-through" : "text-white"}`}>
                          {task.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {task.assignee?.fullName || "Unassigned"} · {task.priority} priority
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-white/12 bg-slate-950/35 p-5 text-sm text-slate-400">
                Join the project first to manage tasks.
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Updates</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Project activity log</h2>

            {canManageProject ? (
              <div className="mt-5 flex flex-col gap-3">
                <textarea
                  value={updateText}
                  onChange={(event) => setUpdateText(event.target.value)}
                  placeholder="Share progress with the team"
                  className="min-h-28 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!updateText.trim() || !currentUser) return;
                      await addProjectUpdate(project.id, currentUser.$id, updateText.trim());
                      setUpdateText("");
                      await loadProject();
                    }}
                    className="rounded-2xl bg-lime-300 px-5 py-3 text-sm font-medium text-slate-950"
                  >
                    Post update
                  </button>
                </div>
              </div>
            ) : null}

            <div className="mt-6 space-y-3">
              {project.updates.map((update) => (
                <div key={update.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 font-semibold text-white">
                      {update.author?.initials || "U"}
                    </div>
                    <div>
                      <p className="text-sm text-slate-200">
                        <span className="font-semibold text-white">{update.author?.fullName || "Unknown user"}</span>
                      </p>
                      <p className="mt-2 text-sm text-slate-300">{update.text}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        {new Date(update.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Project room</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Team chat</h2>

            <div className="mt-6 space-y-3">
              {projectMessages.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-200">
                    <span className="font-semibold text-white">{entry.author?.fullName || "Unknown user"}</span>
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{entry.text}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {new Date(entry.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>

            {canManageProject ? (
              <div className="mt-5 flex gap-3">
                <textarea
                  rows={2}
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  placeholder="Send a message to the project room"
                  className="flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!messageText.trim()) return;
                    await sendProjectMessage(project.id, currentUser.$id, messageText.trim());
                    setMessageText("");
                    await loadProject();
                  }}
                  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-300 text-slate-950"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-white/12 bg-slate-950/35 p-5 text-sm text-slate-400">
                Join the project to participate in the team room.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Team</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Collaborators</h2>

            <div className="mt-6 space-y-3">
              {project.members.map((member) => (
                <div key={member.$id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-300 font-semibold text-slate-950">
                    {member.initials}
                  </div>
                  <div>
                    <p className="font-medium text-white">{member.fullName}</p>
                    <p className="text-sm text-slate-400">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {canInvite && (
              <div className="mt-6">
                <p className="text-sm text-slate-400">Invite a connection</p>
                <div className="mt-3 flex gap-3">
                  <select
                    value={inviteTarget}
                    onChange={(event) => setInviteTarget(event.target.value)}
                    className="flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                  >
                    <option value="">Select a collaborator</option>
                    {inviteOptions.map((person) => (
                      <option key={person.$id} value={person.$id}>
                        {person.fullName} · {person.role}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!inviteTarget) return;
                      await inviteUserToProject(project.id, currentUser.$id, inviteTarget);
                      setInviteTarget("");
                      await loadProject();
                    }}
                    className="rounded-2xl bg-lime-300 px-4 py-3 text-sm font-medium text-slate-950"
                  >
                    Send invite
                  </button>
                </div>
              </div>
            )}
          </div>

          {canInvite && (
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Pending approvals</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Join requests</h2>
              <div className="mt-6 space-y-3">
                {projectRequests.length ? (
                  projectRequests.map((request) => (
                    <div key={request.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="font-medium text-white">{request.sender?.fullName}</p>
                      <p className="mt-1 text-sm text-slate-400">{request.sender?.role}</p>
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            await respondToProjectRequest(request.id, currentUser.$id, "accept");
                            await loadProject();
                          }}
                          className="rounded-xl bg-lime-300 px-4 py-2 text-sm font-medium text-slate-950"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await respondToProjectRequest(request.id, currentUser.$id, "decline");
                            await loadProject();
                          }}
                          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/12 bg-slate-950/35 p-5 text-sm text-slate-400">
                    No join requests for this project right now.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Project shape</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Skills and hiring gaps</h2>

            <div className="mt-6">
              <p className="text-sm text-slate-400">Required skills</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs text-lime-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-slate-400">Looking for</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.lookingFor.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
              Visibility: {project.visibility} · Due date: {project.dueDate || "Not set"}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
