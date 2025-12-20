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
            <h4 className="font-semibold text-foreground mb-4">{t('footer.explore')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={localePath("/attractions")} className="hover:text-foreground transition-colors">{t('nav.attractions')}</Link></li>
              <li><Link href={localePath("/hotels")} className="hover:text-foreground transition-colors">{t('nav.hotels')}</Link></li>
              <li><Link href={localePath("/articles")} className="hover:text-foreground transition-colors">{t('nav.articles')}</Link></li>
              <li><Link href={localePath("/districts")} className="hover:text-foreground transition-colors">{t('nav.districts')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('footer.categories')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={localePath("/dining")} className="hover:text-foreground transition-colors">{t('nav.dining')}</Link></li>
              <li><Link href={localePath("/events")} className="hover:text-foreground transition-colors">{t('nav.events')}</Link></li>
              <li><Link href={localePath("/dubai-real-estate")} className="hover:text-foreground transition-colors">{t('nav.realEstate')}</Link></li>
              <li><Link href={localePath("/search")} className="hover:text-foreground transition-colors">{t('nav.search')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('footer.tools')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={localePath("/tools-currency-converter")} className="hover:text-foreground transition-colors">{t('footer.currencyConverter')}</Link></li>
              <li><Link href={localePath("/tools-roi-calculator")} className="hover:text-foreground transition-colors">{t('footer.roiCalculator')}</Link></li>
              <li><Link href={localePath("/tools-mortgage-calculator")} className="hover:text-foreground transition-colors">{t('footer.mortgageCalculator')}</Link></li>
              <li><Link href={localePath("/glossary")} className="hover:text-foreground transition-colors">{t('footer.glossary')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('footer.aboutUs')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={localePath("/privacy")} className="hover:text-foreground transition-colors">{t('footer.privacyPolicy')}</Link></li>
              <li><Link href={localePath("/terms")} className="hover:text-foreground transition-colors">{t('footer.termsOfService')}</Link></li>
              <li><Link href={localePath("/contact")} className="hover:text-foreground transition-colors">{t('footer.contactUs')}</Link></li>
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
