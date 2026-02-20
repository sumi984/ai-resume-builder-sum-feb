import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, Target, Download, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Content Generation",
    description: "Generate professional summaries, bullet points, and project descriptions instantly with AI.",
  },
  {
    icon: Target,
    title: "ATS Score Optimization",
    description: "Get real-time ATS compatibility scores and keyword suggestions to beat applicant tracking systems.",
  },
  {
    icon: Download,
    title: "One-Click PDF Export",
    description: "Download your polished resume as a perfectly formatted A4 PDF, ready to submit anywhere.",
  },
];

const Landing = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />

    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(234_89%_64%/0.15),transparent)]" />
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
              <Sparkles className="h-4 w-4" /> Powered by AI
            </div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
              Build Your Perfect Resume{" "}
              <span className="gradient-text">with AI</span>
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground md:text-xl">
              Create ATS-optimized, professional resumes in minutes. AI-powered content generation, real-time scoring, and job tailoring — all free to start.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="gradient-primary border-0 px-8 text-base shadow-glow">
                <Link to="/auth?tab=signup">
                  Get Started Free <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to land the interview
          </h2>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="border-0 bg-background shadow-lg shadow-primary/5 transition-shadow hover:shadow-xl hover:shadow-primary/10">
                <CardContent className="flex flex-col items-start gap-4 p-8">
                  <div className="rounded-xl bg-accent p-3">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{f.title}</h3>
                  <p className="text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to build your best resume?</h2>
          <p className="mx-auto mb-8 max-w-md text-muted-foreground">
            Join thousands of job seekers using AI to craft winning resumes.
          </p>
          <Button size="lg" asChild className="gradient-primary border-0 px-8 shadow-glow">
            <Link to="/auth?tab=signup">Start Building Now <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default Landing;
