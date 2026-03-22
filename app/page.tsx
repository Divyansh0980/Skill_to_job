import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, ShieldCheck, Target } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center w-full">
        {/* --- Hero Section --- */}
        <section className="w-full max-w-4xl mx-auto text-center py-20 md:py-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100 mb-8 cursor-default">
            ✨ Introducing Skill to Job 1.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
            Hire Smarter. <br className="hidden md:block" /> Prove Skills. Get Hired.
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            The ultimate platform to bridge the gap between your current skillset and your dream career. Validate your expertise, find tailored learning tracks, and land the job you deserve.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" className="h-14 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all shadow-md hover:shadow-lg">
              <Link href="/login">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors">
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section id="features" className="w-full max-w-6xl mx-auto py-24 scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our platform provides all the tools necessary to analyze your skills, build your portfolio, and connect with top employers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-0">
            <FeatureCard 
              icon={<Target className="w-8 h-8 text-indigo-600" />}
              title="Skill Gap Analysis"
              description="Identify exactly what you need to learn to qualify for your target roles with our precise, data-driven matching algorithm."
            />
            <FeatureCard 
              icon={<BookOpen className="w-8 h-8 text-indigo-600" />}
              title="Curated Learning Tracks"
              description="Stop guessing what to learn next. Get personalized roadmaps featuring the highest-rated resources available online."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-indigo-600" />}
              title="Verified Portfolios"
              description="Prove your capabilities through practical, real-world assessments and effortlessly stand out to premium employers."
            />
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="w-full max-w-5xl mx-auto py-20 px-4 md:px-0 mb-12">
          <Card className="bg-slate-900 border-none text-white text-center p-8 md:p-14 shadow-2xl rounded-3xl">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-3xl md:text-5xl font-bold mb-4">Ready to accelerate your career?</CardTitle>
              <CardDescription className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
                Join thousands of professionals who have already bridged their skill gaps and landed their dream roles today.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex justify-center mt-8">
              <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full h-14 px-10 font-semibold text-base transition-colors shadow-lg">
                <Link href="/login">Create Free Account</Link>
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
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white rounded-2xl">
      <CardHeader>
        <div className="mb-4 bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center">
          {icon}
        </div>
        <CardTitle className="text-xl font-bold text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
