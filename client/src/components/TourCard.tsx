import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Mountain, Star, Users } from "lucide-react";
import type { Tour } from "@shared/types";

interface TourCardProps {
  tour: Tour;
}

export function TourCard({ tour }: TourCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="group overflow-hidden hover-elevate" data-testid={`card-tour-${tour.slug}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={tour.imageUrl || "/images/hero/kailash-manasarovar-hero.jpg"}
          alt={tour.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {tour.isPremium && (
            <Badge className="bg-accent text-accent-foreground" data-testid="badge-premium">
              Premium
            </Badge>
          )}
          {tour.isFeatured && (
            <Badge variant="secondary" data-testid="badge-featured">
              Featured
            </Badge>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-serif text-xl font-bold text-white mb-1 line-clamp-2">
            {tour.name}
          </h3>
          <div className="flex items-center gap-3 text-white/90 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {tour.duration}
            </span>
            {tour.maxAltitude && (
              <span className="flex items-center gap-1">
                <Mountain className="h-3.5 w-3.5" />
                {tour.maxAltitude}
              </span>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {tour.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2">
          {tour.highlights.slice(0, 3).map((highlight, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {highlight}
            </Badge>
          ))}
        </div>

        <div className="flex items-end justify-between pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Starting from</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(tour.pricePerPerson)}
              </span>
              {tour.originalPrice && tour.originalPrice > tour.pricePerPerson && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(tour.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">per person</p>
          </div>
          <Link href={`/tours/${tour.slug}`}>
            <Button data-testid={`button-view-tour-${tour.slug}`}>View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
