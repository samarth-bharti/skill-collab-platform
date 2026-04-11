import React, { useEffect, useMemo, useState } from "react";
import { Search, Send, UserPlus, Users } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getConnections,
  getDiscoverProfiles,
  getPendingRequests,
  getSentRequests,
  sendFriendRequest,
} from "../../lib/api";

function SkillChip({ skill }) {
  return (
    <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs text-lime-100">
      {skill}
    </span>
  );
}

export default function DiscoverPage() {
  const { currentUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [pending, setPending] = useState([]);
  const [sent, setSent] = useState([]);
  const [connections, setConnections] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const loadData = async () => {
    if (!currentUser) return;
    const [nextProfiles, nextPending, nextSent, nextConnections] = await Promise.all([
      getDiscoverProfiles(currentUser.$id),
      getPendingRequests(currentUser.$id),
      getSentRequests(currentUser.$id),
      getConnections(currentUser.$id),
    ]);

    setProfiles(nextProfiles);
    setPending(nextPending);
    setSent(nextSent);
    setConnections(nextConnections);
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      const matchesQuery =
        profile.fullName.toLowerCase().includes(query.toLowerCase()) ||
        profile.role.toLowerCase().includes(query.toLowerCase()) ||
        profile.topSkills.some((skill) => skill.toLowerCase().includes(query.toLowerCase()));

      const matchesFilter = filter === "all" ? true : profile.connectionStatus === filter;
      return matchesQuery && matchesFilter;
    });
  }, [filter, profiles, query]);

  const sentMap = useMemo(
    () => Object.fromEntries(sent.map((request) => [request.receiverId, request])),
    [sent]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-xl md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Network and discovery</p>
            <h1 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
              Find students who can actually help you ship.
            </h1>
            <p className="mt-4 text-slate-300">
              Send requests, accept collaborators, and discover people by role, skills, and working style.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4">
              <p className="text-sm text-slate-400">Connections</p>
              <p className="mt-2 text-2xl font-semibold text-white">{connections.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4">
              <p className="text-sm text-slate-400">Incoming</p>
              <p className="mt-2 text-2xl font-semibold text-white">{pending.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4">
              <p className="text-sm text-slate-400">Sent</p>
              <p className="mt-2 text-2xl font-semibold text-white">{sent.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, role, or skill"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-12 pr-4 text-white outline-none transition focus:border-lime-300/40"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ["all", "All"],
              ["connected", "Connected"],
              ["incoming", "Incoming"],
              ["outgoing", "Sent"],
              ["none", "New"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-2xl px-4 py-3 text-sm transition ${
                  filter === value
                    ? "bg-lime-300 text-slate-950"
                    : "border border-white/10 bg-slate-950/70 text-slate-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300 text-slate-950">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Incoming requests</p>
                <h2 className="text-2xl font-semibold text-white">People waiting on you</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {pending.length ? (
                pending.map((request) => (
                  <div key={request.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-300 font-semibold text-slate-950">
                        {request.sender.initials}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{request.sender.fullName}</p>
                        <p className="text-sm text-slate-400">{request.sender.role}</p>
                        <p className="mt-2 text-sm text-slate-300">{request.sender.headline || request.sender.bio}</p>
                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              await acceptFriendRequest(request.id, currentUser.$id);
                              await loadData();
                            }}
                            className="rounded-xl bg-lime-300 px-4 py-2 text-sm font-medium text-slate-950"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await declineFriendRequest(request.id, currentUser.$id);
                              await loadData();
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
                  No incoming requests. Your network is quiet right now.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Current network</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Connected collaborators</h2>
            <div className="mt-6 space-y-3">
              {connections.map((person) => (
                <div key={person.$id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 font-semibold text-white">
                    {person.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">{person.fullName}</p>
                    <p className="truncate text-sm text-slate-400">
                      {person.role} · {person.location}
                    </p>
                  </div>
                  <span className="rounded-full bg-lime-300/10 px-3 py-1 text-xs text-lime-100">Connected</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Discover collaborators</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Students you can build with</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filteredProfiles.map((profile) => {
              const outgoingRequest = sentMap[profile.$id];
              const state = profile.connectionStatus;

              return (
                <div key={profile.$id} className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-lime-300 font-semibold text-slate-950">
                        {profile.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{profile.fullName}</p>
                        <p className="text-sm text-slate-400">{profile.role}</p>
                        <p className="text-xs text-slate-500">{profile.location}</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                      {profile.status}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-slate-300">{profile.bio}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.topSkills.map((skill) => (
                      <SkillChip key={skill} skill={skill} />
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
                    <span>{profile.skillsVerified} verified skills</span>
                    <span>{profile.endorsements} endorsements</span>
                  </div>

                  <div className="mt-5">
                    {state === "connected" && (
                      <div className="rounded-xl bg-lime-300/10 px-4 py-3 text-sm text-lime-100">
                        You are already connected.
                      </div>
                    )}
                    {state === "outgoing" && (
                      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                        Request sent {outgoingRequest ? new Date(outgoingRequest.createdAt).toLocaleDateString("en-US") : ""}.
                      </div>
                    )}
                    {state === "incoming" && (
                      <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
                        This person already sent you a request. Accept it from the left panel.
                      </div>
                    )}
                    {state === "none" && (
                      <button
                        type="button"
                        onClick={async () => {
                          await sendFriendRequest(currentUser.$id, profile.$id);
                          await loadData();
                        }}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-lime-300 px-4 py-3 text-sm font-medium text-slate-950"
                      >
                        <UserPlus className="h-4 w-4" />
                        Send request
                      </button>
                    )}
                    {state === "declined" && (
                      <button
                        type="button"
                        onClick={async () => {
                          await sendFriendRequest(currentUser.$id, profile.$id);
                          await loadData();
                        }}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                      >
                        <Send className="h-4 w-4" />
                        Send again
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
