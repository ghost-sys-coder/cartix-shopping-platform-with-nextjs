import { AdminSidebar } from "@/components/admin/sidebar";
import {
  getAdminDisplayName,
  getCurrentAuthAdminState,
} from "@/lib/auth/admin";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId, isAdmin, sessionClaims } = await getCurrentAuthAdminState();
  if (!userId) redirect("/sign-in");
  if (!isAdmin) redirect("/");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
          <div>
            <h1 className="font-label font-semibold text-sm text-muted-foreground">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3 text-sm font-label text-muted-foreground">
            <span>{getAdminDisplayName(sessionClaims)}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
