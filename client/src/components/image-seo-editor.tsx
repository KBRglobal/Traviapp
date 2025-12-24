/**
 * ImageSeoEditor Component
 * INLINE editor for image SEO fields - shows errors and allows immediate fixing
 * ALL FIELDS ARE REQUIRED - no saving without complete SEO metadata
 */

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { GalleryImage } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Wand2,
  Image as ImageIcon,
  MapPin,
  X,
} from "lucide-react";

// ==================== Types ====================

interface ImageSeoValidation {
  isValid: boolean;
  missingFields: string[];
  warnings: string[];
  score: number;
}

interface ImageSeoEditorProps {
  image: GalleryImage;
  onChange: (image: GalleryImage) => void;
  onRemove?: () => void;
  index?: number;
  contentType?: string;
  contentTitle?: string;
  className?: string;
  showPreview?: boolean;
}

// ==================== Constants ====================

const DUBAI_AREAS = [
  'Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Jumeirah Beach',
  'Business Bay', 'DIFC', 'Al Barsha', 'Deira', 'Bur Dubai', 'JBR',
  'Dubai Creek', 'Al Fahidi', 'Zabeel', 'Dubai Hills', 'Arabian Ranches',
  'City Walk', 'Dubai Mall', 'Mall of the Emirates', 'Global Village',
  'Dubai Frame', 'Museum of the Future', 'Expo City',
];

const SEO_RULES = {
  alt: { min: 20, max: 125 },
  altHe: { min: 10, max: 125 },
  title: { min: 10, max: 100 },
  caption: { min: 30, max: 200 },
  keywords: { min: 3, max: 10 },
};

// ==================== Validation ====================

function validateImageSeo(image: GalleryImage): ImageSeoValidation {
  const missingFields: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // Alt text
  if (!image.alt || image.alt.trim().length === 0) {
    missingFields.push('alt');
    score -= 20;
  } else if (image.alt.length < SEO_RULES.alt.min) {
    missingFields.push('alt');
    score -= 15;
  }

  // Hebrew alt
  if (!image.altHe || image.altHe.trim().length === 0) {
    missingFields.push('altHe');
    score -= 15;
  }

  // Title
  if (!image.title || image.title.trim().length === 0) {
    missingFields.push('title');
    score -= 15;
  }

  // Caption
  if (!image.caption || image.caption.trim().length === 0) {
    missingFields.push('caption');
    score -= 10;
  }

  // Keywords
  if (!image.keywords || image.keywords.length < SEO_RULES.keywords.min) {
    missingFields.push('keywords');
    score -= 10;
  }

  // Location
  if (!image.contentLocation?.name) {
    missingFields.push('contentLocation');
    score -= 10;
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    warnings,
    score: Math.max(0, score),
  };
}

// ==================== Main Component ====================

