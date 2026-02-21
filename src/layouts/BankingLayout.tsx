import { Outlet } from "react-router-dom";
import BankingSidebar from "@/components/BankingSidebar";

export default function BankingLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <BankingSidebar />
      <main className="flex-1 p-6 lg:p-8 pt-16 lg:pt-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
