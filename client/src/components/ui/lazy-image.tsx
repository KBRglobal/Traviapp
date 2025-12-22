import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { generateSrcset, generateSizes } from "@/lib/image-seo-utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: "video" | "square" | "portrait" | "auto" | "4/3" | "3/2";
  // SEO enhancements
  title?: string;
  srcset?: string;
  sizes?: string;
  imageType?: 'hero' | 'featured' | 'content' | 'thumbnail' | 'gallery';
  // Performance
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  // Dimensions for CLS prevention
  width?: number;
  height?: number;
}

export function LazyImage({
  src,
  alt,
  fallback = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
  aspectRatio = "auto",
  title,
  srcset: srcsetProp,
  sizes: sizesProp,
  imageType = 'content',
  priority = false,
  fetchPriority: fetchPriorityProp,
  width,
  height,
  className,
  style,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate responsive attributes
  const srcset = srcsetProp || (src.includes('unsplash.com') ? generateSrcset(src) : undefined);
  const sizes = sizesProp || (srcset ? generateSizes(imageType) : undefined);
  const fetchPriority = fetchPriorityProp || (priority ? 'high' : 'auto');

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
      { rootMargin: "200px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const aspectClasses: Record<string, string> = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    "4/3": "aspect-[4/3]",
    "3/2": "aspect-[3/2]",
    auto: "",
  };

  // Calculate aspect ratio style for auto mode
  const containerStyle = aspectRatio === 'auto' && width && height
    ? { ...style, aspectRatio: `${width}/${height}` }
    : style;

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-hidden bg-muted relative",
        aspectClasses[aspectRatio],
        className
      )}
      style={containerStyle}
    >
      {/* Placeholder skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse" />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          ref={imgRef}
          src={error ? fallback : src}
          alt={alt}
          title={title}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          srcSet={!error && srcset ? srcset : undefined}
          sizes={!error && sizes ? sizes : undefined}
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          // @ts-expect-error fetchPriority is valid but not in types
          fetchpriority={fetchPriority}
          {...props}
        />
      )}
    </div>
  );
}

// SEO-enhanced variant with figure and caption support
interface SeoLazyImageProps extends LazyImageProps {
  caption?: string;
  captionClassName?: string;
  showFigure?: boolean;
}

export function SeoLazyImage({
  caption,
  captionClassName,
  showFigure = false,
  ...props
}: SeoLazyImageProps) {
  if (!showFigure && !caption) {
    return <LazyImage {...props} />;
  }

  return (
    <figure>
      <LazyImage {...props} />
      {caption && (
        <figcaption
          className={cn(
            "mt-2 text-sm text-muted-foreground",
            captionClassName
          )}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
