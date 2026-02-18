import DashboardSidebar from "@/components/dashboard/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import UserMenu from "@/components/user-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-svh">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-end gap-2 border-b px-6">
          <ModeToggle />
          <UserMenu />
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
