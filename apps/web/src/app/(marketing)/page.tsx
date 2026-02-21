import Link from "next/link";
import type { Metadata } from "next";
import {
  BookOpen,
  GraduationCap,
  Trophy,
  Video,
  FileText,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimateIn } from "@/components/animate-in";

export const metadata: Metadata = {
  title: "Mathematics Point — Expert Math Coaching Online",
  description:
    "Expert mathematics coaching from foundation to competitive exams. Video lectures, practice problems, and personalized learning for Classes 6-12, JEE & Olympiad.",
};

const features = [
  {
    icon: Video,
    title: "Video Lectures",
    description:
      "High-quality recorded lectures covering every topic with clear explanations and examples.",
    accent: "bg-primary/10 text-primary",
  },
  {
    icon: FileText,
    title: "Study Materials",
    description:
      "Comprehensive PDF notes, formula sheets, and handwritten notes for quick revision.",
    accent: "bg-accent-warm/15 text-accent-warm-foreground",
  },
  {
    icon: BookOpen,
    title: "Practice Problems",
    description:
      "Daily practice problems and chapter-wise quizzes to strengthen your understanding.",
    accent: "bg-chart-2/10 text-chart-2",
  },
  {
    icon: GraduationCap,
    title: "Board & Competitive",
    description:
      "Structured courses for CBSE, ICSE board exams as well as JEE and Olympiad preparation.",
    accent: "bg-chart-3/10 text-chart-3",
  },
  {
    icon: Trophy,
    title: "Track Progress",
    description:
      "Monitor your learning journey with detailed progress tracking and performance analytics.",
    accent: "bg-accent-warm/15 text-accent-warm-foreground",
  },
  {
    icon: Users,
    title: "Doubt Support",
    description:
      "Get your doubts resolved quickly with dedicated support from experienced teachers.",
    accent: "bg-primary/10 text-primary",
  },
];

const stats = [
  { value: "500+", label: "Students Taught" },
  { value: "10+", label: "Years Experience" },
  { value: "50+", label: "Courses" },
  { value: "95%", label: "Success Rate" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    class: "Class 12 — JEE",
    text: "The structured approach and practice problems helped me crack JEE with a great score. Highly recommended!",
  },
  {
    name: "Rahul Verma",
    class: "Class 10 — CBSE",
    text: "Mathematics Point made math so much easier to understand. My board exam score improved from 75 to 95.",
  },
  {
    name: "Ananya Singh",
    class: "Class 11 — Olympiad",
    text: "The Olympiad preparation course is excellent. The problem-solving techniques taught here are invaluable.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-36">
        {/* Decorative gradient orb */}
        <div className="pointer-events-none absolute -top-40 right-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-radial opacity-20" />
        {/* Floating geometric shapes */}
        <div className="pointer-events-none absolute top-20 right-[15%] h-16 w-16 rounded-full border-2 border-primary/20 animate-float hidden md:block" />
        <div
          className="pointer-events-none absolute bottom-16 right-[25%] h-8 w-8 rotate-45 bg-accent-warm/20 animate-float hidden md:block"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="pointer-events-none absolute top-32 left-[8%] h-6 w-6 rounded-full bg-primary/10 animate-float hidden md:block"
          style={{ animationDelay: "4s" }}
        />

        <div className="container mx-auto px-4 text-center md:text-left">
          <AnimateIn animation="blur-in">
            <h1 className="mx-auto md:mx-0 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Master Mathematics with{" "}
              <span className="gradient-text">Expert Coaching</span>
            </h1>
          </AnimateIn>
          <AnimateIn animation="blur-in" delay={150}>
            <p className="mx-auto md:mx-0 mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              From foundation to competitive exams — video lectures, practice
              problems, and personalized learning for Classes 6-12, JEE &
              Olympiad.
            </p>
          </AnimateIn>
          <AnimateIn animation="blur-in" delay={300}>
            <div className="mt-10 flex items-center justify-center md:justify-start gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25"
                asChild
              >
                <Link href="/courses">Browse Courses</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-14">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="relative container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <AnimateIn key={stat.label} animation="scale-in" delay={i * 100}>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="h-12 w-1 rounded-full bg-gradient-to-b from-primary to-primary/40" />
                  <div>
                    <div className="text-3xl md:text-4xl font-bold tabular-nums text-foreground">
                      {stat.value}
                    </div>
                    <div className="mt-0.5 text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features — Bento Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <AnimateIn
            animation="fade-in-up"
            className="text-center md:text-left"
          >
            <h2 className="text-3xl font-bold md:text-4xl">
              Everything You Need to Excel
            </h2>
            <p className="mt-3 text-muted-foreground max-w-lg">
              A complete learning platform designed for mathematics students
            </p>
          </AnimateIn>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {features.map((feature, i) => {
              const isLarge = i < 2;
              return (
                <AnimateIn
                  key={feature.title}
                  animation="fade-in-up"
                  delay={i * 80}
                  className={isLarge ? "lg:row-span-1" : ""}
                >
                  <Card
                    className={`h-full transition-shadow hover:shadow-lg ${i === 0 ? "border-primary/20 shadow-md" : ""}`}
                  >
                    <CardContent className={`pt-6 ${isLarge ? "pb-8" : ""}`}>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.accent}`}
                      >
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimateIn animation="fade-in-up" className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              What Our Students Say
            </h2>
            <p className="mt-3 text-muted-foreground">
              Success stories from our students and parents
            </p>
          </AnimateIn>
          <div className="mt-12 grid gap-6 md:grid-cols-3 items-start">
            {testimonials.map((t, i) => {
              const animDir =
                i === 0
                  ? "slide-in-left"
                  : i === 2
                    ? "slide-in-right"
                    : "fade-in-up";
              const isMiddle = i === 1;
              return (
                <AnimateIn key={t.name} animation={animDir} delay={i * 120}>
                  <Card
                    className={`glass border-border/50 backdrop-blur-sm ${isMiddle ? "md:-mt-4 md:mb-4" : ""}`}
                  >
                    <CardContent className="relative pt-6">
                      {/* Decorative quotation mark */}
                      <svg
                        className="absolute -top-2 -left-1 h-16 w-16 text-primary/8"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <p className="relative text-sm text-muted-foreground italic leading-relaxed">
                        &ldquo;{t.text}&rdquo;
                      </p>
                      <div className="mt-5 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {t.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{t.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {t.class}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <AnimateIn animation="scale-in" className="container mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-gradient-end px-8 py-16 text-center text-primary-foreground shadow-xl shadow-primary/15">
            <h2 className="text-3xl font-bold md:text-4xl">
              Ready to Start Learning?
            </h2>
            <p className="mt-3 text-primary-foreground/80 max-w-md mx-auto">
              Join hundreds of students who are already excelling in
              mathematics.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                variant="secondary"
                className="shadow-lg"
                asChild
              >
                <Link href="/login">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </AnimateIn>
      </section>
    </>
  );
}
