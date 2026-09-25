import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/shared/social-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/impact", label: "Impact" },
  { href: "/faq", label: "FAQ" },
];

const SOCIAL = [
  { icon: LinkedInIcon, label: "LinkedIn" },
  { icon: XIcon, label: "X" },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: FacebookIcon, label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="bg-brand-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <Logo variant="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Investing in Canada&apos;s Sustainable Future
          </p>
          <div className="mt-6 flex gap-2">
            {SOCIAL.map(({ icon: Icon, label }) => (
              <span
                key={label}
                title={`${label} — profile URL coming soon`}
                aria-label={`${label} (coming soon)`}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 text-white/80"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-wide uppercase">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 transition hover:text-brand-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-wide uppercase">
            Sectors
          </h3>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link
                href="/ev"
                className="text-sm text-white/70 transition hover:text-brand-300"
              >
                EV Charging
              </Link>
            </li>
            <li>
              <Link
                href="/agriculture"
                className="text-sm text-white/70 transition hover:text-brand-300"
              >
                Agriculture
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-sm text-white/70">
            <a
              href="mailto:hello@canadagreen.ca"
              className="transition hover:text-brand-300"
            >
              hello@canadagreen.ca
            </a>
          </p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold tracking-wide uppercase">
            Newsletter
          </h3>
          <p className="mt-4 text-sm text-white/70">
            Project updates and platform news — no spam.
          </p>
          <form className="mt-4 flex flex-col gap-2 sm:flex-row" action="#">
            <Input
              type="email"
              placeholder="Your email"
              className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
              aria-label="Email for newsletter"
            />
            <Button type="button" variant="primary" size="sm">
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <p>© 2026 Canada Green. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/terms" className="hover:text-white/80">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white/80">
              Privacy Policy
            </Link>
            <Link href="/risk-disclosure" className="hover:text-white/80">
              Risk Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
