import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TourCard } from "@/components/TourCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Mountain, MapPin, Clock, X } from "lucide-react";
import type { Tour } from "@shared/types";

const categories = [
  { value: "all", label: "All Tours" },
  { value: "himalayan", label: "Himalayan Yatras" },
  { value: "temple", label: "Temple Tours" },
  { value: "jyotirlinga", label: "Jyotirlinga Darshan" },
  { value: "south-india", label: "South India" },
];

const durations = [
  { value: "all", label: "Any Duration" },
  { value: "short", label: "1-7 Days" },
  { value: "medium", label: "8-14 Days" },
  { value: "long", label: "15+ Days" },
];

const priceRanges = [
  { value: "all", label: "Any Price" },
  { value: "budget", label: "Under ₹25,000" },
  { value: "mid", label: "₹25,000 - ₹50,000" },
  { value: "premium", label: "₹50,000+" },
];

export default function Tours() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");

  const { data: tours, isLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  const filteredTours = tours?.filter((tour) => {
    if (!tour.isActive) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !tour.name.toLowerCase().includes(query) &&
        !tour.shortDescription.toLowerCase().includes(query) &&
        !tour.category.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    if (selectedCategory !== "all" && tour.category !== selectedCategory) {
      return false;
    }

    if (selectedDuration !== "all") {
      const days = parseInt(tour.duration);
      if (selectedDuration === "short" && days > 7) return false;
      if (selectedDuration === "medium" && (days < 8 || days > 14)) return false;
      if (selectedDuration === "long" && days < 15) return false;
    }

    if (selectedPrice !== "all") {
      if (selectedPrice === "budget" && tour.pricePerPerson >= 25000) return false;
      if (selectedPrice === "mid" && (tour.pricePerPerson < 25000 || tour.pricePerPerson >= 50000)) return false;
      if (selectedPrice === "premium" && tour.pricePerPerson < 50000) return false;
    }

    return true;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDuration("all");
    setSelectedPrice("all");
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedDuration !== "all" || selectedPrice !== "all";

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">Sacred Pilgrimages</Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Explore Our Tour Packages
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Discover transformative spiritual journeys to the most sacred destinations in India and beyond
            </p>

            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tours by name or destination..."
                className="pl-12 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-tours"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-b sticky top-16 bg-background z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px]" data-testid="select-filter-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
              <SelectTrigger className="w-[140px]" data-testid="select-filter-duration">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((dur) => (
                  <SelectItem key={dur.value} value={dur.value}>
                    {dur.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPrice} onValueChange={setSelectedPrice}>
              <SelectTrigger className="w-[150px]" data-testid="select-filter-price">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((price) => (
                  <SelectItem key={price.value} value={price.value}>
                    {price.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2" data-testid="button-clear-filters">
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}

            <div className="ml-auto text-sm text-muted-foreground">
              {filteredTours?.length || 0} tours found
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="aspect-[4/3]" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTours?.length === 0 ? (
            <div className="text-center py-16">
              <Mountain className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Tours Found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any tours matching your criteria
              </p>
              <Button onClick={clearFilters} data-testid="button-reset-filters">
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours?.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
