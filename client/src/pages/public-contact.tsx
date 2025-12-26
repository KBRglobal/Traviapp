import { useState } from "react";
import { PageContainer } from "@/components/public-layout";
import { SEOHead } from "@/components/seo-head";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Clock, Send, Loader2, MessageSquare, Building2 } from "lucide-react";
import { SiInstagram, SiFacebook, SiX } from "react-icons/si";

export default function PublicContact() {
  const { t } = useLocale();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission (in production, this would POST to an API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@travi.ae",
      description: "Send us an email anytime"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Dubai, UAE",
      description: "United Arab Emirates"
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "24-48 hours",
      description: "We aim to respond quickly"
    }
  ];

  const socialLinks = [
    { href: "https://instagram.com/travidubai", icon: SiInstagram, label: "Instagram" },
    { href: "https://facebook.com/travidubai", icon: SiFacebook, label: "Facebook" },
    { href: "https://x.com/travidubai", icon: SiX, label: "X" },
  ];

  return (
    <PageContainer>
      <SEOHead
        title="Contact Us | Travi Dubai Travel Guide"
        description="Get in touch with the Travi team. We're here to help with your Dubai travel questions, suggestions, and feedback."
        keywords={["contact travi", "dubai travel help", "travel support", "dubai tourism"]}
      />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-travi-purple/10 via-background to-travi-pink/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <MessageSquare className="w-16 h-16 text-travi-purple mx-auto mb-6" />
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('contact.title') || "Contact Us"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('contact.subtitle') || "Have a question, suggestion, or just want to say hello? We'd love to hear from you!"}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Send us a message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        data-testid="input-contact-email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      data-testid="input-contact-subject"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us what's on your mind..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      data-testid="input-contact-message"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                    data-testid="button-contact-submit"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* Contact Details */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-travi-purple/10 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-travi-purple" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {info.title}
                          </div>
                          <div className="text-muted-foreground">
                            {info.value}
                          </div>
                          <div className="text-sm text-muted-foreground/70">
                            {info.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Follow Us
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Stay connected and get the latest Dubai travel updates.
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-travi-purple hover:text-white transition-all duration-300"
                        aria-label={social.label}
                        data-testid={`contact-social-${social.label.toLowerCase()}`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Business Inquiries */}
              <div className="bg-gradient-to-br from-travi-purple/10 to-travi-pink/10 rounded-lg border border-border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-5 h-5 text-travi-purple" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Business Inquiries
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Interested in partnerships, advertising, or collaboration? We'd love to hear from you.
                </p>
                <a 
                  href="mailto:partnerships@travi.ae"
                  className="text-sm text-travi-purple hover:underline"
                >
                  partnerships@travi.ae
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
