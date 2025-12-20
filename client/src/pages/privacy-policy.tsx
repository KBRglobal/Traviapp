import { Link } from "wouter";
import { useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function PrivacyPolicy() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b" data-testid="nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo variant="primary" height={28} />

            <div className="hidden md:flex items-center gap-8">
              <Link href="/hotels" className="text-foreground/80 hover:text-primary font-medium transition-colors">Hotels</Link>
              <Link href="/attractions" className="text-foreground/80 hover:text-primary font-medium transition-colors">Attractions</Link>
              <Link href="/articles" className="text-foreground/80 hover:text-primary font-medium transition-colors">News</Link>
            </div>

            <div className="flex items-center gap-3">
              <button 
                className="md:hidden p-2 text-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4">
            <div className="flex flex-col gap-2">
              <Link href="/hotels" className="py-2 px-4 hover:bg-muted rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Hotels</Link>
              <Link href="/attractions" className="py-2 px-4 hover:bg-muted rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Attractions</Link>
              <Link href="/articles" className="py-2 px-4 hover:bg-muted rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>News</Link>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6" data-testid="link-back-home">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <article className="prose prose-lg dark:prose-invert max-w-none">
            <h1 className="font-heading" data-testid="text-page-title">Privacy Policy</h1>
            <p className="text-muted-foreground">Effective Date: December 2024 | Version 2.0</p>

            <h2 className="font-heading">Quick Summary</h2>
            <p><strong>Your Privacy at a Glance:</strong></p>
            <ul>
              <li>We collect only what's necessary to provide our travel platform services</li>
              <li>Your data is never sold for money - we earn through transparent affiliate commissions</li>
              <li>You have full control: access, correct, delete, or export your data anytime</li>
              <li>We use industry-standard security including encryption and secure storage</li>
              <li>AI features are clearly labeled and no automated decisions affect you without human review</li>
              <li>International transfers are protected by legal safeguards (SCCs, adequacy decisions)</li>
            </ul>

            <h3 className="font-heading">Contact Us</h3>
            <ul>
              <li>Email: <a href="mailto:privacy@traviworld.com">privacy@traviworld.com</a></li>
              <li>Data Protection Officer: <a href="mailto:dpo@traviworld.com">dpo@traviworld.com</a></li>
              <li>Address: TRAVI World LLC, Dubai, United Arab Emirates</li>
            </ul>

            <h2 className="font-heading">1. About TRAVI World</h2>
            <p>TRAVI World LLC ("TRAVI," "we," "us," "our") operates the TRAVI World website (traviworld.com) and the TRAVI mobile application. We're a Dubai-based travel technology platform that provides AI-powered travel planning, curated content, and booking services through trusted affiliate partnerships.</p>
            
            <p><strong>Data Controller Information:</strong></p>
            <ul>
              <li>Company: TRAVI World LLC</li>
              <li>Registered in: Dubai, United Arab Emirates</li>
              <li>Data Protection Officer: Available at dpo@traviworld.com</li>
            </ul>

            <p>This Privacy Policy applies to all users of our services worldwide. We comply with:</p>
            <ul>
              <li>EU General Data Protection Regulation (GDPR)</li>
              <li>UAE Personal Data Protection Law (PDPL) - Federal Decree-Law No. 45 of 2021</li>
              <li>California Consumer Privacy Act/California Privacy Rights Act (CCPA/CPRA)</li>
              <li>Other applicable data protection laws</li>
            </ul>

            <h2 className="font-heading">2. Information We Collect</h2>
            <p>We collect information in three main ways:</p>

            <h3 className="font-heading">2.1 Information You Provide Directly</h3>
            <p><strong>Account Information:</strong> Name, email address, phone number (optional), password (stored in encrypted form), country of residence and preferred language.</p>
            <p><strong>Guest Mode Data:</strong> Temporary trip plans and preferences, chat interactions with TRAVI AI, automatically deleted within 7 days.</p>
            <p><strong>Profile and Preferences:</strong> Travel interests and styles, favorite destinations, dietary preferences or accessibility needs (optional), home city or frequent departure locations.</p>

            <h3 className="font-heading">2.2 Information Collected Automatically</h3>
            <p><strong>Device and Usage Information:</strong> IP address (anonymized where required by law), browser type and version, device identifiers, operating system, time zone and language settings, pages viewed and features used.</p>
            <p><strong>Location Data (only with your permission):</strong> Precise location for "near me" features, coarse location from IP address for relevant content. You can disable location access anytime in your device settings.</p>

            <h3 className="font-heading">2.3 Information from Third Parties</h3>
            <p><strong>Booking Partners:</strong> When you make a booking through our affiliate links, partners may share booking confirmation ID, transaction amount (for commission calculation), booking status (confirmed/cancelled), and general booking category. We do NOT receive your payment details or personal booking information.</p>

            <h2 className="font-heading">3. How We Use Your Information</h2>
            <h3 className="font-heading">3.1 Service Delivery</h3>
            <ul>
              <li>Provide access to our platform and features</li>
              <li>Manage your account and authenticate logins</li>
              <li>Process wallet transactions and rewards</li>
              <li>Save and manage your trip plans and favorites</li>
              <li>Enable AI-powered travel assistance</li>
            </ul>

            <h3 className="font-heading">3.2 Personalization</h3>
            <ul>
              <li>Recommend relevant destinations and content</li>
              <li>Customize search results based on your preferences</li>
              <li>Show nearby attractions when you permit location access</li>
              <li>Remember your language and display preferences</li>
            </ul>

            <h3 className="font-heading">3.3 Safety and Security</h3>
            <ul>
              <li>Verify identities for wallet features (KYC)</li>
              <li>Detect and prevent fraud, spam, and abuse</li>
              <li>Monitor for security threats and vulnerabilities</li>
              <li>Enforce our Terms of Service</li>
            </ul>

            <h2 className="font-heading">4. Legal Basis for Processing</h2>
            <p>We process your personal data only when we have a legal basis:</p>
            <ul>
              <li><strong>Consent</strong> - When you explicitly agree (marketing, non-essential cookies, sensitive data processing)</li>
              <li><strong>Contract</strong> - To fulfill our agreement with you (platform access, account management, transactions)</li>
              <li><strong>Legal Obligation</strong> - When required by law (KYC, tax records, government requests)</li>
              <li><strong>Legitimate Interests</strong> - Balanced against your rights (service improvement, security, analytics)</li>
            </ul>

            <h2 className="font-heading">5. How We Share Information</h2>
            <p>We never sell your personal data for money. We share information only in specific situations:</p>
            <ul>
              <li><strong>Service Providers:</strong> Cloud providers, email services, analytics, payment processors</li>
              <li><strong>Booking Partners:</strong> When you click affiliate links (we share only an anonymous affiliate ID)</li>
              <li><strong>Legal Disclosures:</strong> When required by law or to protect rights and safety</li>
              <li><strong>Business Transfers:</strong> If TRAVI undergoes a merger or acquisition (with notice to you)</li>
            </ul>

            <h2 className="font-heading">6. Data Security</h2>
            <p>We implement comprehensive security measures:</p>
            <ul>
              <li>HTTPS/TLS 1.3 for all data in transit</li>
              <li>AES-256 encryption for data at rest</li>
              <li>Multi-factor authentication for staff access</li>
              <li>Regular security audits and penetration testing</li>
              <li>Web Application Firewall and DDoS protection</li>
            </ul>

            <h2 className="font-heading">7. Your Privacy Rights</h2>
            <p>You have comprehensive rights over your personal data:</p>
            <ul>
              <li><strong>Right to Access:</strong> Request a copy of all data we have about you</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate information</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in machine-readable format</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent anytime</li>
            </ul>

            <h3 className="font-heading">How to Exercise Your Rights</h3>
            <ul>
              <li>Email: <a href="mailto:privacy@traviworld.com">privacy@traviworld.com</a></li>
              <li>Data Protection Officer: <a href="mailto:dpo@traviworld.com">dpo@traviworld.com</a></li>
              <li>Response Time: Within 30 days</li>
            </ul>

            <h2 className="font-heading">8. Cookies and Tracking</h2>
            <p>We use cookies for:</p>
            <ul>
              <li><strong>Strictly Necessary:</strong> Authentication, security, basic preferences</li>
              <li><strong>Functional:</strong> Language preferences, personalization settings</li>
              <li><strong>Analytics (with consent):</strong> Usage patterns, performance monitoring</li>
              <li><strong>Marketing (with consent):</strong> Ad conversion, retargeting</li>
            </ul>
            <p>You can manage cookie preferences through our cookie banner or your browser settings.</p>

            <h2 className="font-heading">9. AI and Automated Processing</h2>
            <p>TRAVI uses AI features including:</p>
            <ul>
              <li>AI Travel Assistant for planning and recommendations</li>
              <li>AI-assisted content generation (always human-reviewed)</li>
              <li>Fraud detection and content moderation</li>
            </ul>
            <p>All AI features are clearly labeled. We do not train AI on your personal data, and no automated decisions affect you without human review.</p>

            <h2 className="font-heading">10. Children's Privacy</h2>
            <p>Our services are not intended for users under 13 years of age. We do not knowingly collect personal data from children. If we learn we have collected data from a child under 13, we will delete it promptly.</p>

            <h2 className="font-heading">11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of material changes by email or through our platform. Continued use after changes constitutes acceptance of the updated policy.</p>

            <h2 className="font-heading">12. Contact Us</h2>
            <p>For privacy-related inquiries:</p>
            <ul>
              <li>Email: <a href="mailto:privacy@traviworld.com">privacy@traviworld.com</a></li>
              <li>Data Protection Officer: <a href="mailto:dpo@traviworld.com">dpo@traviworld.com</a></li>
              <li>Address: TRAVI World LLC, Dubai, United Arab Emirates</li>
            </ul>
          </article>
        </div>
      </main>

      <footer className="py-12 bg-[#1a1a2e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Logo variant="dark-bg" height={28} />
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm">
              <Link href="/hotels" className="hover:text-white transition-colors">Hotels</Link>
              <Link href="/attractions" className="hover:text-white transition-colors">Attractions</Link>
              <Link href="/articles" className="hover:text-white transition-colors">News</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
            <p className="text-white/40 text-sm">
              2024 Travi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
