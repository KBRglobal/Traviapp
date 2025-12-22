/**
 * ImageSeoEditor Component
 * Editor for managing image SEO fields including alt text, title, caption, and location
 */

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { GalleryImage } from "@shared/schema";
import {
  validateAltText,
  validateFilename,
  validateTitle,
  validateImageSeo,
  getAltTextTemplate,
  getTitleTemplate,
  generateImageTitle,
  ImageCategory,
  DUBAI_AREAS,
} from "@/lib/image-seo-utils";
import { analyzeImageSeoDetailed, ImageSeoScore } from "@/lib/seo-analyzer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  ChevronDown,
  Image as ImageIcon,
  MapPin,
  Wand2,
  Copy,
} from "lucide-react";

interface ImageSeoEditorProps {
  image: GalleryImage;
  onChange: (image: GalleryImage) => void;
  index?: number;
  primaryKeyword?: string;
  contentType?: string;
  className?: string;
}

export function ImageSeoEditor({
  image,
  onChange,
  index = 0,
  primaryKeyword,
  contentType,
  className,
}: ImageSeoEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [seoScore, setSeoScore] = useState<ImageSeoScore | null>(null);

  // Analyze SEO whenever image changes
  useEffect(() => {
    const score = analyzeImageSeoDetailed([{
      url: image.image,
      alt: image.alt,
      title: image.title,
      width: image.width,
      height: image.height,
      caption: image.caption,
    }], primaryKeyword);
    setSeoScore(score);
  }, [image, primaryKeyword]);

  const handleFieldChange = (field: keyof GalleryImage, value: unknown) => {
    onChange({
      ...image,
      [field]: value,
    });
  };

  const handleLocationChange = (field: string, value: string) => {
    onChange({
      ...image,
      contentLocation: {
        ...image.contentLocation,
        name: image.contentLocation?.name || '',
        [field]: value,
      },
    });
  };

  const generateSuggestedAlt = () => {
    const filename = image.image.split('/').pop() || '';
    // Extract keywords from filename
    const words = filename
      .replace(/\.[^.]+$/, '') // Remove extension
      .replace(/[-_]/g, ' ') // Replace separators with spaces
      .split(' ')
      .filter(w => w.length > 2);

    const suggestion = words.join(' ') + (image.contentLocation?.addressLocality
      ? ` in ${image.contentLocation.addressLocality}`
      : ' in Dubai');

    handleFieldChange('alt', suggestion.charAt(0).toUpperCase() + suggestion.slice(1));
  };

  const generateSuggestedTitle = () => {
    const placeName = image.contentLocation?.name || 'Dubai Location';
    const title = generateImageTitle(placeName, undefined, 'TripMD');
    handleFieldChange('title', title);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-300';
    if (score >= 60) return 'bg-yellow-100 border-yellow-300';
    if (score >= 40) return 'bg-orange-100 border-orange-300';
    return 'bg-red-100 border-red-300';
  };

  return (
    <Card className={cn("relative", className)}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                  {image.image ? (
                    <img
                      src={image.image}
                      alt={image.alt || 'Preview'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">
                    Image {index + 1}
                    {image.alt && (
                      <span className="ml-2 font-normal text-muted-foreground truncate max-w-[200px] inline-block align-bottom">
                        - {image.alt}
                      </span>
                    )}
                  </CardTitle>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {seoScore && (
                  <Badge
                    variant="outline"
                    className={cn("font-bold", getScoreBgColor(seoScore.score))}
                  >
                    <span className={getScoreColor(seoScore.score)}>
                      SEO: {seoScore.score}%
                    </span>
                  </Badge>
                )}
                <ChevronDown
                  className={cn(
                    "w-5 h-5 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {/* SEO Issues Summary */}
            {seoScore && seoScore.issues.length > 0 && (
              <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium">SEO Analysis</h4>
                <div className="space-y-1">
                  {seoScore.issues.slice(0, 5).map((issue, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex items-start gap-2 text-xs",
                        issue.type === 'error' && 'text-red-600',
                        issue.type === 'warning' && 'text-yellow-600',
                        issue.type === 'info' && 'text-blue-600',
                        issue.type === 'success' && 'text-green-600'
                      )}
                    >
                      {issue.type === 'error' && <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                      {issue.type === 'warning' && <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                      {issue.type === 'info' && <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                      {issue.type === 'success' && <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alt Text */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`alt-${index}`}>Alt Text *</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={generateSuggestedAlt}
                  className="h-7 text-xs"
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  Generate
                </Button>
              </div>
              <Textarea
                id={`alt-${index}`}
                value={image.alt || ''}
                onChange={(e) => handleFieldChange('alt', e.target.value)}
                placeholder="Describe what is shown in the image (50-125 chars recommended)"
                className="resize-none"
                rows={2}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Descriptive text for accessibility and SEO</span>
                <span className={cn(
                  image.alt && image.alt.length > 125 && 'text-yellow-600',
                  image.alt && image.alt.length < 20 && 'text-yellow-600'
                )}>
                  {image.alt?.length || 0}/125 chars
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`title-${index}`}>Title (Tooltip)</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={generateSuggestedTitle}
                  className="h-7 text-xs"
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  Generate
                </Button>
              </div>
              <Input
                id={`title-${index}`}
                value={image.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Place Name - Interesting Fact | TripMD"
              />
              <p className="text-xs text-muted-foreground">
                Shows on hover. Format: "Place - Fact | Brand"
              </p>
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <Label htmlFor={`caption-${index}`}>Caption</Label>
              <Textarea
                id={`caption-${index}`}
                value={image.caption || ''}
                onChange={(e) => handleFieldChange('caption', e.target.value)}
                placeholder="Optional caption to display below the image"
                className="resize-none"
                rows={2}
              />
            </div>

            {/* Multilingual Alt Text */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`alt-he-${index}`}>Alt Text (Hebrew)</Label>
                <Textarea
                  id={`alt-he-${index}`}
                  value={image.altHe || ''}
                  onChange={(e) => handleFieldChange('altHe', e.target.value)}
                  placeholder="תיאור בעברית"
                  className="resize-none"
                  dir="rtl"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`alt-ar-${index}`}>Alt Text (Arabic)</Label>
                <Textarea
                  id={`alt-ar-${index}`}
                  value={image.altAr || ''}
                  onChange={(e) => handleFieldChange('altAr', e.target.value)}
                  placeholder="الوصف بالعربية"
                  className="resize-none"
                  dir="rtl"
                  rows={2}
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`width-${index}`}>Width (px)</Label>
                <Input
                  id={`width-${index}`}
                  type="number"
                  value={image.width || ''}
                  onChange={(e) => handleFieldChange('width', parseInt(e.target.value) || undefined)}
                  placeholder="1200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`height-${index}`}>Height (px)</Label>
                <Input
                  id={`height-${index}`}
                  type="number"
                  value={image.height || ''}
                  onChange={(e) => handleFieldChange('height', parseInt(e.target.value) || undefined)}
                  placeholder="800"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <Label>Content Location (for Schema)</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`loc-name-${index}`}>Place Name</Label>
                  <Input
                    id={`loc-name-${index}`}
                    value={image.contentLocation?.name || ''}
                    onChange={(e) => handleLocationChange('name', e.target.value)}
                    placeholder="Burj Khalifa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`loc-area-${index}`}>Area</Label>
                  <Select
                    value={image.contentLocation?.addressLocality || ''}
                    onValueChange={(value) => handleLocationChange('addressLocality', value)}
                  >
                    <SelectTrigger id={`loc-area-${index}`}>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {DUBAI_AREAS.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`loc-lat-${index}`}>Latitude</Label>
                  <Input
                    id={`loc-lat-${index}`}
                    value={image.contentLocation?.latitude || ''}
                    onChange={(e) => handleLocationChange('latitude', e.target.value)}
                    placeholder="25.1972"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`loc-lng-${index}`}>Longitude</Label>
                  <Input
                    id={`loc-lng-${index}`}
                    value={image.contentLocation?.longitude || ''}
                    onChange={(e) => handleLocationChange('longitude', e.target.value)}
                    placeholder="55.2744"
                  />
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <Label htmlFor={`keywords-${index}`}>Keywords (comma separated)</Label>
              <Input
                id={`keywords-${index}`}
                value={image.keywords?.join(', ') || ''}
                onChange={(e) => handleFieldChange('keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
                placeholder="dubai, sunset, skyline, tourism"
              />
            </div>

            {/* Schema Preview */}
            {image.image && image.alt && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Schema Preview</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const schema = {
                        "@context": "https://schema.org",
                        "@type": "ImageObject",
                        contentUrl: image.image,
                        name: image.title || image.alt,
                        description: image.alt,
                        ...(image.width && { width: String(image.width) }),
                        ...(image.height && { height: String(image.height) }),
                        ...(image.contentLocation && {
                          contentLocation: {
                            "@type": "Place",
                            name: image.contentLocation.name,
                            address: {
                              "@type": "PostalAddress",
                              addressLocality: image.contentLocation.addressLocality || "Dubai",
                              addressCountry: "AE",
                            },
                          },
                        }),
                      };
                      copyToClipboard(JSON.stringify(schema, null, 2));
                    }}
                    className="h-7 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <pre className="p-3 rounded bg-muted text-xs overflow-auto max-h-40">
                  {JSON.stringify({
                    "@type": "ImageObject",
                    contentUrl: image.image.substring(0, 50) + '...',
                    name: (image.title || image.alt).substring(0, 30) + '...',
                    description: image.alt.substring(0, 30) + '...',
                    ...(image.contentLocation?.name && {
                      contentLocation: image.contentLocation.name,
                    }),
                  }, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

// Compact version for inline editing
interface CompactImageSeoEditorProps {
  image: GalleryImage;
  onChange: (image: GalleryImage) => void;
  primaryKeyword?: string;
}

export function CompactImageSeoEditor({
  image,
  onChange,
  primaryKeyword,
}: CompactImageSeoEditorProps) {
  const handleFieldChange = (field: keyof GalleryImage, value: unknown) => {
    onChange({
      ...image,
      [field]: value,
    });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="text-xs">Alt Text</Label>
        <Input
          value={image.alt || ''}
          onChange={(e) => handleFieldChange('alt', e.target.value)}
          placeholder="Descriptive alt text"
          className="h-8 text-sm"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Title</Label>
        <Input
          value={image.title || ''}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          placeholder="Title on hover"
          className="h-8 text-sm"
        />
      </div>
    </div>
  );
}

export default ImageSeoEditor;
