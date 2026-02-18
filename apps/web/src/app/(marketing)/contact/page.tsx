"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // For now, just show a success toast. Backend contact form can be added later.
    setTimeout(() => {
      toast.success("Thank you! We'll get back to you soon.");
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-3 text-muted-foreground">
          Have a question? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="flex items-start gap-4 pt-6">
              <Mail className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  contact@mathematicspoint.com
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-4 pt-6">
              <Phone className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">Phone / WhatsApp</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  +91 XXXXX XXXXX
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-4 pt-6">
              <MapPin className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mathematics Point Coaching Center
                  <br />
                  Your City, India
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
