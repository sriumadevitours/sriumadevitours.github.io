import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, X } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Tours", href: "/tours" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold text-primary" data-testid="logo-text">
              Sri Umadevi Tours
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Divine Spiritual Journeys
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              data-testid={`nav-link-${item.name.toLowerCase().replace(" ", "-")}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/919581608979"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex"
          >
            <Button variant="outline" size="sm" className="gap-2" data-testid="button-whatsapp">
              <SiWhatsapp className="h-4 w-4 text-green-600" />
              <span className="hidden lg:inline">WhatsApp</span>
            </Button>
          </a>
          <a href="tel:+919581608979" className="hidden sm:flex">
            <Button size="sm" className="gap-2" data-testid="button-call">
              <Phone className="h-4 w-4" />
              <span className="hidden lg:inline">+91 95816 08979</span>
            </Button>
          </a>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex flex-col">
                  <span className="font-serif text-xl font-bold text-primary">
                    Sri Umadevi Tours
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Divine Spiritual Journeys
                  </span>
                </div>
                <nav className="flex flex-col gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-primary ${
                        location === item.href
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                      data-testid={`mobile-nav-link-${item.name.toLowerCase().replace(" ", "-")}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-3 pt-4 border-t">
                  <a
                    href="https://wa.me/919581608979"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full gap-2" data-testid="mobile-button-whatsapp">
                      <SiWhatsapp className="h-4 w-4 text-green-600" />
                      WhatsApp Inquiry
                    </Button>
                  </a>
                  <a href="tel:+919581608979">
                    <Button className="w-full gap-2" data-testid="mobile-button-call">
                      <Phone className="h-4 w-4" />
                      +91 95816 08979
                    </Button>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
