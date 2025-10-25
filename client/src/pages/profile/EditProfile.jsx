import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ProfileForm from "../../components/profile/ProfileForm";
import * as api from "../../lib/api"; // import all and check at runtime

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        if (typeof api.getUserProfile === "function") {
          const p = await api.getUserProfile(user.$id);
          setInitial(p || {});
        } else {
          const res = await fetch(`/api/profile/${user.$id}`);
          if (res.ok) setInitial(await res.json());
          else setInitial({});
        }
      } catch (e) {
        console.warn("Failed loading profile:", e);
        setInitial({});
      }
    };
    load();
  }, [user]);

  const handleSave = async (payload) => {
    if (!user) throw new Error("Not authenticated");
    setSaving(true);
    try {
      if (typeof api.updateUserProfile === "function") {
        await api.updateUserProfile(user.$id, payload);
      } else {
        await fetch(`/api/profile/${user.$id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      navigate(-1);
    } catch (err) {
      console.error("Failed saving profile:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  if (initial === null) return <div className="p-8 text-center text-gray-400">Loading profile…</div>;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-black via-gray-900 to-black">
      <h2 className="text-2xl text-white mb-6">Edit profile</h2>
      <ProfileForm initial={initial} onSave={handleSave} saving={saving} />
    </div>
  );
}