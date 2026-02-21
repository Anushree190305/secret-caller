import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, List, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/deposit", icon: ArrowDownCircle, label: "Deposit" },
  { to: "/withdraw", icon: ArrowUpCircle, label: "Withdraw" },
  { to: "/transfer", icon: ArrowLeftRight, label: "Transfer" },
  { to: "/transactions", icon: List, label: "Transactions" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function BankingSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const sidebar = (
    <div className="flex flex-col h-full" style={{ background: "hsl(var(--sidebar-bg))", color: "hsl(var(--sidebar-foreground))" }}>
      <div className="p-5 border-b border-white/10">
        <h2 className="text-xl font-bold tracking-tight">🏦 SecureBank</h2>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-white/10"
              }`
            }>
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium w-full hover:bg-white/10 transition-colors text-destructive">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setOpen(!open)} className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card shadow-md border border-border">
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {open && <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static z-40 h-screen w-64 shrink-0 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        {sidebar}
      </aside>
    </>
  );
}
