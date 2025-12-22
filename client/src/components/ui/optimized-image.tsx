/**
 * OptimizedImage Component
 * Comprehensive image component with full SEO optimization
 * Implements: responsive images, lazy loading, schema markup, accessibility
 */

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  ImageSeoData,
  ImageLocation,
  generateImageObjectSchema,
  generateSrcset,
  generateSizes,
} from "@/lib/image-seo-utils";

// ==================== Types ====================

export interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  // Required
  src: string;
  alt: string;

  // Dimensions (required for CLS prevention)
  width: number;
  height: number;

  // SEO enhancements
  title?: string;
  caption?: string;
  captionLink?: {
    href: string;
    text: string;
  };
  ctaLink?: {
    href: string;
    text: string;
  };

  // Multilingual
  altHe?: string;
  altAr?: string;
  captionHe?: string;
  captionAr?: string;

  // Schema metadata
  contentLocation?: ImageLocation;
  datePublished?: string;
  author?: string;
  license?: string;
  pageUrl?: string;

  // Loading behavior
  priority?: boolean; // For LCP images (above the fold)
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';

  // Responsive images
  srcset?: string;
  sizes?: string;
  imageType?: 'hero' | 'featured' | 'content' | 'thumbnail' | 'gallery';

  // Fallback
  fallbackSrc?: string;

  // WebP support
  webpSrc?: string;

  // Display options
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto' | '4/3' | '3/2';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

  // Figure/Caption
  showCaption?: boolean;
  showSchema?: boolean;

  // Animation
  fadeIn?: boolean;
  blurPlaceholder?: boolean;

  // Container
  containerClassName?: string;
  figureClassName?: string;
  captionClassName?: string;
}

