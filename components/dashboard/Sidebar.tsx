"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Briefcase, FileText, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const candidateLinks = [
  { name: "My Board", href: "/dashboard/candidate", icon: LayoutDashboard },
  { name: "My Profile", href: "/dashboard/candidate/profile", icon: FileText },
  { name: "Settings", href: "/dashboard/candidate/settings", icon: Settings },
];

const recruiterLinks = [
  { name: "Overview", href: "/dashboard/recruiter", icon: LayoutDashboard },
  { name: "Active Jobs", href: "/dashboard/recruiter/jobs", icon: Briefcase },
  { name: "Candidates", href: "/dashboard/recruiter/candidates", icon: Users },
  { name: "Settings", href: "/dashboard/recruiter/settings", icon: Settings },
];

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const links = role === "RECRUITER" ? recruiterLinks : candidateLinks;

  return (
    <aside className="hidden border-r bg-muted/40 lg:flex w-64 flex-col fixed inset-y-0 z-50">
      <div className="flex h-14 items-center border-b px-6 lg:h-[60px]">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <Briefcase className="h-5 w-5" />
          <span className="text-lg tracking-tight">SkillToJob</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
