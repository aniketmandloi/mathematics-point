"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/contact", label: "Contact" },
] as const;

export default function MarketingNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-sm shadow-md shadow-primary/20">
            M
          </div>
          <span className="text-lg font-bold tracking-tight">Mathematics Point</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative text-sm font-medium transition-colors hover:text-primary ${
                pathname === href ? "text-primary" : "text-muted-foreground"
              } after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full after:bg-primary after:transition-all after:duration-300 ${
                pathname === href
                  ? "after:w-full"
                  : "after:w-0 hover:after:w-full"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ModeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 shadow-md shadow-primary/20" asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === href
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
