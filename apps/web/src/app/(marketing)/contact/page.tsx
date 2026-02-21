"use client";

import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnimateIn } from "@/components/animate-in";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    detail: "contact@mathematicspoint.com",
  },
  {
    icon: Phone,
    title: "Phone / WhatsApp",
    detail: "+91 XXXXX XXXXX",
  },
  {
    icon: MapPin,
    title: "Location",
    detail: "Mathematics Point Coaching Center\nYour City, India",
  },
];

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you! We'll get back to you soon.");
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <AnimateIn
        animation="blur-in"
        className="text-center md:text-left max-w-xl"
      >
        <h1 className="text-4xl font-bold md:text-5xl">Contact Us</h1>
        <p className="mt-3 text-muted-foreground">
          Have a question? We&apos;d love to hear from you.
        </p>
      </AnimateIn>

      <div className="mt-12 grid gap-0 md:grid-cols-5 overflow-hidden rounded-2xl border shadow-lg">
        {/* Contact Form — left side */}
        <AnimateIn
          animation="slide-in-left"
          delay={100}
          className="md:col-span-3"
        >
          <div className="bg-card p-8 md:p-10 h-full">
            <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" required placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="How can we help you?"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary/80"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </AnimateIn>

        {/* Contact Info — right side with gradient */}
        <AnimateIn
          animation="slide-in-right"
          delay={200}
          className="md:col-span-2"
        >
          <div className="relative h-full bg-gradient-to-br from-primary to-gradient-end p-8 md:p-10 text-primary-foreground">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <div className="relative space-y-6">
              <h2 className="text-xl font-semibold">Get in touch</h2>
              <p className="text-sm text-primary-foreground/70">
                Reach out through any of these channels and we&apos;ll respond
                within 24 hours.
              </p>
              <div className="space-y-4 pt-2">
                {contactInfo.map((item) => (
                  <div
                    key={item.title}
                    className="glass rounded-xl p-4 flex items-start gap-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <p className="mt-1 text-sm text-primary-foreground/80 whitespace-pre-line">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}
