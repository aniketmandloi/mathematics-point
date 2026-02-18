import type { Metadata } from "next";
import { Award, BookOpen, GraduationCap, Heart } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

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
  },
  {
    icon: Award,
    title: "500+ Students Mentored",
    description:
      "Hundreds of students have achieved academic success through our coaching.",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Curriculum",
    description:
      "From Class 6 foundation to JEE and Olympiad-level preparation.",
  },
  {
    icon: Heart,
    title: "Student-First Approach",
    description:
      "Every student gets personalized attention and a clear path to mastery.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold">About Mathematics Point</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Transforming mathematics education through passionate teaching and
          technology.
        </p>
      </div>

      {/* Story */}
      <div className="mx-auto mt-16 max-w-3xl space-y-6 text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground">Our Story</h2>
        <p>
          Mathematics Point started as a small offline coaching center with a
          simple belief: every student can excel at mathematics with the right
          guidance and practice. Over the years, we have built a reputation for
          clarity, consistency, and results.
        </p>
        <p>
          Now, we are bringing the same trusted teaching experience online —
          making quality mathematics education accessible to students
          everywhere. Our platform combines the personal touch of classroom
          coaching with the convenience and power of digital learning.
        </p>
      </div>

      {/* Philosophy */}
      <div className="mx-auto mt-16 max-w-3xl space-y-6 text-muted-foreground">
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
      </div>

      {/* Achievements */}
      <div className="mt-16">
        <h2 className="text-center text-2xl font-bold">Why Choose Us</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {achievements.map((item) => (
            <Card key={item.title}>
              <CardContent className="flex items-start gap-4 pt-6">
                <item.icon className="h-8 w-8 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
