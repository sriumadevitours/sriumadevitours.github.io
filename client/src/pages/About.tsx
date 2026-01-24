import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Users,
  Award,
  Mountain,
  Heart,
  Shield,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";

const stats = [
  { label: "Happy Pilgrims", value: "5000+", icon: Users },
  { label: "Years Experience", value: "15+", icon: Award },
  { label: "Kailash Journeys", value: "500+", icon: Mountain },
  { label: "Satisfaction Rate", value: "100%", icon: Heart },
];

const values = [
  {
    icon: Heart,
    title: "Devotion & Faith",
    description:
      "Every journey we organize is infused with deep spiritual understanding and reverence for the sacred destinations.",
  },
  {
    icon: Shield,
    title: "Safety & Comfort",
    description:
      "Your well-being is our priority. We ensure safe travels with proper medical support and comfortable accommodations.",
  },
  {
    icon: Users,
    title: "Personal Care",
    description:
      "We treat every pilgrim as family, providing 24/7 support and attention to individual needs throughout the journey.",
  },
  {
    icon: Award,
    title: "Experience & Expertise",
    description:
      "With over 15 years of experience, our expert guides ensure authentic and transformative spiritual experiences.",
  },
];

const team = [
  {
    name: "Sri Umadevi Tours Team",
    role: "Dedicated Pilgrimage Experts",
    description:
      "Our team consists of experienced travel professionals and spiritual guides who understand the profound significance of each pilgrimage. We work tirelessly to ensure your journey is comfortable, safe, and spiritually fulfilling.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">About Us</Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Your Trusted Spiritual Journey Partners
            </h1>
            <p className="text-lg text-muted-foreground">
              For over 15 years, Sri Umadevi Tours has been guiding thousands of devotees
              on transformative pilgrimages to the most sacred destinations in India and beyond.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center hover-elevate" data-testid={`stat-about-${stat.label.toLowerCase().replace(/ /g, "-")}`}>
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Our Story</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                A Journey of Faith & Service
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Sri Umadevi Tours was founded with a simple yet profound mission: to help
                  devotees experience the divine by organizing seamless pilgrimages to the
                  most sacred destinations.
                </p>
                <p>
                  What started as a small endeavor to help local pilgrims visit sacred sites
                  has grown into a trusted organization serving thousands of yatris every year.
                  Our journey from Secunderabad to organizing Kailash Manasarovar yatras has
                  been blessed with the grace of the divine and the trust of our pilgrims.
                </p>
                <p>
                  Located beside the sacred Sri Subramanya Swami Temple in Skandagiri, our
                  office is a testament to our spiritual roots. Every tour we organize is
                  infused with devotion, careful planning, and a deep understanding of what
                  makes a pilgrimage truly transformative.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/hero/kailash-manasarovar-hero-4.jpeg"
                alt="Mount Kailash - Sacred Himalayan Journey"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Our Values</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              What Guides Us
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our core values shape every journey we organize, ensuring that each
              pilgrimage is a sacred and memorable experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="hover-elevate" data-testid={`card-value-${index}`}>
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Our Mission</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Facilitating Divine Experiences
            </h2>
          </div>

          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8 text-center">
              <p className="text-xl text-muted-foreground italic leading-relaxed">
                "To facilitate authentic spiritual experiences that connect devotees with
                the divine, creating memories and transformations that last a lifetime.
                We believe that every pilgrimage should be a journey of the soul,
                where comfort meets devotion, and every step brings you closer to the divine."
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Visit Us</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Our Office
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Address</h4>
                    <p className="text-muted-foreground">
                      Beside Sri Subramanya Swami Temple,<br />
                      Skandagiri, Padmarao Nagar,<br />
                      Secunderabad, Telangana
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-muted-foreground">
                      <a href="tel:+919581608979" className="hover:text-primary">
                        +91 95816 08979
                      </a>
                      <br />
                      <a href="tel:+919703980123" className="hover:text-primary">
                        +91 97039 80123
                      </a>
                      <br />
                      <a href="tel:+919703990123" className="hover:text-primary">
                        +91 97039 90123
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-muted-foreground">
                      <a
                        href="mailto:sriumadevitravels1@gmail.com"
                        className="hover:text-primary"
                      >
                        sriumadevitravels1@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6 flex flex-col justify-center h-full">
                <h3 className="font-serif text-2xl font-bold mb-4">
                  Ready to Begin Your Sacred Journey?
                </h3>
                <p className="mb-6 opacity-90">
                  Contact us today to plan your divine pilgrimage. Our team is ready
                  to assist you every step of the way.
                </p>
                <Link href="/contact">
                  <Button variant="secondary" size="lg" className="gap-2" data-testid="button-contact-us">
                    Get in Touch
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
