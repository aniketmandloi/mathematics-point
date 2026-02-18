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
  },
  {
    icon: FileText,
    title: "Study Materials",
    description:
      "Comprehensive PDF notes, formula sheets, and handwritten notes for quick revision.",
  },
  {
    icon: BookOpen,
    title: "Practice Problems",
    description:
      "Daily practice problems and chapter-wise quizzes to strengthen your understanding.",
  },
  {
    icon: GraduationCap,
    title: "Board & Competitive",
    description:
      "Structured courses for CBSE, ICSE board exams as well as JEE and Olympiad preparation.",
  },
  {
    icon: Trophy,
    title: "Track Progress",
    description:
      "Monitor your learning journey with detailed progress tracking and performance analytics.",
  },
  {
    icon: Users,
    title: "Doubt Support",
    description:
      "Get your doubts resolved quickly with dedicated support from experienced teachers.",
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
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Master Mathematics with{" "}
            <span className="text-primary">Expert Coaching</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            From foundation to competitive exams — video lectures, practice
            problems, and personalized learning for Classes 6-12, JEE &
            Olympiad.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/40 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Everything You Need to Excel</h2>
            <p className="mt-3 text-muted-foreground">
              A complete learning platform designed for mathematics students
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="pt-6">
                  <feature.icon className="h-10 w-10 text-primary" />
                  <h3 className="mt-4 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">What Our Students Say</h2>
            <p className="mt-3 text-muted-foreground">
              Success stories from our students and parents
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-4">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.class}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to Start Learning?</h2>
          <p className="mt-3 text-muted-foreground">
            Join hundreds of students who are already excelling in mathematics.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/login">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
