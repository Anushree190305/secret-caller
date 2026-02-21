import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  recipient_info: string | null;
  status: string;
  created_at: string;
}

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTransactions((data as unknown as Transaction[]) || []);
        setLoading(false);
      });
  }, [user]);

  const typeLabel: Record<string, string> = {
    deposit: "Deposit",
    withdraw: "Withdrawal",
    transfer_sent: "Transfer Sent",
    transfer_received: "Transfer Received",
  };

  const typeColor: Record<string, string> = {
    deposit: "text-[hsl(var(--success))]",
    withdraw: "text-destructive",
    transfer_sent: "text-destructive",
    transfer_received: "text-[hsl(var(--success))]",
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Transaction History</h1>
      <p className="text-muted-foreground mb-6">{transactions.length} transaction(s)</p>

      {transactions.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">No transactions yet</div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Type</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Details</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4">{new Date(t.created_at).toLocaleDateString()}</td>
                    <td className={`p-4 font-medium ${typeColor[t.type] || ""}`}>{typeLabel[t.type] || t.type}</td>
                    <td className="p-4 font-mono">${Number(t.amount).toFixed(2)}</td>
                    <td className="p-4 text-muted-foreground">{t.recipient_info || "—"}</td>
                    <td className="p-4"><span className="px-2 py-1 rounded-full text-xs bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]">{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
