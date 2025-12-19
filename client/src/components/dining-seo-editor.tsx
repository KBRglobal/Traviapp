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
  Phone,
  Utensils,
} from "lucide-react";
import type {
  QuickInfoItem,
  MenuHighlightItem,
  RelatedItem,
} from "@shared/schema";

interface ReservationInfo {
  bookingAdvance?: string;
  bookingUrl?: string;
  bookingCTA?: string;
  phone?: string;
  depositRequired?: string;
  cancellationPolicy?: string;
}

interface DeliveryInfo {
  available?: boolean;
  platforms?: string[];
  deliveryUrl?: string;
  deliveryCTA?: string;
  menuNote?: string;
  deliveryAreas?: string[];
}

interface DiningSeoEditorProps {
  data: {
    introText?: string;
    expandedIntroText?: string;
    quickInfoBar?: QuickInfoItem[];
    reservationInfo?: ReservationInfo;
    deliveryInfo?: DeliveryInfo;
    menuHighlights?: MenuHighlightItem[];
    dinerTips?: string[];
    relatedRestaurants?: RelatedItem[];
    trustSignals?: string[];
    primaryCta?: string;
    secondaryCta?: string;
  };
  onChange: (data: any) => void;
}

export function DiningSeoEditor({ data, onChange }: DiningSeoEditorProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateReservationInfo = (field: keyof ReservationInfo, value: any) => {
    updateField("reservationInfo", {
      ...(data.reservationInfo || {}),
      [field]: value
    });
  };

  const updateDeliveryInfo = (field: keyof DeliveryInfo, value: any) => {
    updateField("deliveryInfo", {
      ...(data.deliveryInfo || {}),
      [field]: value
    });
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

  const addMenuHighlight = () => {
    const newItem: MenuHighlightItem = { name: "", description: "", price: "" };
    updateField("menuHighlights", [...(data.menuHighlights || []), newItem]);
  };

  const updateMenuHighlight = (index: number, field: keyof MenuHighlightItem, value: string) => {
    const updated = [...(data.menuHighlights || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateField("menuHighlights", updated);
  };

  const removeMenuHighlight = (index: number) => {
    updateField("menuHighlights", (data.menuHighlights || []).filter((_, i) => i !== index));
  };

  const addDinerTip = () => {
    updateField("dinerTips", [...(data.dinerTips || []), ""]);
  };

  const updateDinerTip = (index: number, value: string) => {
    const updated = [...(data.dinerTips || [])];
    updated[index] = value;
    updateField("dinerTips", updated);
  };

  const removeDinerTip = (index: number) => {
    updateField("dinerTips", (data.dinerTips || []).filter((_, i) => i !== index));
  };

  const addRelatedRestaurant = () => {
    const newItem: RelatedItem = { name: "", link: "", image: "" };
    updateField("relatedRestaurants", [...(data.relatedRestaurants || []), newItem]);
  };

  const updateRelatedRestaurant = (index: number, field: keyof RelatedItem, value: string) => {
    const updated = [...(data.relatedRestaurants || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateField("relatedRestaurants", updated);
  };

  const removeRelatedRestaurant = (index: number) => {
    updateField("relatedRestaurants", (data.relatedRestaurants || []).filter((_, i) => i !== index));
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

  const addDeliveryPlatform = () => {
    const platforms = [...(data.deliveryInfo?.platforms || []), ""];
    updateDeliveryInfo("platforms", platforms);
  };

  const updateDeliveryPlatform = (index: number, value: string) => {
    const platforms = [...(data.deliveryInfo?.platforms || [])];
    platforms[index] = value;
    updateDeliveryInfo("platforms", platforms);
  };

  const removeDeliveryPlatform = (index: number) => {
    const platforms = (data.deliveryInfo?.platforms || []).filter((_, i) => i !== index);
    updateDeliveryInfo("platforms", platforms);
  };

  const addDeliveryArea = () => {
    const areas = [...(data.deliveryInfo?.deliveryAreas || []), ""];
    updateDeliveryInfo("deliveryAreas", areas);
  };

  const updateDeliveryArea = (index: number, value: string) => {
    const areas = [...(data.deliveryInfo?.deliveryAreas || [])];
    areas[index] = value;
    updateDeliveryInfo("deliveryAreas", areas);
  };

  const removeDeliveryArea = (index: number) => {
    const areas = (data.deliveryInfo?.deliveryAreas || []).filter((_, i) => i !== index);
    updateDeliveryInfo("deliveryAreas", areas);
  };

  const iconOptions = [
    { value: "MapPin", label: "Location" },
    { value: "Clock", label: "Time" },
    { value: "DollarSign", label: "Price" },
    { value: "Users", label: "People" },
    { value: "Star", label: "Rating" },
    { value: "Info", label: "Info" },
    { value: "Utensils", label: "Cuisine" },
    { value: "Phone", label: "Phone" },
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
              placeholder="Short, compelling intro capturing the restaurant's essence..."
              rows={3}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {(data.introText || "").split(" ").filter(Boolean).length} words
            </p>
          </div>

          <div>
            <Label htmlFor="expandedIntroText">Expanded Intro (~150 words)</Label>
            <Textarea
              id="expandedIntroText"
              value={data.expandedIntroText || ""}
              onChange={(e) => updateField("expandedIntroText", e.target.value)}
              placeholder="Detailed description about culinary philosophy, chef's background, signature flavors, dining experience..."
              rows={6}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {(data.expandedIntroText || "").split(" ").filter(Boolean).length} words
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTAs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Call-to-Actions</CardTitle>
          <CardDescription>Primary and secondary CTAs for reservations and delivery</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Primary CTA</Label>
            <Input
              value={data.primaryCta || ""}
              onChange={(e) => updateField("primaryCta", e.target.value)}
              placeholder="Reserve Table"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Secondary CTA</Label>
            <Input
              value={data.secondaryCta || ""}
              onChange={(e) => updateField("secondaryCta", e.target.value)}
              placeholder="Order Delivery"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Info Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Info Bar</CardTitle>
          <CardDescription>
            6 key facts displayed prominently (Location, Cuisine, Price Range, Hours, etc.)
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
                  placeholder="Label (e.g., Cuisine)"
                />
                <Input
                  value={item.value}
                  onChange={(e) => updateQuickInfoItem(index, "value", e.target.value)}
                  placeholder="Value (e.g., Italian Fine Dining)"
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

      {/* Reservation Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reservation Information</CardTitle>
          <CardDescription>Booking policies and contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Booking Advance Required</Label>
            <Input
              value={data.reservationInfo?.bookingAdvance || ""}
              onChange={(e) => updateReservationInfo("bookingAdvance", e.target.value)}
              placeholder="2-3 days in advance"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Booking URL</Label>
            <Input
              value={data.reservationInfo?.bookingUrl || ""}
              onChange={(e) => updateReservationInfo("bookingUrl", e.target.value)}
              placeholder="https://..."
              className="mt-1"
            />
          </div>
          <div>
            <Label>Booking CTA Text</Label>
            <Input
              value={data.reservationInfo?.bookingCTA || ""}
              onChange={(e) => updateReservationInfo("bookingCTA", e.target.value)}
              placeholder="Reserve Your Table"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={data.reservationInfo?.phone || ""}
              onChange={(e) => updateReservationInfo("phone", e.target.value)}
              placeholder="+971 4 XXX XXXX"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Deposit Required</Label>
            <Input
              value={data.reservationInfo?.depositRequired || ""}
              onChange={(e) => updateReservationInfo("depositRequired", e.target.value)}
              placeholder="AED 200 per person"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Cancellation Policy</Label>
            <Textarea
              value={data.reservationInfo?.cancellationPolicy || ""}
              onChange={(e) => updateReservationInfo("cancellationPolicy", e.target.value)}
              placeholder="Free cancellation up to 24 hours before..."
              rows={2}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Delivery Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Information</CardTitle>
          <CardDescription>Food delivery options and details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="deliveryAvailable"
              checked={data.deliveryInfo?.available || false}
              onChange={(e) => updateDeliveryInfo("available", e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="deliveryAvailable">Delivery Available</Label>
          </div>

          {data.deliveryInfo?.available && (
            <>
              <div>
                <Label>Delivery Platforms</Label>
                <div className="space-y-2 mt-2">
                  {(data.deliveryInfo?.platforms || []).map((platform, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={platform}
                        onChange={(e) => updateDeliveryPlatform(index, e.target.value)}
                        placeholder="Deliveroo, Talabat, Zomato..."
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDeliveryPlatform(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addDeliveryPlatform} variant="outline" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Platform
                  </Button>
                </div>
              </div>

              <div>
                <Label>Delivery URL</Label>
                <Input
                  value={data.deliveryInfo?.deliveryUrl || ""}
                  onChange={(e) => updateDeliveryInfo("deliveryUrl", e.target.value)}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Delivery CTA Text</Label>
                <Input
                  value={data.deliveryInfo?.deliveryCTA || ""}
                  onChange={(e) => updateDeliveryInfo("deliveryCTA", e.target.value)}
                  placeholder="Order Now"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Menu Note</Label>
                <Input
                  value={data.deliveryInfo?.menuNote || ""}
                  onChange={(e) => updateDeliveryInfo("menuNote", e.target.value)}
                  placeholder="Full menu available on delivery apps"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Delivery Areas</Label>
                <div className="space-y-2 mt-2">
                  {(data.deliveryInfo?.deliveryAreas || []).map((area, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={area}
                        onChange={(e) => updateDeliveryArea(index, e.target.value)}
                        placeholder="Dubai Marina, JBR..."
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDeliveryArea(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addDeliveryArea} variant="outline" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Area
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Menu Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Menu Highlights (3-4 dishes)</CardTitle>
          <CardDescription>Signature dishes with descriptions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.menuHighlights || []).map((item, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Dish {index + 1}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMenuHighlight(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Dish Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateMenuHighlight(index, "name", e.target.value)}
                    placeholder="Signature Risotto"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Price (optional)</Label>
                  <Input
                    value={item.price || ""}
                    onChange={(e) => updateMenuHighlight(index, "price", e.target.value)}
                    placeholder="AED 120"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateMenuHighlight(index, "description", e.target.value)}
                  placeholder="Brief description of the dish..."
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
          ))}
          <Button onClick={addMenuHighlight} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Menu Highlight
          </Button>
        </CardContent>
      </Card>

      {/* Diner Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Diner Tips (5 essential tips)</CardTitle>
          <CardDescription>Practical advice and insider tips for diners</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.dinerTips || []).map((tip, index) => (
            <div key={index} className="flex gap-2 items-center">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <Input
                value={tip}
                onChange={(e) => updateDinerTip(index, e.target.value)}
                placeholder="Reservations recommended on weekends..."
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeDinerTip(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addDinerTip} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Diner Tip
          </Button>
        </CardContent>
      </Card>

      {/* Related Restaurants */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Related Restaurants (4)</CardTitle>
          <CardDescription>Similar or nearby restaurants to suggest</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.relatedRestaurants || []).map((restaurant, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Restaurant {index + 1}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRelatedRestaurant(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Label>Name</Label>
                <Input
                  value={restaurant.name}
                  onChange={(e) => updateRelatedRestaurant(index, "name", e.target.value)}
                  placeholder="Restaurant Name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Link</Label>
                <Input
                  value={restaurant.link}
                  onChange={(e) => updateRelatedRestaurant(index, "link", e.target.value)}
                  placeholder="/dining/restaurant-name-dubai"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Image URL (optional)</Label>
                <Input
                  value={restaurant.image || ""}
                  onChange={(e) => updateRelatedRestaurant(index, "image", e.target.value)}
                  placeholder="/images/restaurant-thumb.jpg"
                  className="mt-1"
                />
              </div>
            </div>
          ))}
          <Button onClick={addRelatedRestaurant} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Related Restaurant
          </Button>
        </CardContent>
      </Card>

      {/* Trust Signals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trust Signals</CardTitle>
          <CardDescription>Badges near CTAs (e.g., "Instant confirmation")</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.trustSignals || []).map((signal, index) => (
            <div key={index} className="flex gap-2 items-center">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <Input
                value={signal}
                onChange={(e) => updateTrustSignal(index, e.target.value)}
                placeholder="Instant confirmation"
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
