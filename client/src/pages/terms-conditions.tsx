import { Link } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/lib/i18n/LocaleRouter";

interface StaticPage {
  id: string;
  slug: string;
  title: string;
  titleHe: string | null;
  content: string | null;
  contentHe: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isActive: boolean;
}

const fallbackContent = `
<h1>Terms & Conditions</h1>
<p><strong>Last updated:</strong> December 2024</p>

<div class="bg-muted/50 p-4 rounded-lg mb-8">
  <p class="font-medium mb-2">Important Notice</p>
  <p class="text-sm text-muted-foreground">These Terms are a legal agreement between you and the operator of TRAVI World. By accessing or using this Website, you agree to be bound by these Terms. If you do not agree, do not use the Website.</p>
</div>

<p><strong>Operator / Legal Entity:</strong> TRAVI World (the "Website", "we", "us", "our") is operated by TRAVI World LLC, a company based in Dubai, United Arab Emirates. You may contact us at <a href="mailto:legal@traviworld.com">legal@traviworld.com</a> for legal inquiries.</p>

<h2>1. Purpose & Scope of Use</h2>
<p>TRAVI World is a digital media and editorial platform. We publish travel-related news, destination updates, guides, reviews, and curated outbound links to third-party providers (such as Booking.com, GetYourGuide, Viator, Skyscanner, and others). We do not sell any products or services directly and do not process bookings or payments. All third-party transactions are governed by the third party's terms.</p>
<p>Use of the Website is permitted for personal, non-commercial purposes only and subject to these Terms, our Privacy Policy, and our Cookie Policy, which are incorporated by reference.</p>

<h2>2. Affiliate Disclosure & Third-Party Transactions</h2>
<p>Some links on the Website are affiliate links. If you click an affiliate link and make a purchase or booking, we may earn a commission at no additional cost to you. We clearly disclose material connections and mark sponsored content.</p>
<p>All bookings, purchases, and customer service matters are handled exclusively by the relevant third-party provider. We are not a travel agent, booking service, payment processor, or travel provider.</p>

<h2>3. AI-Generated Content Disclaimer</h2>
<p>We may create, edit, or enhance certain content using artificial intelligence (AI) tools. While we apply editorial review, AI-assisted content may contain inaccuracies, omissions, or time-sensitive information. Content is provided for general information only.</p>
<p><strong>No Professional Advice:</strong> AI-assisted or human-written content on the Website does not constitute professional, legal, medical, financial, or individualized travel advice.</p>

<h2>4. Intellectual Property</h2>
<p>All content on the Platform, including text, images, logos, and software, is owned by or licensed to TRAVI World and is protected by intellectual property laws.</p>

<h2>5. User Conduct</h2>
<p>You agree not to:</p>
<ul>
  <li>Use the Platform for any unlawful purpose</li>
  <li>Attempt to gain unauthorized access to our systems</li>
  <li>Transmit any malicious code or interfere with Platform functionality</li>
  <li>Scrape or copy content without permission</li>
  <li>Impersonate any person or entity</li>
</ul>

<h2>6. Limitation of Liability</h2>
<p>To the maximum extent permitted by law, TRAVI World shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform.</p>

<h2>7. Governing Law</h2>
<p>These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates.</p>

<h2>8. Contact Us</h2>
<p>For questions about these Terms, contact us at:</p>
<ul>
  <li><strong>Email:</strong> <a href="mailto:legal@traviworld.com">legal@traviworld.com</a></li>
  <li><strong>Address:</strong> TRAVI World LLC, Dubai, United Arab Emirates</li>
</ul>

<p><em>Last updated: December 2024</em></p>
`;

export default function TermsConditions() {
  const { locale } = useLocale();
  
  const { data: page, isLoading } = useQuery<StaticPage>({
    queryKey: ['/api/site-config/public/pages/terms-conditions'],
    retry: 1,
  });

  const getContent = () => {
    if (page) {
      if (locale === 'he' && page.contentHe) {
        return page.contentHe;
      }
      return page.content || fallbackContent;
    }
    return fallbackContent;
  };

  const getTitle = () => {
    if (page) {
      if (locale === 'he' && page.titleHe) {
        return page.titleHe;
      }
      return page.title;
    }
    return locale === 'he' ? 'תנאי שימוש' : 'Terms & Conditions';
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <PublicNav />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6" data-testid="link-back-home">
            <ArrowLeft className="w-4 h-4" />
            {locale === 'he' ? 'חזרה לדף הבית' : 'Back to Home'}
          </Link>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <article 
              className="prose prose-lg dark:prose-invert max-w-none"
              dir={locale === 'he' ? 'rtl' : 'ltr'}
            >
              <h1 className="font-heading" data-testid="text-page-title">{getTitle()}</h1>
              <div dangerouslySetInnerHTML={{ __html: getContent() }} />
            </article>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
