import { useState } from "react";
import { useBanking } from "@/hooks/useBanking";
import { useProfile } from "@/hooks/useProfile";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState("");
  const { performAction, loading, error } = useBanking();
  const { refetch } = useProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    const result = await performAction("deposit", parseFloat(amount));
    if (result) {
      setSuccess(`Successfully deposited $${parseFloat(amount).toFixed(2)}`);
      setAmount("");
      refetch();
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-1">Deposit Funds</h1>
      <p className="text-muted-foreground mb-6">Add money to your account</p>
      <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-xl border border-border shadow-sm">
        {error && <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">{error}</div>}
        {success && <div className="bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/30 rounded-lg p-3 text-sm text-[hsl(var(--success))]">{success}</div>}
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">Amount ($)</label>
          <input type="number" min="0.01" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <button type="submit" disabled={loading || !amount}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
          {loading ? "Processing..." : "Deposit"}
        </button>
      </form>
    </div>
  );
}
