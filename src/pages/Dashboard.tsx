import { useProfile } from "@/hooks/useProfile";
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react";

export default function Dashboard() {
  const { profile, loading } = useProfile();

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  const cards = [
    { label: "Current Balance", value: profile?.balance ?? 0, icon: DollarSign, color: "text-primary" },
    { label: "Total Deposited", value: profile?.total_deposited ?? 0, icon: TrendingUp, color: "text-[hsl(var(--success))]" },
    { label: "Total Withdrawn", value: profile?.total_withdrawn ?? 0, icon: TrendingDown, color: "text-destructive" },
    { label: "Account Number", value: profile?.account_number ?? "—", icon: CreditCard, color: "text-muted-foreground", isCurrency: false },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Welcome, {profile?.name || "User"} 👋</h1>
      <p className="text-muted-foreground mb-6">Here's your account overview</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold">
              {card.isCurrency === false ? card.value : `$${Number(card.value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
