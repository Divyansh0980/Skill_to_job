import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { FileCode2, CheckCircle2, TrendingUp, ExternalLink } from "lucide-react";

export default async function CandidateDashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      <div className="flex flex-col space-y-2">
         <h1 className="text-3xl font-bold tracking-tight">Candidate Board</h1>
         <p className="text-muted-foreground">Manage your evidence portfolio, applications, and visibility.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Evidence Logs</h3>
            <FileCode2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground mt-1 text-orange-500 font-medium">1 pending verification</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Profile Strength</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-primary">84%</div>
          <p className="text-xs text-muted-foreground mt-1">Top 15% of candidates overall</p>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-all">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Verified Skills</h3>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground mt-1">Acquired across 4 projects</p>
        </div>
      </div>
      
      {/* Basic User Info Identity Card */}
      <h2 className="text-xl font-semibold mt-10 tracking-tight">Public Identity</h2>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden mt-4">
        <div className="p-8">
            <div className="flex items-center gap-6">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="Profile" className="h-20 w-20 rounded-full object-cover border-[3px] border-primary/20 shadow-sm" />
              ) : (
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold shadow-sm">
                   {user?.name?.charAt(0) || "C"}
                </div>
              )}
              <div className="space-y-1.5 flex-1">
                 <h4 className="text-2xl font-bold tracking-tight">{user?.name || "Unnamed Candidate"}</h4>
                 <p className="text-sm font-medium text-muted-foreground">{user?.email}</p>
                 <div className="flex items-center gap-2 pt-1">
                   <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-500 uppercase">
                     {user?.role}
                   </div>
                   <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      <ExternalLink className="h-3 w-3" /> GitHub Synced
                   </div>
                 </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
