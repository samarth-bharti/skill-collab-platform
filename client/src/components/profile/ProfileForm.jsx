import React, { useState, useEffect } from "react";

export default function ProfileForm({ initial = {}, onSave, saving = false }) {
  const [fullName, setFullName] = useState(initial.fullName || "");
  const [username, setUsername] = useState(initial.username || "");
  const [bio, setBio] = useState(initial.bio || "");
  const [skills, setSkills] = useState((initial.skills || []).join(", "));
  const [location, setLocation] = useState(initial.location || "");
  const [avatarPreview, setAvatarPreview] = useState(initial.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFullName(initial.fullName || "");
    setUsername(initial.username || "");
    setBio(initial.bio || "");
    setSkills((initial.skills || []).join(", "));
    setLocation(initial.location || "");
    setAvatarPreview(initial.avatar || null);
  }, [initial]);

  const onFile = (file) => {
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError(null);
    const payload = {
      fullName: fullName.trim(),
      username: username.trim(),
      bio: bio.trim(),
      skills: skills.split(",").map(s => s.trim()).filter(Boolean),
      location: location.trim(),
    };

    // if avatar selected, include base64 data so backend can handle it
    if (avatarFile && avatarPreview) payload.avatar = avatarPreview;

    try {
      await onSave(payload);
    } catch (err) {
      setError(err.message || "Failed to save profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-lg border border-zinc-700 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden">
          {avatarPreview ? (
            <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="text-zinc-500">No avatar</div>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-300">Upload avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0])}
            className="mt-2 text-sm text-gray-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-300">Full name</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full mt-1 p-2 bg-zinc-800 border border-zinc-700 rounded" />
      </div>

      <div>
        <label className="block text-sm text-gray-300">Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 p-2 bg-zinc-800 border border-zinc-700 rounded" />
      </div>

      <div>
        <label className="block text-sm text-gray-300">Bio</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full mt-1 p-2 bg-zinc-800 border border-zinc-700 rounded" rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300">Skills (comma separated)</label>
          <input value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full mt-1 p-2 bg-zinc-800 border border-zinc-700 rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-300">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full mt-1 p-2 bg-zinc-800 border border-zinc-700 rounded" />
        </div>
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      <div className="flex items-center justify-end gap-3">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white">
          {saving ? "Saving…" : "Save profile"}
        </button>
      </div>
    </form>
  );
}