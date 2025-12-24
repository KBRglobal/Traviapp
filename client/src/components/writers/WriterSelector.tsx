/**
 * WriterSelector Component
 * 
 * Allows users to select an AI writer for content generation
 */

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Sparkles } from 'lucide-react';

interface Writer {
  id: string;
  name: string;
  expertise: string;
  personality: string;
  writingStyle: string;
  isActive: boolean;
  totalArticles: number;
  avgVoiceScore: number;
}

interface WriterSelectorProps {
  contentType: string;
  onSelect: (writerId: string) => void;
  showRecommended?: boolean;
  selectedWriterId?: string;
}

export function WriterSelector({ 
  contentType, 
  onSelect, 
  showRecommended = true,
  selectedWriterId 
}: WriterSelectorProps) {
  const [writers] = useState<Writer[]>([
    {
      id: 'default-writer',
      name: 'Alex Thompson',
      expertise: 'luxury_travel',
      personality: 'Sophisticated, detail-oriented',
      writingStyle: 'Elegant prose with rich descriptions',
      isActive: true,
      totalArticles: 0,
      avgVoiceScore: 85
    }
  ]);

  const [selected, setSelected] = useState<string>(selectedWriterId || '');

  useEffect(() => {
    if (selectedWriterId) {
      setSelected(selectedWriterId);
    }
  }, [selectedWriterId]);

  const handleSelect = (writerId: string) => {
    setSelected(writerId);
    onSelect(writerId);
  };

  const getRecommendedWriter = () => {
    // For now, return the first active writer
    // TODO: Implement intelligent matching based on contentType
    return writers.find(w => w.isActive);
  };

  const recommendedWriter = showRecommended ? getRecommendedWriter() : null;

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Select AI Writer</Label>
      
      {writers.length === 0 ? (
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            No writers available. Using default writer.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {writers.map((writer) => {
            const isRecommended = recommendedWriter?.id === writer.id;
            const isSelected = selected === writer.id;
            
            return (
              <Card
                key={writer.id}
                className={`p-3 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => handleSelect(writer.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <User className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{writer.name}</h4>
                      {isRecommended && (
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1">
                      {writer.personality}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {writer.expertise.replace('_', ' ')}
                      </Badge>
                      {writer.avgVoiceScore > 0 && (
                        <span>Quality: {writer.avgVoiceScore}%</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      
      <p className="text-xs text-muted-foreground mt-2">
        Choose an AI writer whose expertise matches your content type
      </p>
    </div>
  );
}
