import type { Metadata } from "next";
import { Award, BookOpen, GraduationCap, Heart } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { AnimateIn } from "@/components/animate-in";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Mathematics Point — our teaching philosophy, experience, and commitment to student success.",
};

const achievements = [
  {
    icon: GraduationCap,
    title: "10+ Years of Teaching",
    description:
      "Over a decade of experience teaching mathematics across all levels.",
    accent: "bg-primary/10 text-primary",
  },
  {
    icon: Award,
    title: "500+ Students Mentored",
    description:
      "Hundreds of students have achieved academic success through our coaching.",
    accent: "bg-accent-warm/15 text-accent-warm-foreground",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Curriculum",
    description:
      "From Class 6 foundation to JEE and Olympiad-level preparation.",
    accent: "bg-chart-2/10 text-chart-2",
  },
  {
    icon: Heart,
    title: "Student-First Approach",
    description:
      "Every student gets personalized attention and a clear path to mastery.",
    accent: "bg-chart-3/10 text-chart-3",
  },
];

function HeroAchievement() {
  const hero = achievements[0];
  const Icon = hero.icon;
  return (
    <Card className="bg-gradient-to-r from-primary to-gradient-end text-primary-foreground shadow-lg shadow-primary/15">
      <CardContent className="flex items-start gap-4 pt-6 pb-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{hero.title}</h3>
          <p className="mt-1 text-sm text-primary-foreground/80">
            {hero.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header — left-aligned with accent bar */}
      <AnimateIn animation="blur-in" className="max-w-3xl">
        <div className="flex gap-5">
          <div className="hidden md:block w-1.5 rounded-full bg-gradient-to-b from-primary to-accent-warm shrink-0" />
          <div>
            <h1 className="text-4xl font-bold md:text-5xl">
              About Mathematics Point
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Transforming mathematics education through passionate teaching and
              technology.
            </p>
          </div>
        </div>
      </AnimateIn>

      {/* Story */}
      <AnimateIn
        animation="fade-in-up"
        delay={100}
        className="mx-auto mt-16 max-w-3xl space-y-6 text-muted-foreground"
      >
        <h2 className="text-2xl font-bold text-foreground">Our Story</h2>
        <p>
          Mathematics Point started as a small offline coaching center with a
          simple belief: every student can excel at mathematics with the right
          guidance and practice. Over the years, we have built a reputation for
          clarity, consistency, and results.
        </p>
        {/* Pull quote */}
        <blockquote className="border-l-4 border-transparent bg-gradient-to-r from-primary/5 to-transparent pl-6 py-4 my-8 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-primary to-accent-warm" />
          <p className="text-lg italic text-foreground/80 font-medium">
            &ldquo;Every student can excel at mathematics with the right
            guidance and practice.&rdquo;
          </p>
        </blockquote>
        <p>
          Now, we are bringing the same trusted teaching experience online —
          making quality mathematics education accessible to students
          everywhere. Our platform combines the personal touch of classroom
          coaching with the convenience and power of digital learning.
        </p>
      </AnimateIn>

      {/* Philosophy */}
      <AnimateIn
        animation="fade-in-up"
        className="mx-auto mt-16 max-w-3xl space-y-6 text-muted-foreground"
      >
        <h2 className="text-2xl font-bold text-foreground">
          Teaching Philosophy
        </h2>
        <p>
          We believe that mathematics is not about memorizing formulas — it is
          about understanding concepts deeply and building problem-solving
          skills. Our teaching approach focuses on:
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>Building strong conceptual foundations before advancing</li>
          <li>Regular practice with progressively challenging problems</li>
          <li>Connecting topics to show the bigger picture</li>
          <li>Encouraging students to think, not just compute</li>
        </ul>
      </AnimateIn>

      {/* Achievements — Bento Grid */}
      <div className="mt-20">
        <AnimateIn animation="fade-in-up">
          <h2 className="text-2xl font-bold md:text-3xl">Why Choose Us</h2>
        </AnimateIn>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {/* Hero achievement — full width */}
          <AnimateIn animation="fade-in-up" delay={0} className="md:col-span-3">
            <HeroAchievement />
          </AnimateIn>
          {/* Remaining 3 achievements */}
          {achievements.slice(1).map((item, i) => (
            <AnimateIn
              key={item.title}
              animation="fade-in-up"
              delay={(i + 1) * 100}
            >
              <Card className="h-full">
                <CardContent className="flex items-start gap-4 pt-6">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.accent}`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimateIn>
          ))}
        </div>
      </div>
    </div>
  );
}
