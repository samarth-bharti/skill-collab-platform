import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { createUserProfile, getUserSettings, updateUserSettings } from "../../lib/api";

function Section({ title, description, children }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label, hint }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-left"
    >
      <div>
        <p className="font-medium text-white">{label}</p>
        <p className="mt-1 text-sm text-slate-400">{hint}</p>
      </div>
      <div className={`flex h-7 w-12 items-center rounded-full p-1 ${checked ? "bg-lime-300" : "bg-white/10"}`}>
        <div className={`h-5 w-5 rounded-full bg-slate-950 transition ${checked ? "translate-x-5" : ""}`} />
      </div>
    </button>
  );
}

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState(null);
  const [profile, setProfile] = useState({
    fullName: "",
    role: "",
    bio: "",
    location: "",
    availability: "",
    github: "",
    linkedin: "",
    skills: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!currentUser) return;
      const nextSettings = await getUserSettings(currentUser.$id);
      setSettings(nextSettings);
      setProfile({
        fullName: currentUser.fullName || currentUser.name || "",
        role: currentUser.role || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        availability: currentUser.availability || "",
        github: currentUser.github || "",
        linkedin: currentUser.linkedin || "",
        skills: (currentUser.topSkills || []).join(", "),
      });
    };

    load();
  }, [currentUser]);

  if (!settings) {
    return <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-slate-300">Loading settings...</div>;
  }

  const setPath = (path, value) => {
    const keys = path.split(".");
    setSettings((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      let cursor = next;
      keys.slice(0, -1).forEach((key) => {
        cursor = cursor[key];
      });
      cursor[keys[keys.length - 1]] = value;
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-xl md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Settings and profile</p>
            <h1 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
              Make the prototype feel like a real account.
            </h1>
            <p className="mt-4 max-w-3xl text-slate-300">
              Profile data, notification preferences, privacy, appearance, and integrations all persist locally for now.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (!currentUser) return;
              setSaving(true);
              await createUserProfile(currentUser.$id, {
                fullName: profile.fullName,
                role: profile.role,
                bio: profile.bio,
                location: profile.location,
                availability: profile.availability,
                github: profile.github,
                linkedin: profile.linkedin,
                skills: profile.skills
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              });
              await updateUserSettings(currentUser.$id, settings);
              setSaving(false);
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-lime-300 px-5 py-4 text-sm font-medium text-slate-950"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save settings"}
          </button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Section title="Profile" description="This is the public-facing information collaborators use to decide whether to connect with you.">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={profile.fullName}
                onChange={(event) => setProfile((prev) => ({ ...prev, fullName: event.target.value }))}
                placeholder="Full name"
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              />
              <input
                value={profile.role}
                onChange={(event) => setProfile((prev) => ({ ...prev, role: event.target.value }))}
                placeholder="Role"
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              />
              <input
                value={profile.location}
                onChange={(event) => setProfile((prev) => ({ ...prev, location: event.target.value }))}
                placeholder="Location"
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              />
              <input
                value={profile.availability}
                onChange={(event) => setProfile((prev) => ({ ...prev, availability: event.target.value }))}
                placeholder="Availability"
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              />
              <input
                value={profile.github}
                onChange={(event) => setProfile((prev) => ({ ...prev, github: event.target.value }))}
                placeholder="GitHub URL"
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              />
              <input
                value={profile.linkedin}
                onChange={(event) => setProfile((prev) => ({ ...prev, linkedin: event.target.value }))}
                placeholder="LinkedIn URL"
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              />
            </div>
            <textarea
              value={profile.bio}
              onChange={(event) => setProfile((prev) => ({ ...prev, bio: event.target.value }))}
              placeholder="Short bio"
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
            />
            <input
              value={profile.skills}
              onChange={(event) => setProfile((prev) => ({ ...prev, skills: event.target.value }))}
              placeholder="Skills, comma separated"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
            />
          </Section>

          <Section title="Notifications" description="Choose which collaboration events deserve your attention.">
            <Toggle
              checked={settings.notifications.push.messages}
              onChange={(value) => setPath("notifications.push.messages", value)}
              label="Direct messages"
              hint="Be notified about incoming chat messages."
            />
            <Toggle
              checked={settings.notifications.push.projectUpdates}
              onChange={(value) => setPath("notifications.push.projectUpdates", value)}
              label="Project updates"
              hint="Get alerted when tasks or updates change in your workspaces."
            />
            <Toggle
              checked={settings.notifications.push.friendRequests}
              onChange={(value) => setPath("notifications.push.friendRequests", value)}
              label="Connection requests"
              hint="Know when someone wants to collaborate."
            />
            <Toggle
              checked={settings.notifications.email.weeklyDigest}
              onChange={(value) => setPath("notifications.email.weeklyDigest", value)}
              label="Weekly digest"
              hint="Receive a summary of projects, network growth, and activity."
            />
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Privacy and collaboration" description="These controls help shape how other students find and work with you.">
            <div className="grid gap-4">
              <select
                value={settings.privacy.account.profileVisibility}
                onChange={(event) => setPath("privacy.account.profileVisibility", event.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              >
                <option value="community">Visible to community</option>
                <option value="campus">Campus only</option>
                <option value="private">Private</option>
              </select>
              <Toggle
                checked={settings.collaboration.openToConnections}
                onChange={(value) => setPath("collaboration.openToConnections", value)}
                label="Open to new connections"
                hint="Show that you are available for networking."
              />
              <Toggle
                checked={settings.collaboration.allowProjectInvites}
                onChange={(value) => setPath("collaboration.allowProjectInvites", value)}
                label="Allow project invites"
                hint="Let project owners add you to future collaborations."
              />
              <Toggle
                checked={settings.privacy.account.loginAlerts}
                onChange={(value) => setPath("privacy.account.loginAlerts", value)}
                label="Login alerts"
                hint="Keep this on if you want a more realistic security surface."
              />
            </div>
          </Section>

          <Section title="Appearance and integrations" description="These don’t change the whole app theme yet, but they define the contract for backend-connected preferences.">
            <div className="grid gap-4">
              <select
                value={settings.appearance.theme}
                onChange={(event) => setPath("appearance.theme", event.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
              <select
                value={settings.appearance.accentColor}
                onChange={(event) => setPath("appearance.accentColor", event.target.value)}
                className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
              >
                <option value="green">Lime</option>
                <option value="blue">Blue</option>
                <option value="orange">Orange</option>
              </select>
              <Toggle
                checked={settings.appearance.animations}
                onChange={(value) => setPath("appearance.animations", value)}
                label="Interface animations"
                hint="Keep interactions expressive and lively."
              />
              <Toggle
                checked={settings.integrations.connected[0]?.connected}
                onChange={(value) => {
                  const next = [...settings.integrations.connected];
                  next[0] = { ...next[0], connected: value };
                  setPath("integrations.connected", next);
                }}
                label="GitHub connected"
                hint="Used later for repo links, activity, and skill validation."
              />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
