import Image from "next/image";
import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/mock-data/testimonials";
import { cn } from "@/lib/utils";

type TestimonialCardProps = {
  testimonial: Testimonial;
  className?: string;
};

export function TestimonialCard({
  testimonial,
  className,
}: TestimonialCardProps) {
  return (
    <article className={cn("card-elevated relative p-6", className)}>
      <Quote className="absolute top-5 left-5 size-8 text-brand-300/80" />
      <div className="relative pt-8">
        <div className="mb-4 flex gap-0.5">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star
              key={i}
              className="size-4 fill-amber-500 text-amber-500"
            />
          ))}
        </div>
        <p className="text-sm leading-relaxed text-neutral-600">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <div className="mt-6 flex items-center gap-3">
          <div className="relative size-11 overflow-hidden rounded-full">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          <div>
            <p className="font-heading text-sm font-bold text-neutral-900">
              {testimonial.name}
            </p>
            <p className="text-xs text-neutral-600">{testimonial.city}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
