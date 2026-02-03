import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, Send } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useState } from "react";

interface InquiryFormProps {
  selectedTour?: { id: string; name: string };
  variant?: "card" | "inline";
}

const TOURS = [
  "Kailash Manasarovar Yatra",
  "Chardham Yatra",
  "12 Jyotirlinga Darshan",
  "Divya Desam",
  "Adi Kailash & Om Parvat",
  "Panch Kedar Yatra"
];

export function InquiryForm({ selectedTour, variant = "card" }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("https://formspree.io/f/xdkoqovk", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setIsSubmitted(true);
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate WhatsApp message with tour context
  const getWhatsAppUrl = () => {
    const baseMessage = selectedTour
      ? `Hello! I'm interested in the ${selectedTour.name}. Please provide more details.`
      : "Hello! I'm interested in your pilgrimage tours. Please provide more information.";
    return `https://wa.me/919581608979?text=${encodeURIComponent(baseMessage)}`;
  };

  const formContent = (
    <div className="space-y-6">
      {isSubmitted ? (
        <div className="text-center py-8 space-y-3">
          <div className="text-green-600 text-5xl">✓</div>
          <h3 className="text-lg font-semibold">Thank You!</h3>
          <p className="text-sm text-muted-foreground">
            We've received your inquiry and will contact you within 24 hours.
          </p>
        </div>
      ) : (
        <>
          <div className="text-center pb-2">
            <h3 className="text-lg font-semibold mb-2">
              {selectedTour ? `Inquire About ${selectedTour.name}` : "Plan Your Sacred Journey"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Fill the form below and we'll get back to you within 24 hours
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tour">Tour Interest *</Label>
              <Select name="tour" defaultValue={selectedTour?.name} required disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tour" />
                </SelectTrigger>
                <SelectContent>
                  {TOURS.map((tour) => (
                    <SelectItem key={tour} value={tour}>
                      {tour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="travelers">Number of Travelers *</Label>
              <Input
                id="travelers"
                name="travelers"
                type="number"
                min="1"
                placeholder="2"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Preferred Travel Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message / Special Requirements</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell us about any special requirements or questions..."
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2 h-12 text-base"
              disabled={isSubmitting}
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Sending..." : "Send Inquiry"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or contact us directly</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* WhatsApp */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="outline"
                className="w-full gap-2 h-11 text-sm border-green-200 hover:bg-green-50"
              >
                <SiWhatsapp className="h-4 w-4 text-green-600" />
                WhatsApp: +91 95816 08979
              </Button>
            </a>

            {/* Phone Call */}
            <a href="tel:+919581608979" className="block">
              <Button
                variant="outline"
                className="w-full gap-2 h-11 text-sm"
              >
                <Phone className="h-4 w-4" />
                Call: +91 95816 08979
              </Button>
            </a>

            {/* Email */}
            <a
              href={`mailto:sriumadevitours@gmail.com?subject=${encodeURIComponent(
                selectedTour ? `Inquiry: ${selectedTour.name}` : "Tour Inquiry"
              )}`}
              className="block"
            >
              <Button
                variant="outline"
                className="w-full gap-2 h-11 text-sm"
              >
                <Mail className="h-4 w-4" />
                sriumadevitours@gmail.com
              </Button>
            </a>
          </div>
        </>
      )}
    </div>
  );

  if (variant === "inline") {
    return formContent;
  }

  return (
    <Card data-testid="card-inquiry-form">
      <CardHeader>
        <CardTitle className="font-serif">Request Information</CardTitle>
        <CardDescription>
          Get in touch with our team for personalized tour planning
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
