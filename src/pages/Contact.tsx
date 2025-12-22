import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Contact = () => {
  // Google Maps embed URL for the store location
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.5!2d77.5!3d9.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zQ1A1VytHQ0Y!5e0!3m2!1sen!2sin!4v1234567890";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Find Our Store
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Visit us at KR Fireworks for the best quality crackers and fireworks in Tamil Nadu
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.0!2d77.55!3d9.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cf5d3e89f5a7%3A0x1234567890abcdef!2sMaraneri%2C%20Tamil%20Nadu%20626124!5e0!3m2!1sen!2sin!4v1702800000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="KR Fireworks Store Location"
            />
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border-primary/20 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <MapPin className="w-6 h-6" />
                  Store Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground font-semibold text-lg">K R Fireworks</p>
                <p className="text-muted-foreground">CP5W+GCF, Maraneri</p>
                <p className="text-muted-foreground">Tamil Nadu 626124</p>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=CP5W%2BGCF+Maraneri+Tamil+Nadu+626124"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions
                </a>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 hover:border-secondary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-secondary">
                  <Phone className="w-6 h-6" />
                  Contact Number
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href="tel:+919876543210" 
                  className="text-foreground font-semibold text-lg hover:text-primary transition-colors"
                >
                  +91 98765 43210
                </a>
                <p className="text-muted-foreground mt-1">Call us for orders & inquiries</p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 hover:border-accent/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-accent">
                  <Clock className="w-6 h-6" />
                  Store Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Saturday</span>
                    <span className="text-foreground font-medium">9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="text-foreground font-medium">10:00 AM - 6:00 PM</span>
                  </div>
                  <p className="text-primary text-sm mt-3 font-medium">
                    🎆 Extended hours during Diwali season!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <Mail className="w-6 h-6" />
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href="mailto:contact@krfireworks.com" 
                  className="text-foreground font-semibold hover:text-primary transition-colors"
                >
                  contact@krfireworks.com
                </a>
                <p className="text-muted-foreground mt-1">We'll respond within 24 hours</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
