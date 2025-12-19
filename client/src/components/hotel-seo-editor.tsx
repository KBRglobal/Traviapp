import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  GripVertical,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Star,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckCircle,
  Info,
  Building,
} from "lucide-react";
import type {
  QuickInfoItem,
  RoomTypeItem,
  RelatedItem,
} from "@shared/schema";

interface LocationHighlight {
  name: string;
  distance: string;
  description: string;
}

interface HotelSeoEditorProps {
  data: {
    introText?: string;
    expandedIntroText?: string;
    quickInfoBar?: QuickInfoItem[];
    roomTypes?: RoomTypeItem[];
    hotelAmenities?: string[];
    locationHighlights?: LocationHighlight[];
    guestTips?: string[];
    relatedHotels?: RelatedItem[];
    trustSignals?: string[];
    primaryCta?: string;
  };
  onChange: (data: any) => void;
}

export function HotelSeoEditor({ data, onChange }: HotelSeoEditorProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addQuickInfoItem = () => {
    const newItem: QuickInfoItem = { icon: "MapPin", label: "", value: "" };
    updateField("quickInfoBar", [...(data.quickInfoBar || []), newItem]);
  };

  const updateQuickInfoItem = (index: number, field: keyof QuickInfoItem, value: string) => {
    const updated = [...(data.quickInfoBar || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateField("quickInfoBar", updated);
  };

  const removeQuickInfoItem = (index: number) => {
    updateField("quickInfoBar", (data.quickInfoBar || []).filter((_, i) => i !== index));
  };

  const addRoomType = () => {
    const newItem: RoomTypeItem = {
      image: "",
      title: "",
      features: [],
      price: "",
      ctaText: "Check Availability"
    };
    updateField("roomTypes", [...(data.roomTypes || []), newItem]);
  };

  const updateRoomType = (index: number, field: keyof RoomTypeItem, value: any) => {
    const updated = [...(data.roomTypes || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateField("roomTypes", updated);
  };

  const removeRoomType = (index: number) => {
    updateField("roomTypes", (data.roomTypes || []).filter((_, i) => i !== index));
  };

  const addRoomFeature = (roomIndex: number) => {
    const updated = [...(data.roomTypes || [])];
    const features = [...(updated[roomIndex].features || []), ""];
    updated[roomIndex] = { ...updated[roomIndex], features };
    updateField("roomTypes", updated);
  };

  const updateRoomFeature = (roomIndex: number, featureIndex: number, value: string) => {
    const updated = [...(data.roomTypes || [])];
    const features = [...updated[roomIndex].features];
    features[featureIndex] = value;
    updated[roomIndex] = { ...updated[roomIndex], features };
    updateField("roomTypes", updated);
  };

  const removeRoomFeature = (roomIndex: number, featureIndex: number) => {
    const updated = [...(data.roomTypes || [])];
    const features = updated[roomIndex].features.filter((_, i) => i !== featureIndex);
    updated[roomIndex] = { ...updated[roomIndex], features };
    updateField("roomTypes", updated);
  };

  const addAmenity = () => {
    updateField("hotelAmenities", [...(data.hotelAmenities || []), ""]);
  };

  const updateAmenity = (index: number, value: string) => {
    const updated = [...(data.hotelAmenities || [])];
    updated[index] = value;
    updateField("hotelAmenities", updated);
  };

  const removeAmenity = (index: number) => {
    updateField("hotelAmenities", (data.hotelAmenities || []).filter((_, i) => i !== index));
  };

  const addLocationHighlight = () => {
    const newItem: LocationHighlight = { name: "", distance: "", description: "" };
    updateField("locationHighlights", [...(data.locationHighlights || []), newItem]);
  };

  const updateLocationHighlight = (index: number, field: keyof LocationHighlight, value: string) => {
    const updated = [...(data.locationHighlights || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateField("locationHighlights", updated);
  };

  const removeLocationHighlight = (index: number) => {
    updateField("locationHighlights", (data.locationHighlights || []).filter((_, i) => i !== index));
  };

  const addGuestTip = () => {
    updateField("guestTips", [...(data.guestTips || []), ""]);
  };

  const updateGuestTip = (index: number, value: string) => {
    const updated = [...(data.guestTips || [])];
    updated[index] = value;
    updateField("guestTips", updated);
  };

  const removeGuestTip = (index: number) => {
    updateField("guestTips", (data.guestTips || []).filter((_, i) => i !== index));
  };

  const addRelatedHotel = () => {
    const newItem: RelatedItem = { name: "", link: "", image: "", price: "" };
    updateField("relatedHotels", [...(data.relatedHotels || []), newItem]);
  };

  const updateRelatedHotel = (index: number, field: keyof RelatedItem, value: string) => {
    const updated = [...(data.relatedHotels || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateField("relatedHotels", updated);
  };

  const removeRelatedHotel = (index: number) => {
    updateField("relatedHotels", (data.relatedHotels || []).filter((_, i) => i !== index));
  };

  const addTrustSignal = () => {
    updateField("trustSignals", [...(data.trustSignals || []), ""]);
  };

  const updateTrustSignal = (index: number, value: string) => {
    const updated = [...(data.trustSignals || [])];
    updated[index] = value;
    updateField("trustSignals", updated);
  };

  const removeTrustSignal = (index: number) => {
    updateField("trustSignals", (data.trustSignals || []).filter((_, i) => i !== index));
  };

  const iconOptions = [
    { value: "MapPin", label: "Location" },
    { value: "Clock", label: "Time" },
    { value: "DollarSign", label: "Price" },
    { value: "Users", label: "People" },
    { value: "Star", label: "Rating" },
    { value: "Info", label: "Info" },
    { value: "Building", label: "Building" },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Texts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Introduction</CardTitle>
          <CardDescription>
            Brief intro (visible) + Expanded intro (collapsed by default)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="introText">Brief Intro (3 sentences, ~60 words)</Label>
            <Textarea
              id="introText"
              value={data.introText || ""}
              onChange={(e) => updateField("introText", e.target.value)}
              placeholder="Short, compelling intro about the hotel..."
              rows={3}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {(data.introText || "").split(" ").filter(Boolean).length} words
            </p>
          </div>

          <div>
            <Label htmlFor="expandedIntroText">Expanded Intro (~200 words)</Label>
            <Textarea
              id="expandedIntroText"
              value={data.expandedIntroText || ""}
              onChange={(e) => updateField("expandedIntroText", e.target.value)}
              placeholder="Detailed description covering property history, design aesthetic, target guests, location advantages..."
              rows={6}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {(data.expandedIntroText || "").split(" ").filter(Boolean).length} words
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Primary CTA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Primary CTA</CardTitle>
          <CardDescription>Main call-to-action text (e.g., "Check Rates & Availability")</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            value={data.primaryCta || ""}
            onChange={(e) => updateField("primaryCta", e.target.value)}
            placeholder="Check Rates & Availability"
          />
        </CardContent>
      </Card>

      {/* Quick Info Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Info Bar</CardTitle>
          <CardDescription>
            6 key facts displayed prominently (Location, Star Rating, Key Feature, Dining, Airport Distance, Check-in Time)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.quickInfoBar || []).map((item, index) => (
            <div key={index} className="flex gap-2 items-start p-3 border rounded-lg">
              <GripVertical className="h-5 w-5 text-muted-foreground mt-2 flex-shrink-0" />
              <div className="flex-1 grid grid-cols-3 gap-2">
                <select
                  value={item.icon}
                  onChange={(e) => updateQuickInfoItem(index, "icon", e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <Input
                  value={item.label}
                  onChange={(e) => updateQuickInfoItem(index, "label", e.target.value)}
                  placeholder="Label (e.g., Location)"
                />
                <Input
                  value={item.value}
                  onChange={(e) => updateQuickInfoItem(index, "value", e.target.value)}
                  placeholder="Value (e.g., Dubai Marina)"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeQuickInfoItem(index)}
                className="flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addQuickInfoItem} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Info Item
          </Button>
        </CardContent>
      </Card>

      {/* Room Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Room Types (3-4)</CardTitle>
          <CardDescription>Different room categories with features and pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.roomTypes || []).map((room, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Room Type {index + 1}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRoomType(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Label>Room Name</Label>
                <Input
                  value={room.title}
                  onChange={(e) => updateRoomType(index, "title", e.target.value)}
                  placeholder="Deluxe Room"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={room.image}
                  onChange={(e) => updateRoomType(index, "image", e.target.value)}
                  placeholder="/images/room-deluxe.jpg"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Price (From)</Label>
                <Input
                  value={room.price}
                  onChange={(e) => updateRoomType(index, "price", e.target.value)}
                  placeholder="AED 500/night"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>CTA Text</Label>
                <Input
                  value={room.ctaText || ""}
                  onChange={(e) => updateRoomType(index, "ctaText", e.target.value)}
                  placeholder="Check Availability"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Affiliate Link ID (optional)</Label>
                <Input
                  value={room.affiliateLinkId || ""}
                  onChange={(e) => updateRoomType(index, "affiliateLinkId", e.target.value)}
                  placeholder="link-id-from-affiliate-links"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Features</Label>
                <div className="space-y-2 mt-2">
                  {(room.features || []).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateRoomFeature(index, featureIndex, e.target.value)}
                        placeholder="Ocean view, King bed, 45 sqm..."
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRoomFeature(index, featureIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => addRoomFeature(index)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Feature
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <Button onClick={addRoomType} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Room Type
          </Button>
        </CardContent>
      </Card>

      {/* Hotel Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hotel Amenities (8-10)</CardTitle>
          <CardDescription>Key hotel facilities and services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.hotelAmenities || []).map((amenity, index) => (
            <div key={index} className="flex gap-2 items-center">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <Input
                value={amenity}
                onChange={(e) => updateAmenity(index, e.target.value)}
                placeholder="Free WiFi, Infinity Pool, Spa..."
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeAmenity(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addAmenity} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Amenity
          </Button>
        </CardContent>
      </Card>

      {/* Location Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Location Highlights (3-4)</CardTitle>
          <CardDescription>Nearby attractions and landmarks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.locationHighlights || []).map((item, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Location {index + 1}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLocationHighlight(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateLocationHighlight(index, "name", e.target.value)}
                    placeholder="Burj Khalifa"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Distance</Label>
                  <Input
                    value={item.distance}
                    onChange={(e) => updateLocationHighlight(index, "distance", e.target.value)}
                    placeholder="5 min walk"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateLocationHighlight(index, "description", e.target.value)}
                  placeholder="Brief description of the location..."
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
          ))}
          <Button onClick={addLocationHighlight} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Location Highlight
          </Button>
        </CardContent>
      </Card>

      {/* Guest Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Guest Tips (5-7 bullets)</CardTitle>
          <CardDescription>Insider advice and practical tips for guests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.guestTips || []).map((tip, index) => (
            <div key={index} className="flex gap-2 items-center">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <Input
                value={tip}
                onChange={(e) => updateGuestTip(index, e.target.value)}
                placeholder="Book direct for best rates..."
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeGuestTip(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addGuestTip} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Guest Tip
          </Button>
        </CardContent>
      </Card>

      {/* Related Hotels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Related Hotels (4)</CardTitle>
          <CardDescription>Similar or nearby hotels to suggest</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.relatedHotels || []).map((hotel, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Hotel {index + 1}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRelatedHotel(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={hotel.name}
                    onChange={(e) => updateRelatedHotel(index, "name", e.target.value)}
                    placeholder="Hotel Name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    value={hotel.price || ""}
                    onChange={(e) => updateRelatedHotel(index, "price", e.target.value)}
                    placeholder="From AED 600"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Link</Label>
                <Input
                  value={hotel.link}
                  onChange={(e) => updateRelatedHotel(index, "link", e.target.value)}
                  placeholder="/hotel/hotel-name-dubai"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Image URL (optional)</Label>
                <Input
                  value={hotel.image || ""}
                  onChange={(e) => updateRelatedHotel(index, "image", e.target.value)}
                  placeholder="/images/hotel-thumb.jpg"
                  className="mt-1"
                />
              </div>
            </div>
          ))}
          <Button onClick={addRelatedHotel} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Related Hotel
          </Button>
        </CardContent>
      </Card>

      {/* Trust Signals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trust Signals</CardTitle>
          <CardDescription>Badges near CTAs (e.g., "Free cancellation")</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.trustSignals || []).map((signal, index) => (
            <div key={index} className="flex gap-2 items-center">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <Input
                value={signal}
                onChange={(e) => updateTrustSignal(index, e.target.value)}
                placeholder="Free cancellation"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTrustSignal(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addTrustSignal} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Trust Signal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
