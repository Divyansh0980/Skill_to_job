import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Briefcase, Users, Activity, ExternalLink } from "lucide-react";

export default async function RecruiterDashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      <div className="flex flex-col space-y-2">
         <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
         <p className="text-muted-foreground">Monitor your active hiring pipeline and candidate analytics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-2">
        {/* Metric Cards styled with explicit Shadcn design language */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Jobs</h3>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground mt-1 text-emerald-500 font-medium">+2 since last week</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Candidates Reviewed</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">148</div>
          <p className="text-xs text-muted-foreground mt-1 text-emerald-500 font-medium">+42 verified this month</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Hiring Velocity</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">+18%</div>
          <p className="text-xs text-muted-foreground mt-1">Platform-wide comparison</p>
        </div>
      </div>
      
      {/* Basic User Info Identity Card */}
      <h2 className="text-xl font-semibold mt-10 tracking-tight">Recruiter Identity</h2>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden mt-4">
        <div className="p-8">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold shadow-sm">
                 {user?.name?.charAt(0) || "R"}
              </div>
              <div className="space-y-1.5 flex-1">
                 <h4 className="text-2xl font-bold tracking-tight">{user?.name || "Unnamed Recruiter"}</h4>
                 <p className="text-sm font-medium text-muted-foreground">{user?.email}</p>
                 <div className="flex items-center gap-2 pt-1">
                   <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary uppercase">
                     {user?.role}
                   </div>
                   <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      <ExternalLink className="h-3 w-3" /> Edit Profile
                   </div>
                 </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
