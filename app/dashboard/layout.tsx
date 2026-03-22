import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[256px_1fr]">
      {/* Sidebar acts as the left 256px column */}
      <Sidebar role={user.role} />
      
      {/* Main content dynamically fills rest of space */}
      <div className="flex flex-col lg:ml-[256px] w-[100vw] lg:w-[calc(100vw-256px)]">
        <Header user={user} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-8 lg:p-8 bg-background overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
