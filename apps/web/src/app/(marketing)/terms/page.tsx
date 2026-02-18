import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Mathematics Point",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-4 text-muted-foreground">Last updated: 2025</p>
      <div className="mt-8 space-y-6 text-sm text-muted-foreground">
        <p>
          By accessing or using Mathematics Point, you agree to be bound by
          these Terms of Service. Please read these terms carefully before using
          our platform.
        </p>
        <h2 className="text-lg font-semibold text-foreground">
          Use of Service
        </h2>
        <p>
          You may use our services only as permitted by law and these terms. You
          must be at least 13 years old to use Mathematics Point.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Course Access</h2>
        <p>
          Upon purchasing a course, you are granted a non-exclusive,
          non-transferable license to access and view the course content for
          personal, non-commercial educational purposes.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Refund Policy</h2>
        <p>
          We offer refunds within 7 days of purchase if you have not completed
          more than 20% of the course content. Contact support for refund
          requests.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at
          support@mathematicspoint.in.
        </p>
      </div>
    </div>
  );
}
