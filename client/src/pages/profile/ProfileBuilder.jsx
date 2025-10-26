import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ProfileForm from "../../components/profile/ProfileForm";
import { createUserProfile, getUserProfile } from "../../lib/api"; // fallback below if missing

export default function ProfileBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        if (typeof getUserProfile === "function") {
          const p = await getUserProfile(user.$id);
          setInitial(p || {});
        } else {
          // no helper: attempt fetch
          const res = await fetch(`/api/profile/${user.$id}`);
          if (res.ok) setInitial(await res.json());
        }
      } catch {
        setInitial({});
      }
    };
    load();
  }, [user]);

  const handleSave = async (payload) => {
    if (!user) throw new Error("Not authenticated");
    setSaving(true);
    try {
      if (typeof createUserProfile === "function") {
        await createUserProfile(user.$id, payload);
      } else {
        await fetch(`/api/profile/${user.$id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      // after initial setup redirect to dashboard
      navigate("/dashboard", { replace: true });
    } finally {
      setSaving(false);
    }
  };

  if (initial === null) {
    return <div className="p-8 text-center text-gray-400">Loading profile builder…</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-black via-gray-900 to-black">
      <h2 className="text-2xl text-white mb-6">Complete your profile</h2>
      <ProfileForm initial={initial} onSave={handleSave} saving={saving} />
    </div>
  );
}