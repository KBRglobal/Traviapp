import { Link } from "wouter";
import { useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default function TermsConditions() {
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
              <Link href="/articles" className="text-foreground/80 hover:text-primary font-medium transition-colors">Articles</Link>
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
              <Link href="/articles" className="py-2 px-4 hover:bg-muted rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Articles</Link>
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
            <h1 className="font-heading" data-testid="text-page-title">Terms & Conditions</h1>
            <p className="text-muted-foreground">Last updated: October 28, 2025</p>

            <div className="bg-muted/50 p-4 rounded-lg mb-8">
              <p className="font-medium mb-2">Important Notice</p>
              <p className="text-sm text-muted-foreground">These Terms are a legal agreement between you and the operator of TRAVI World. By accessing or using this Website, you agree to be bound by these Terms. If you do not agree, do not use the Website.</p>
            </div>

            <p><strong>Operator / Legal Entity:</strong> TRAVI World (the "Website", "we", "us", "our") is operated by TRAVI World LLC, a company based in Dubai, United Arab Emirates. You may contact us at <a href="mailto:traviquackson@gmail.com">traviquackson@gmail.com</a> for legal inquiries.</p>

            <h2 className="font-heading">1. Purpose & Scope of Use</h2>
            <p>TRAVI World is a digital media and editorial platform. We publish travel-related news, destination updates, guides, reviews, and curated outbound links to third-party providers (such as Booking.com, GetYourGuide, Viator, Skyscanner, and others). We do not sell any products or services directly and do not process bookings or payments. All third-party transactions are governed by the third party's terms.</p>
            <p>Use of the Website is permitted for personal, non-commercial purposes only and subject to these Terms, our Privacy Policy, and our Cookie Policy, which are incorporated by reference.</p>

            <h2 className="font-heading">2. Affiliate Disclosure & Third-Party Transactions</h2>
            <p>Some links on the Website are affiliate links. If you click an affiliate link and make a purchase or booking, we may earn a commission at no additional cost to you. We clearly disclose material connections and mark sponsored content, in line with the U.S. FTC Endorsement Guides and the EU Digital Services Act.</p>
            <p>All bookings, purchases, and customer service matters are handled exclusively by the relevant third-party provider. We are not a travel agent, booking service, payment processor, or travel provider. We do not control third-party services and are not responsible for their acts, omissions, or policies. Direct any inquiries, complaints, cancellations, or refund requests to the applicable provider.</p>

            <h2 className="font-heading">3. AI-Generated Content Disclaimer</h2>
            <p>We may create, edit, or enhance certain content using artificial intelligence (AI) tools. While we apply editorial review, AI-assisted content may contain inaccuracies, omissions, or time-sensitive information. Content is provided for general information only.</p>
            <p><strong>No Professional Advice:</strong> AI-assisted or human-written content on the Website does not constitute professional, legal, medical, financial, or individualized travel advice and must not be relied upon as a substitute for consultation with qualified professionals or verification with official sources. You are responsible for independently verifying critical details before making decisions.</p>

            <h2 className="font-heading">4. User Conduct & Prohibited Actions</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Website for unlawful, harmful, defamatory, obscene, or abusive purposes</li>
              <li>Infringe intellectual property or privacy rights of others</li>
              <li>Interfere with or disrupt the Website or its infrastructure</li>
              <li>Upload or transmit malware, spyware, or harmful code</li>
              <li>Engage in unauthorized scraping, data extraction, or bulk copying</li>
              <li>Use bots, crawlers, or automated tools (including AI agents) to access or reproduce content without our prior written consent</li>
              <li>Misrepresent your identity or affiliation</li>
              <li>Circumvent access controls, rate limits, or security features</li>
            </ul>
            <p>We may suspend or terminate access without notice for violations.</p>

            <h2 className="font-heading">5. Intellectual Property & Limited License</h2>
            <p>Unless otherwise credited, all original content on the Website—articles, text, layout, design, trademarks, logos, and compilations—is the intellectual property of TRAVI World or its licensors and is protected by law. Subject to these Terms, we grant you a limited, revocable, non-exclusive, non-transferable license to access and use the Website for personal, non-commercial purposes. Any other use (including reproduction, distribution, public display, or commercial exploitation) requires our prior written consent.</p>

            <h2 className="font-heading">6. Notice-and-Takedown (DMCA/Similar)</h2>
            <p>If you believe that content on the Website infringes your rights, please send a notice to our Designated Agent:</p>
            <ul>
              <li>Email: <a href="mailto:dmca@traviworld.com">dmca@traviworld.com</a></li>
            </ul>
            <p>Your notice should include: (a) identification of the work claimed to be infringed; (b) the specific URL/location of the allegedly infringing material; (c) your contact details; (d) a statement of good-faith belief; and (e) a statement under penalty of perjury that the information is accurate and that you are authorized to act.</p>

            <h2 className="font-heading">7. Accuracy, Availability & Disclaimers</h2>
            <p><strong>Information-Only; No Warranties:</strong> The Website and all content are provided "as is" and "as available", without warranties of any kind (express or implied), including but not limited to warranties of accuracy, completeness, timeliness, non-infringement, merchantability, or fitness for a particular purpose. We do not warrant that the Website will be uninterrupted, secure, or error-free, or that defects will be corrected.</p>
            <p><strong>Third-Party Content:</strong> We do not endorse and are not responsible for third-party websites, content, products, or services linked from the Website. Accessing third-party sites is at your own risk.</p>

            <h2 className="font-heading">8. Limitation of Liability & Force Majeure</h2>
            <p>To the maximum extent permitted by law, TRAVI World and its affiliates, officers, employees, and partners shall not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages, or for loss of profits, data, goodwill, or other intangible losses, arising out of or related to your use of (or inability to use) the Website or reliance on its content.</p>
            <p>To the extent any liability is not lawfully excludable, our aggregate liability for all claims relating to the Website shall not exceed USD 50.</p>
            <p><strong>Force Majeure:</strong> We shall not be liable for any delay or failure to perform due to events beyond our reasonable control, including acts of God, outages, cyberattacks, war, terrorism, strikes, labor disputes, governmental action, natural disasters, or failures of networks, utilities, or third-party services.</p>

            <h2 className="font-heading">9. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless TRAVI World and its affiliates, officers, employees, and partners from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or related to your breach of these Terms or your misuse of the Website.</p>

            <h2 className="font-heading">10. Privacy, Cookies & Data Protection</h2>
            <p>We describe our data practices in our <Link href="/privacy" className="text-primary">Privacy Policy</Link>. In summary:</p>
            <ul>
              <li>We collect limited personal data and non-personal browsing data to operate and improve the Website</li>
              <li>For users in jurisdictions requiring consent (e.g., EU/EEA), non-essential cookies are not set unless you provide prior consent</li>
              <li>We process personal data in accordance with applicable laws, including GDPR (EU) and UAE PDPL</li>
              <li>California residents may have rights under the CCPA/CPRA</li>
            </ul>

            <h2 className="font-heading">11. Accessibility Statement (WCAG 2.2)</h2>
            <p>We are committed to digital accessibility and aim to conform to WCAG 2.2 Level AA. If you experience difficulty accessing any content, contact <a href="mailto:accessibility@traviworld.com">accessibility@traviworld.com</a>. We will make reasonable efforts to provide the information in an alternative format and to remediate issues.</p>

            <h2 className="font-heading">12. Governing Law, Arbitration & Jurisdiction</h2>
            <p><strong>Governing Law:</strong> These Terms are governed by and construed in accordance with the laws of Gibraltar, without regard to conflict-of-law rules. Nothing in this clause limits mandatory consumer protections that cannot be waived under the law applicable to you.</p>
            <p><strong>Arbitration (ICC):</strong> Any dispute, controversy, or claim arising out of or relating to these Terms or the Website shall be finally settled by arbitration under the Rules of Arbitration of the International Chamber of Commerce (ICC) by one arbitrator. The seat of arbitration shall be London, United Kingdom. The language of the arbitration shall be English.</p>
            <p><strong>Class/Collective Action Waiver:</strong> To the fullest extent permitted by law, disputes shall be resolved on an individual basis and not as a class, collective, or representative action.</p>

            <h2 className="font-heading">13. Updates, Suspension & Termination</h2>
            <p>We may update these Terms from time to time. Changes take effect upon posting the updated Terms with a revised "Last updated" date. Your continued use of the Website after changes are posted constitutes acceptance of the updated Terms.</p>
            <p>We may suspend or terminate the Website or your access at any time, with or without notice, including for violations of these Terms, legal risk, or maintenance and security reasons.</p>

            <h2 className="font-heading">14. Age Requirement</h2>
            <p>This Website is intended for users aged 13 and older. If you are under 13, do not use the Website or provide any personal information. If we learn that we have collected personal data from a child under 13, we will delete it promptly upon notice.</p>

            <h2 className="font-heading">15. Miscellaneous</h2>
            <ul>
              <li><strong>Entire Agreement:</strong> These Terms (together with the Privacy Policy) constitute the entire agreement between you and us regarding the Website</li>
              <li><strong>Severability:</strong> If any provision is held invalid, the remaining provisions shall remain in full force</li>
              <li><strong>No Waiver:</strong> Our failure to enforce any right is not a waiver of such right</li>
              <li><strong>Assignment:</strong> You may not assign these Terms without our consent. We may assign our rights in connection with a merger, acquisition, or sale</li>
            </ul>

            <h2 className="font-heading">16. Contact & Compliance</h2>
            <ul>
              <li>General/Legal: <a href="mailto:traviquackson@gmail.com">traviquackson@gmail.com</a></li>
              <li>Privacy/Data Requests: <a href="mailto:privacy@traviworld.com">privacy@traviworld.com</a></li>
              <li>DMCA/Notice Agent: <a href="mailto:dmca@traviworld.com">dmca@traviworld.com</a></li>
              <li>Accessibility: <a href="mailto:accessibility@traviworld.com">accessibility@traviworld.com</a></li>
            </ul>

            <div className="bg-muted/50 p-4 rounded-lg mt-8">
              <p className="font-medium">Acknowledgement</p>
              <p className="text-sm text-muted-foreground">By using the Website, you confirm that you have read, understood, and agree to these Terms & Conditions.</p>
            </div>
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
              <Link href="/articles" className="hover:text-white transition-colors">Articles</Link>
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
