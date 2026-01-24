import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@shared/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="h-full" data-testid={`card-testimonial-${testimonial.id}`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <Quote className="h-8 w-8 text-primary/20" />
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < testimonial.rating
                    ? "text-accent fill-accent"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed italic">
          "{testimonial.review}"
        </p>

        <div className="flex items-center gap-3 pt-4 border-t">
          <Avatar className="h-12 w-12">
            <AvatarImage src={testimonial.photoUrl || undefined} alt={testimonial.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(testimonial.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">
              {testimonial.tourName && `${testimonial.tourName}`}
              {testimonial.year && ` • ${testimonial.year}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