export function ImageSeoEditor({
  image,
  onChange,
  onRemove,
  index = 0,
  contentType,
  contentTitle,
  className,
  showPreview = true,
}: ImageSeoEditorProps) {
  const [validation, setValidation] = useState<ImageSeoValidation>(() => validateImageSeo(image));
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Re-validate on image change
  useEffect(() => {
    setValidation(validateImageSeo(image));
  }, [image]);

  const handleFieldChange = useCallback((field: keyof GalleryImage, value: unknown) => {
    onChange({
      ...image,
      [field]: value,
    });
  }, [image, onChange]);

  const handleLocationChange = useCallback((field: string, value: string) => {
    onChange({
      ...image,
      contentLocation: {
        ...image.contentLocation,
        name: image.contentLocation?.name || '',
        [field]: value,
      },
    });
  }, [image, onChange]);

  // Auto-generate all missing fields with AI
  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    setGenerateError(null);

    try {
      const response = await fetch('/api/image-seo/enforce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: image.image,
          contentType: contentType || 'general',
          context: contentTitle,
          existingTags: {
            alt: image.alt,
            altHe: image.altHe,
            title: image.title,
            caption: image.caption,
            keywords: image.keywords,
            contentLocation: image.contentLocation,
          },
        }),
      });

      const data = await response.json();

      if (data.tags) {
        onChange({
          ...image,
          alt: data.tags.alt || image.alt,
          altHe: data.tags.altHe || image.altHe,
          altAr: data.tags.altAr || image.altAr,
          title: data.tags.title || image.title,
          caption: data.tags.caption || image.caption,
          captionHe: data.tags.captionHe || image.captionHe,
          keywords: data.tags.keywords || image.keywords,
          contentLocation: data.tags.contentLocation || image.contentLocation,
        });
      }
    } catch (error) {
      console.error('Auto-generate failed:', error);
      setGenerateError('Failed to generate SEO tags. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Field status helper
  const getFieldStatus = (field: string) => {
    const isMissing = validation.missingFields.some(f => f.startsWith(field));
    return isMissing ? 'error' : 'valid';
  };

  const fieldClass = (field: string) => {
    const status = getFieldStatus(field);
    return status === 'error'
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-green-500';
  };

  return (
    <Card className={cn(
      "relative overflow-hidden",
      !validation.isValid && "border-red-500 border-2",
      validation.isValid && "border-green-500",
      className
    )}>
      {/* Header with status */}
      <div className={cn(
        "px-4 py-2 flex items-center justify-between",
        validation.isValid ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"
      )}>
        <div className="flex items-center gap-3">
          {/* Preview */}
          {showPreview && (
            <div className="w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
              {image.image ? (
                <img src={image.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
          )}

          {/* Status */}
          <div>
            <div className="flex items-center gap-2">
              {validation.isValid ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span className="font-medium text-sm">
                תמונה {index + 1}
              </span>
              <Badge variant={validation.isValid ? "default" : "destructive"} className="text-xs">
                {validation.score}%
              </Badge>
            </div>
            {!validation.isValid && (
              <p className="text-xs text-red-600 mt-0.5">
                חסרים: {validation.missingFields.map(f => f.split(' ')[0]).join(', ')}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-generate button */}
          <Button
            type="button"
            size="sm"
            variant={validation.isValid ? "outline" : "default"}
            onClick={handleAutoGenerate}
            disabled={isGenerating}
            className="gap-1"
          >
            {isGenerating ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Wand2 className="w-3 h-3" />
            )}
            {validation.isValid ? 'שפר' : 'השלם אוטומטית'}
          </Button>

          {/* Remove button */}
          {onRemove && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onRemove}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {generateError && (
        <div className="px-4 py-2 bg-red-100 text-red-700 text-sm">
          {generateError}
        </div>
      )}

      <CardContent className="p-4 space-y-4">
        {/* Row 1: Alt text */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1">
              Alt Text (English)
              {getFieldStatus('alt') === 'error' && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <span className={cn(
              "text-xs",
              (image.alt?.length || 0) < SEO_RULES.alt.min && "text-red-500",
              (image.alt?.length || 0) >= SEO_RULES.alt.min && "text-green-600"
            )}>
              {image.alt?.length || 0}/{SEO_RULES.alt.min}-{SEO_RULES.alt.max}
            </span>
          </div>
          <Textarea
            value={image.alt || ''}
            onChange={(e) => handleFieldChange('alt', e.target.value)}
            placeholder="תאר מה מופיע בתמונה (20-125 תווים)"
            className={cn("resize-none h-16 text-sm", fieldClass('alt'))}
          />
        </div>

        {/* Row 2: Hebrew Alt + Title */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1">
                Alt Text (עברית)
                {getFieldStatus('altHe') === 'error' && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <span className="text-xs text-muted-foreground">
                {image.altHe?.length || 0}
              </span>
            </div>
            <Textarea
              value={image.altHe || ''}
              onChange={(e) => handleFieldChange('altHe', e.target.value)}
              placeholder="תיאור בעברית"
              dir="rtl"
              className={cn("resize-none h-16 text-sm", fieldClass('altHe'))}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1">
                Title (Tooltip)
                {getFieldStatus('title') === 'error' && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <span className="text-xs text-muted-foreground">
                {image.title?.length || 0}
              </span>
            </div>
            <Input
              value={image.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="Place Name - Detail | TripMD"
              className={cn("text-sm", fieldClass('title'))}
            />
          </div>
        </div>

        {/* Row 3: Caption */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1">
              Caption
              {getFieldStatus('caption') === 'error' && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <span className={cn(
              "text-xs",
              (image.caption?.length || 0) < SEO_RULES.caption.min && "text-red-500",
              (image.caption?.length || 0) >= SEO_RULES.caption.min && "text-green-600"
            )}>
              {image.caption?.length || 0}/{SEO_RULES.caption.min}-{SEO_RULES.caption.max}
            </span>
          </div>
          <Textarea
            value={image.caption || ''}
            onChange={(e) => handleFieldChange('caption', e.target.value)}
            placeholder="כיתוב מתחת לתמונה עם מידע שימושי (30-200 תווים)"
            className={cn("resize-none h-16 text-sm", fieldClass('caption'))}
          />
        </div>

        {/* Row 4: Keywords + Location */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1">
                Keywords
                {getFieldStatus('keywords') === 'error' && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <span className={cn(
                "text-xs",
                (image.keywords?.length || 0) < SEO_RULES.keywords.min && "text-red-500",
                (image.keywords?.length || 0) >= SEO_RULES.keywords.min && "text-green-600"
              )}>
                {image.keywords?.length || 0}/{SEO_RULES.keywords.min}+
              </span>
            </div>
            <Input
              value={image.keywords?.join(', ') || ''}
              onChange={(e) => handleFieldChange('keywords',
                e.target.value.split(',').map(k => k.trim()).filter(Boolean)
              )}
              placeholder="dubai, hotel, luxury (מופרד בפסיקים)"
              className={cn("text-sm", fieldClass('keywords'))}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Location
              {getFieldStatus('contentLocation') === 'error' && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Select
              value={image.contentLocation?.addressLocality || ''}
              onValueChange={(value) => {
                onChange({
                  ...image,
                  contentLocation: {
                    name: value,
                    addressLocality: value,
                    addressRegion: 'Dubai',
                    addressCountry: 'AE',
                  },
                });
              }}
            >
              <SelectTrigger className={cn("text-sm", fieldClass('contentLocation'))}>
                <SelectValue placeholder="בחר אזור" />
              </SelectTrigger>
              <SelectContent>
                {DUBAI_AREAS.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== Gallery Editor ====================

interface ImageGallerySeoEditorProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  contentType?: string;
  contentTitle?: string;
  className?: string;
}

export function ImageGallerySeoEditor({
  images,
  onChange,
  contentType,
  contentTitle,
  className,
}: ImageGallerySeoEditorProps) {
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  const allValid = images.every(img => validateImageSeo(img).isValid);
  const invalidCount = images.filter(img => !validateImageSeo(img).isValid).length;

  const handleImageChange = (index: number, updatedImage: GalleryImage) => {
    const newImages = [...images];
    newImages[index] = updatedImage;
    onChange(newImages);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleGenerateAll = async () => {
    setIsGeneratingAll(true);
    try {
      const updatedImages = await Promise.all(
        images.map(async (img) => {
          if (validateImageSeo(img).isValid) return img;

          const response = await fetch('/api/image-seo/enforce', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: img.image,
              contentType,
              context: contentTitle,
              existingTags: img,
            }),
          });

          const data = await response.json();
          if (data.tags) {
            return { ...img, ...data.tags };
          }
          return img;
        })
      );
      onChange(updatedImages);
    } catch (error) {
      console.error('Batch generate failed:', error);
    } finally {
      setIsGeneratingAll(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-3 rounded-lg",
        allValid ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"
      )}>
        <div className="flex items-center gap-2">
          {allValid ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span className="font-medium">
            {images.length} תמונות
          </span>
          {!allValid && (
            <Badge variant="destructive">
              {invalidCount} דורשות השלמה
            </Badge>
          )}
        </div>

        {!allValid && (
          <Button
            onClick={handleGenerateAll}
            disabled={isGeneratingAll}
            className="gap-1"
          >
            {isGeneratingAll ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            השלם הכל אוטומטית
          </Button>
        )}
      </div>

      {/* Image editors */}
      <div className="space-y-3">
        {images.map((image, index) => (
          <ImageSeoEditor
            key={`${image.image}-${index}`}
            image={image}
            onChange={(updated) => handleImageChange(index, updated)}
            onRemove={() => handleRemoveImage(index)}
            index={index}
            contentType={contentType}
            contentTitle={contentTitle}
          />
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          אין תמונות. הוסף תמונות כדי להמשיך.
        </div>
      )}
    </div>
  );
}

export default ImageSeoEditor;
