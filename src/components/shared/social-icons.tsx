import { cn } from "@/lib/utils";

type IconProps = { className?: string };

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("size-4", className)} aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.64 4.75 6.07V23h-4v-6.6c0-1.57-.03-3.59-2.19-3.59-2.19 0-2.53 1.71-2.53 3.48V23h-4V8.5z" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("size-4", className)} aria-hidden>
      <path d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.57l-5.14-6.71L5.2 22H1.94l8.02-9.16L1.5 2h6.73l4.64 6.15L18.244 2zm-1.15 18h1.82L7.01 3.94H5.06L17.094 20z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("size-4", className)} aria-hidden>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.15 0-3.52.01-4.76.07-2.24.1-3.28 1.15-3.38 3.38-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.1 2.22 1.14 3.28 3.38 3.38 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c2.23-.1 3.28-1.16 3.38-3.38.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.1-2.23-1.15-3.28-3.38-3.38-1.24-.06-1.61-.07-4.76-.07zm0 3.06a4.98 4.98 0 110 9.96 4.98 4.98 0 010-9.96zm0 1.8a3.18 3.18 0 100 6.36 3.18 3.18 0 000-6.36zm6.24-.96a1.16 1.16 0 11-2.32 0 1.16 1.16 0 012.32 0z" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("size-4", className)} aria-hidden>
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.4V9.85c0-2.37 1.41-3.68 3.56-3.68 1.03 0 2.11.18 2.11.18v2.33h-1.19c-1.17 0-1.54.73-1.54 1.48v1.78h2.62l-.42 2.9h-2.2V22c4.78-.75 8.44-4.91 8.44-9.93z" />
    </svg>
  );
}
