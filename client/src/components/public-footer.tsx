import { Link } from "wouter";
import { Logo } from "@/components/logo";
import { useLocale } from "@/lib/i18n/LocaleRouter";

export function PublicFooter() {
  const { t, isRTL, localePath } = useLocale();

  return (
    <footer className="py-12 bg-card border-t" dir={isRTL ? "rtl" : "ltr"} data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-foreground mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={localePath("/attractions")} className="hover:text-foreground transition-colors">Attractions</Link></li>
              <li><Link href={localePath("/hotels")} className="hover:text-foreground transition-colors">Hotels</Link></li>
              <li><Link href={localePath("/articles")} className="hover:text-foreground transition-colors">Travel Guides</Link></li>
              <li><Link href={localePath("/districts")} className="hover:text-foreground transition-colors">Districts</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={localePath("/dining")} className="hover:text-foreground transition-colors">Dining</Link></li>
              <li><Link href={localePath("/transport")} className="hover:text-foreground transition-colors">Transport</Link></li>
              <li><Link href={localePath("/attractions?category=adventure")} className="hover:text-foreground transition-colors">Adventure</Link></li>
              <li><Link href={localePath("/attractions?category=culture")} className="hover:text-foreground transition-colors">Culture</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={localePath("/tools/currency")} className="hover:text-foreground transition-colors">Currency Converter</Link></li>
              <li><Link href={localePath("/tools/budget")} className="hover:text-foreground transition-colors">Budget Planner</Link></li>
              <li><Link href={localePath("/tools/events")} className="hover:text-foreground transition-colors">Events Calendar</Link></li>
              <li><Link href={localePath("/search")} className="hover:text-foreground transition-colors">Search</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">About</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={localePath("/privacy")} className="hover:text-foreground transition-colors">{t('footer.privacyPolicy')}</Link></li>
              <li><Link href={localePath("/terms")} className="hover:text-foreground transition-colors">{t('footer.termsOfService')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t">
          <Logo variant="primary" height={28} />
          <p className="text-sm text-muted-foreground">
            {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
