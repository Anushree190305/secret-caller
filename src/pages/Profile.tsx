import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { profile, loading, refetch } = useProfile();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Change password state
  const [newPassword, setNewPassword] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const startEditing = () => {
    setName(profile?.name || "");
    setPhone(profile?.phone || "");
    setEditing(true);
    setSuccess("");
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError("");
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ name, phone })
      .eq("user_id", user.id);
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("Profile updated");
      setEditing(false);
      refetch();
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { setPwError("Min 6 characters"); return; }
    setPwLoading(true);
    setPwError("");
    setPwSuccess("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwLoading(false);
    if (error) setPwError(error.message);
    else { setPwSuccess("Password updated"); setNewPassword(""); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
        {error && <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">{error}</div>}
        {success && <div className="bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/30 rounded-lg p-3 text-sm text-[hsl(var(--success))]">{success}</div>}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-muted-foreground">Name</span>
            {editing ? <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2 rounded border border-input bg-background text-foreground" />
              : <p className="font-medium">{profile?.name}</p>}
          </div>
          <div><span className="text-muted-foreground">Email</span><p className="font-medium">{profile?.email}</p></div>
          <div><span className="text-muted-foreground">Phone</span>
            {editing ? <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 p-2 rounded border border-input bg-background text-foreground" />
              : <p className="font-medium">{profile?.phone || "—"}</p>}
          </div>
          <div><span className="text-muted-foreground">Account Number</span><p className="font-medium font-mono">{profile?.account_number}</p></div>
        </div>

        {editing ? (
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setEditing(false)} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium">Cancel</button>
          </div>
        ) : (
          <button onClick={startEditing} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Edit Profile</button>
        )}
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h2 className="font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-3">
          {pwError && <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">{pwError}</div>}
          {pwSuccess && <div className="bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/30 rounded-lg p-3 text-sm text-[hsl(var(--success))]">{pwSuccess}</div>}
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          <button type="submit" disabled={pwLoading} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
            {pwLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
