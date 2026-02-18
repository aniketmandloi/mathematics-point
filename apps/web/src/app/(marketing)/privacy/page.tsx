import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Mathematics Point",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">Last updated: 2025</p>
      <div className="mt-8 space-y-6 text-sm text-muted-foreground">
        <p>
          Mathematics Point is committed to protecting your personal
          information. This Privacy Policy explains how we collect, use, and
          safeguard your data when you use our platform.
        </p>
        <h2 className="text-lg font-semibold text-foreground">
          Information We Collect
        </h2>
        <p>
          We collect information you provide directly to us, such as your name,
          email address, and payment information when you register or purchase a
          course.
        </p>
        <h2 className="text-lg font-semibold text-foreground">
          How We Use Your Information
        </h2>
        <p>
          We use the information we collect to provide, maintain, and improve
          our services, process transactions, and communicate with you.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at support@mathematicspoint.in.
        </p>
      </div>
    </div>
  );
}
