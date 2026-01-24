import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TourCard } from "@/components/TourCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { InquiryForm } from "@/components/InquiryForm";
import { HeroCarousel } from "@/components/HeroCarousel";
import { KailashSectionCarousel } from "@/components/KailashSectionCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mountain,
  Users,
  Calendar,
  Award,
  Phone,
  ChevronRight,
  MapPin,
  Star,
  Shield,
  Heart,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import type { Tour, Testimonial } from "@shared/types";

const stats = [
  { label: "Happy Pilgrims", value: "5000+", icon: Users },
  { label: "Years Experience", value: "15+", icon: Award },
  { label: "Kailash Journeys", value: "500+", icon: Mountain },
  { label: "Satisfaction Rate", value: "100%", icon: Heart },
];

const whyChooseUs = [
  {
    icon: Shield,
    title: "Trusted & Experienced",
    description: "15+ years of organizing sacred pilgrimages with 5000+ satisfied yatris",
  },
  {
    icon: Users,
    title: "Expert Spiritual Guides",
    description: "Knowledgeable guides who understand the spiritual significance of each destination",
  },
  {
    icon: Heart,
    title: "Personalized Care",
    description: "24/7 support, medical assistance, and comfortable arrangements throughout",
  },
  {
    icon: Award,
    title: "Complete Packages",
    description: "All-inclusive tours with accommodation, meals, permits, and transportation",
  },
];

export default function Home() {
  const { data: tours, isLoading: toursLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials/featured"],
  });

  const featuredTours = tours?.filter((t) => t.isFeatured && t.isActive).slice(0, 6);

  return (
    <div className="flex flex-col">
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <HeroCarousel />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-accent text-accent-foreground" data-testid="badge-hero">
            Trusted by 5000+ Pilgrims
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
            Divine Spiritual Journeys to Sacred Destinations
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience the sacred beauty of Kailash Manasarovar, Chardham Yatra, and ancient temples 
            with expert guidance and devotion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button size="lg" className="gap-2 text-base" data-testid="button-explore-tours">
                Explore Sacred Tours
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="https://wa.me/919581608979" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-base bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                data-testid="button-whatsapp-hero"
              >
                <SiWhatsapp className="h-5 w-5" />
                WhatsApp Inquiry
              </Button>
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 pb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center border border-white/20"
                  data-testid={`stat-${stat.label.toLowerCase().replace(/ /g, "-")}`}
                >
                  <stat.icon className="h-6 w-6 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Sacred Pilgrimages</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Popular Tour Packages
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join us on transformative spiritual journeys to the most sacred destinations, 
              guided by devotion and years of experience
            </p>
          </div>

          {toursLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="aspect-[4/3]" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTours?.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/tours">
              <Button variant="outline" size="lg" className="gap-2" data-testid="button-view-all-tours">
                View All Tours
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Kailash Manasarovar</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                Once in a Lifetime Spiritual Experience
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Mount Kailash is the eternal dwelling place of Lord Shiva, where he resides with 
                Goddess Parvati in a state of eternal meditation. This is the spiritual center 
                of the universe for over a billion Hindus.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Mountain className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sacred Parikrama (Kora)</h4>
                    <p className="text-sm text-muted-foreground">
                      52-kilometer circumambulation representing one complete cycle of life
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Lake Manasarovar</h4>
                    <p className="text-sm text-muted-foreground">
                      Holy dip to wash away sins and purify the soul
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Dolma La Pass (5,630m)</h4>
                    <p className="text-sm text-muted-foreground">
                      Highest point of the sacred journey
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/tours/kailash-manasarovar">
                <Button size="lg" className="gap-2" data-testid="button-kailash-details">
                  Begin Your Sacred Journey
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <KailashSectionCarousel />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Why Choose Us</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Your Trusted Spiritual Journey Partners
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              With over 15 years of experience organizing sacred pilgrimages, we understand 
              that each journey is deeply personal and transformative
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="text-center hover-elevate" data-testid={`card-why-${index}`}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Blessed Testimonials
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from fellow devotees who have experienced divine transformation 
              through our spiritual journeys
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex items-center gap-3 pt-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials?.slice(0, 3).map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                Begin Your Sacred Journey Today
              </h2>
              <p className="text-primary-foreground/90 mb-8 leading-relaxed">
                Ready to embark on a life-changing spiritual adventure? Contact us today to plan 
                your divine pilgrimage. Our team is here to guide you every step of the way.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <a href="tel:+919581608979" className="text-primary-foreground/90 hover:underline">
                      +91 95816 08979
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Visit Us</p>
                    <p className="text-primary-foreground/90">
                      Beside Sri Subramanya Swami Temple, Skandagiri, Secunderabad
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-background rounded-lg p-6 text-foreground">
              <InquiryForm variant="inline" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
