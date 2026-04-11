import React, { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare, Search, Send } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  getConnections,
  getConversation,
  getUserConversations,
  sendMessage,
} from "../../lib/api";

function formatStamp(value) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ChatPage() {
  const { currentUser } = useAuth();
  const [connections, setConnections] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const endRef = useRef(null);

  const loadBase = async () => {
    if (!currentUser) return;
    const [nextConnections, nextConversations] = await Promise.all([
      getConnections(currentUser.$id),
      getUserConversations(currentUser.$id),
    ]);

    setConnections(nextConnections);
    setConversations(nextConversations);

    if (!selectedId) {
      const defaultId = nextConversations[0]?.otherUserId || nextConnections[0]?.$id || null;
      setSelectedId(defaultId);
    }
  };

  const loadMessages = async (targetId) => {
    if (!currentUser || !targetId) {
      setMessages([]);
      return;
    }
    const nextMessages = await getConversation(currentUser.$id, targetId);
    setMessages(nextMessages);
  };

  useEffect(() => {
    loadBase();
  }, [currentUser]);

  useEffect(() => {
    loadMessages(selectedId);
  }, [selectedId, currentUser]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const people = useMemo(() => {
    const ids = new Set(connections.map((person) => person.$id));
    const merged = [...connections];

    conversations.forEach((conversation) => {
      if (!ids.has(conversation.otherUserId)) {
        merged.push(conversation.otherUser);
        ids.add(conversation.otherUserId);
      }
    });

    return merged.filter(Boolean);
  }, [connections, conversations]);

  const visiblePeople = useMemo(
    () =>
      people.filter(
        (person) =>
          person.fullName.toLowerCase().includes(search.toLowerCase()) ||
          person.role.toLowerCase().includes(search.toLowerCase())
      ),
    [people, search]
  );

  const selectedPerson = useMemo(
    () => people.find((person) => person.$id === selectedId) || null,
    [people, selectedId]
  );

  const latestByUser = useMemo(
    () => Object.fromEntries(conversations.map((conversation) => [conversation.otherUserId, conversation])),
    [conversations]
  );

  const handleSend = async () => {
    if (!draft.trim() || !selectedId || !currentUser) return;
    await sendMessage(currentUser.$id, selectedId, draft.trim());
    setDraft("");
    await loadBase();
    await loadMessages(selectedId);
  };

  return (
    <div className="grid min-h-[calc(100vh-7rem)] gap-6 xl:grid-cols-[360px_1fr]">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Direct messages</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Connected collaborators</h1>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-300 text-slate-950">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>

        <div className="relative mt-5">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search people"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-11 pr-4 text-white outline-none transition focus:border-lime-300/40"
          />
        </div>

        <div className="mt-5 space-y-3">
          {visiblePeople.map((person) => {
            const preview = latestByUser[person.$id];
            const active = selectedId === person.$id;

            return (
              <button
                key={person.$id}
                type="button"
                onClick={() => setSelectedId(person.$id)}
                className={`w-full rounded-[22px] border p-4 text-left transition ${
                  active
                    ? "border-lime-300/40 bg-lime-300/10"
                    : "border-white/10 bg-slate-950/55 hover:bg-slate-950/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 font-semibold text-white">
                    {person.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-medium text-white">{person.fullName}</p>
                      {preview?.createdAt && (
                        <span className="text-[11px] text-slate-500">
                          {new Date(preview.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-sm text-slate-400">
                      {preview?.content || person.role}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-xl">
        {selectedPerson ? (
          <div className="flex h-full min-h-[70vh] flex-col">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-300 font-semibold text-slate-950">
                  {selectedPerson.initials}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{selectedPerson.fullName}</h2>
                  <p className="text-sm text-slate-400">
                    {selectedPerson.role} · {selectedPerson.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              {messages.length ? (
                messages.map((message) => {
                  const own = message.senderId === currentUser.$id;
                  return (
                    <div key={message.id} className={`flex ${own ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xl rounded-[24px] px-4 py-3 ${
                          own ? "bg-lime-300 text-slate-950" : "bg-slate-950/75 text-white"
                        }`}
                      >
                        <p className="text-sm leading-6">{message.content}</p>
                        <p className={`mt-2 text-[11px] ${own ? "text-slate-700" : "text-slate-500"}`}>
                          {formatStamp(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex h-full items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-slate-950/30 p-8 text-center text-slate-400">
                  Start the conversation. This persists locally so the frontend behaves like a real chat product.
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="border-t border-white/10 px-6 py-5">
              <div className="flex items-end gap-3">
                <textarea
                  rows={2}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={`Message ${selectedPerson.fullName}`}
                  className="min-h-[64px] flex-1 rounded-[24px] border border-white/10 bg-slate-950/70 px-4 py-4 text-white outline-none transition focus:border-lime-300/40"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-300 text-slate-950"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-[70vh] items-center justify-center px-8 text-center">
            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-lime-300 text-slate-950">
                <MessageSquare className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-white">No chat selected</h2>
              <p className="mt-3 max-w-md text-slate-400">
                Accept connection requests or browse collaborators, then start messaging right away.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
