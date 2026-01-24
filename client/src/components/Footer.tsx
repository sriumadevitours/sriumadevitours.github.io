import { Link } from "wouter";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SiWhatsapp, SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";

const tours = [
  { name: "Kailash Manasarovar", href: "/tours/kailash-manasarovar" },
  { name: "Chardham Yatra", href: "/tours/chardham-yatra" },
  { name: "12 Jyotirlinga", href: "/tours/12-jyotirlinga" },
  { name: "Divya Desam Temples", href: "/tours/divya-desam" },
  { name: "Adi Kailash", href: "/tours/adi-kailash" },
];

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "All Tours", href: "/tours" },
  { name: "Contact Us", href: "/contact" },
  { name: "Terms & Conditions", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-primary">
                Sri Umadevi Tours
              </h3>
              <p className="text-sm text-muted-foreground">
                Divine Spiritual Journeys
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Begin your divine journey with Sri Umadevi Tours - trusted by thousands 
              of yatris every year for sacred pilgrimages across India and beyond.
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/919581608979"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md bg-muted hover-elevate"
                data-testid="footer-link-whatsapp"
              >
                <SiWhatsapp className="h-5 w-5 text-green-600" />
              </a>
              <a
                href="#"
                className="p-2 rounded-md bg-muted hover-elevate"
                data-testid="footer-link-facebook"
              >
                <SiFacebook className="h-5 w-5 text-blue-600" />
              </a>
              <a
                href="#"
                className="p-2 rounded-md bg-muted hover-elevate"
                data-testid="footer-link-instagram"
              >
                <SiInstagram className="h-5 w-5 text-pink-600" />
              </a>
              <a
                href="#"
                className="p-2 rounded-md bg-muted hover-elevate"
                data-testid="footer-link-youtube"
              >
                <SiYoutube className="h-5 w-5 text-red-600" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Popular Tours</h4>
            <ul className="space-y-2">
              {tours.map((tour) => (
                <li key={tour.name}>
                  <Link
                    href={tour.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`footer-tour-${tour.name.toLowerCase().replace(/ /g, "-")}`}
                  >
                    {tour.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/ /g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Beside Sri Subramanya Swami Temple, Skandagiri, Padmarao Nagar, Secunderabad
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <a href="tel:+919581608979" className="hover:text-primary">
                    +91 95816 08979
                  </a>
                  <br />
                  <a href="tel:+919703980123" className="hover:text-primary">
                    +91 97039 80123
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:sriumadevitravels1@gmail.com"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  sriumadevitravels1@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Mon - Sat: 9:00 AM - 7:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Sri Umadevi Tours and Travels. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">5000+ Happy Pilgrims</span>
              <span className="text-primary">|</span>
              <span className="text-sm text-muted-foreground">15+ Years Experience</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
