import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, ShieldCheck, Target } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center w-full relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-transparent blur-3xl rounded-full"></div>
        </div>

        {/* --- Hero Section --- */}
        <section className="relative w-full max-w-5xl mx-auto text-center py-24 md:py-36 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-sm font-medium bg-muted/50 text-muted-foreground backdrop-blur-md hover:bg-muted/80 transition-colors mb-8 cursor-default shadow-sm hover:shadow-md">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Introducing Skill to Job 1.0
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60">
            Hire Smarter. <br className="hidden md:block" /> Prove Skills. Get Hired.
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            The ultimate platform to bridge the gap between your current skillset and your dream career. Validate your expertise, find tailored learning tracks, and land the job you deserve.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button render={<Link href="/login" />} size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all shadow-lg hover:shadow-xl border border-primary/20">
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button render={<a href="#features" />} variant="outline" size="lg" className="h-12 px-8 text-base rounded-full border-border bg-background/50 hover:bg-accent text-foreground backdrop-blur-sm transition-colors shadow-sm">
              Explore Platform
            </Button>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section id="features" className="w-full max-w-6xl mx-auto py-24 scroll-mt-20 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools necessary to analyze your skills, build your portfolio, and connect with top employers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
            <FeatureCard
              icon={<Target className="w-7 h-7 text-primary" />}
              title="Skill Gap Analysis"
              description="Identify exactly what you need to learn to qualify for your target roles with our precise, data-driven matching algorithm."
            />
            <FeatureCard
              icon={<BookOpen className="w-7 h-7 text-primary" />}
              title="Curated Learning Tracks"
              description="Stop guessing what to learn next. Get personalized roadmaps featuring the highest-rated resources available online."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-7 h-7 text-primary" />}
              title="Verified Portfolios"
              description="Prove your capabilities through practical, real-world assessments and effortlessly stand out to premium employers."
            />
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="w-full max-w-5xl mx-auto py-24 px-4 md:px-0 mb-12 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-fuchsia-500/20 to-primary/20 blur-3xl rounded-[3rem] -z-10 opacity-50"></div>
          <Card className="bg-card/80 backdrop-blur-xl border border-border text-center p-10 md:p-16 shadow-2xl rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 p-32 bg-fuchsia-500/10 blur-[100px] rounded-full"></div>

            <CardHeader className="p-0 mb-8 relative z-10">
              <CardTitle className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-foreground">Ready to accelerate <br /> your career?</CardTitle>
              <CardDescription className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
                Join thousands of professionals who have already bridged their skill gaps and landed their dream roles today.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex justify-center mt-10 relative z-10">
              <Button render={<Link href="/login" />} size="lg" className="bg-foreground text-background hover:bg-foreground/90 hover:scale-105 active:scale-95 rounded-full h-14 px-10 font-bold text-base transition-all shadow-xl border border-border/50">
                Create Free Account
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
}

// --- Local Components ---

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-border bg-card/60 backdrop-blur-md shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-500 rounded-3xl overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader className="relative z-10 p-8 pb-4">
        <div className="mb-6 bg-muted border border-border w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors duration-500">
          {icon}
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 p-8 pt-0">
        <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-500">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
