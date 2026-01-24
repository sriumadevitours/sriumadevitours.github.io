import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, Mail, ExternalLink } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

// IMPORTANT: Replace this URL with your actual Google Form URL
// Create a Google Form with fields: Name, Email, Phone, Tour Interest, Number of Travelers, Preferred Date, Message
const GOOGLE_FORM_URL = "https://forms.gle/YOUR_FORM_ID";

interface InquiryFormProps {
  selectedTour?: { id: string; name: string };
  variant?: "card" | "inline";
}

export function InquiryForm({ selectedTour, variant = "card" }: InquiryFormProps) {
  // Build Google Form URL with pre-filled tour name if available
  const getGoogleFormUrl = () => {
    const baseUrl = GOOGLE_FORM_URL;
    if (selectedTour?.name) {
      // Add tour name as URL parameter for pre-filling (update entry ID based on your form)
      return `${baseUrl}?entry.TOUR_FIELD_ID=${encodeURIComponent(selectedTour.name)}`;
    }
    return baseUrl;
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
      <div className="text-center pb-4">
        <h3 className="text-lg font-semibold mb-2">
          {selectedTour ? `Inquire About ${selectedTour.name}` : "Plan Your Sacred Journey"}
        </h3>
        <p className="text-sm text-muted-foreground">
          Fill out our inquiry form or contact us directly via WhatsApp or phone
        </p>
      </div>

      {/* Primary CTA - Google Form */}
      <a
        href={getGoogleFormUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Button className="w-full gap-2 h-12 text-base" data-testid="button-google-form">
          <ExternalLink className="h-5 w-5" />
          Fill Inquiry Form
        </Button>
      </a>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or contact directly</span>
        </div>
      </div>

      {/* WhatsApp - Most popular in India */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Button
          variant="outline"
          className="w-full gap-2 h-12 text-base border-green-200 hover:bg-green-50 hover:border-green-300"
          data-testid="button-whatsapp-inquiry"
        >
          <SiWhatsapp className="h-5 w-5 text-green-600" />
          WhatsApp Inquiry
        </Button>
      </a>

      {/* Phone Call */}
      <a href="tel:+919581608979" className="block">
        <Button
          variant="outline"
          className="w-full gap-2 h-12 text-base"
          data-testid="button-call-inquiry"
        >
          <Phone className="h-5 w-5" />
          Call: +91 95816 08979
        </Button>
      </a>

      {/* Email */}
      <a
        href={`mailto:sriumadevitravels1@gmail.com?subject=${encodeURIComponent(
          selectedTour ? `Inquiry: ${selectedTour.name}` : "Tour Inquiry"
        )}`}
        className="block"
      >
        <Button
          variant="ghost"
          className="w-full gap-2 text-muted-foreground hover:text-foreground"
          data-testid="button-email-inquiry"
        >
          <Mail className="h-4 w-4" />
          sriumadevitravels1@gmail.com
        </Button>
      </a>
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
