import { useState } from "react";
import { useBanking } from "@/hooks/useBanking";
import { useProfile } from "@/hooks/useProfile";

export default function Transfer() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState("");
  const { performAction, loading, error } = useBanking();
  const { profile, refetch } = useProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    const result = await performAction("transfer", parseFloat(amount), recipient);
    if (result) {
      setSuccess(`Successfully transferred $${parseFloat(amount).toFixed(2)}`);
      setAmount("");
      setRecipient("");
      refetch();
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-1">Transfer Funds</h1>
      <p className="text-muted-foreground mb-6">Balance: ${Number(profile?.balance ?? 0).toFixed(2)}</p>
      <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-xl border border-border shadow-sm">
        {error && <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">{error}</div>}
        {success && <div className="bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/30 rounded-lg p-3 text-sm text-[hsl(var(--success))]">{success}</div>}
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Recipient (Email or Account Number)</label>
          <input type="text" placeholder="email@example.com or ACC..." value={recipient} onChange={(e) => setRecipient(e.target.value)}
            className="w-full p-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Amount ($)</label>
          <input type="number" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <button type="submit" disabled={loading || !amount || !recipient}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
          {loading ? "Processing..." : "Transfer"}
        </button>
      </form>
    </div>
  );
}
