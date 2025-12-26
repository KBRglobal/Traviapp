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
<h1>Privacy Policy</h1>
<p><strong>Effective Date:</strong> December 2024 | Version 2.0</p>

<h2>Quick Summary</h2>
<p><strong>Your Privacy at a Glance:</strong></p>
<ul>
  <li>We collect only what's necessary to provide our travel platform services</li>
  <li>Your data is never sold for money - we earn through transparent affiliate commissions</li>
  <li>You have full control: access, correct, delete, or export your data anytime</li>
  <li>We use industry-standard security including encryption and secure storage</li>
  <li>AI features are clearly labeled and no automated decisions affect you without human review</li>
  <li>International transfers are protected by legal safeguards (SCCs, adequacy decisions)</li>
</ul>

<h3>Contact Us</h3>
<ul>
  <li>Email: <a href="mailto:privacy@traviworld.com">privacy@traviworld.com</a></li>
  <li>Data Protection Officer: <a href="mailto:dpo@traviworld.com">dpo@traviworld.com</a></li>
  <li>Address: TRAVI World LLC, Dubai, United Arab Emirates</li>
</ul>

<h2>1. About TRAVI World</h2>
<p>TRAVI World LLC ("TRAVI", "we", "us", "our") operates the travel and hospitality platform accessible at travi.world and related mobile applications. We provide comprehensive travel guides, hotel recommendations, attraction information, and booking facilitation services focused on Dubai and the UAE.</p>

<h2>2. Information We Collect</h2>
<h3>2.1 Information You Provide</h3>
<ul>
  <li><strong>Account Information:</strong> Email address, name, profile picture (optional)</li>
  <li><strong>Preferences:</strong> Travel interests, saved destinations, favorite hotels</li>
  <li><strong>Communications:</strong> Messages sent through our contact forms, support requests</li>
  <li><strong>Newsletter Subscriptions:</strong> Email address and communication preferences</li>
</ul>

<h3>2.2 Automatically Collected Information</h3>
<ul>
  <li><strong>Usage Data:</strong> Pages visited, search queries, time spent on content</li>
  <li><strong>Device Information:</strong> Browser type, operating system, screen resolution</li>
  <li><strong>Location Data:</strong> Approximate location based on IP address (city/country level only)</li>
  <li><strong>Cookies and Similar Technologies:</strong> See our Cookie Policy section below</li>
</ul>

<h2>3. How We Use Your Information</h2>
<p>We use collected information to:</p>
<ul>
  <li>Provide personalized travel recommendations</li>
  <li>Process and facilitate bookings through our partner networks</li>
  <li>Send newsletters and promotional content (with your consent)</li>
  <li>Improve our services through analytics</li>
  <li>Ensure platform security and prevent fraud</li>
  <li>Comply with legal obligations</li>
</ul>

<h2>4. Your Rights</h2>
<p>You have the right to:</p>
<ul>
  <li><strong>Access:</strong> Request a copy of your personal data</li>
  <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
  <li><strong>Erasure:</strong> Request deletion of your data</li>
  <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
  <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
  <li><strong>Withdraw Consent:</strong> Withdraw consent at any time without affecting lawfulness of prior processing</li>
</ul>

<h2>5. Contact Information</h2>
<p>For privacy-related inquiries:</p>
<ul>
  <li><strong>Email:</strong> <a href="mailto:privacy@traviworld.com">privacy@traviworld.com</a></li>
  <li><strong>Data Protection Officer:</strong> <a href="mailto:dpo@traviworld.com">dpo@traviworld.com</a></li>
  <li><strong>Address:</strong> TRAVI World LLC, Dubai, United Arab Emirates</li>
</ul>

<p><em>Last updated: December 2024</em></p>
`;

export default function PrivacyPolicy() {
  const { locale } = useLocale();
  
  const { data: page, isLoading } = useQuery<StaticPage>({
    queryKey: ['/api/site-config/public/pages/privacy-policy'],
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
    return locale === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy';
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
