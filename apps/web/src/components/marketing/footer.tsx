import Link from "next/link";

const footerLinks = {
  courses: [
    { href: "/courses?level=foundation", label: "Foundation (6-8)" },
    { href: "/courses?level=board", label: "Board Exams (9-12)" },
    { href: "/courses?level=competitive", label: "JEE Preparation" },
    { href: "/courses?level=olympiad", label: "Olympiad" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
} as const;

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                M
              </div>
              <span className="text-lg font-bold">Mathematics Point</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Expert mathematics coaching from foundation to competitive exams.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Courses</h3>
            <ul className="space-y-2">
              {footerLinks.courses.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Mathematics Point. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
