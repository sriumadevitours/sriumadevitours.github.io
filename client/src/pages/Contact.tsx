import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { InquiryForm } from "@/components/InquiryForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SiWhatsapp, SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";

const contactInfo = [
  {
    icon: MapPin,
    title: "Office Address",
    content: [
      "Beside Sri Subramanya Swami Temple,",
      "Skandagiri, Padmarao Nagar,",
      "Secunderabad, Telangana",
    ],
  },
  {
    icon: Phone,
    title: "Phone Numbers",
    content: ["+91 95816 08979", "+91 97039 80123", "+91 97039 90123"],
    links: ["tel:+919581608979", "tel:+919703980123", "tel:+919703990123"],
  },
  {
    icon: Mail,
    title: "Email",
    content: ["sriumadevitravels1@gmail.com", "info@sriumadevitours.com"],
    links: [
      "mailto:sriumadevitravels1@gmail.com",
      "mailto:info@sriumadevitours.com",
    ],
  },
  {
    icon: Clock,
    title: "Working Hours",
    content: ["Monday - Saturday", "9:00 AM - 7:00 PM", "Sunday: By Appointment"],
  },
];

const socialLinks = [
  {
    icon: SiWhatsapp,
    name: "WhatsApp",
    href: "https://wa.me/919581608979",
    color: "text-green-600",
  },
  {
    icon: SiFacebook,
    name: "Facebook",
    href: "#",
    color: "text-blue-600",
  },
  {
    icon: SiInstagram,
    name: "Instagram",
    href: "#",
    color: "text-pink-600",
  },
  {
    icon: SiYoutube,
    name: "YouTube",
    href: "#",
    color: "text-red-600",
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">Contact Us</Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Begin Your Sacred Journey
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions about our pilgrimage tours? Our team is here to help you
              plan the perfect spiritual journey. Reach out to us today.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6 md:p-8">
                  <h2 className="font-serif text-2xl font-bold mb-6">Send Us a Message</h2>
                  <InquiryForm variant="inline" />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} data-testid={`card-contact-${info.title.toLowerCase().replace(/ /g, "-")}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-md bg-primary/10">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{info.title}</h3>
                        <div className="space-y-1">
                          {info.content.map((line, i) => (
                            <p key={i} className="text-sm text-muted-foreground">
                              {info.links ? (
                                <a
                                  href={info.links[i]}
                                  className="hover:text-primary transition-colors"
                                >
                                  {line}
                                </a>
                              ) : (
                                line
                              )}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-md bg-muted hover-elevate"
                        data-testid={`link-social-${social.name.toLowerCase()}`}
                      >
                        <social.icon className={`h-5 w-5 ${social.color}`} />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-bold mb-2">Our Location</h2>
            <p className="text-muted-foreground">
              Visit us at our office in Secunderabad
            </p>
          </div>
          <Card className="overflow-hidden">
            <div className="aspect-[21/9] bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Beside Sri Subramanya Swami Temple, Skandagiri,<br />
                  Padmarao Nagar, Secunderabad
                </p>
                <a
                  href="https://maps.google.com/?q=Skandagiri+Secunderabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline mt-2 inline-block"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">
            Prefer to Call?
          </h2>
          <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
            Our team is available Monday to Saturday, 9 AM to 7 PM. 
            We'd love to hear from you and help plan your pilgrimage.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+919581608979"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-md transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span className="font-medium">+91 95816 08979</span>
            </a>
            <a
              href="https://wa.me/919581608979"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md transition-colors"
            >
              <SiWhatsapp className="h-5 w-5" />
              <span className="font-medium">WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
