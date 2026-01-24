import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { InquiryForm } from "@/components/InquiryForm";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  Mountain,
  Calendar,
  Check,
  X,
  MapPin,
  ChevronLeft,
  Phone,
  FileText,
  AlertCircle,
  Star,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import type { Tour } from "@shared/types";

export default function TourDetail() {
  const { slug } = useParams<{ slug: string }>();

  // Fetch all tours and filter by slug for static site
  const { data: tours, isLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  const tour = tours?.find(t => t.slug === slug);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="relative h-[50vh]">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div>
              <Skeleton className="h-[400px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Tour Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The tour you're looking for doesn't exist or has been removed
          </p>
          <Link href="/tours">
            <Button data-testid="button-back-to-tours">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Tours
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={tour.imageUrl || "/images/hero/kailash-manasarovar-hero.jpg"}
          alt={tour.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <Link href="/tours">
            <Button variant="outline" size="sm" className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm" data-testid="button-back">
              <ChevronLeft className="h-4 w-4" />
              All Tours
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {tour.isPremium && (
                <Badge className="bg-accent text-accent-foreground">Premium</Badge>
              )}
              <Badge variant="secondary">{tour.category}</Badge>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {tour.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {tour.duration}
              </span>
              {tour.maxAltitude && (
                <span className="flex items-center gap-2">
                  <Mountain className="h-5 w-5" />
                  {tour.maxAltitude}
                </span>
              )}
              {tour.difficulty && (
                <span className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  {tour.difficulty}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {tour.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {tour.highlights.map((highlight, index) => (
                <Badge key={index} variant="outline" className="text-sm py-1.5">
                  {highlight}
                </Badge>
              ))}
            </div>

            <Tabs defaultValue="itinerary" className="w-full">
              <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
                <TabsTrigger value="itinerary" data-testid="tab-itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="inclusions" data-testid="tab-inclusions">Inclusions</TabsTrigger>
                <TabsTrigger value="departures" data-testid="tab-departures">Departures</TabsTrigger>
                <TabsTrigger value="requirements" data-testid="tab-requirements">Requirements</TabsTrigger>
              </TabsList>

              <TabsContent value="itinerary" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Day-by-Day Itinerary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0">
                    {(tour.itinerary as any[])?.map((day, index) => (
                      <div key={index} className="relative pl-8 pb-8 last:pb-0">
                        <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                          {day.day}
                        </div>
                        {index < (tour.itinerary as any[]).length - 1 && (
                          <div className="absolute left-[11px] top-6 w-0.5 h-[calc(100%-24px)] bg-border" />
                        )}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-lg">{day.title}</h4>
                          <p className="text-muted-foreground">{day.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {day.distance && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {day.distance}
                              </span>
                            )}
                            {day.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {day.duration}
                              </span>
                            )}
                            {day.meals && (
                              <span>Meals: {day.meals}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inclusions" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                        <Check className="h-5 w-5" />
                        Inclusions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {tour.inclusions.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                        <X className="h-5 w-5" />
                        Exclusions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {tour.exclusions.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <X className="h-4 w-4 text-destructive mt-1 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="departures" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Fixed Departure Dates 2026</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="mb-2">Departure dates available on inquiry</p>
                      <p className="text-sm mb-4">Contact us to check available dates and book your spot</p>
                      <a href="https://wa.me/919581608979" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2">
                          <SiWhatsapp className="h-4 w-4 text-green-600" />
                          Check Availability
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Requirements & Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tour.requirements && tour.requirements.length > 0 ? (
                      <ul className="space-y-3">
                        {tour.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <FileText className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <span className="text-muted-foreground">{req}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">
                        Contact us for specific requirements for this tour.
                      </p>
                    )}

                    {tour.cancellationPolicy && (
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-semibold mb-3">Cancellation Policy</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {tour.cancellationPolicy}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(tour.pricePerPerson)}
                    </span>
                    {tour.originalPrice && tour.originalPrice > tour.pricePerPerson && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(tour.originalPrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">per person</p>
                </div>

                <Separator className="my-6" />

                <InquiryForm selectedTour={tour} variant="inline" />

                <div className="mt-6 pt-6 border-t space-y-3">
                  <a
                    href={`https://wa.me/919581608979?text=Hi, I'm interested in ${tour.name}. Please share more details.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full gap-2" data-testid="button-whatsapp-tour">
                      <SiWhatsapp className="h-4 w-4 text-green-600" />
                      WhatsApp Inquiry
                    </Button>
                  </a>
                  <a href="tel:+919581608979" className="block">
                    <Button variant="ghost" className="w-full gap-2" data-testid="button-call-tour">
                      <Phone className="h-4 w-4" />
                      +91 95816 08979
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
