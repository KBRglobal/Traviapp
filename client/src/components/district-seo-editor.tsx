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
  Utensils,
} from "lucide-react";
import type {
  QuickInfoItem,
  RelatedItem,
} from "@shared/schema";

interface TopHotelItem {
  name: string;
  type: string;
  location: string;
  priceFrom: string;
  rating?: string;
  image?: string;
  link: string;
  ctaText?: string;
}

interface TopRestaurantItem {
  name: string;
  cuisine: string;
  location: string;
  priceRange: string;
  description: string;
  image?: string;
  link: string;
}

interface ThingToDoItem {
  name: string;
  type: string;
  description: string;
  image?: string;
  icon?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface NearbyDistrictItem {
  name: string;
  distance: string;
  type: string;
  link: string;
}

interface DistrictSeoEditorProps {
  data: {
    introText?: string;
    expandedIntroText?: string;
    quickInfoBar?: QuickInfoItem[];
    topHotels?: TopHotelItem[];
    topRestaurants?: TopRestaurantItem[];
    thingsToDo?: ThingToDoItem[];
    visitorTips?: string[];
    nearbyDistricts?: NearbyDistrictItem[];
    relatedDistricts?: RelatedItem[];
    trustSignals?: string[];
  };
  onChange: (data: any) => void;
}

export function DistrictSeoEditor({ data, onChange }: DistrictSeoEditorProps) {
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

  const addTopHotel = () => {
    const newItem: TopHotelItem = {
      name: "",
      type: "",
      location: "",
      priceFrom: "",
      link: "",
      ctaText: "View Hotel"
    };
    updateField("topHotels", [...(data.topHotels || []), newItem]);
  };

  const updateTopHotel = (index: number, field: keyof TopHotelItem, value: string) => {
    const updated = [...(data.topHotels || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateField("topHotels", updated);
  };

  const removeTopHotel = (index: number) => {
    updateField("topHotels", (data.topHotels || []).filter((_, i) => i !== index));
  };

  const addTopRestaurant = () => {
    const newItem: TopRestaurantItem = {
      name: "",
      cuisine: "",
      location: "",
      priceRange: "",
      description: "",
      link: ""
    };
    updateField("topRestaurants", [...(data.topRestaurants || []), newItem]);
  };

  const updateTopRestaurant = (index: number, field: keyof TopRestaurantItem, value: string) => {
    const updated = [...(data.topRestaurants || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateField("topRestaurants", updated);
  };

  const removeTopRestaurant = (index: number) => {
    updateField("topRestaurants", (data.topRestaurants || []).filter((_, i) => i !== index));
  };

  const addThingToDo = () => {
    const newItem: ThingToDoItem = {
      name: "",
      type: "",
      description: "",
      ctaText: "Learn More"
    };
    updateField("thingsToDo", [...(data.thingsToDo || []), newItem]);
  };

  const updateThingToDo = (index: number, field: keyof ThingToDoItem, value: string) => {
    const updated = [...(data.thingsToDo || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateField("thingsToDo", updated);
  };

  const removeThingToDo = (index: number) => {
    updateField("thingsToDo", (data.thingsToDo || []).filter((_, i) => i !== index));
  };

  const addVisitorTip = () => {
    updateField("visitorTips", [...(data.visitorTips || []), ""]);
  };

  const updateVisitorTip = (index: number, value: string) => {
    const updated = [...(data.visitorTips || [])];
    updated[index] = value;
    updateField("visitorTips", updated);
  };

  const removeVisitorTip = (index: number) => {
    updateField("visitorTips", (data.visitorTips || []).filter((_, i) => i !== index));
  };

  const addNearbyDistrict = () => {
    const newItem: NearbyDistrictItem = {
      name: "",
      distance: "",
      type: "",
      link: ""
    };
    updateField("nearbyDistricts", [...(data.nearbyDistricts || []), newItem]);
  };

  const updateNearbyDistrict = (index: number, field: keyof NearbyDistrictItem, value: string) => {
    const updated = [...(data.nearbyDistricts || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateField("nearbyDistricts", updated);
  };

  const removeNearbyDistrict = (index: number) => {
    updateField("nearbyDistricts", (data.nearbyDistricts || []).filter((_, i) => i !== index));
  };

  const addRelatedDistrict = () => {
    const newItem: RelatedItem = { name: "", link: "", image: "" };
    updateField("relatedDistricts", [...(data.relatedDistricts || []), newItem]);
  };

  const updateRelatedDistrict = (index: number, field: keyof RelatedItem, value: string) => {
    const updated = [...(data.relatedDistricts || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateField("relatedDistricts", updated);
  };

  const removeRelatedDistrict = (index: number) => {
    updateField("relatedDistricts", (data.relatedDistricts || []).filter((_, i) => i !== index));
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
    { value: "Utensils", label: "Dining" },
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
            <Label htmlFor="introText">Brief Intro (2-3 sentences)</Label>
            <Textarea
              id="introText"
              value={data.introText || ""}
              onChange={(e) => updateField("introText", e.target.value)}
              placeholder="Capture the district's essence..."
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
              placeholder="Cover history, atmosphere, who it attracts, what it's known for..."
              rows={6}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {(data.expandedIntroText || "").split(" ").filter(Boolean).length} words
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Info Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Info Bar</CardTitle>
          <CardDescription>
            6 key facts about the district
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
                  placeholder="Label"
                />
                <Input
                  value={item.value}
                  onChange={(e) => updateQuickInfoItem(index, "value", e.target.value)}
                  placeholder="Value"
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

      {/* Top Hotels */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Hotels (6)</CardTitle>
          <CardDescription>Best hotels in the district</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.topHotels || []).map((hotel, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Hotel {index + 1}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTopHotel(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Hotel Name</Label>
                  <Input
                    value={hotel.name}
                    onChange={(e) => updateTopHotel(index, "name", e.target.value)}
                    placeholder="Atlantis The Palm"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Input
                    value={hotel.type}
                    onChange={(e) => updateTopHotel(index, "type", e.target.value)}
                    placeholder="5-Star Resort"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Location</Label>
                  <Input
                    value={hotel.location}
                    onChange={(e) => updateTopHotel(index, "location", e.target.value)}
                    placeholder="Palm Jumeirah"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Price From</Label>
                  <Input
                    value={hotel.priceFrom}
                    onChange={(e) => updateTopHotel(index, "priceFrom", e.target.value)}
                    placeholder="AED 800/night"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Rating (optional)</Label>
                  <Input
                    value={hotel.rating || ""}
                    onChange={(e) => updateTopHotel(index, "rating", e.target.value)}
                    placeholder="4.8/5"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>CTA Text</Label>
                  <Input
                    value={hotel.ctaText || ""}
                    onChange={(e) => updateTopHotel(index, "ctaText", e.target.value)}
                    placeholder="View Hotel"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Link</Label>
                <Input
                  value={hotel.link}
                  onChange={(e) => updateTopHotel(index, "link", e.target.value)}
                  placeholder="/hotel/atlantis-the-palm-dubai"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Image URL (optional)</Label>
                <Input
                  value={hotel.image || ""}
                  onChange={(e) => updateTopHotel(index, "image", e.target.value)}
                  placeholder="/images/hotel-thumb.jpg"
                  className="mt-1"
                />
              </div>
            </div>
          ))}
          <Button onClick={addTopHotel} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Hotel
          </Button>
        </CardContent>
      </Card>

      {/* Top Restaurants */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Restaurants (8)</CardTitle>
          <CardDescription>Best dining options in the district</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.topRestaurants || []).map((restaurant, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Restaurant {index + 1}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTopRestaurant(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={restaurant.name}
                    onChange={(e) => updateTopRestaurant(index, "name", e.target.value)}
                    placeholder="Restaurant Name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Cuisine</Label>
                  <Input
                    value={restaurant.cuisine}
                    onChange={(e) => updateTopRestaurant(index, "cuisine", e.target.value)}
                    placeholder="Italian, French..."
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Location</Label>
                  <Input
                    value={restaurant.location}
                    onChange={(e) => updateTopRestaurant(index, "location", e.target.value)}
                    placeholder="Marina Walk"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Price Range</Label>
                  <Input
                    value={restaurant.priceRange}
                    onChange={(e) => updateTopRestaurant(index, "priceRange", e.target.value)}
                    placeholder="AED 150-300"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={restaurant.description}
                  onChange={(e) => updateTopRestaurant(index, "description", e.target.value)}
                  placeholder="Brief description of the restaurant..."
                  rows={2}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Link</Label>
                <Input
                  value={restaurant.link}
                  onChange={(e) => updateTopRestaurant(index, "link", e.target.value)}
                  placeholder="/dining/restaurant-name-dubai"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Image URL (optional)</Label>
                <Input
                  value={restaurant.image || ""}
                  onChange={(e) => updateTopRestaurant(index, "image", e.target.value)}
                  placeholder="/images/restaurant-thumb.jpg"
                  className="mt-1"
                />
              </div>
            </div>
          ))}
          <Button onClick={addTopRestaurant} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Restaurant
          </Button>
        </CardContent>
      </Card>

      {/* Things to Do */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Things to Do (4)</CardTitle>
          <CardDescription>Top activities and attractions in the district</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.thingsToDo || []).map((activity, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Activity {index + 1}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeThingToDo(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={activity.name}
                    onChange={(e) => updateThingToDo(index, "name", e.target.value)}
                    placeholder="Activity Name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Input
                    value={activity.type}
                    onChange={(e) => updateThingToDo(index, "type", e.target.value)}
                    placeholder="Shopping, Entertainment..."
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={activity.description}
                  onChange={(e) => updateThingToDo(index, "description", e.target.value)}
                  placeholder="Brief description of the activity..."
                  rows={2}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Icon (optional)</Label>
                  <Input
                    value={activity.icon || ""}
                    onChange={(e) => updateThingToDo(index, "icon", e.target.value)}
                    placeholder="Shopping, Camera, Music..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>CTA Text</Label>
                  <Input
                    value={activity.ctaText || ""}
                    onChange={(e) => updateThingToDo(index, "ctaText", e.target.value)}
                    placeholder="Learn More"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>CTA Link (optional)</Label>
                <Input
                  value={activity.ctaLink || ""}
                  onChange={(e) => updateThingToDo(index, "ctaLink", e.target.value)}
                  placeholder="/attraction/activity-name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Image URL (optional)</Label>
                <Input
                  value={activity.image || ""}
                  onChange={(e) => updateThingToDo(index, "image", e.target.value)}
                  placeholder="/images/activity-thumb.jpg"
                  className="mt-1"
                />
              </div>
            </div>
          ))}
          <Button onClick={addThingToDo} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Thing to Do
          </Button>
        </CardContent>
      </Card>

      {/* Visitor Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Visitor Tips (5 practical tips)</CardTitle>
          <CardDescription>Practical advice for exploring the district</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.visitorTips || []).map((tip, index) => (
            <div key={index} className="flex gap-2 items-center">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <Input
                value={tip}
                onChange={(e) => updateVisitorTip(index, e.target.value)}
                placeholder="Best explored on foot..."
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeVisitorTip(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addVisitorTip} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Visitor Tip
          </Button>
        </CardContent>
      </Card>

      {/* Nearby Districts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Nearby Districts (5)</CardTitle>
          <CardDescription>Adjacent neighborhoods to explore</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.nearbyDistricts || []).map((district, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">District {index + 1}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeNearbyDistrict(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={district.name}
                    onChange={(e) => updateNearbyDistrict(index, "name", e.target.value)}
                    placeholder="Downtown Dubai"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Distance</Label>
                  <Input
                    value={district.distance}
                    onChange={(e) => updateNearbyDistrict(index, "distance", e.target.value)}
                    placeholder="10 min drive"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Input
                    value={district.type}
                    onChange={(e) => updateNearbyDistrict(index, "type", e.target.value)}
                    placeholder="Urban, Beachfront..."
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Link</Label>
                <Input
                  value={district.link}
                  onChange={(e) => updateNearbyDistrict(index, "link", e.target.value)}
                  placeholder="/district/downtown-dubai"
                  className="mt-1"
                />
              </div>
            </div>
          ))}
          <Button onClick={addNearbyDistrict} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Nearby District
          </Button>
        </CardContent>
      </Card>

      {/* Related Districts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Related Districts (4)</CardTitle>
          <CardDescription>Similar districts to suggest</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.relatedDistricts || []).map((district, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">District {index + 1}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRelatedDistrict(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Label>Name</Label>
                <Input
                  value={district.name}
                  onChange={(e) => updateRelatedDistrict(index, "name", e.target.value)}
                  placeholder="District Name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Link</Label>
                <Input
                  value={district.link}
                  onChange={(e) => updateRelatedDistrict(index, "link", e.target.value)}
                  placeholder="/district/district-name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Image URL (optional)</Label>
                <Input
                  value={district.image || ""}
                  onChange={(e) => updateRelatedDistrict(index, "image", e.target.value)}
                  placeholder="/images/district-thumb.jpg"
                  className="mt-1"
                />
              </div>
            </div>
          ))}
          <Button onClick={addRelatedDistrict} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Related District
          </Button>
        </CardContent>
      </Card>

      {/* Trust Signals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trust Signals</CardTitle>
          <CardDescription>Credibility indicators for the district</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(data.trustSignals || []).map((signal, index) => (
            <div key={index} className="flex gap-2 items-center">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <Input
                value={signal}
                onChange={(e) => updateTrustSignal(index, e.target.value)}
                placeholder="Award-winning neighborhood"
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
