"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CreditCard,
  LayoutDashboard,
  Users,
  User,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const studentLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Browse Courses", icon: BookOpen },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
] as const;

const adminLinks = [
  {
    href: "/dashboard/admin/overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  { href: "/dashboard/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/dashboard/admin/students", label: "Students", icon: Users },
  { href: "/dashboard/profile", label: "Profile", icon: User },
] as const;

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const isAdmin = session?.user?.role === "admin";
  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-60 shrink-0 border-r bg-sidebar">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xs">
            M
          </div>
          <span className="font-semibold text-sm">Mathematics Point</span>
        </Link>
      </div>
      <nav className="space-y-1 p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
