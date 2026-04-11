import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock3,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  respondToProjectRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getDashboardSnapshot,
} from "../../lib/api";

function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-400">{hint}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300 text-slate-950">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function formatDateLabel(dateString) {
  if (!dateString) return "No deadline";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function DashboardHomePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [snapshot, setSnapshot] = useState(null);

  const loadSnapshot = async () => {
    if (!currentUser) return;
    const next = await getDashboardSnapshot(currentUser.$id);
    setSnapshot(next);
  };

  useEffect(() => {
    loadSnapshot();
  }, [currentUser]);

  const nextDeadline = useMemo(() => {
    if (!snapshot?.myProjects?.length) return null;
    return [...snapshot.myProjects].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];
  }, [snapshot]);

  if (!snapshot) {
    return <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-slate-300">Loading workspace...</div>;
  }

  const {
    profile,
    metrics,
    pendingRequests,
    projectInvites,
    incomingProjectRequests,
    notifications,
    timeline,
    myProjects,
    activeProject,
  } = snapshot;

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(163,230,53,0.16),rgba(15,23,42,0.8)_42%,rgba(15,23,42,0.96))] p-6 shadow-2xl md:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-lime-200/80">Workspace overview</p>
            <h1 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
              Build, connect, and ship with students who actually complement your skills.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-300">
              {profile.fullName}, this frontend prototype already supports networking, requests, direct chat,
              projects, tasks, updates, and settings. It is ready to map onto Spring Boot APIs next.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard/discover")}
              className="rounded-2xl bg-slate-950 px-5 py-4 text-left shadow-lg transition hover:bg-slate-900"
            >
              <p className="text-sm text-slate-400">Connections</p>
              <p className="mt-2 text-2xl font-semibold text-white">{metrics.collaborators.current}</p>
              <p className="mt-1 text-sm text-slate-300">Grow your collaborator graph</p>
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/projects")}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left shadow-lg transition hover:bg-white/10"
            >
              <p className="text-sm text-slate-400">Active projects</p>
              <p className="mt-2 text-2xl font-semibold text-white">{metrics.projectsActive.current}</p>
              <p className="mt-1 text-sm text-slate-300">Track delivery without a backend yet</p>
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active projects"
          value={metrics.projectsActive.current}
          hint={`${metrics.projectsActive.growth}% growth in momentum`}
          icon={Briefcase}
        />
        <StatCard
          label="Collaborators"
          value={metrics.collaborators.current}
          hint={`${pendingRequests.length} requests waiting on you`}
          icon={Users}
        />
        <StatCard
          label="Tasks completed"
          value={metrics.tasksDone.current}
          hint="Project progress rolls up from task completion"
          icon={CheckCircle2}
        />
        <StatCard
          label="Profile strength"
          value={`${metrics.profileStrength.current}%`}
          hint="Stronger profiles convert better in discovery"
          icon={Sparkles}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Projects</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Your current work</h2>
              </div>
              <Link
                to="/dashboard/projects"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {myProjects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => navigate(`/dashboard/projects/${project.id}`)}
                  className="w-full rounded-[24px] border border-white/10 bg-slate-950/70 p-5 text-left transition hover:border-lime-300/40 hover:bg-slate-950"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">{project.tagline}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.requiredSkills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs text-lime-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="min-w-44">
                      <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>{project.status}</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full bg-lime-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <p className="mt-3 text-xs text-slate-400">
                        Due {formatDateLabel(project.dueDate)} · {project.members.length} members
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Activity</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Recent collaboration feed</h2>
              </div>
              <Clock3 className="h-5 w-5 text-slate-500" />
            </div>

            <div className="mt-6 space-y-4">
              {timeline.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-2xl border border-white/8 bg-slate-950/55 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/8 text-sm font-semibold text-white">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="text-sm text-slate-200">
                      <span className="font-semibold text-white">{item.user}</span> {item.action}{" "}
                      <span className="text-lime-200">{item.target}</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(item.time).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Requests</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Pending connection requests</h2>

            <div className="mt-6 space-y-4">
              {pendingRequests.length ? (
                pendingRequests.map((request) => (
                  <div key={request.id} className="rounded-2xl border border-white/8 bg-slate-950/60 p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-300 font-semibold text-slate-950">
                        {request.sender.initials}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{request.sender.fullName}</p>
                        <p className="text-sm text-slate-400">{request.sender.role}</p>
                        <p className="mt-2 text-sm text-slate-300">{request.sender.bio}</p>
                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              await acceptFriendRequest(request.id, currentUser.$id);
                              await loadSnapshot();
                            }}
                            className="rounded-xl bg-lime-300 px-4 py-2 text-sm font-medium text-slate-950"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await declineFriendRequest(request.id, currentUser.$id);
                              await loadSnapshot();
                            }}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/12 bg-slate-950/35 p-5 text-sm text-slate-400">
                  No incoming requests right now. Explore collaborators and grow the network.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Project access</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Invites and join approvals</h2>

            <div className="mt-6 space-y-4">
              {projectInvites.map((invite) => (
                <div key={invite.id} className="rounded-2xl border border-white/8 bg-slate-950/60 p-4">
                  <p className="font-medium text-white">{invite.project?.name}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Invited by {invite.sender?.fullName || "project owner"}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await respondToProjectRequest(invite.id, currentUser.$id, "accept");
                        await loadSnapshot();
                      }}
                      className="rounded-xl bg-lime-300 px-4 py-2 text-sm font-medium text-slate-950"
                    >
                      Accept invite
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await respondToProjectRequest(invite.id, currentUser.$id, "decline");
                        await loadSnapshot();
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}

              {incomingProjectRequests.map((request) => (
                <div key={request.id} className="rounded-2xl border border-white/8 bg-slate-950/60 p-4">
                  <p className="font-medium text-white">
                    {request.sender?.fullName || "Student"} wants to join {request.project?.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{request.sender?.role}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await respondToProjectRequest(request.id, currentUser.$id, "accept");
                        await loadSnapshot();
                      }}
                      className="rounded-xl bg-lime-300 px-4 py-2 text-sm font-medium text-slate-950"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await respondToProjectRequest(request.id, currentUser.$id, "decline");
                        await loadSnapshot();
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}

              {!projectInvites.length && !incomingProjectRequests.length && (
                <div className="rounded-2xl border border-dashed border-white/12 bg-slate-950/35 p-5 text-sm text-slate-400">
                  No project invites or join requests pending.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Focus</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">What to do next</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">Closest deadline</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {nextDeadline ? nextDeadline.name : "No project deadline yet"}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {nextDeadline ? `Due ${formatDateLabel(nextDeadline.dueDate)}` : "Create or join a project to start tracking progress."}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">Unread platform signals</p>
                <p className="mt-2 text-lg font-semibold text-white">{notifications.filter((item) => item.unread).length}</p>
                <p className="mt-1 text-sm text-slate-300">Messages, project updates, and collaboration events</p>
              </div>
              {activeProject && (
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/projects/${activeProject.id}`)}
                  className="w-full rounded-2xl bg-lime-300 px-5 py-4 text-left text-slate-950"
                >
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-700">Active project</p>
                  <p className="mt-2 text-xl font-semibold">{activeProject.name}</p>
                  <p className="mt-1 text-sm text-slate-700">Open workspace and continue shipping</p>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