// ==================== Component ====================

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  title,
  caption,
  captionLink,
  ctaLink,
  altHe,
  altAr,
  captionHe,
  captionAr,
  contentLocation,
  datePublished,
  author = 'TripMD',
  license,
  pageUrl,
  priority = false,
  loading: loadingProp,
  fetchPriority: fetchPriorityProp,
  srcset: srcsetProp,
  sizes: sizesProp,
  imageType = 'content',
  fallbackSrc = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
  webpSrc,
  aspectRatio = 'auto',
  objectFit = 'cover',
  showCaption = false,
  showSchema = false,
  fadeIn = true,
  blurPlaceholder = true,
  className,
  containerClassName,
  figureClassName,
  captionClassName,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine loading strategy
  const loading = loadingProp || (priority ? 'eager' : 'lazy');
  const fetchPriority = fetchPriorityProp || (priority ? 'high' : 'auto');

  // Generate responsive attributes
  const srcset = srcsetProp || generateSrcset(src);
  const sizes = sizesProp || generateSizes(imageType);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Aspect ratio classes
  const aspectClasses: Record<string, string> = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
    auto: '',
  };

  // Generate schema data
  const seoData: ImageSeoData = {
    src: error ? fallbackSrc : src,
    alt,
    title,
    caption,
    width,
    height,
    altHe,
    altAr,
    captionHe,
    captionAr,
    contentLocation,
    datePublished,
    author,
    license,
  };

  const schemaMarkup = showSchema ? generateImageObjectSchema(seoData, pageUrl) : null;

  // Image element
  const imageElement = (
    <div
      ref={containerRef}
      className={cn(
        'overflow-hidden bg-muted relative',
        aspectClasses[aspectRatio],
        containerClassName
      )}
      style={aspectRatio === 'auto' ? { aspectRatio: `${width}/${height}` } : undefined}
    >
      {/* Blur placeholder */}
      {blurPlaceholder && !isLoaded && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse',
            fadeIn && 'transition-opacity duration-300'
          )}
        />
      )}

      {/* Picture element for format support */}
      {isInView && (
        <picture>
          {/* WebP source */}
          {webpSrc && (
            <source
              type="image/webp"
              srcSet={webpSrc}
              sizes={sizes}
            />
          )}

          {/* Auto WebP if URL supports it */}
          {!webpSrc && src.includes('unsplash.com') && (
            <source
              type="image/webp"
              srcSet={srcset.replace(/\.(jpg|jpeg|png)/gi, '.webp')}
              sizes={sizes}
            />
          )}

          {/* Main image */}
          <img
            ref={imgRef}
            src={error ? fallbackSrc : src}
            alt={alt}
            title={title}
            width={width}
            height={height}
            loading={loading}
            decoding="async"
            srcSet={!error ? srcset : undefined}
            sizes={!error ? sizes : undefined}
            onLoad={() => setIsLoaded(true)}
            onError={() => setError(true)}
            className={cn(
              'w-full h-full',
              `object-${objectFit}`,
              fadeIn && 'transition-opacity duration-300',
              fadeIn && (isLoaded ? 'opacity-100' : 'opacity-0'),
              className
            )}
            // @ts-expect-error fetchPriority is valid but not in types
            fetchpriority={fetchPriority}
            {...props}
          />
        </picture>
      )}
    </div>
  );

  // If no caption or schema needed, return just the image
  if (!showCaption && !showSchema) {
    return imageElement;
  }

  // Full figure with caption and schema
  return (
    <figure
      itemScope
      itemType="https://schema.org/ImageObject"
      className={figureClassName}
    >
      {imageElement}

      {/* Caption */}
      {showCaption && caption && (
        <figcaption
          itemProp="caption"
          className={cn(
            'mt-2 text-sm text-muted-foreground',
            captionClassName
          )}
        >
          {captionLink ? (
            <>
              {caption.split(captionLink.text)[0]}
              <a
                href={captionLink.href}
                itemProp="url"
                className="text-primary hover:underline"
              >
                {captionLink.text}
              </a>
              {caption.split(captionLink.text)[1]}
            </>
          ) : (
            caption
          )}
          {ctaLink && (
            <>
              {' '}
              <a
                href={ctaLink.href}
                className="text-primary hover:underline font-medium"
              >
                {ctaLink.text}
              </a>
            </>
          )}
        </figcaption>
      )}

      {/* Schema metadata (hidden) */}
      {showSchema && (
        <>
          <meta itemProp="contentUrl" content={src} />
          <meta itemProp="name" content={title || alt} />
          <meta itemProp="description" content={alt} />
          {datePublished && <meta itemProp="datePublished" content={datePublished} />}
          <meta itemProp="encodingFormat" content={src.includes('.webp') ? 'image/webp' : 'image/jpeg'} />
          <meta itemProp="width" content={String(width)} />
          <meta itemProp="height" content={String(height)} />

          {contentLocation && (
            <span itemProp="contentLocation" itemScope itemType="https://schema.org/Place">
              <meta itemProp="name" content={contentLocation.name} />
              {contentLocation.address && (
                <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  {contentLocation.address.addressLocality && (
                    <meta itemProp="addressLocality" content={contentLocation.address.addressLocality} />
                  )}
                  {contentLocation.address.addressRegion && (
                    <meta itemProp="addressRegion" content={contentLocation.address.addressRegion} />
                  )}
                  {contentLocation.address.addressCountry && (
                    <meta itemProp="addressCountry" content={contentLocation.address.addressCountry} />
                  )}
                </span>
              )}
              {contentLocation.geo && (
                <span itemProp="geo" itemScope itemType="https://schema.org/GeoCoordinates">
                  <meta itemProp="latitude" content={contentLocation.geo.latitude} />
                  <meta itemProp="longitude" content={contentLocation.geo.longitude} />
                </span>
              )}
            </span>
          )}
        </>
      )}

      {/* JSON-LD Schema */}
      {showSchema && schemaMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      )}
    </figure>
  );
}

// ==================== Hero Image Variant ====================

export interface HeroImageProps extends Omit<OptimizedImageProps, 'priority' | 'imageType'> {
  overlayOpacity?: number;
  children?: React.ReactNode;
  minHeight?: string;
}

export function HeroImage({
  overlayOpacity = 0.4,
  children,
  minHeight = '400px',
  className,
  containerClassName,
  ...props
}: HeroImageProps) {
  return (
    <div className={cn('relative', containerClassName)} style={{ minHeight }}>
      <OptimizedImage
        {...props}
        priority
        imageType="hero"
        className={cn('absolute inset-0', className)}
        containerClassName="absolute inset-0"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      {children && (
        <div className="relative z-10 h-full flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

// ==================== Gallery Image Variant ====================

export interface GalleryImageProps extends Omit<OptimizedImageProps, 'imageType'> {
  onClick?: () => void;
}

export function GalleryImage({
  onClick,
  className,
  ...props
}: GalleryImageProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={cn(
        onClick && 'cursor-pointer hover:opacity-90 transition-opacity',
        className
      )}
    >
      <OptimizedImage
        {...props}
        imageType="gallery"
      />
    </div>
  );
}

// ==================== Thumbnail Variant ====================

export function ThumbnailImage(props: Omit<OptimizedImageProps, 'imageType'>) {
  return (
    <OptimizedImage
      {...props}
      imageType="thumbnail"
      aspectRatio="video"
    />
  );
}

export default OptimizedImage;
